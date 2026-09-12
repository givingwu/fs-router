import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repo = fileURLToPath(new URL("..", import.meta.url));
const artifacts = join(repo, ".artifacts");
mkdirSync(artifacts, { recursive: true });
function run(command, args, cwd) {
	execFileSync(command, args, { cwd, stdio: "inherit", timeout: 240_000 });
}
// prepack builds and checks the package. --ignore-scripts prevents recursive lifecycle hooks.
if (!process.env.FS_ROUTER_TARBALL) run("pnpm", ["run", "prepack"], repo);
const packed = process.env.FS_ROUTER_TARBALL
	? null
	: JSON.parse(
			execFileSync(
				"npm",
				["pack", "--ignore-scripts", "--json", "--pack-destination", artifacts],
				{ cwd: repo, encoding: "utf8" },
			),
		);
const manifest =
	packed && (Array.isArray(packed) ? packed[0] : packed["@feoe/fs-router"]);
assert(
	process.env.FS_ROUTER_TARBALL || manifest,
	"npm pack did not return package metadata",
);
const tarball = process.env.FS_ROUTER_TARBALL
	? resolve(process.env.FS_ROUTER_TARBALL)
	: join(artifacts, manifest.filename);
if (manifest) {
	assert(
		manifest.files.every((file) =>
			/^(dist\/|package\.json$|README(?:\.en)?\.md$|LICENSE$)/.test(file.path),
		),
		"unexpected file in tarball",
	);
	assert(
		!manifest.files.some((file) => /\.map$/.test(file.path)),
		"source maps must not expose build paths",
	);
	writeFileSync(
		join(artifacts, "package-preview.json"),
		JSON.stringify(manifest, null, 2),
	);
	console.log(
		`Package preview: ${manifest.name}@${manifest.version}, ${manifest.size} bytes, ${manifest.integrity}`,
	);
}
for (const variant of process.env.FS_ROUTER_CONSUMER
	? [process.env.FS_ROUTER_CONSUMER]
	: ["react18", "react19"]) {
	assert(["react18", "react19"].includes(variant));
	const project = mkdtempSync(join(tmpdir(), `fs-router-${variant}-`));
	try {
		cpSync(join(repo, "tests/consumers", variant), project, {
			recursive: true,
		});
		cpSync(
			join(repo, "tests/consumers/verify.mjs"),
			join(project, "verify.mjs"),
		);
		run("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], project);
		run(
			"npm",
			[
				"install",
				"--no-save",
				"--package-lock=false",
				"--ignore-scripts",
				"--no-audit",
				"--no-fund",
				tarball,
			],
			project,
		);
		run(process.execPath, ["verify.mjs"], project);
		console.log(
			`PASS ${variant} on Node ${process.version} (${process.platform}/${process.arch})`,
		);
	} finally {
		rmSync(project, { recursive: true, force: true });
	}
}
console.log(`Validated tarball: ${tarball}`);
