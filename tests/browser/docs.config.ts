import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: ".",
	testMatch: "docs.spec.ts",
	workers: 1,
	timeout: 30_000,
	use: {
		browserName: "chromium",
		viewport: { width: 1280, height: 900 },
		trace: "retain-on-failure",
	},
	webServer: [
		{
			command: "pnpm docs:preview --host 127.0.0.1 --port 4176",
			url: "http://127.0.0.1:4176/fs-router/",
			cwd: "../..",
			timeout: 60_000,
		},
		{
			command: "pnpm docs:dev --host 127.0.0.1 --port 4177",
			url: "http://127.0.0.1:4177/fs-router/",
			cwd: "../..",
			timeout: 60_000,
		},
	],
});
