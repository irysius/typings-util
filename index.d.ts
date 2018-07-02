declare module "@irysius/typings-util" {
    /**
     * Generates typings that are useful in a published node_modules setting.
     * @param typesFolder Folder where all your generated .d.ts resides.
     * @param ns The namespace to root all module declarations against.
     * @param outputFolder The root folder to place all generated declaration files under.
     */
    export function commonjs(typesFolder: string, ns: string, outputFolder?: string): Promise<void>;
    /**
     * Generates a declaration file that is useful when directly referenced within a TypeScript project.
     * @param typesFolder Folder where all your generated .d.ts resides.
     * @param ns The namespace to root all module declarations against.
     * @param outputFile The singular declaration file that will contained merged module declarations.
     */
    export function amd(typesFolder: string, ns: string, outputFile?: string): Promise<void>;
}