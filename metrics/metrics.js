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



/*

Detección de Declaraciones de Clases:
Se verifica si el nodo actual es una declaración de clase (ClassDeclaration).

Inicialización de la Clase en el Objeto coupling:
Si se encuentra una clase, se añade una entrada en el objeto coupling con el nombre de la clase.

Iteración sobre los Miembros de la Clase:
Se recorre cada miembro de la clase.

Detección de Métodos:
Se verifica si el miembro es un método (MethodDefinition).

Iteración sobre las Sentencias del Método:
Se recorren las sentencias dentro del cuerpo del método.

Detección de Llamadas a Métodos:
Se verifica si la sentencia es una llamada a un método (CallExpression).

Contabilización de Llamadas:
Se identifica la clase del objeto que realiza la llamada y se incrementa el contador correspondiente en el objeto coupling.

Recursión:
Se aplica recursivamente la función a los nodos hijos.

*/

