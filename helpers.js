"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PATH = require("path");
function isImport(line) {
    return line.indexOf('import ') === 0;
}
function isExport(line) {
    return line.indexOf('export ') === 0;
}
/**
 * Categorize raw contents of a file into imports and exports
 */
function parseStatements(lines) {
    let imports = [];
    let exports = [];
    let currentExport = [];
    lines.forEach(line => {
        if (line) { // remove empty lines
            if (isImport(line)) {
                imports.push(line);
            }
            else if (isExport(line)) {
                exports.push(currentExport);
                currentExport = [line];
            }
            else {
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
function parseModuleName(fullPath, root) {
    return PATH.relative(root, fullPath).replace('.d.ts', '');
}
exports.parseModuleName = parseModuleName;
/**
 * Given file contents, return located imports and exports
 */
function parseFileContent(content) {
    let lines = content.split(/\r?\n/g);
    return parseStatements(lines);
}
exports.parseFileContent = parseFileContent;
/**
 * Given a namespace and a module map, create a templating function for generating module text
 */
function moduleTemplate(ns, moduleMap) {
    let _processImport = processImport(ns, moduleMap);
    return function (name, fullPath, statements) {
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
exports.moduleTemplate = moduleTemplate;
function tab(line) {
    return `    ${line}`;
}
function processImport(ns, moduleMap) {
    return function (importLine, fullPath) {
        let wd = PATH.dirname(fullPath);
        // Resolve path, and convert to global
        let [pre, post] = importLine.split(' from ');
        // parse ./Module from "./Module"; or './Module';
        let from = post.replace(/['";]/g, '');
        let absFrom;
        if (from.startsWith('.')) {
            // relative require, like ./Module
            let absPath = PATH.resolve(wd, from) + '.d.ts';
            absFrom = `${ns}/${moduleMap[absPath]}`;
        }
        else {
            // absolute require, like express
            absFrom = from;
        }
        return `${pre} from "${absFrom}";`;
    };
}
function processExport(exportLines) {
    let [firstLine, ...otherLines] = exportLines;
    return [
        firstLine.replace(' declare ', ' '),
        ...otherLines
    ];
}
function flatMap(v) {
    let results = [];
    v.forEach(x => {
        x.forEach(l => {
            results.push(l);
        });
    });
    return results;
}
