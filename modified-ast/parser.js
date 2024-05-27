const esprima = require('esprima');
const astring = require('astring');
const fs = require('fs');
const { exec } = require('child_process');
const {promisify} = require('node:util');

const code = fs.readFileSync('insertCodeExample.js', 'utf8');

const ast = esprima.parseScript(code, { jsx: true });

// Esto inserta la función externa en el código, al inicio del archivo
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
                        arguments: [{ type: 'Literal', value: 'THIS IS NEW CODE INSERTED IN THE AST!' }]
                    }
                }
            ]
        },
        generator: false,
        async: false,
        expression: false
    });
}

// Esto inserta la llamada a la función externa en el método greet de la clase Greeter
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
fs.writeFileSync('insertCodeExampleModified.js', modifiedCode);

const execPromise = promisify(exec);

(async () => {
    try {
        console.log('Executing Original Code:');
        console.log('-----------------------------------------\n');

        const { stdout: stdoutOriginal, stderr: stderrOriginal } = await execPromise('node insertCodeExample.js');

        if (stderrOriginal) {
            console.error(`Error: ${stderrOriginal}`);
        } else {
            console.log(stdoutOriginal);
        }



        console.log('Executing Modified Code:');
        console.log('-----------------------------------------\n');

        const { stdout: stdoutModified, stderr: stderrModified } = await execPromise('node insertCodeExampleModified.js');

        if (stderrModified) {
            console.error(`Error: ${stderrModified}`);
        } else {
            console.log(stdoutModified);
        }
    } catch (error) {
        console.error(`Error executing code: ${error.message}`);
    }
})();