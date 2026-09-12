import * as fs from "node:fs";
import * as path from "node:path";
import ts from "typescript";

export const getPathWithoutExt = (filepath: string): string => {
	return filepath.replace(/\.[^/.]+$/, "");
};

export const hasAction = async (filepath: string): Promise<boolean> => {
	const content = await fs.promises.readFile(filepath, "utf-8");
	const source = ts.createSourceFile(
		filepath,
		content,
		ts.ScriptTarget.Latest,
		true,
	);
	return source.statements.some((statement) => {
		if (
			ts.isExportDeclaration(statement) &&
			statement.exportClause &&
			ts.isNamedExports(statement.exportClause)
		) {
			return (
				!statement.isTypeOnly &&
				statement.exportClause.elements.some(
					(e) => !e.isTypeOnly && e.name.text === "action",
				)
			);
		}
		const exported =
			ts.canHaveModifiers(statement) &&
			ts
				.getModifiers(statement)
				?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
		if (!exported) return false;
		if (ts.isFunctionDeclaration(statement))
			return statement.name?.text === "action";
		return (
			ts.isVariableStatement(statement) &&
			statement.declarationList.declarations.some(
				(d) => ts.isIdentifier(d.name) && d.name.text === "action",
			)
		);
	});
};

export const replaceWithAlias = (
	basePath: string,
	filePath: string,
	alias: string,
): string => {
	if (!alias) return normalizeToPosixPath(filePath);
	const relativePath = path.relative(basePath, filePath);
	return normalizeToPosixPath(path.join(alias, relativePath));
};

export const normalizeToPosixPath = (str: string): string => {
	return str.replace(/\\/g, "/");
};

/** Encode file-system text as a JavaScript string literal. */
export const quote = (value: string): string => JSON.stringify(value);
