import {
	mkdir,
	mkdtemp,
	readFile,
	realpath,
	rm,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { rspack } from "@rspack/core";
import { describe, expect, it, vi } from "vitest";
import webpack from "webpack";
import rspackPlugin from "../src/plugin/rspack";
import webpackPlugin from "../src/plugin/webpack";

describe.each(["webpack", "rspack", "rspack native"] as const)(
	"%s watch recovery",
	(tool) => {
		it.each(["missing layout", "duplicate page", "missing type directory"])(
			"recovers from an initial %s error using only route edits",
			async (problem) => {
				const root = await realpath(
					await mkdtemp(join(tmpdir(), "fs-router-watch-")),
				);
				const routes = join(root, "routes");
				await mkdir(routes);
				await writeFile(join(root, "entry.js"), "export const value = 42;");
				await writeFile(join(routes, "page.tsx"), "export default () => null;");
				const layout = join(routes, "layout.tsx");
				const duplicate = join(routes, "page.jsx");
				const typeDirectory = join(root, "type-routes");
				if (problem !== "missing layout") {
					await writeFile(layout, "export default () => null;");
				}
				if (problem === "duplicate page") {
					await writeFile(duplicate, "export default () => null;");
				}
				const config = {
					mode: "development" as const,
					context: root,
					entry: "./entry.js",
					output: { path: join(root, "output") },
				};
				const options = {
					routesDirectory: routes,
					generatedRoutesPath: join(root, "generated.tsx"),
					typeGenerateOptions:
						problem === "missing type directory"
							? {
									routesTypeFile: join(root, "routes-type.ts"),
									routesDirectories: [
										{ path: typeDirectory, prefix: "/types" },
									],
								}
							: undefined,
				};
				const compiler =
					tool === "webpack"
						? webpack({ ...config, plugins: [webpackPlugin(options)] })
						: rspack({
								...config,
								experiments: { nativeWatcher: tool === "rspack native" },
								plugins: [rspackPlugin(options)],
							});
				let builds = 0;
				let failure: string | undefined;
				const watcher = compiler.watch(
					{ aggregateTimeout: 20 },
					(error, stats) => {
						builds++;
						failure =
							error?.message ??
							(stats?.hasErrors() ? stats.toString() : undefined);
					},
				);
				try {
					await vi.waitFor(() => expect(builds).toBeGreaterThan(0), {
						timeout: 5000,
					});
					expect(failure).toContain(
						problem === "missing layout"
							? "root layout component is required"
							: problem === "duplicate page"
								? "Duplicate route convention"
								: "ENOENT",
					);
					const failedBuilds = builds;
					if (problem === "missing layout")
						await writeFile(layout, "export default () => null;");
					else if (problem === "duplicate page") await rm(duplicate);
					else {
						await mkdir(typeDirectory);
						await writeFile(
							join(typeDirectory, "page.tsx"),
							"export default () => null;",
						);
					}
					await vi.waitFor(
						() => {
							expect(builds).toBeGreaterThan(failedBuilds);
							expect(failure).toBeUndefined();
						},
						{ timeout: 5000 },
					);
					expect(await readFile(options.generatedRoutesPath, "utf8")).toContain(
						"index: true",
					);
					if (problem === "missing type directory")
						await vi.waitFor(
							async () =>
								expect(
									await readFile(join(root, "routes-type.ts"), "utf8"),
								).toContain('"/types": {}'),
							{ timeout: 5000 },
						);
					// A later generation failure must also leave the host watcher live.
					const recoveredBuilds = builds;
					await writeFile(duplicate, "export default () => null;");
					await vi.waitFor(
						() => {
							expect(builds).toBeGreaterThan(recoveredBuilds);
							expect(failure).toContain("Duplicate route convention");
						},
						{ timeout: 5000 },
					);
					// Existing non-route dependencies must survive generation failures too.
					const beforeEntryEdit = builds;
					await writeFile(join(root, "entry.js"), "export const value = 43;");
					await vi.waitFor(
						() => {
							expect(builds).toBeGreaterThan(beforeEntryEdit);
							expect(failure).toContain("Duplicate route convention");
						},
						{ timeout: 5000 },
					);
					const subsequentFailures = builds;
					await rm(duplicate);
					await vi.waitFor(
						() => {
							expect(builds).toBeGreaterThan(subsequentFailures);
							expect(failure).toBeUndefined();
						},
						{ timeout: 5000 },
					);
				} finally {
					if (watcher)
						await new Promise<void>((resolve) =>
							watcher.close(() => resolve()),
						);
					await new Promise<void>((resolve) => compiler.close(() => resolve()));
					await rm(root, { recursive: true, force: true });
				}
			},
			25_000,
		);
	},
);
