class ClassA {
    constructor() {}

    methodA() {
        console.log('Method A called');
        const classB = new ClassB();
        classB.methodB();
        classB.methodB();
        classB.methodB();
    }
}

class ClassB {
    constructor() {}

    methodB() {
        console.log('Method B called');
    }
}

const instanceA = new ClassA();
instanceA.methodA();
