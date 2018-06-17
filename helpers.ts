import * as PATH from 'path';

function isImport(line: string) {
    return line.indexOf('import ') === 0;
}
function isExport(line: string) {
    return line.indexOf('export ') === 0;
}
function isExportFrom(line: string) {
    return line.indexOf('export ') === 0 &&
        line.indexOf(' from ') > -1;
}

interface IStatements {
    imports: string[];
    exports: string[][];
}
interface IMap<T> {
    [key: string]: T;
}

/**
 * Categorize raw contents of a file into imports and exports
 */
function parseStatements(lines: string[]): IStatements {
    let imports: string[] = [];
    let exports: string[][] = [];
    let currentExport: string[] = [];
    lines.forEach(line => {
        if (line) { // remove empty lines
            if (isImport(line) || isExportFrom(line)) {
                imports.push(line);
            } else if (isExport(line)) {
                exports.push(currentExport);
                currentExport = [line];
            } else {
                currentExport.push(line);
            }
        }
    });

    exports.push(currentExport);
    exports = exports.filter(x => x.length > 0);

    return {
        imports, exports
    };
}

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
        let _name = name === 'index'
            ? '' : `/${name}`;
        return [
            `declare module "${ns}${_name}" {`,
                ..._imports,
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
function flatMap(v: string[][]): string[] {
    let results = [];
    v.forEach(x => {
        x.forEach(l => {
            results.push(l);
        });
    });
    return results;
}