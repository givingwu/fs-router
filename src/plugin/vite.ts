import { createVitePlugin } from "unplugin";
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
const FileBasedRouterVite = createVitePlugin(unpluginRouterGeneratorFactory);

export { FileBasedRouterVite, type PluginConfig };
export default FileBasedRouterVite;
