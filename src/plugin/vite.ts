import { createVitePlugin } from "unplugin";
import type { Plugin } from "vite";
import type { PluginConfig } from "./config";
import { unpluginRouterGeneratorFactory } from "./factory";

/**
 * @example
 * ```ts
 * export default defineConfig({
 *   // ...
 *   tools: {
 *     Vite: {
 *       plugins: [FileBasedRouterVite()],
 *     },
 *   },
 * })
 * ```
 */
const FileBasedRouterVite: (
	options?: Partial<PluginConfig>,
) => Plugin | Plugin[] = createVitePlugin(unpluginRouterGeneratorFactory);

export { FileBasedRouterVite, type PluginConfig };
export default FileBasedRouterVite;
