import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { expect, test } from "@playwright/test";

for (const [tool, port] of [
	["vite", 4173],
	["rspack", 4174],
	["webpack", 4175],
] as const) {
	test(`${tool}: production navigation, loader, chunks and errors`, async ({
		page,
	}) => {
		const errors: string[] = [];
		const requests: string[] = [];
		page.on("pageerror", (error) => errors.push(error.message));
		page.on("request", (request) => {
			if (/\.js(?:\?|$)/.test(request.url())) requests.push(request.url());
		});
		await page.goto(`http://127.0.0.1:${port}/`);
		await page.getByRole("button", { name: "Count: 0" }).click();
		await expect(page.getByRole("button", { name: "Count: 1" })).toBeVisible();
		const before = requests.length;
		let releaseChunks = () => {};
		const chunksBlocked = new Promise<void>((resolve) => {
			releaseChunks = resolve;
		});
		await page.route(/\.js(?:\?|$)/, async (route) => {
			await chunksBlocked;
			await route.continue();
		});
		try {
			await page.getByRole("button", { name: "Open user 42" }).click();
			await expect(
				page.getByText("Loading component…", { exact: true }),
			).toBeVisible();
		} finally {
			releaseChunks();
		}
		await expect(
			page.getByRole("heading", { name: "Demo User" }),
		).toBeVisible();
		await expect(page.getByText("User ID: 42")).toBeVisible();
		expect(requests.length).toBeGreaterThan(before);
		await mkdir(".artifacts/browser", { recursive: true });
		await page.screenshot({ path: `.artifacts/browser/example-${tool}.png` });
		await page.reload();
		await expect(page.getByText("User ID: 42")).toBeVisible();
		await page.goto(`http://127.0.0.1:${port}/users/missing`);
		await expect(
			page.getByRole("heading", { name: "Error 404" }),
		).toBeVisible();
		await page.goto(`http://127.0.0.1:${port}/unknown`);
		await expect(
			page.getByRole("heading", { name: "Page not found" }),
		).toBeVisible();
		expect(errors).toEqual([]);
	});
}

test("Vite dev: component edit and route add/delete update the browser", async ({
	page,
}) => {
	const root = "examples/minimal-react/src/routes";
	const home = `${root}/page.tsx`;
	const original = await readFile(home, "utf8");
	let added: string | undefined;
	let segment: string;
	await page.goto("http://127.0.0.1:4178/");
	await page.getByRole("button", { name: "Count: 0" }).click();
	try {
		await writeFile(
			home,
			original.replace("Hello fs-router", "Hello edited route"),
		);
		await expect(
			page.getByRole("heading", { name: "Hello edited route" }),
		).toBeVisible();
		await expect(page.getByRole("button", { name: "Count: 1" })).toBeVisible();
		added = await mkdtemp(`${root}/smoke-added-`);
		segment = basename(added);
		await writeFile(
			`${added}/page.tsx`,
			"export default function Added() { return <h1>Added route works</h1>; }",
		);
		await expect
			.poll(async () =>
				readFile("examples/minimal-react/src/routes.tsx", "utf8"),
			)
			.toContain(segment);
		await page.goto(`http://127.0.0.1:4178/${segment}`);
		await expect(
			page.getByRole("heading", { name: "Added route works" }),
		).toBeVisible();
		await rm(added, { recursive: true });
		await expect
			.poll(async () =>
				readFile("examples/minimal-react/src/routes.tsx", "utf8"),
			)
			.not.toContain(segment);
		await expect(
			page.getByRole("heading", { name: "Page not found" }),
		).toBeVisible();
	} finally {
		await writeFile(home, original);
		if (added) await rm(added, { recursive: true, force: true });
	}
});
