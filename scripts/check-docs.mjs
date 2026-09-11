import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = "doc_build";
const base = "/fs-router/";
const pages = readdirSync(root, { recursive: true }).filter((file) =>
	file.endsWith(".html"),
);
assert(pages.includes("index.html"), "Missing documentation index");
let assets = 0;
for (const page of pages) {
	const html = readFileSync(join(root, page), "utf8");
	for (const [, url] of html.matchAll(/(?:src|href)="([^" ]+)"/g)) {
		if (!url.startsWith("/") || url.startsWith("//")) continue;
		assert(url.startsWith(base), `${page}: URL outside Pages base: ${url}`);
		const asset = url.slice(base.length).split(/[?#]/)[0];
		if (/\.(?:js|css|svg|png|ico|webp)$/.test(asset)) {
			assert(existsSync(join(root, asset)), `${page}: missing asset ${url}`);
			assets++;
		}
	}
}
assert(assets > 0, "No local documentation assets checked");
console.log(
	`Verified ${pages.length} HTML pages and ${assets} asset references under ${base}`,
);
