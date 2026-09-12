import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const artifacts = join(root, ".artifacts");
mkdirSync(artifacts, { recursive: true });
function run(command, args, cwd = root) {
	execFileSync(command, args, { cwd, stdio: "inherit", timeout: 240_000 });
}
run("pnpm", ["run", "prepack"]);
const [packed] = JSON.parse(
	execFileSync(
		"npm",
		["pack", "--ignore-scripts", "--json", "--pack-destination", artifacts],
		{ cwd: root, encoding: "utf8" },
	),
);
const example = join(root, "examples/minimal-react");
run("npm", ["ci", "--ignore-scripts", "--no-audit", "--no-fund"], example);
run(
	"npm",
	[
		"install",
		"--no-save",
		"--package-lock=false",
		"--ignore-scripts",
		"--no-audit",
		"--no-fund",
		join(artifacts, packed.filename),
	],
	example,
);
console.log(
	`Example installed from ${packed.filename}. Run npm --prefix examples/minimal-react run dev`,
);
