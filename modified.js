function externalFunction() {
  console.log("External function called before greet method");
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
