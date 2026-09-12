import { resolve } from "node:path";
import { defineConfig } from "rspress/config";
import { navigation } from "./navigation";

export default defineConfig({
	root: resolve("docs"),
	base: "/fs-router/",
	themeDir: resolve("docs/.rspress/theme"),
	globalStyles: resolve("docs/.rspress/styles.css"),
	title: "@feoe/fs-router",
	description: "为现有 React 应用生成文件路由、导航类型与客户端 loader 配置",
	icon: "/logo.svg",
	logo: { light: "/logo.svg", dark: "/logo.svg" },
	lang: "zh",
	themeConfig: {
		...navigation,
		editLink: {
			docRepoBaseUrl: "https://github.com/givingwu/fs-router/tree/main/docs",
			text: "在 GitHub 上编辑此页",
		},
		lastUpdated: true,
		lastUpdatedText: "最后更新时间",
		prevPageText: "上一页",
		nextPageText: "下一页",
		outlineTitle: "页面导航",
		searchPlaceholderText: "搜索文档",
		footer: { message: "基于 MIT 许可发布 · fs-router" },
	},
	markdown: { showLineNumbers: true, codeHighlighter: "prism" },
});
