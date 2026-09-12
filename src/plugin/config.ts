import { isAbsolute, relative, resolve, sep } from "node:path";
import type { TypeGenerateOptions } from "../router/route-type-generator";

export interface PluginConfig {
	/** 路由文件目录 */
	routesDirectory: string;
	/** 生成的路由文件路径 */
	generatedRoutesPath: string;
	/** 路由文件扩展名 */
	routeExtensions?: string[];
	/** 是否启用路由生成 */
	enableGeneration?: boolean;
	/** 路径别名配置 */
	alias?: {
		name: string;
		basename: string;
	};
	/** 是否启用代码分割 */
	splitting?: boolean;
	/** 是否启用默认错误边界 */
	defaultErrorBoundary?: boolean;
	/** 类型生成选项 */
	typeGenerateOptions?: TypeGenerateOptions;
}

export const defaultConfig: PluginConfig = {
	routesDirectory: "src/routes",
	generatedRoutesPath: "src/routes.tsx",
	routeExtensions: [".js", ".jsx", ".ts", ".tsx"],
	splitting: true,
	alias: undefined,
	enableGeneration: true,
	defaultErrorBoundary: false,
	typeGenerateOptions: {
		routesTypeFile: "src/routes-type.ts",
		generateRouteParams: true,
		generateLoaderTypes: true,
		routesDirectories: [],
	},
};

export const getConfig = (
	options: Partial<PluginConfig>,
	root: string,
): PluginConfig => {
	const config = { ...defaultConfig, ...options };

	// Resolve absolute paths
	config.routesDirectory = isAbsolute(config.routesDirectory)
		? config.routesDirectory
		: resolve(root, config.routesDirectory);

	config.generatedRoutesPath = isAbsolute(config.generatedRoutesPath)
		? config.generatedRoutesPath
		: resolve(root, config.generatedRoutesPath);

	if (config.typeGenerateOptions) {
		config.typeGenerateOptions = { ...config.typeGenerateOptions };
		const { routesTypeFile } = config.typeGenerateOptions;
		config.typeGenerateOptions.routesTypeFile = isAbsolute(routesTypeFile)
			? routesTypeFile
			: resolve(root, routesTypeFile);
		if (!config.typeGenerateOptions.routesDirectories?.length) {
			config.typeGenerateOptions.routesDirectories = [
				{ path: config.routesDirectory },
			];
		}
	}

	if (config.alias)
		config.alias = {
			...config.alias,
			basename: resolve(root, config.alias.basename),
		};
	if (config.typeGenerateOptions?.routesDirectories) {
		config.typeGenerateOptions.routesDirectories =
			config.typeGenerateOptions.routesDirectories.map((directory) => ({
				...directory,
				path: resolve(root, directory.path),
			}));
	}
	const outputs = [
		config.generatedRoutesPath,
		config.typeGenerateOptions?.routesTypeFile,
	].filter((p): p is string => Boolean(p));
	if (new Set(outputs).size !== outputs.length)
		throw new Error("Route code and type outputs must be different files");
	for (const directory of [
		config.routesDirectory,
		...(config.typeGenerateOptions?.routesDirectories?.map((d) => d.path) ??
			[]),
	]) {
		for (const output of outputs) {
			const rel = relative(directory, output);
			if (
				rel === "" ||
				(!isAbsolute(rel) && rel !== ".." && !rel.startsWith(`..${sep}`))
			)
				throw new Error(
					"Generated output must be outside all routes directories",
				);
		}
	}
	return config;
};
