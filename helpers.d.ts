declare module "@irysius/typings-util/helpers" {
    export interface IStatements {
        imports: string[];
        exports: string[][];
        internal: Internal;
    }
    export interface IMap<T> {
        [key: string]: T;
    }
    interface Internal {
        interfaces: string[][];
        types: string[];
    }

    /**
     * Given a path to multiple generated .d.ts, determine what the module name should be.
     */
    export function parseModuleName(fullPath: string, root: string): string;

    /**
     * Given file contents, return located imports and exports
     */
    export function parseFileContent(content: string): IStatements;

    /**
     * Given a namespace and a module map, create a templating function for generating module text
     */
    export function moduleTemplate(ns: string, moduleMap: IMap<string>): string[];
}
