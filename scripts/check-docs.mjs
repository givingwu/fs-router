import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve("doc_build");
const base = "/fs-router/";
const origin = "https://givingwu.github.io";
const pages = readdirSync(root, { recursive: true }).filter((file) =>
	file.endsWith(".html"),
);
assert(pages.includes("index.html"), "Missing documentation index");
const contents = new Map(
	pages.map((page) => [
		join(root, page),
		readFileSync(join(root, page), "utf8"),
	]),
);
let references = 0;
function target(pathname) {
	const path = join(root, pathname.slice(base.length));
	return [path, `${path}.html`, join(path, "index.html")].find(
		(candidate) =>
			contents.has(candidate) ||
			(existsSync(candidate) && /\.[a-z0-9]+$/i.test(candidate)),
	);
}
for (const page of pages) {
	const html = contents.get(join(root, page));
	assert(/<html[^>]+lang="zh"/.test(html), `${page}: missing Chinese language`);
	const current = new URL(
		`${base}${page.replace(/index\.html$/, "").replace(/\.html$/, "")}`,
		origin,
	);
	for (const [, raw] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
		if (/^(?:data:|mailto:|tel:)/.test(raw)) continue;
		const url = new URL(raw.replaceAll("&amp;", "&"), current);
		if (url.origin !== origin) continue;
		assert(
			url.pathname.startsWith(base),
			`${page}: URL outside Pages base: ${raw}`,
		);
		const file = target(decodeURIComponent(url.pathname));
		assert(file, `${page}: missing page/asset: ${raw}`);
		if (url.hash && contents.has(file)) {
			const id = decodeURIComponent(url.hash.slice(1));
			assert(
				contents.get(file).includes(`id="${id}"`),
				`${page}: missing anchor: ${raw}`,
			);
		}
		references++;
	}
}
const home = contents.get(join(root, "index.html"));
for (const path of [
	"guide/start/getting-started",
	"examples/",
	"api/",
	"contributing/",
	"english",
]) {
	assert(
		home.includes(
			`href="${base}${path.endsWith("/") ? `${path}index` : path}.html"`,
		),
		`Missing home navigation: ${path}`,
	);
}
const guide = contents.get(join(root, "guide/start/getting-started.html"));
for (const path of [
	"guide/basic/file-based-routing",
	"guide/advanced/data-fetch",
	"guide/compatibility",
]) {
	assert(
		guide.includes(
			`href="${base}${path.endsWith("/") ? `${path}index` : path}.html"`,
		),
		`Missing guide sidebar: ${path}`,
	);
}
// Existing published paths are a fixed baseline, even if sources are later moved.
for (const path of JSON.parse(
	readFileSync("tests/browser/legacy-doc-paths.json", "utf8"),
)) {
	assert(contents.has(join(root, path)), `Removed published page: ${path}`);
}
// Cover new pages too.
const sourcePages = readdirSync("docs", { recursive: true }).filter((file) =>
	file.endsWith(".md"),
);
for (const file of sourcePages)
	assert(
		target(`${base}${file.replace(/\.md$/, "")}`),
		`Missing built page: ${file}`,
	);
console.log(
	`Verified ${pages.length} HTML pages, ${references} local references/anchors, Chinese navigation and source page coverage`,
);
