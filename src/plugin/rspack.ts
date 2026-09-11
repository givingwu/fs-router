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
const FileBasedRouterRspack = createRspackPlugin(
	unpluginRouterGeneratorFactory,
);

export { FileBasedRouterRspack, type PluginConfig };
export default FileBasedRouterRspack;
