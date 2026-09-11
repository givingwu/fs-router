import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pkg = JSON.parse(
	readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);
for (const [entry, targets] of Object.entries(pkg.exports)) {
	for (const [condition, path] of Object.entries(targets)) {
		assert(
			existsSync(new URL(`../${path}`, import.meta.url)),
			`${entry}: missing ${condition} target ${path}`,
		);
	}
	const name = pkg.name + (entry === "." ? "" : entry.slice(1));
	const esm = await import(name);
	const cjs = require(name);
	if (entry === ".") {
		assert.equal(esm.pathParser("users/[id]/page.tsx").route, "users/:id");
		assert.equal(cjs.pathParser("users/[id]/page.tsx").route, "users/:id");
	} else {
		assert.equal(typeof esm.default, "function");
		assert.equal(typeof cjs.default, "function");
	}
}
console.log("Verified all 4 package entry points: types, ESM and CJS");
