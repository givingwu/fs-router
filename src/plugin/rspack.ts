import type { RspackPluginInstance } from "@rspack/core";
import { createRspackPlugin } from "unplugin";
import type { PluginConfig } from "./config";
import { unpluginRouterGeneratorFactory } from "./factory";

/**
 * @example
 * ```ts
 * export default defineConfig({
 *   // ...
 *   tools: {
 *     rspack: {
 *       plugins: [FileBasedRouterRspack()],
 *     },
 *   },
 * })
 * ```
 */
// unplugin resolves a different Rspack copy internally. Expose the host compiler type;
// the adapter contract is verified against the installed tarball in consumer tests.
const FileBasedRouterRspack: (
	options?: Partial<PluginConfig>,
) => RspackPluginInstance = createRspackPlugin(
	unpluginRouterGeneratorFactory,
) as unknown as (options?: Partial<PluginConfig>) => RspackPluginInstance;

export { FileBasedRouterRspack, type PluginConfig };
export default FileBasedRouterRspack;
