import fetch from 'node-fetch';
const API = 'https://api.escuelajs.co/api/v1';

/*function fetchData(urlApi) {
    return fetch(urlApi);
};
//el llamado
fetchData(`${API}/products`)
    .then(response => response.json())
    .then(products => {
        console.log(products);
    })
    .then(() => {
        console.log('ESTOY AQUI SOLO PARA DEMOSTRAR QUE PUEDO');
    }) //se pueden anidar múltiples .then
    .catch(error => console.log(error));*/


function fetchData(urlApi) {
    return fetch(urlApi);
};

fetchData(`${API}/products`)
    .then(response => response.json())
    .then(products => {
        console.log(products);
        return fetchData(`${API}/products/${products[0].id}`)
    })
    .then(response => response.json())
    .then(product => {
        console.log(product.title);
        return fetchData(`${API}/categories/${product.category.id}`)
    })
    .then(response => response.json())
    .then(category => {
        console.log(category.name)
    })
    .catch(error => console.log(error))
    .finally(() => console.log("finish"))




function postData(urlApi, data) {
    const response = fetch(urlApi, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response;
}

const data = {
    "title": "El producto mas prron",
    "price": 999,
    "description": "A description",
    "categoryId": 1,
    "images": [
        "https://placeimg.com/640/480/any"
    ]
}

postData(`${API}/products`, data)
    .then(response => response.json())
    .then(data => console.log(data))

function putData(urlApi, dataUpdate) {
    const response = fetch(urlApi, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataUpdate)
    });
    return response;
}

const dataUpdate = {
    "title": "El producto mas perron",
    "price": 998
}

putData(`${API}/products/209`, dataUpdate)
    .then(response => response.json())
    .then(dataUpdate => console.log(dataUpdate));

function deleteData(urlApi) {
    const response = fetch(urlApi, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

const idNumber = 209;
deleteData(`${API}/products/${idNumber}`)
    .then(() => {
        console.log(`Borrado ${idNumber}`);
    });