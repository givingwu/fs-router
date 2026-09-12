import { randomUUID } from "node:crypto";
import {
	lstat,
	mkdir,
	readFile,
	realpath,
	rename,
	rm,
	writeFile,
} from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, sep } from "node:path";

export const isWithin = (directory: string, file: string) => {
	const rel = relative(directory, file);
	return rel !== ".." && !rel.startsWith(`..${sep}`) && !isAbsolute(rel);
};

async function physicalPath(file: string): Promise<string> {
	try {
		return await realpath(file);
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
		return join(await physicalPath(dirname(file)), basename(file));
	}
}

export async function validateOutputs(
	outputs: string[],
	directories: string[],
) {
	const physicalOutputs = await Promise.all(outputs.map(physicalPath));
	if (new Set(physicalOutputs).size !== physicalOutputs.length)
		throw new Error("Route code and type outputs must be different files");
	for (const output of outputs) {
		const stat = await lstat(output).catch((error: NodeJS.ErrnoException) => {
			if (error.code !== "ENOENT") throw error;
			return null;
		});
		if (stat?.isSymbolicLink())
			throw new Error(`Generated output cannot be a symbolic link: ${output}`);
	}
	for (const directory of directories) {
		const physicalDirectory = await physicalPath(directory);
		if (physicalOutputs.some((output) => isWithin(physicalDirectory, output)))
			throw new Error(
				"Generated output must be outside all routes directories",
			);
	}
}

export async function writeGenerated(file: string, content: string) {
	const current = await readFile(file, "utf8").catch(
		(error: NodeJS.ErrnoException) => {
			if (error.code !== "ENOENT") throw error;
			return null;
		},
	);
	if (current === content) return;
	await mkdir(dirname(file), { recursive: true });
	const temporary = `${file}.${randomUUID()}.tmp`;
	try {
		await writeFile(temporary, content, { encoding: "utf8", flag: "wx" });
		await rename(temporary, file);
	} finally {
		await rm(temporary, { force: true });
	}
}
