import { readdirSync, writeFileSync } from "node:fs";

const origin = "https://givingwu.github.io/fs-router/";
const pages = readdirSync("doc_build", { recursive: true })
	.filter((file) => file.endsWith(".html") && file !== "404.html")
	.sort();
const urls = pages.map(
	(file) => new URL(file.replace(/index\.html$/, ""), origin).href,
);
writeFileSync(
	"doc_build/sitemap.xml",
	`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url.replaceAll("&", "&amp;")}</loc></url>`).join("\n")}\n</urlset>\n`,
);
console.log(`Generated sitemap with ${urls.length} public documentation URLs`);
