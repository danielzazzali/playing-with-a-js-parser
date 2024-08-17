// Esto es un metodo NORMAL
function foo() {
    // Tiene 2 fan out
    bar();
    baz();
}

// Esto es metodo NORMAL
function bar() {
    // Tiene 1 fan out
    baz();
    return "bar";
}

// Esto es 1 metodo ANONYMOUS
const baz = () => {
    // Tiene 1 fan out
    bar();
    return "baz";
};

// Aqui tenemos 3 ANONYMOUS donde cada una tiene fan out de 2
(function () { bar(); baz(); })();
(function () { bar(); baz(); })();
(function () { bar(); baz(); })();
