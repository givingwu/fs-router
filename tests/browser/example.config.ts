import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: ".",
	testMatch: "example.spec.ts",
	workers: 1,
	timeout: 45_000,
	use: {
		browserName: "chromium",
		viewport: { width: 1100, height: 750 },
		trace: "retain-on-failure",
	},
	webServer: [
		{
			command:
				"npm --prefix examples/minimal-react run preview -- --port 4173 --strictPort",
			url: "http://127.0.0.1:4173",
			cwd: "../..",
		},
		{
			command: "npm --prefix examples/minimal-react run preview:rspack",
			url: "http://127.0.0.1:4174",
			cwd: "../..",
		},
		{
			command: "npm --prefix examples/minimal-react run preview:webpack",
			url: "http://127.0.0.1:4175",
			cwd: "../..",
		},
		{
			command:
				"npm --prefix examples/minimal-react run dev -- --port 4178 --strictPort",
			url: "http://127.0.0.1:4178",
			cwd: "../..",
		},
	],
});
