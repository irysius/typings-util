"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PATH = require("path");
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
    var imports = [];
    var exports = [];
    var currentExport = [];
    lines.forEach(function (line) {
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
    exports = exports.filter(function (x) { return x.length > 0; });
    return {
        imports: imports, exports: exports
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
    var lines = content.split(/\r?\n/g);
    return parseStatements(lines);
}
exports.parseFileContent = parseFileContent;
/**
 * Given a namespace and a module map, create a templating function for generating module text
 */
function moduleTemplate(ns, moduleMap) {
    var _processImport = processImport(ns, moduleMap);
    return function (name, fullPath, statements) {
        var _imports = statements.imports.map(function (i) { return _processImport(i, fullPath); }).map(tab);
        var _exports = flatMap(statements.exports.map(processExport)).map(tab);
        var _name = name === 'index'
            ? '' : "/" + name;
        return [
            "declare module \"" + ns + _name + "\" {"
        ].concat(_imports, _exports, [
            "}"
        ]);
    };
}
exports.moduleTemplate = moduleTemplate;
function tab(line) {
    return "    " + line;
}
function processImport(ns, moduleMap) {
    return function (importLine, fullPath) {
        var wd = PATH.dirname(fullPath);
        // Resolve path, and convert to global
        var _a = importLine.split(' from '), pre = _a[0], post = _a[1];
        // parse ./Module from "./Module"; or './Module';
        var from = post.replace(/['";]/g, '');
        var absPath = PATH.resolve(wd, from) + '.d.ts';
        var absFrom = ns + "/" + moduleMap[absPath];
        return pre + " from \"" + absFrom + "\";";
    };
}
function processExport(exportLines) {
    var firstLine = exportLines[0], otherLines = exportLines.slice(1);
    return [
        firstLine.replace(' declare ', ' ')
    ].concat(otherLines);
}
function flatMap(v) {
    var results = [];
    v.forEach(function (x) {
        x.forEach(function (l) {
            results.push(l);
        });
    });
    return results;
}
