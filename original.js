class Greeter {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}!`;
    }
}

const greeter = new Greeter('World');
console.log(greeter.greet());
