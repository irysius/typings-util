import { fs } from '@irysius/utils';
import { parseModuleName, moduleTemplate, parseFileContent } from './helpers';
declare var Promise;

const NEWLINE = process.env.NEWLINE;

function main(typesFolder: string, ns: string, outputFile: string = './index.d.ts') {
    return fs.listFiles(typesFolder, { recurse: true }).then(results => {
        let paths = results.map(x => x.path);
        let moduleNames = paths.map(p => parseModuleName(p, typesFolder));
    
        // Create a map of absolute file paths to module names.
        let moduleMap = {};
        paths.forEach((path, i) => {
            moduleMap[path] = moduleNames[i];
        });
    
        let _template = moduleTemplate(ns, moduleMap);
    
        let pContents = paths.map(p => fs.readFile(p));
        return Promise.all(pContents).then(contents => {
            return contents.map(c => c.toString()).map(parseFileContent);
        }).then(statements => {
            // For each declaration file, using the module template, generate the module text.
            return moduleNames.map((name: string, i) => {
                return _template(name, paths[i], statements[i]).join(NEWLINE);
            }).join(NEWLINE);
        }).then(declarationText => {
            return fs.writeFile(outputFile, declarationText);
        });
    });
}

export = main;
