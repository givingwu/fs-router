import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import rspackPlugin from "@feoe/fs-router/rspack";
import vitePlugin from "@feoe/fs-router/vite";
import webpackPlugin from "@feoe/fs-router/webpack";
import { rspack } from "@rspack/core";
import { build, createServer } from "vite";
import webpack from "webpack";

const require = createRequire(import.meta.url);
const root = process.cwd();
async function write(path, content) {
	await mkdir(join(root, path, ".."), { recursive: true });
	await writeFile(join(root, path), content);
}
for (const entry of ["", "/vite", "/webpack", "/rspack"]) {
	const esm = await import(`@feoe/fs-router${entry}`);
	const cjs = require(`@feoe/fs-router${entry}`);
	if (!entry) {
		assert.equal(esm.pathParser("users/[id]/page.tsx").route, "users/:id");
		assert.equal(cjs.pathParser("users/[id]/page.tsx").route, "users/:id");
		assert.equal(typeof esm.useNavigation, "function");
	} else {
		assert.equal(typeof esm.default, "function");
		assert.equal(typeof cjs.default, "function");
	}
}
await write(
	"src/routes/layout.tsx",
	`import { Outlet } from 'react-router-dom'; export default function Layout() { return <main><Outlet /></main>; }`,
);
for (const path of [
	"page",
	"users/[id]/page",
	"(public)/about/page",
	"files/[...path]/page",
	"it's-quoted/page",
	"optional/[[id]]/page",
]) {
	await write(
		`src/routes/${path}.tsx`,
		"export default function Page() { return <p>Fixture</p>; }",
	);
}
await write(
	"src/routes/users/[id]/page.data.ts",
	`import type { LoaderFunctionArgs } from 'react-router-dom'; export function loader({ params }: LoaderFunctionArgs) { return { id: params.id }; } export async function action() { return { saved: true }; }`,
);
await write(
	"src/routes/users/[id]/page.loader.ts",
	"export default function loader() { return { extra: true }; }",
);
await write(
	"src/runtime.tsx",
	`
import assert from 'node:assert/strict';
import { matchRoutes, MemoryRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import { useNavigation } from '@feoe/fs-router';
import { routes } from './routes';
async function main() {
 for (const path of ['/about', '/files/a/b', "/it's-quoted", '/optional', '/optional/x']) assert(matchRoutes(routes, path));
 const matches = matchRoutes(routes, '/users/42')!;
 const route = matches.at(-1)!.route;
 assert.deepEqual(await (route.loader as Function)({params: {id: '42'}}), {id: '42', extra: true});
 assert.deepEqual(await (route.action as Function)(), {saved: true});
 function Probe() {
  const navigation = useNavigation();
  assert.equal(navigation.buildHref('/users/:id', {id: 42}, {q: 'a b'}), '/users/42?q=a+b');
  assert.equal(navigation.buildHref('/optional/:id?'), '/optional');
  return null;
 }
 renderToString(<MemoryRouter><Probe /></MemoryRouter>);
 console.log('PASS generated route matching, loader, action and navigation');
}
void main().catch(error => { console.error(error); process.exitCode = 1; });
`,
);
await write(
	"src/client.tsx",
	`import { createRoot } from 'react-dom/client'; import { createBrowserRouter, RouterProvider } from 'react-router-dom'; import { routes } from './routes'; createRoot(document.getElementById('root')!).render(<RouterProvider router={createBrowserRouter(routes)} />);`,
);
await write(
	"index.html",
	'<div id="root"></div><script type="module" src="/src/client.tsx"></script>',
);
await write(
	"loader.cjs",
	`const ts = require('typescript'); module.exports = function(source) { return ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText; };`,
);
function compilerConfig(tool, splitting) {
	return {
		context: root,
		mode: "development",
		devtool: false,
		entry: "./src/client.tsx",
		output: {
			path: join(root, `out-${tool}-${splitting}`),
			filename: "app.js",
			clean: true,
		},
		resolve: { extensions: [".tsx", ".ts", ".js"] },
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					exclude: /node_modules/,
					use: join(root, "loader.cjs"),
				},
			],
		},
		plugins: [
			(tool === "webpack" ? webpackPlugin : rspackPlugin)({ splitting }),
		],
	};
}
async function compile(tool, splitting) {
	const compiler = (tool === "webpack" ? webpack : rspack)(
		compilerConfig(tool, splitting),
	);
	try {
		await new Promise((resolve, reject) =>
			compiler.run((error, stats) =>
				error
					? reject(error)
					: stats.hasErrors()
						? reject(new Error(stats.toString({ all: false, errors: true })))
						: resolve(),
			),
		);
	} finally {
		await new Promise((resolve, reject) =>
			compiler.close((error) => (error ? reject(error) : resolve())),
		);
	}
	if (splitting)
		assert(
			(await readdir(join(root, `out-${tool}-${splitting}`))).length > 1,
			"expected split chunks",
		);
	console.log(`PASS ${tool} splitting=${splitting}`);
}
for (const splitting of [false, true]) {
	await build({
		root,
		configFile: false,
		logLevel: "error",
		plugins: [vitePlugin({ splitting })],
		esbuild: { jsx: "automatic" },
		build: { outDir: `out-vite-${splitting}` },
	});
	if (splitting)
		assert(
			(await readdir(join(root, `out-vite-${splitting}/assets`))).filter(
				(name) => name.endsWith(".js"),
			).length > 1,
		);
	for (const tool of ["webpack", "rspack"]) await compile(tool, splitting);
}
// Execute a bundle of the actual generated eager routes using React Router.
await build({
	root,
	configFile: false,
	logLevel: "error",
	plugins: [vitePlugin({ splitting: false })],
	esbuild: { jsx: "automatic" },
	build: {
		outDir: "out-runtime",
		lib: {
			entry: join(root, "src/runtime.tsx"),
			formats: ["cjs"],
			fileName: () => "runtime.cjs",
		},
		rollupOptions: {
			external: [
				/^node:/,
				/^react(?:\/|$)/,
				/^react-dom(?:\/|$)/,
				/^react-router-dom$/,
			],
		},
	},
});
execFileSync(process.execPath, ["out-runtime/runtime.cjs"], {
	stdio: "inherit",
});
await write(
	"src/types-check.ts",
	`import { useNavigation } from '@feoe/fs-router'; function check(navigation: ReturnType<typeof useNavigation>) {
 navigation.push('/about'); navigation.push('/users/:id', {id: 42}); navigation.push('/optional/:id?');
 // @ts-expect-error unknown route
 navigation.push('/missing');
 // @ts-expect-error required param
 navigation.push('/users/:id');
 // @ts-expect-error incorrect param
 navigation.push('/users/:id', {wrong: '42'});
}`,
);
const options = {
	noEmit: true,
	strict: true,
	skipLibCheck: false,
	target: "ES2022",
	jsx: "react-jsx",
	esModuleInterop: true,
};
await write(
	"tsconfig.json",
	JSON.stringify({
		compilerOptions: {
			...options,
			module: "ESNext",
			moduleResolution: "Bundler",
		},
		include: ["src"],
	}),
);
execFileSync(
	process.execPath,
	["node_modules/typescript/bin/tsc", "-p", "tsconfig.json"],
	{ stdio: "inherit" },
);
for (const ext of ["mts", "cts"]) {
	await write(
		`api.${ext}`,
		`import { pathParser, useNavigation } from '@feoe/fs-router'; import vite from '@feoe/fs-router/vite'; import webpack from '@feoe/fs-router/webpack'; import rspack from '@feoe/fs-router/rspack'; pathParser('x'); vite({splitting: false}); webpack(); rspack(); const hook: typeof useNavigation = useNavigation;`,
	);
	await write(
		`tsconfig-${ext}.json`,
		JSON.stringify({
			compilerOptions: {
				...options,
				module: "NodeNext",
				moduleResolution: "NodeNext",
			},
			files: [`api.${ext}`],
		}),
	);
	execFileSync(
		process.execPath,
		["node_modules/typescript/bin/tsc", "-p", `tsconfig-${ext}.json`],
		{ stdio: "inherit" },
	);
}
console.log("PASS strict declarations: Bundler + NodeNext ESM/CJS");
async function until(predicate, label = "update") {
	const deadline = Date.now() + 20_000;
	while (Date.now() < deadline) {
		if (await predicate()) return;
		await delay(50);
	}
	throw new Error(`watch ${label} timed out`);
}
const generated = () => readFile(join(root, "src/routes.tsx"), "utf8");
const server = await createServer({
	root,
	configFile: false,
	logLevel: "error",
	plugins: [vitePlugin()],
	server: { host: "127.0.0.1", port: 0 },
	esbuild: { jsx: "automatic" },
});
try {
	await server.listen();
	await write("src/routes/watch-vite/page.tsx", "export default () => null;");
	await until(async () => (await generated()).includes("watch-vite"));
	await write(
		"src/routes/watch-vite/page.data.ts",
		"export const loader = () => null;",
	);
	await until(async () => (await generated()).includes("watch-vite/page.data"));
	await server.transformRequest("/src/routes.tsx");
	await write(
		"src/routes/watch-vite/page.data.ts",
		"export const loader = () => null; export function action() { return null; }",
	);
	await until(
		async () =>
			/import \{ action as [^}]+\} from "[^"\n]*watch-vite\/page.data"/.test(
				await generated(),
			),
		"Vite data export update",
	);
	await rm(join(root, "src/routes/watch-vite"), { recursive: true });
	await until(async () => !(await generated()).includes("watch-vite"));
} finally {
	await server.close();
}
console.log("PASS Vite add/update/delete regeneration");
for (const tool of ["webpack", "rspack"]) {
	const compiler = (tool === "webpack" ? webpack : rspack)(
		compilerConfig(tool, true),
	);
	let builds = 0;
	let failure;
	let moduleResources = new Set();
	const watcher = compiler.watch({ aggregateTimeout: 30 }, (error, stats) => {
		failure =
			error ??
			(stats?.hasErrors()
				? new Error(stats.toString({ all: false, errors: true }))
				: undefined);
		builds++;
		// Snapshot native-backed Rspack module data during the callback. A later
		// compilation invalidates its JS handles.
		moduleResources = new Set(
			Array.from(stats?.compilation.modules ?? [], (module) => module.resource),
		);
	});
	try {
		await until(async () => builds > 0, `${tool} initial`);
		if (failure) throw failure;
		const hasWatchedModule = () =>
			moduleResources.has(join(root, `src/routes/watch-${tool}/page.tsx`));
		const before = builds;
		await write(
			`src/routes/watch-${tool}/page.tsx`,
			"export default () => null;",
		);
		await until(
			async () =>
				builds > before &&
				!failure &&
				hasWatchedModule() &&
				(await generated()).includes(`watch-${tool}`),
			`${tool} add/delete`,
		);
		if (failure) throw failure;
		const added = builds;
		await rm(join(root, `src/routes/watch-${tool}`), { recursive: true });
		await until(
			async () =>
				builds > added &&
				!failure &&
				!hasWatchedModule() &&
				!(await generated()).includes(`watch-${tool}`),
			`${tool} add/delete`,
		);
		if (failure) throw failure;
	} finally {
		await new Promise((resolve) => watcher.close(resolve));
		await new Promise((resolve) => compiler.close(resolve));
	}
	console.log(`PASS ${tool} add/delete regeneration`);
}
