const esprima = require('esprima');
const fs = require('fs');

const code = fs.readFileSync('couplingExample.js', 'utf8');

const ast = esprima.parseScript(code);

const coupling = {};

function countMethodCalls(node) {
    if (node.type === 'ClassDeclaration') {
        const className = node.id.name;
        coupling[className] = {};
        node.body.body.forEach(member => {
            if (member.type === 'MethodDefinition') {
                if (member.value.type === 'FunctionExpression') {
                    member.value.body.body.forEach(statement => {
                        if (statement.type === 'ExpressionStatement' && statement.expression.type === 'CallExpression') {
                            const calleeObject = statement.expression.callee.object;
                            const calleeClass = calleeObject && calleeObject.name;
                            if (calleeClass && coupling[className][calleeClass]) {
                                coupling[className][calleeClass]++;
                            } else if (calleeClass) {
                                coupling[className][calleeClass] = 1;
                            }
                        }
                    });
                }
            }
        });
    }

    for (const key in node) {
        if (node.hasOwnProperty(key)) {
            const child = node[key];
            if (child && typeof child === 'object') {
                countMethodCalls(child);
            }
        }
    }
}

countMethodCalls(ast);

console.log('Acoplamiento entre clases:');
console.log(JSON.stringify(coupling, null, 2));

