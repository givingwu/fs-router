import { isAbsolute, relative, sep } from "node:path";
import type { UnpluginFactory, UnpluginOptions } from "unplugin";
import { getConfig, type PluginConfig } from "./config";
import { generator } from "./generator";

const PLUGIN_NAME = "unplugin:file-based-router-generator";
type Compiler =
	| Parameters<NonNullable<UnpluginOptions["webpack"]>>[0]
	| Parameters<NonNullable<UnpluginOptions["rspack"]>>[0];

function watchDependencies(values: Iterable<string>) {
	const dependencies = new Set(values);
	// Rspack's native watcher also requires incremental dependency collections.
	return Object.assign(dependencies, {
		added: dependencies,
		removed: new Set<string>(),
	});
}

/** Plugin structure inspired by https://github.com/TanStack/router/tree/main/packages/router-plugin */
export const unpluginRouterGeneratorFactory: UnpluginFactory<
	Partial<PluginConfig> | undefined
> = (userOptions = {}, meta) => {
	let root = process.cwd();
	let config = getConfig(userOptions, root);
	// Serialize requests instead of dropping edits received during generation.
	let pending = Promise.resolve();
	const generate = () => {
		const next = pending
			.catch(() => {})
			.then(async () => {
				if (config.enableGeneration) await generator(config);
			});
		pending = next;
		return next;
	};
	const routeDirectories = () => [
		config.routesDirectory,
		...(config.typeGenerateOptions?.routesDirectories?.map(
			(directory) => directory.path,
		) ?? []),
	];
	const contains = (file: string) => {
		return routeDirectories().some((directory) => {
			const rel = relative(directory, file);
			return rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
		});
	};
	const setRoot = (value: string) => {
		root = value;
		config = getConfig(userOptions, root);
	};
	const configureCompiler = (compiler: Compiler) => {
		setRoot(compiler.context);
		let files = watchDependencies([]);
		let directories = watchDependencies(routeDirectories());
		let missing = watchDependencies([]);
		const beforeBuild = async () => {
			await generate();
			if (config.enableGeneration) {
				// The host snapshot precedes watchRun; invalidate generated modules
				// in this compilation, not only in a later filesystem event.
				compiler.inputFileSystem?.purge?.(config.generatedRoutesPath);
				if (compiler.modifiedFiles)
					compiler.modifiedFiles = new Set([
						...Array.from(compiler.modifiedFiles),
						config.generatedRoutesPath,
					]);
			}
		};
		compiler.hooks.beforeRun.tapPromise(PLUGIN_NAME, beforeBuild);
		compiler.hooks.watchRun.tapPromise(PLUGIN_NAME, async () => {
			// A rejected generation skips afterCompile. Subscribe before awaiting
			// it on every run so route edits can recover initial and later failures.
			// Watching owns cleanup and retains the last compilation's dependencies.
			if (config.enableGeneration)
				compiler.watching?.watch(files, directories, missing);
			await beforeBuild();
		});
		compiler.hooks.afterCompile.tap(PLUGIN_NAME, (compilation) => {
			if (!config.enableGeneration) return;
			for (const directory of routeDirectories())
				compilation.contextDependencies.add(directory);
			// Copy Rspack's native-backed collections while this compilation is live.
			files = watchDependencies(compilation.fileDependencies);
			directories = watchDependencies(compilation.contextDependencies);
			missing = watchDependencies(compilation.missingDependencies);
		});
	};

	return {
		name: PLUGIN_NAME,
		buildStart: meta.framework === "vite" ? generate : undefined,
		watchChange:
			meta.framework === "vite"
				? async (id) => {
						if (contains(id)) await generate();
					}
				: undefined,
		vite: {
			configResolved(resolved) {
				setRoot(resolved.root);
			},
			configureServer(server) {
				// Vite's watcher owns its lifecycle. New/deleted files are not yet
				// necessarily in its module graph, so handle structural edits here.
				if (!config.enableGeneration) return;
				server.watcher.add(routeDirectories());
				const onStructure = (file: string) => {
					if (!contains(file)) return;
					void generate()
						.then(() => server.ws.send({ type: "full-reload" }))
						.catch((error: unknown) => {
							const message =
								error instanceof Error ? error.message : String(error);
							server.config.logger.error(message);
							server.ws.send({
								type: "error",
								err: { message, stack: "", plugin: PLUGIN_NAME },
							});
						});
				};
				server.watcher.on("add", onStructure).on("unlink", onStructure);
				server.httpServer?.once("close", () => {
					server.watcher.off("add", onStructure).off("unlink", onStructure);
				});
			},
		},
		webpack: configureCompiler,
		rspack: configureCompiler,
	};
};
