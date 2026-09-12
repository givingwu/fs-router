import { createWebpackPlugin } from "unplugin";
import type { WebpackPluginInstance } from "webpack";
import type { PluginConfig } from "./config";
import { unpluginRouterGeneratorFactory } from "./factory";

/**
 * @example
 * ```ts
 * export default defineConfig({
 *   // ...
 *   tools: {
 *     Webpack: {
 *       plugins: [FileBasedRouterWebpack()],
 *     },
 *   },
 * })
 * ```
 */
const FileBasedRouterWebpack: (
	options?: Partial<PluginConfig>,
) => WebpackPluginInstance = /* #__PURE__ */ createWebpackPlugin(
	unpluginRouterGeneratorFactory,
);

export { FileBasedRouterWebpack, type PluginConfig };
export default FileBasedRouterWebpack;
