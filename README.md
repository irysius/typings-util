# @irysius/typings-util

Utility functions to help assemble TypeScript declarations.

## Usage
1. Make sure your project can generate loose declaration files using `tsc -d`.
2. Install this package: `npm install --save-dev @iryius/typings-util`
3. Import the main function in your task running script of choice:

    var generateTypes = require('@irysius/typings-util');

4. If your generated types are in the `types` folder, if you want your declarations to be rooted against `@irysius/custom-lib`, and if you want the concatenated result to be `index.d.ts`:

    let promise = generateTypes('./types', '@irysius/custom-lib', './index.d.ts');