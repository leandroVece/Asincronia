import fetch from 'node-fetch';
const API = 'https://api.escuelajs.co/api/v1';
var bool = true
const fnAsync = () => {
  return new Promise((resolve, reject) => {
    (bool) ? setTimeout(() => resolve('Async'), 2000)
      : reject(new Error('Error!'))
  })
}

const anotherFn = async () => {
  const somethig = await fnAsync();
  console.log(somethig);
  console.log('I am here');
}

console.log('before')
anotherFn()
console.log('after')


async function fetchData(urlApi) {
  const response = await fetch(urlApi);
  const data = await response.json();
  return data;
}

const anotherFunction = async (urlApi) => {
  try {
    const products = await fetchData(`${urlApi}/products`);
    const product = await fetchData(`${urlApi}/products/${products[0].id}`);
    const category = await fetchData(`${urlApi}/categories/${product.category.id}`);

    console.log(products);
    console.log(product.title);
    console.log(category.name);

  } catch (error) {
    console.error(error);
  }
}

anotherFunction(API);