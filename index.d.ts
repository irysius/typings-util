declare module "@irysius/typings-util" {
    function main(typesFolder: string, ns: string, outputFile?: string): Promise<void>;
    // https://github.com/Microsoft/TypeScript-Handbook/issues/350
    namespace main {}
    export = main;
}

