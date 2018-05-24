"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@irysius/utils");
var helpers_1 = require("./helpers");
var NEWLINE = '\r\n';
function main(typesFolder, ns, outputFile) {
    if (outputFile === void 0) { outputFile = './index.d.ts'; }
    return utils_1.fs.listFiles(typesFolder, { recurse: true }).then(function (results) {
        var paths = results.map(function (x) { return x.path; });
        var moduleNames = paths.map(function (p) { return helpers_1.parseModuleName(p, typesFolder); });
        var moduleMap = {};
        paths.forEach(function (path, i) {
            moduleMap[path] = moduleNames[i];
        });
        var _template = helpers_1.moduleTemplate(ns, moduleMap);
        var pContents = paths.map(function (p) { return utils_1.fs.readFile(p); });
        return Promise.all(pContents).then(function (contents) {
            return contents.map(function (c) { return c.toString(); }).map(helpers_1.parseFileContent);
        }).then(function (statements) {
            return moduleNames.map(function (name, i) {
                return _template(name, paths[i], statements[i]).join(NEWLINE);
            }).join(NEWLINE);
        }).then(function (declarationText) {
            return utils_1.fs.writeFile(outputFile, declarationText);
        });
    });
}
main('./naive-types', '@irysius/grid-math', './index.d.ts');
