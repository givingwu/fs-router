import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// npm 10.9.0 runs prepare during pack even with --ignore-scripts. Keep packing
// side-effect free and its JSON stdout clean; hooks belong to local installs.
if (
	!process.env.CI &&
	process.env.npm_command !== "pack" &&
	!["1", "true"].includes(process.env.SKIP_INSTALL_SIMPLE_GIT_HOOKS)
) {
	execFileSync(
		process.execPath,
		[
			fileURLToPath(
				new URL("../node_modules/simple-git-hooks/cli.js", import.meta.url),
			),
		],
		{ stdio: "inherit" },
	);
}
