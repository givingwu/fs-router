import type { ViteHotContext } from "vite/types/hot.js";

export interface ImportMetaHot {
	accept(): void;
	on<T = unknown>(event: string, callback: (data: T) => void): void;
}

export declare interface ImportMeta {
	hot?: ViteHotContext | undefined;
}
