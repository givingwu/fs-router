import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(
	readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);
assert.equal(pkg.name, "@feoe/fs-router");
assert.match(pkg.version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);
assert.equal(
	process.env.RELEASE_VERSION,
	pkg.version,
	"Requested release must match package.json",
);
assert(
	readFileSync(new URL("../CHANGELOG.md", import.meta.url), "utf8").includes(
		`## ${pkg.version}`,
	),
	"Missing changelog entry",
);
console.log(
	`Validated release version ${pkg.name}@${pkg.version}; this check does not publish`,
);
