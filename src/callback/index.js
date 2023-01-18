function sum(a, b) {
    return a + b;
}

function calc(num1, num2, callback) {
    return callback(num1, num2)
}

console.log(calc(2, 4, sum))

setTimeout(() => {
    console.log("hola perrito")
}, 2000);

function grettin(name) {
    console.log(`hola ${name}`)
}

setTimeout(grettin, 2000, "campeon")