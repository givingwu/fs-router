import { stat } from "node:fs/promises";
import { RouteCodeGenerator, RouteExtractor } from "../router";
import { generateRouteType } from "../router/route-type-generator";
import type { PluginConfig } from "./config";
import { validateOutputs, writeGenerated } from "./output";

async function generateOnce(config: PluginConfig) {
	if (!config.enableGeneration) return "";
	await validateOutputs(
		[
			config.generatedRoutesPath,
			...(config.typeGenerateOptions
				? [config.typeGenerateOptions.routesTypeFile]
				: []),
		],
		[
			config.routesDirectory,
			...(config.typeGenerateOptions?.routesDirectories?.map(
				(directory) => directory.path,
			) ?? []),
		],
	);
	// Extract routes
	const extractor = new RouteExtractor({
		routesDir: config.routesDirectory,
		alias: config.alias,
		routeExtensions: config.routeExtensions,
	});
	const routes = await extractor.extract();

	// Generate code
	const generator = new RouteCodeGenerator({
		splitting: config.splitting,
	});
	const code = generator.generate(routes);

	await writeGenerated(config.generatedRoutesPath, code);

	if (config.typeGenerateOptions) {
		const { routesTypeFile, routesDirectories = [] } =
			config.typeGenerateOptions;
		if (routesDirectories.length > 0) {
			await generateRouteType(
				{
					routesTypeFile,
					routesDirectories,
				},
				config.routeExtensions,
			);
		}
	}

	return code;
}

// Editors and recursive directory deletion can invalidate a scan between readdir
// and lstat/readFile. Retry a fresh scan, but never hide a missing root or a
// persistent I/O/configuration error.
export async function generator(config: PluginConfig) {
	for (let attempt = 0; ; attempt++) {
		try {
			return await generateOnce(config);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== "ENOENT" || attempt >= 2)
				throw error;
			if (!(await stat(config.routesDirectory)).isDirectory()) throw error;
		}
	}
}
