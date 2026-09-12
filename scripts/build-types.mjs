import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";

const root = fileURLToPath(new URL("..", import.meta.url));
const temporary = join(root, ".artifacts/types");
mkdirSync(temporary, { recursive: true });
try {
	execFileSync(
		process.execPath,
		[
			join(root, "node_modules/typescript/bin/tsc"),
			"--project",
			"tsconfig.json",
			"--noEmit",
			"false",
			"--declaration",
			"--emitDeclarationOnly",
			"--outDir",
			temporary,
			"--rootDir",
			"src",
		],
		{ cwd: root, stdio: "inherit" },
	);
	for (const entry of ["index", "vite", "webpack", "rspack"]) {
		const output = join(root, "dist", `${entry}.d.ts`);
		const config = ExtractorConfig.prepare({
			configObject: {
				projectFolder: root,
				mainEntryPointFilePath: join(
					temporary,
					entry === "index" ? "index.d.ts" : `plugin/${entry}.d.ts`,
				),
				compiler: { tsconfigFilePath: join(root, "tsconfig.json") },
				dtsRollup: { enabled: true, untrimmedFilePath: output },
				messages: {
					extractorMessageReporting: {
						"ae-missing-release-tag": { logLevel: "none" },
						"ae-forgotten-export": { logLevel: "none" },
					},
				},
			},
			configObjectFullPath: undefined,
			packageJsonFullPath: join(root, "package.json"),
		});
		const result = Extractor.invoke(config, { localBuild: true });
		if (!result.succeeded)
			throw new Error(`Declaration bundling failed for ${entry}`);
		// Vite's CJS runtime shim does not re-export its ESM-only Plugin type.
		const commonjs = readFileSync(output, "utf8").replace(
			/^import (?:type )?(.+) from 'vite';/gm,
			`import type $1 from 'vite' with { "resolution-mode": "import" };`,
		);
		writeFileSync(output.replace(/\.d\.ts$/, ".d.cts"), commonjs);
	}
} finally {
	rmSync(temporary, { recursive: true, force: true });
}
console.log("Bundled ESM/CJS declarations for all four public entry points");
