import * as PATH from 'path';

function isImport(line: string) {
    return line.indexOf('import ') === 0;
}
function isExport(line: string) {
    return line.indexOf('export ') === 0;
}
function isInternalInterface(line: string) {
    return line.indexOf('interface ') === 0;
}
function isInternalType(line: string) {
    return line.indexOf('declare type ') === 0;
}
function isExportFrom(line: string) {
    return line.indexOf('export ') === 0 &&
        line.indexOf(' from ') > -1;
}

enum LineType {
    None,
    Other,
    Import,
    Export,
    ExportFrom,
    InternalInterface,
    InternalType
}

function parseLineType(line: string): LineType {
    if (isImport(line)) {
        return LineType.Import;
    }
    if (isExportFrom(line)) {
        return LineType.ExportFrom;
    }
    if (isExport(line)) {
        return LineType.Export;
    }
    if (isInternalInterface(line)) {
        return LineType.InternalInterface;
    }
    if (isInternalType(line)) {
        return LineType.InternalType;
    }

    return LineType.Other;
}

export interface IStatements {
    imports: string[];
    exports: string[][];
    internal: Internal;
}
interface IMap<T> {
    [key: string]: T;
}
interface Internal {
    interfaces: string[][];
    types: string[];
}

/**
 * Categorize raw contents of a file into imports and exports
 */
function parseStatements(lines: string[]): IStatements {
    let imports: string[] = [];
    let internal: Internal = {
        interfaces: [],
        types: []
    };
    let exports: string[][] = [];
    let prevLineType = LineType.None;
    let currGroup: string[] = null;
    let currGroupResolve = () => {};
    lines.forEach(line => {
        if (line) { // remove empty lines
            let lineType = parseLineType(line);
            if (currGroup != null && lineType != LineType.Other) {
                currGroupResolve();
                currGroup = null;
                prevLineType = lineType;
            }
            switch (lineType) {
                case LineType.Import:
                case LineType.ExportFrom:
                    imports.push(line);
                    break;
                case LineType.InternalType:
                    internal.types.push(line);
                    break;
                case LineType.Export:
                    currGroup = [line];
                    currGroupResolve = () => { 
                        exports.push(currGroup);
                    }
                    break;
                case LineType.InternalInterface:
                    currGroup = [line];
                    currGroupResolve = () => { 
                        internal.interfaces.push(currGroup); 
                    }
                    break;
                case LineType.Other:
                    if (currGroup != null) {
                        currGroup.push(line);
                    }
                    break;
            }
        }
    });

    if (currGroup != null) { currGroupResolve(); }
    exports = exports.filter(x => x.length > 0);
    internal.interfaces = internal.interfaces.filter(x => x.length > 0);

    return {
        imports, exports, internal
    };
}

/**
 * Given a path to multiple generated .d.ts, determine what the module name should be.
 */
export function parseModuleName(fullPath: string, root: string) {
    return PATH.relative(root, fullPath).replace('.d.ts', '');
}

/**
 * Given file contents, return located imports and exports
 */
export function parseFileContent(content: string) {
    let lines = content.split(/\r?\n/g);
    return parseStatements(lines);
}

/**
 * Given a namespace and a module map, create a templating function for generating module text
 */
export function moduleTemplate(ns: string, moduleMap: IMap<string>) {
    let _processImport = processImport(ns, moduleMap);
    return function (name: string, fullPath: string, statements: IStatements): string[] {
        let _imports = statements.imports.map(i => _processImport(i, fullPath)).map(tab);
        let _exports = flatMap(statements.exports.map(processExport)).map(tab);
        let internalInterfaces = flatMap(statements.internal.interfaces).map(tab);
        let internalTypes = statements.internal.types.map(processInternalType).map(tab);

        let _name = name === 'index'
            ? '' : `/${name}`;
        return [
            `declare module "${ns}${_name}" {`,
                ..._imports,
                ...internalInterfaces,
                ...internalTypes,
                ..._exports,
            `}`
        ];
    };
}
function tab(line: string) {
    return `    ${line}`;
}
function processImport(ns: string, moduleMap: IMap<string>) {
    return function (importLine: string, fullPath: string) {
        let wd = PATH.dirname(fullPath);

        // Resolve path, and convert to global
        let [pre, post] = importLine.split(' from ');
        // parse ./Module from "./Module"; or './Module';
        let from = post.replace(/['";]/g, '');
        let absFrom: string;
        if (from.startsWith('.')) {
            // relative require, like ./Module
            let absPath = PATH.resolve(wd, from) + '.d.ts';
            absFrom = `${ns}/${moduleMap[absPath]}`;
        } else {
            // absolute require, like express
            absFrom = from;
        }
        
        return `${pre} from "${absFrom}";`;
    };
}
function processExport(exportLines: string[]) {
    let [firstLine, ...otherLines] = exportLines;
    return [
        firstLine.replace(' declare ', ' '),
        ...otherLines
    ];
}
function processInternalType(line: string) {
    return line.replace('declare ', '');
}
function flatMap(v: string[][]): string[] {
    let results = [];
    v.forEach(x => {
        x.forEach(l => {
            results.push(l);
        });
    });
    return results;
}