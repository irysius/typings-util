import { fs } from '@irysius/utils';
import { parseModuleName, moduleTemplate, parseFileContent } from './helpers';
import * as PATH from 'path';
declare var Promise;

const NEWLINE = '\r\n';

function uniq(values: string[]): string[] {
    let hash = {};
    values.forEach(value => {
        hash[value] = true;
    });
    return Object.keys(hash);
}

function main(typesFolder: string, ns: string, outputFolder: string = './') {
    return fs.listFiles(typesFolder, { recurse: true }).then(results => {
        let paths = results.map(x => x.path);
        let moduleNames = paths
            .map(p => parseModuleName(p, typesFolder))
            .map(p => p.split(PATH.sep).join('/')); // Need to enforce / as separator.
        let outputFiles = moduleNames.map(name => {
            return PATH.resolve(outputFolder, `${name}.d.ts`);
        });

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
            // For each module, generate the declaration text.
            let declarations = moduleNames.map((name: string, i) => {
                return _template(name, paths[i], statements[i]).join(NEWLINE);
            });

            // Make sure nested folders exists before writing declaration files.
            let assertFolders = uniq(outputFiles.map(file => {
                return PATH.dirname(file);
            })).map(folder => {
                return fs.assertFolder(folder);
            });

            return Promise.all(assertFolders).then(() => {
                // For each declaration file, using the module template, generate the module text.
                let declarationWrites = declarations.map((declaration: string, i) => {
                    return fs.writeFile(outputFiles[i], declaration);
                });
                return Promise.all(declarationWrites);
            });
        });
    });
}

export = main;
