import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { build as viteBuild } from "vite";
import { afterEach, describe, expect, it, vi } from "vitest";
import webpack from "webpack";
import {
	defaultConfig,
	getConfig,
	type PluginConfig,
} from "../src/plugin/config";
import vitePlugin from "../src/plugin/vite";
import webpackPlugin from "../src/plugin/webpack";
import { generateRouteType } from "../src/router/route-type-generator";

const directories: string[] = [];
afterEach(async () => {
	vi.restoreAllMocks();
	await Promise.all(
		directories
			.splice(0)
			.map((dir) => rm(dir, { recursive: true, force: true })),
	);
});

async function fixture() {
	const root = await mkdtemp(join(tmpdir(), "fs-router-plugin-"));
	directories.push(root);
	await mkdir(join(root, "routes"));
	await writeFile(join(root, "entry.js"), "export const value = 42;");
	await writeFile(join(root, "routes/page.tsx"), "export default () => null;");
	const options: Partial<PluginConfig> = {
		routesDirectory: join(root, "routes"),
		generatedRoutesPath: join(root, "generated.tsx"),
		typeGenerateOptions: undefined,
	};
	return { root, options };
}

async function compile(root: string, options: Partial<PluginConfig>) {
	const compiler = webpack({
		mode: "production",
		context: root,
		entry: "./entry.js",
		output: { path: join(root, "output") },
		plugins: [webpackPlugin(options)],
	});
	try {
		await new Promise<void>((resolvePromise, reject) => {
			compiler.run((error, stats) => {
				if (error) reject(error);
				else if (stats?.hasErrors()) reject(new Error(stats.toString()));
				else resolvePromise();
			});
		});
	} finally {
		await new Promise<void>((resolvePromise, reject) => {
			compiler.close((error) => (error ? reject(error) : resolvePromise()));
		});
	}
}

describe("build plugin boundaries", () => {
	it("keeps default and caller-owned type paths independent across project roots", () => {
		const first = resolve("first-project");
		const second = resolve("second-project");
		const defaultsBefore = structuredClone(defaultConfig);
		expect(getConfig({}, first).typeGenerateOptions?.routesTypeFile).toBe(
			join(first, "src/routes-type.ts"),
		);
		expect(getConfig({}, second).typeGenerateOptions?.routesTypeFile).toBe(
			join(second, "src/routes-type.ts"),
		);
		expect(defaultConfig).toEqual(defaultsBefore);
		const options = { typeGenerateOptions: { routesTypeFile: "custom.ts" } };
		expect(getConfig(options, first).typeGenerateOptions?.routesTypeFile).toBe(
			join(first, "custom.ts"),
		);
		expect(getConfig(options, second).typeGenerateOptions?.routesTypeFile).toBe(
			join(second, "custom.ts"),
		);
		expect(options.typeGenerateOptions.routesTypeFile).toBe("custom.ts");
	});

	it("fails a Webpack build when the required root layout is missing", async () => {
		const { root, options } = await fixture();
		vi.spyOn(console, "error").mockImplementation(() => {});
		await expect(compile(root, options)).rejects.toThrow(
			"root layout component is required",
		);
	});

	it("fails a Vite build when the required root layout is missing", async () => {
		const { root, options } = await fixture();
		vi.spyOn(console, "error").mockImplementation(() => {});
		await expect(
			viteBuild({
				root,
				configFile: false,
				logLevel: "silent",
				plugins: [vitePlugin(options)],
				build: { rollupOptions: { input: join(root, "entry.js") } },
			}),
		).rejects.toThrow("root layout component is required");
	});

	it("generates routes without terminating the Webpack host process", async () => {
		const { root, options } = await fixture();
		await writeFile(
			join(root, "routes/layout.tsx"),
			"export default () => null;",
		);
		const exit = vi
			.spyOn(process, "exit")
			.mockImplementation(() => undefined as never);
		await compile(root, options);
		// The old plugin scheduled process.exit(0) from the compiler's done hook.
		await delay(25);
		expect(exit).not.toHaveBeenCalled();
		expect(await readFile(join(root, "generated.tsx"), "utf8")).toContain(
			"export const routes = [",
		);
	});

	it("generates dynamic route declarations through the maintained glob API", async () => {
		const { root } = await fixture();
		await mkdir(join(root, "routes/users/[id]"), { recursive: true });
		await writeFile(
			join(root, "routes/users/[id]/page.tsx"),
			"export default () => null;",
		);
		const output = join(root, "routes-type.ts");
		await generateRouteType({
			routesTypeFile: output,
			routesDirectories: [{ path: join(root, "routes"), prefix: "/app" }],
		});
		const declarations = await readFile(output, "utf8");
		expect(declarations).toContain('"/app/users/:id"');
		expect(declarations).toContain('"/app"');
	});
});
