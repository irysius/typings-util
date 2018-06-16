"use strict";
const utils_1 = require("@irysius/utils");
const helpers_1 = require("./helpers");
const PATH = require("path");
const NEWLINE = '\r\n';
function main(typesFolder, ns, outputFile = './index.d.ts') {
    return utils_1.fs.listFiles(typesFolder, { recurse: true }).then(results => {
        let paths = results.map(x => x.path);
        let moduleNames = paths
            .map(p => helpers_1.parseModuleName(p, typesFolder))
            .map(p => p.split(PATH.sep).join('/')); // Need to enforce / as separator.
        // Create a map of absolute file paths to module names.
        let moduleMap = {};
        paths.forEach((path, i) => {
            moduleMap[path] = moduleNames[i];
        });
        let _template = helpers_1.moduleTemplate(ns, moduleMap);
        let pContents = paths.map(p => utils_1.fs.readFile(p));
        return Promise.all(pContents).then(contents => {
            return contents.map(c => c.toString()).map(helpers_1.parseFileContent);
        }).then(statements => {
            // For each declaration file, using the module template, generate the module text.
            return moduleNames.map((name, i) => {
                return _template(name, paths[i], statements[i]).join(NEWLINE);
            }).join(NEWLINE);
        }).then(declarationText => {
            return utils_1.fs.writeFile(outputFile, declarationText);
        });
    });
}
module.exports = main;
