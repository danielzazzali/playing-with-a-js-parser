const esprima = require('esprima');
const astring = require('astring');
const fs = require('fs');
const { exec } = require('child_process');

const code = fs.readFileSync('insertCodeExample.js', 'utf8');

const ast = esprima.parseScript(code, { jsx: true });

function insertExternalFunction(ast, functionName) {
    ast.body.unshift({
        type: 'FunctionDeclaration',
        id: { type: 'Identifier', name: functionName },
        params: [],
        body: {
            type: 'BlockStatement',
            body: [
                {
                    type: 'ExpressionStatement',
                    expression: {
                        type: 'CallExpression',
                        callee: { type: 'MemberExpression', object: { type: 'Identifier', name: 'console' }, property: { type: 'Identifier', name: 'log' }, computed: false },
                        arguments: [{ type: 'Literal', value: 'External function called before greet method' }]
                    }
                }
            ]
        },
        generator: false,
        async: false,
        expression: false
    });
}

function insertExternalFunctionCallInGreet(ast, functionName) {
    ast.body.forEach(node => {
        if (node.type === 'ClassDeclaration' && node.id.name === 'Greeter') {
            node.body.body.forEach(method => {
                if (method.type === 'MethodDefinition' && method.key.name === 'greet') {
                    method.value.body.body.unshift({
                        type: 'ExpressionStatement',
                        expression: {
                            type: 'CallExpression',
                            callee: { type: 'Identifier', name: functionName },
                            arguments: []
                        }
                    });
                }
            });
        }
    });
}

console.log('Original AST:\n', JSON.stringify(ast, null, 2));
console.log('Original Code:\n', code);

insertExternalFunction(ast, 'externalFunction');

insertExternalFunctionCallInGreet(ast, 'externalFunction');

console.log('Modified AST:\n', JSON.stringify(ast, null, 2));
console.log('Modified Code:\n', astring.generate(ast));

const modifiedCode = astring.generate(ast);
fs.writeFileSync('modified.js', modifiedCode);

console.log('Executing Original Code:');
fs.writeFileSync('original.js', code);
exec('node original.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing original code: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Error: ${stderr}`);
        return;
    }
    console.log(stdout);

    console.log('Executing Modified Code:');
    exec('node modified.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing modified code: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
        console.log(stdout);
    });
});
