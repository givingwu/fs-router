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

const sitemap = readFileSync(join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
	(match) => match[1],
);
assert.equal(
	sitemapUrls.length,
	pages.length - 1,
	"Sitemap must cover every non-404 page",
);
assert.equal(
	new Set(sitemapUrls).size,
	sitemapUrls.length,
	"Duplicate sitemap URL",
);
for (const url of sitemapUrls) {
	const parsed = new URL(url);
	assert.equal(parsed.origin, origin);
	assert(parsed.pathname.startsWith(base));
	assert(
		target(decodeURIComponent(parsed.pathname)),
		`Broken sitemap URL: ${url}`,
	);
	assert(!parsed.pathname.endsWith("404.html"));
}
console.log(`Verified ${sitemapUrls.length} sitemap URLs`);

for (const [file, title, summary] of [
	["index.html", "React 文件路由与类型化导航", "React/TypeScript"],
	["english.html", "File-based routing for React", "typed navigation"],
]) {
	const html = contents.get(join(root, file));
	assert(
		html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1].includes(title),
		`${file}: missing descriptive title`,
	);
	const description = [...html.matchAll(/<meta\b[^>]*>/g)].find(([tag]) =>
		tag.includes('name="description"'),
	)?.[0];
	assert(description?.includes(summary), `${file}: missing search summary`);
	assert(
		!/<meta[^>]+name="robots"[^>]+noindex/.test(html),
		`${file}: unexpectedly blocks indexing`,
	);
}
console.log("Verified Chinese and English entry titles and search summaries");
