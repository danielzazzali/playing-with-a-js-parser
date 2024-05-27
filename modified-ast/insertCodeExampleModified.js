function externalFunction() {
  console.log("THIS IS NEW CODE INSERTED IN THE AST!");
}
class Greeter {
  constructor(name) {
    this.name = name;
  }
  greet() {
    externalFunction();
    return `Hello, ${this.name}!`;
  }
}
const greeter = new Greeter('World');
console.log(greeter.greet());
