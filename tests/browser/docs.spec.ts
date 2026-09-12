import { mkdir, writeFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const [mode, port] of [
	["preview", 4176],
	["dev", 4177],
] as const) {
	test(`${mode}: Chinese navigation, sidebar, search and keyboard`, async ({
		page,
	}) => {
		const errors: string[] = [];
		page.on("pageerror", (error) => errors.push(error.message));
		await page.goto(`http://127.0.0.1:${port}/fs-router/`);
		await expect(page.locator("html")).toHaveAttribute("lang", "zh");
		await page.getByRole("link", { name: "指南", exact: true }).first().click();
		await expect(
			page.getByRole("heading", { name: "快速开始", level: 1 }),
		).toBeVisible();
		const sidebar = page.locator(".rspress-sidebar");
		await expect(
			sidebar.getByRole("link", { name: "约定式路由", exact: true }),
		).toBeVisible();
		await page.getByRole("button", { name: /搜索文档/ }).focus();
		await page.keyboard.press("Enter");
		const search = page.getByPlaceholder("搜索文档");
		await expect(search).toBeVisible();
		await search.press("ArrowDown");
		await search.press("Enter");
		await expect(search).toBeVisible();
		await search.fill("useNavigation");
		await expect(
			page.getByRole("link", { name: "Hook API > useNavigation", exact: true }),
		).toBeVisible();
		await mkdir(".artifacts/browser", { recursive: true });
		await page.screenshot({
			path: `.artifacts/browser/docs-${mode}-search.png`,
		});
		await search.press("Enter");
		await expect(
			page.getByRole("heading", { name: "Hook API", level: 1 }),
		).toBeVisible();
		await page.goto(
			`http://127.0.0.1:${port}/fs-router/guide/start/getting-started`,
		);
		await page.getByRole("button", { name: /搜索文档/ }).click();
		await expect(search).toBeVisible();
		await page.keyboard.press("Escape");
		await expect(search).not.toBeVisible();
		await sidebar
			.getByRole("link", { name: "兼容性与限制", exact: true })
			.click();
		await expect(
			page.getByRole("heading", { name: "兼容性、公开 API 与限制", level: 1 }),
		).toBeVisible();
		expect(errors).toEqual([]);
	});
}

test("production pages: images, responsive navigation and accessibility", async ({
	page,
}) => {
	// Exercise the text shortcut label even when the test host is macOS.
	await page.addInitScript(() => {
		Object.defineProperty(navigator, "platform", { get: () => "Linux x86_64" });
	});
	await page.goto("http://127.0.0.1:4176/fs-router/");
	await expect(page.getByRole("link", { name: "运行最小示例" })).toBeVisible();
	for (const img of await page.locator("img:visible").all()) {
		await expect(img).toHaveAttribute("alt", /.+/);
		expect(
			await img.evaluate(
				(node: HTMLImageElement) => node.complete && node.naturalWidth > 0,
			),
		).toBe(true);
	}
	await page.screenshot({
		path: ".artifacts/browser/docs-desktop.png",
		fullPage: true,
	});
	const reports = [];
	for (const scheme of ["light", "dark"] as const) {
		await page.emulateMedia({ colorScheme: scheme });
		for (const path of ["", "guide/start/getting-started", "english"]) {
			await page.goto(`http://127.0.0.1:4176/fs-router/${path}`);
			const result = await new AxeBuilder({ page })
				.withTags(["wcag2a", "wcag2aa", "wcag21aa"])
				.analyze();
			reports.push({ path, scheme, violations: result.violations });
		}
	}
	await page.emulateMedia({ colorScheme: "light" });
	await writeFile(
		".artifacts/browser/accessibility.json",
		JSON.stringify(reports, null, 2),
	);
	expect(
		reports.flatMap((report) =>
			report.violations.map((v) => ({
				id: v.id,
				targets: v.nodes.map((n) => n.target),
			})),
		),
	).toEqual([]);
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto("http://127.0.0.1:4176/fs-router/");
	await page.getByRole("button", { name: "mobile hamburger" }).click();
	await page.getByRole("link", { name: "指南", exact: true }).last().click();
	await expect(
		page.getByRole("heading", { name: "快速开始", level: 1 }),
	).toBeVisible();
	await page.getByRole("button", { name: "Menu", exact: true }).click();
	await page
		.locator(".rspress-sidebar")
		.getByRole("link", { name: "约定式路由", exact: true })
		.click();
	await expect(
		page.getByRole("heading", { name: "约定式路由", level: 1 }),
	).toBeVisible();
	expect(
		await page.evaluate(
			() => document.documentElement.scrollWidth <= window.innerWidth,
		),
	).toBe(true);
	await expect
		.poll(() =>
			page
				.locator(".rspress-sidebar")
				.evaluate((element) => element.getBoundingClientRect().right),
		)
		.toBeLessThanOrEqual(0);
	await page.screenshot({
		path: ".artifacts/browser/docs-mobile.png",
		animations: "disabled",
	});
});
