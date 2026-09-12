import { lstat, readdir } from "node:fs/promises";
import { extname, join } from "node:path";
import { pathParser } from "../core/path-parser";
import { validateOutputs, writeGenerated } from "../plugin/output";
import { JS_EXTENSIONS } from "./constants";
import { quote } from "./utils";

export interface RouteDirectory {
	prefix?: string;
	path: string;
}
export interface TypeGenerateOptions {
	routesTypeFile: string;
	/** Reserved for compatibility; parameters are inferred by useNavigation. */
	generateRouteParams?: boolean;
	/** Reserved for compatibility; loader result types are not generated. */
	generateLoaderTypes?: boolean;
	routesDirectories?: Array<RouteDirectory>;
}
export type GenerateRouteTypeOptions = TypeGenerateOptions;

export async function generateRouteType(
	options: TypeGenerateOptions,
	extensions: readonly string[] = JS_EXTENSIONS,
) {
	const { routesTypeFile, routesDirectories = [] } = options;
	await validateOutputs(
		[routesTypeFile],
		routesDirectories.map((directory) => directory.path),
	);
	const paths = new Set<string>();
	async function walk(directory: string, segments: string[], prefix: string) {
		for (const entry of (
			await readdir(directory, { withFileTypes: true })
		).sort((a, b) => a.name.localeCompare(b.name, "en"))) {
			if (
				entry.isSymbolicLink() ||
				entry.name.startsWith(".") ||
				entry.name === "node_modules"
			)
				continue;
			if (entry.isDirectory()) {
				await walk(
					join(directory, entry.name),
					[...segments, entry.name],
					prefix,
				);
			} else if (entry.isFile()) {
				const ext = extname(entry.name);
				const stem = entry.name.slice(0, -ext.length);
				if (!extensions.includes(ext) || !["page", "$"].includes(stem))
					continue;
				const parsed = pathParser([...segments, stem].join("/")).route;
				paths.add(
					`/${prefix}/${parsed}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/",
				);
			}
		}
	}
	for (const directory of routesDirectories) {
		const stat = await lstat(directory.path);
		if (!stat.isDirectory() || stat.isSymbolicLink())
			throw new Error(
				`Routes directory must be a real directory: ${directory.path}`,
			);
		await walk(directory.path, [], directory.prefix ?? "");
	}
	const content = [
		`import "@feoe/fs-router";`,
		`declare module "@feoe/fs-router" {`,
		"  interface RouteTypes {",
		...Array.from(paths)
			.sort()
			.map((route) => `    ${quote(route)}: {};`),
		"  }",
		"}",
		"",
	].join("\n");
	await writeGenerated(routesTypeFile, content);
}
