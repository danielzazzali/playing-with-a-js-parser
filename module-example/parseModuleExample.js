const fs = require('fs');
const esprima = require('esprima');

// Read the code from the file
const code = fs.readFileSync('module-example/moduleExample.js', 'utf8');

// Parse the module code to get the AST (Abstract Syntax Tree)
const ast = esprima.parseModule(code, { jsx: true });

// Output the AST to the console
console.log(JSON.stringify(ast, null, 2));
