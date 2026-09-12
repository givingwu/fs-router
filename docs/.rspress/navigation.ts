import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import nav from "../_meta.json";

type SidebarItem =
	| { text: string; link: string }
	| { text: string; items: SidebarItem[] };

type Entry = { type: "file" | "dir"; name: string; label: string };

// Rspress 1 auto-navigation requires language directories when lang is set.
// Keep the flat Chinese URLs and reuse the existing metadata as a single source.
function readSidebar(directory: string): SidebarItem[] {
	const entries: Entry[] = JSON.parse(
		readFileSync(resolve("docs", directory, "_meta.json"), "utf8"),
	);
	return entries.map(({ type, name, label }) => {
		if (type === "dir") {
			return { text: label, items: readSidebar(`${directory}/${name}`) };
		}
		if (type !== "file")
			throw new Error(`Unsupported navigation entry: ${type}`);
		return {
			text: label,
			link: `/${directory}/${name === "index" ? "" : name}`,
		};
	});
}

export const navigation = {
	nav,
	sidebar: Object.fromEntries(
		["guide", "examples", "api", "contributing"].map((directory) => [
			`/${directory}/`,
			readSidebar(directory),
		]),
	),
};
