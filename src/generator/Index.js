const API = 'https://api.escuelajs.co/api/v1';
const urlApi = API;

function* gen() {
    yield 1
    yield 2
    yield 3
}

const g = gen();

console.log(g.next().value);
console.log(g.next().value);
console.log(g.next().value);

function* iterate(array) {
    for (const value of array) {
        yield value;
    }
}

const i = iterate(['hola', 'soy', 'un', 'array'])
console.log(i.next().value)
console.log(i.next().value)
console.log(i.next().value)
console.log(i.next().value)
