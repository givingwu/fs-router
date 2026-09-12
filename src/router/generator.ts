import * as path from "node:path";
import type { RouteNode } from "./type";
import { quote } from "./utils";

interface RouteCodeGeneratorOptions {
	splitting?: boolean;
}

export class RouteCodeGenerator {
	private readonly options: RouteCodeGeneratorOptions;
	/**
	 * runtime imports
	 * 使用 loadable 替换 lazy
	 */
	private runtimeImports: Set<string> = new Set();
	/** loader imports */
	private loaderImports: Set<string> = new Set();
	/** loading imports */
	private loadingImports: Set<string> = new Set();
	/** error imports */
	private errorImports: Set<string> = new Set();
	/** config imports */
	private configImports: Set<string> = new Set();
	/** component declarations */
	private componentDeclarations: Set<string> = new Set();

	constructor(options?: RouteCodeGeneratorOptions) {
		this.options = {
			splitting: true,
			...options,
		};
	}

	generate(routes: RouteNode[]): string {
		for (const imports of [
			this.runtimeImports,
			this.loaderImports,
			this.loadingImports,
			this.errorImports,
			this.configImports,
			this.componentDeclarations,
		])
			imports.clear();
		const routeCode = this.generateRouteCode(routes);

		return this.wrapWithImports(routeCode);
	}

	private generateRouteCode(routes: RouteNode[]): string {
		this.runtimeImports.add(
			`import type { RouteObject } from 'react-router-dom';`,
		);
		const code = `export const routes: RouteObject[] = [
  ${routes.map((route) => this.stringifyRoute(route)).join(",\n  ")}
];`;

		return JSON.parse(JSON.stringify(code, null, 2));
	}

	private stringifyRoute(route: RouteNode): string {
		const element = this.generateElementCode(route);
		const errorElement = this.generateErrorElement(route);
		const loader = this.generateLoaderCode(route);
		const action = this.generateActionCode(route);

		// These values are source-code fragments, not runtime RouteObjects.
		const routeObj = {
			id: route.id,
			path: route.path,
			index: route.index,
			errorElement: errorElement || undefined,
			loader: loader || undefined,
			element: element || undefined,
			action: action || undefined,
			children: undefined,
		};

		// 处理子路由
		const childrenStr = route.children?.length
			? `children: [${route.children.map((child) => this.stringifyRoute(child)).join(",")}]`
			: "";

		// 合并所有属性
		const routeEntries = Object.entries(routeObj)
			.filter(([_, value]) => value !== undefined)
			.map(([key, value]) => {
				if (key === "path" || key === "id")
					return `${key}: ${quote(String(value))}`;
				if (key === "element") return `${key}: ${value}`;
				if (key === "errorElement") return `${key}: ${value}`;
				return `${key}: ${value}`;
			});

		if (childrenStr) routeEntries.push(childrenStr);

		return `{
      ${routeEntries.join(",\n      ")}
    }`;
	}

	private generateElementCode(route: RouteNode): string {
		if (!route._component) return "";

		const chunkName =
			route.id ||
			path.basename(route._component, path.extname(route._component));

		if (route.isRoot) {
			this.runtimeImports.add(
				`import RootLayout from ${quote(route._component)};`,
			);
			return "<RootLayout />";
		}

		if (this.options.splitting) {
			this.runtimeImports.add(`import loadable from '@loadable/component';`);
			const importPath = route._component;
			const componentName = `Component_${this.componentDeclarations.size}`;

			let loadingComponent = "";

			if (route.loading) {
				const loadingName = `Loading_${this.loadingImports.size}`;

				this.loadingImports.add(
					`import ${loadingName} from ${quote(route.loading)};`,
				);
				loadingComponent = `, { fallback: <${loadingName} /> }`;
			}

			// Define component using loadable for code splitting
			this.componentDeclarations.add(
				`const ${componentName} = loadable(() => import(/* webpackChunkName: "${chunkName.replace(/[^a-zA-Z0-9_()/.-]/g, "_")}" */ ${quote(importPath)})${loadingComponent});`,
			);

			return `<${componentName} />`;
		}

		const componentName = `Component_${this.componentDeclarations.size}`;
		this.componentDeclarations.add(
			`import ${componentName} from ${quote(route._component)};`,
		);

		return `<${componentName} />`;
	}

	private generateErrorElement(route: RouteNode): string {
		if (!route.error) return "";

		const errorName = `Error_${this.errorImports.size}`;
		this.errorImports.add(`import ${errorName} from ${quote(route.error)};`);

		return `<${errorName} />`;
	}

	// 新增 action 处理
	private generateActionCode(route: RouteNode): string {
		if (!route.action) return "";

		const actionName = `action_${this.loaderImports.size}`;
		this.loaderImports.add(
			`import { action as ${actionName} } from ${quote(route.action)};`,
		);

		return actionName;
	}

	private generateLoaderCode(route: RouteNode): string {
		const loaders = [];

		// Handle data loader
		if (route.data) {
			const loaderName = `loader_${this.loaderImports.size}`;
			this.loaderImports.add(
				`import { loader as ${loaderName} } from ${quote(route.data)};`,
			);
			loaders.push(loaderName);
		}

		// Handle client data
		if (route.clientData) {
			const clientDataName = `clientData_${this.loaderImports.size}`;
			this.loaderImports.add(
				`import { loader as ${clientDataName} } from ${quote(route.clientData)};`,
			);
			loaders.push(clientDataName);
		}

		// Handle regular loader
		if (route.loader) {
			const loaderName = `loader_${this.loaderImports.size}`;
			this.loaderImports.add(
				`import ${loaderName} from ${quote(route.loader)};`,
			);
			loaders.push(loaderName);
		}

		if (loaders.length === 0) return "";

		// Combine multiple loaders if needed
		if (loaders.length > 1) {
			return `async (...args: Parameters<import('react-router-dom').LoaderFunction>) => {
			const values = await Promise.all([${loaders.map((l) => `(${l} as import('react-router-dom').LoaderFunction)(...args)`).join(", ")}]);
        return values.find(value => value instanceof Response) ?? Object.assign({}, ...values);
      }`;
		}

		return loaders[0];
	}

	private wrapWithImports(routeCode: string): string {
		const runtimeImports = [
			...Array.from(this.runtimeImports),
			...Array.from(this.loaderImports),
			...Array.from(this.configImports),
			...Array.from(this.loadingImports),
			...Array.from(this.errorImports),
		];

		return `
${runtimeImports.join("\n")}
${this.componentDeclarations.size ? Array.from(this.componentDeclarations).join("\n") : ""}

${routeCode}`;
	}
}
