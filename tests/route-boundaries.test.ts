import {
	mkdir,
	mkdtemp,
	readFile,
	rm,
	stat,
	symlink,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import ts from "typescript";
import { afterEach, describe, expect, it } from "vitest";
import { getConfig } from "../src/plugin/config";
import { generator } from "../src/plugin/generator";
import { RouteExtractor } from "../src/router/extractor";
import { RouteCodeGenerator } from "../src/router/generator";
import { hasAction } from "../src/router/utils";

const roots: string[] = [];
afterEach(async () => {
	await Promise.all(
		roots.splice(0).map((root) => rm(root, { recursive: true, force: true })),
	);
});
async function fixture() {
	const root = await mkdtemp(join(tmpdir(), "fs-router-boundaries-"));
	roots.push(root);
	const write = async (
		file: string,
		content = "export default () => null;",
	) => {
		const target = join(root, "src/routes", file);
		await mkdir(dirname(target), { recursive: true });
		await writeFile(target, content);
		return target;
	};
	await write("layout.tsx");
	return {
		root,
		write,
		extract: () =>
			new RouteExtractor({ routesDir: join(root, "src/routes") }).extract(),
	};
}
describe("route generation boundaries", () => {
	it("rejects duplicate conventions and equivalent dynamic routes", async () => {
		const { write, extract, root } = await fixture();
		await write("users/[id]/page.tsx");
		await write("users/[name]/page.tsx");
		await expect(extract()).rejects.toThrow("Conflicting routes");
		await rm(join(root, "src/routes/users/[name]"), { recursive: true });
		await write("users/[id]/page.jsx");
		await expect(extract()).rejects.toThrow("Duplicate route convention");
	});
	it("rejects ambiguous route ids before React Router consumes them", async () => {
		const { write, extract } = await fixture();
		await write("(id)/layout.tsx");
		await write("(id)/about/page.tsx");
		await write("[id]/layout.tsx");
		await write("[id]/page.tsx");
		await expect(extract()).rejects.toThrow("Conflicting route id");
	});

	it("excludes dot directories, node_modules and symbolic links from runtime and types", async () => {
		const { root, write } = await fixture();
		await write("page.js");
		await write(".private/page.tsx");
		await write("node_modules/dependency/page.tsx");
		await symlink(
			join(root, "src/routes"),
			join(root, "src/routes/loop"),
			"dir",
		);
		const config = getConfig({}, root);
		const code = await generator(config);
		const types = await readFile(join(root, "src/routes-type.ts"), "utf8");
		expect(code).not.toMatch(/private|dependency|loop/);
		expect(types).toContain('"/": {}');
		expect(types).not.toMatch(/private|dependency|loop/);
	});
	it("keeps JS and TS routes in the same extension-filtered type map", async () => {
		const { root, write } = await fixture();
		await write("enabled/page.js");
		await write("disabled/page.jsx");
		const config = getConfig({ routeExtensions: [".ts", ".tsx", ".js"] }, root);
		const code = await generator(config);
		const types = await readFile(join(root, "src/routes-type.ts"), "utf8");
		expect(code).toContain("enabled");
		expect(types).toContain("/enabled");
		expect(code).not.toContain("disabled");
		expect(types).not.toContain("/disabled");
	});
	it("rejects overlapping outputs, including a symlinked parent", async () => {
		const { root } = await fixture();
		expect(() =>
			getConfig({ generatedRoutesPath: "src/routes/generated.tsx" }, root),
		).toThrow("outside");
		expect(() =>
			getConfig({ generatedRoutesPath: "src/routes-type.ts" }, root),
		).toThrow("different");
		await symlink(join(root, "src/routes"), join(root, "alias"), "dir");
		await expect(
			generator(
				getConfig({ generatedRoutesPath: "alias/generated.tsx" }, root),
			),
		).rejects.toThrow("outside");
	});
	it("does not overwrite source through an output symlink", async () => {
		const { root, write } = await fixture();
		const page = await write("page.tsx");
		await symlink(page, join(root, "src/routes.tsx"));
		await expect(generator(getConfig({}, root))).rejects.toThrow(
			"symbolic link",
		);
		expect(await readFile(page, "utf8")).toBe("export default () => null;");
	});
	it("retains layout data without a layout component and attaches named actions", async () => {
		const { write, extract } = await fixture();
		await write(
			"users/layout.data.ts",
			"export function loader() { return {ok: true}; }",
		);
		await write("users/page.tsx");
		await write(
			"users/page.data.ts",
			"export async function action() { return null; } export const loader = () => null;",
		);
		const routes = await extract();
		const users = routes[0].children?.find((route) => route.path === "users");
		expect(users?.data).toContain("layout.data");
		expect(users?.children?.[0].action).toContain("page.data");
		expect(new RouteCodeGenerator().generate(routes)).toContain(
			"import { action as",
		);
	});
	it("parses action exports without treating comments and strings as exports", async () => {
		const { write } = await fixture();
		const file = await write(
			"page.data.ts",
			'// export const action = 1;\nexport const loader = () => "export let action";',
		);
		expect(await hasAction(file)).toBe(false);
		await writeFile(
			file,
			"const submit = () => null; export {submit as action};",
		);
		expect(await hasAction(file)).toBe(true);
	});
	it("escapes quoted paths and resets imports on repeat generation", () => {
		const generator = new RouteCodeGenerator();
		const code = generator.generate([
			{
				id: "*/injection",
				path: "it's-quoted",
				_component: "./it's-quoted/page",
			},
		]);
		const result = ts.transpileModule(code, {
			reportDiagnostics: true,
			compilerOptions: { jsx: ts.JsxEmit.ReactJSX },
		});
		expect(result.diagnostics).toEqual([]);
		expect(generator.generate([])).not.toContain("it's-quoted");
	});
	it("writes unchanged output only once and honors disabled generation", async () => {
		const { root, write } = await fixture();
		await write("page.tsx");
		const config = getConfig({}, root);
		await generator(config);
		const before = await stat(config.generatedRoutesPath);
		const typesBefore = await stat(
			config.typeGenerateOptions?.routesTypeFile ?? "",
		);
		await generator(config);
		expect((await stat(config.generatedRoutesPath)).mtimeMs).toBe(
			before.mtimeMs,
		);
		expect(
			(await stat(config.typeGenerateOptions?.routesTypeFile ?? "")).mtimeMs,
		).toBe(typesBefore.mtimeMs);
		await write("added/page.tsx");
		await generator({ ...config, enableGeneration: false });
		expect(await readFile(config.generatedRoutesPath, "utf8")).not.toContain(
			"added",
		);
	});
});
