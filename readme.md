#Asincronismo Js

Para este proyecto vamos a usar fake API de node.js y visual studio code.
>consejo: instalen en vsc la extencion code runner que nos permitirá correr código js en nuestra terminal de comando.
 Comenzamos inicializando el proyecto con la siguiente línea de código
	npm init
Al ingresar nos va a pedir llenar una serie de parámetros vamos a leer detenidamente y llenaremos los que son necesario para el proyecto los demás podemos obviarlos.
Con la configuración terminada vamos a crear una nueva carpeta llamada **src** siguiendo el estándar para guardar los archivos que colocaremos en un futuro.
Luego agregaremos un **.gitignore** para evitar subir archivos innecesarios al GitHub.
Podemos empezar con el primer tema

##Callbacks

Un Callback es una función que se pasa como argumento de otra función y que será invocada. Esta es una de las pocas cosas que son más fácil verlos que explicarlos, por lo que para visualizar creceremos una carpeta llamada callback y dentro creemos un archivo index.js

	function sum(a, b) {
		return a + b;
	}

	function calc(num1, num2, callback) {
		return callback(num1, num2)
	}
	Console.log(calc(2, 4, sum))

Aquí hemos creado una función simple que se va a encargar de sumar 2 numeros. Luego hemos creado una función que recibirá como esos dos números y una función callback como parámetro.
Dentro retornaremos callback que es la función prometida y dentro de la función callback enviaremos los dos números que queremos sumar.
En su invocación vemos que pasamos dos números y la función suma, pero si vemos detenidamente no abrimos los paréntesis, esto se debe a que, si lo ponemos, estaríamos invocando la función suma y nosotros solo lo queremos pasar como argumento.
Ahora si corremos esto en nuestra terminal veremos que obtenemos el mismo resultado si lo enviáramos desde.

###SetTimeout
Este método nos va a permitir ejecutar un bloque de código despues de un tiempo determinado, por ejemplo

	setTimeout(() => {
		console.log("hola perrito")
	}, 2000);

Este console.log() no se ejecutara hasta 2 segundos después.
setTimeoup es un callback por sí misma, ya que es un método que recibe una función con la lógica que tenemos.
Un último ejemplo, crearemos una función de saludo.

	function grettin(name) {
		console.log(`hola ${name}`)
	}
	setTimeout(grettin, 2000, "campeon")

¿Seguramente te estarás preguntando que utilidad tiene esto? bueno veámoslo en un ejemplo mas practico, con una Fake API
Creemos un nuevo archivo, en mi caso lo llamara xmlhttpReques.js donde voy a hacer uso de los callback para consultar una Api cualquiera. Para ello es necesario instalar algunas herramientas para trabajar todo a nivel de consola.

	Npm i xmlhttprequest
	
Luego copiemos el siguiente código

	const XMLHttpReques = require('xmlhttprequest').XMLHttpRequest;
	const API = 'https://api.escuelajs.co/api/v1';

	function fetchData(urlApi, callback) {
		let xhttp = new XMLHttpReques();
		xhttp.open('GET', urlApi, true);

		xhttp.onreadystatechange = function (evet) {
			if (xhttp.readyState === 4) {
				if (xhttp.status === 200) {
					callback(null, JSON.parse(xhttp.responseText))
				} else {
					const error = new Error('Error' + urlApi);
					return callback(error, null);
				}
			}
		}
		xhttp.send();
	}

Antes de seguir vamos a hacer algunas explicaciones.
XMLHttpRequest es un objeto de JS que permite hacer peticiones hacia servicios en la nube(URLs o APIs).
Dentro de los estados en un llamado XMLHttpRequest tenemos 5 estos distintos.
•	0 = Se ha inicializado.
•	1 = Loading (cargando).
•	2 = Se ha cargado.
•	3 = Procesamiento si existe alguna descarga.
•	4 = Completado.

Los códigos de estado de respuesta HTTP indican si se ha completado satisfactoriamente una solicitud HTTP específica. Las respuestas se agrupan en cinco clases:
•	Respuestas informativas (100–199),
•	Respuestas satisfactorias (200–299),
•	Redirecciones (300–399),
•	Errores de los clientes (400–499),
•	y errores de los servidores (500–599).

Esta simple explicación nos va a permitir saber qué hace el código. Con el xhttp.open() voy a establecer la conexión con la API.
Con el xhttp.onreadystatechange va a estar pendiente de los cambios del estado de la consulta. Cuando xhttp.readyState llegue a 4 significa que se ha completado y puede retornar el estatus de la solicitud.
Por último, si todo está correcto, en nuestro callback vamos a trasformar en Json lo que nos entrega en el servidor.
En el caso de que el status no sea igual a completo (4) devolverá error.
Explicado de una manera muy general el código ahora podemos hacer un buen espagueti (software poco claro).

	fetchData(`${API}/products`, function (error1, data1) {
		if (error1) return console.error(error1);
		fetchData(`${API}/products/${data1[0].id}`, function (error2, data2) {
			if (error2) return console.error(error2);
			fetchData(`${API}/categories/${data2?.category?.id}`, function (error3, data3) {
				if (error3) return console.error(error3);
				console.log(data1[0]);
				console.log(data2.title);
				console.log(data3.name);
			});
		});
	});

La razón por la que llamamos a esto código espagueti o callback hell, es porque podemos anidar tantas peticiones que en un momento del código solo Dios sabe que quisimos hacer. En este caso para mantenerlo simple solo hemos hechos 3 peticiones.
La primera para conseguir datos tipo Json sobre un producto en particular. La segunda, con el mismo dato, extraemos el Id para conseguir el título del producto conseguido y por último entramos en la parte de categoría del primer producto que llamamos, y atreves del id conseguimos el nombre.
Ahora corremos el código en nuestra terminal de vsc y este sería el resultado

![resultado](../img/callback.png "resultado")

#Promesa

Las  promesas representan valores que pueden estar disponibles en cualquier momento. Esto quiere decir que los valores que esperamos conseguir pueden estar en el momento que ejecutamos el código, en un momento futuro o no pueden nunca devolverse.
Una promesa tiene tres casos particulares:
- Pendiente: es cuando se está ejecutando.
- Cumplido: cuando se devolvió el dato solicitado.
- Rechazado: cuando el pedido fue rechazado
- Veámoslo con un simple ejemplo

		const cocas = 15;

		const countCocas = new Promise(function(resolve,reject){
			if (cocas>10) {
				resolve(`yes sir, we have ${cocas} cocas wair a moment plis`)
			}else{
				reject("sorry, i don't have enough cocas")
			}
		})
		countCocas.then((result)=> {
			console.log(result);
		}).catch((error)=>{
			console.log(error)
		}).finally(()=> console.log("see you"))

Aquí instanciamos una promesa que va a recibir dos parámetros. El primero resolve o resolver en español es el que se va a encargar de capturar los resultados si fueron devueltos. El segundo es reject o rechazar que se va a encargar de cancelar la petición.
Ahora que entendimos en esencia lo que hace este código, aplíquemelo a nuestro ejemplo anterior.
Empecemos creando un nuevo archivo para guardar nuestro proyecto, el nombre te lo dejo a tu gusto. Después de crear, instalaremos otro paquete llamado node fetch

	Mpn i node-fetch

Segundo paso es ir a nuestro archivo Package.json y agregar esta linea de codigo para que nos permita correr la app desde nuestra consola.

	"type": "module"
>¡No te olvides de la coma! recueda que un archivo json esta separado por comas

Después de instalarlo, vamos a importar y comenzar a trabajar en el.

	import fetch from 'node-fetch';
	const API = 'https://api.escuelajs.co/api/v1';

	function fetchData(urlApi){
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
		.catch(error => console.log(error));

Si prestamos atención podemos ver que en ningún momento instancie la clase promise, eso es porque el fetch es en sí una promesa.
La sintaxis es fácil de ver, después de llamar a mi función al cual le pase la url de la API use el método then para acceder a él. Con el primero lo convertí en un tipo Json, con el segundo tome el resultado del primero y lo mostró en la consola, con el cuarto capture el error en caso de que el servidor se cayera o algún otro problema ajeno a nosotros y El tercero solo esta para demostrar que podemos seguir anidando el problema cuantas veces sea necesario.
Póngamelo en un ejemplo para que sea más claro.

	function fetchData(urlApi){
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
		.then(response=> response.json())
		.then(category =>{
			console.log(category.name)
		})
		.catch(error => console.log(error))
		.finally(()=>console.log("finish"))

Si has entendido hasta ahora, veras que el primer them captura los datos de la API, el segundo lo guarda en una variable y llama de nuevo a la función fetchData.
Pedimos que no devuelva el primer elemento de acuerdo a su id y lo convertimos en json, luego volvemos a hacer una tercera solicitud pero esta vez entramos en la parte de categoría.

Si prestamos atención, vemos que los productos, es un array de objetos que a su vez tienen otros objetos. Entonces para acceder a esos diferentes niveles invocamos la función tantas veces como niveles queramos acceser.

Pero hacer consuntas para obtener los datos no es lo único que se puede hacer. Intentamos ahora agregar un dato nuevo.

Lo primero que vamos a tener en cuenta son las reglas que la misma API nos impone para hacer uso de ella. En el caso de nuestro ejemplo, Hay permisos que se deben tomar en cuenta para que el intercambio sea seguro, hay que especificar el modo (mode), aquí se indica si se permite solicitudes de origen cruzado.

¿Qué es un origen cruzado?

Un origen tiene dominio/protocolo/puerto, un origen cruzado denominado “Cross Origin” es la palabra que se utiliza para denominar el tipo de peticiones que se realizan a un dominio diferente del dominio de origen desde donde se realiza la petición. Así que, si se coloca cors, indica que se permiten ciertas solicitudes predeterminadas de origen cruzado como Get y Post para salvaguardar y evitar manipulaciones maliciosas.

	function postData(urlApi,data){
		const response = fetch(urlApi,{
			method: 'POST',
			mode: 'cors',
			credentials:'same-origin',
			headers:{
				'Content-Type':'application/json'
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

Con la primera función voy a decirle al código que por medio del método Post, modo cors voy a enviar un archivo del tipo json.
La contante son los valores mínimos que debo usar para enviar información a esta API.
> Nota: esta información se encuentra en la documentación de la Api.

	  postData(`${API}/products`,data)
		.then(response=>response.json())
		.then(data=> console.log(data))

Luego de llamarlo vemos que nos devuelve la data con los valores que le hemos enviado ¿Cómo comprobamos que nuestra solicitud fue escuchada?
Una manera muy simple la hicimos muchas veces en los ejemplos anteriores. Hicimos una solicitud a la Api para traer el dato con el primer ID. Bueno busquemos en ID de nuestros pedido que acabamos de crear. Copiemoslo y pequeño la ir en el navegador
https://api.escuelajs.co/api/v1/products/209
En mi caso el Id es 209. Y el resultado es el siguiente.

Logramos lo mismo ¿felicidades conseguiste lo que estábamos buscando? Pero y ¿si queremos borrar o actualizar esos datos?

Para Actualizar

    function putData(urlApi, dataUpdate) {
        const response = fetch(urlApi, {
            method: 'PUT',
            mode: 'cors',
            credentials: 'same-origin',
            headers:{
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
    
    putData(`${API}/products/209`, dataUpdate) //se debe colocar el id del objeto que se quiere modificar
        .then(response => response.json())
        .then(dataUpdate => console.log(dataUpdate));

Para eliminar

	function deleteData(urlApi) { 
            const response = fetch(urlApi, {
                method: 'DELETE',
                mode: 'cors',
                credentials: 'same-origin',
                headers:{
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

Sencillo ¿verdad?

# Async y Await

La declaración de función async define una función asíncrona que devuelve un objeto, lo cual permite a un programa correr una función sin congelar toda la compilación.
Dada que la finalidad de las funciones async/await es simplificar el comportamiento del uso síncrono de promesas, se hace más fácil escribir promesas.

	var bool = true
	const fnAsync =()=>{
		return new Promise((resolve, reject) => {
			(bool) ? setTimeout(()=>resolve('Async'),2000)
			: reject(new Error('Error!'))
		})
	}

	const anotherFn = async ()=>{
		const somethig = await fnAsync();
		console.log(somethig);
		console.log('I am here');
	}

	console.log('before')
	anotherFn()
	console.log('after')

siguiendo el ejemplo, instanciamos en una función una promesa que dependiendo de su estado devolverá la lógica que necesitamos o un error.
En la segunda función agregamos la palabra async a nuestra arrow function. De esta manera la decíamos al entorno que es una función asíncrona. Luego cuando invocamos nuestra primera función, como hicimos uso del async, tenemos que llamar a la función que tiene la lógica que hicimos con await.
Y por ultimo para ver el flujo de nuestro código, ponemos un par de console.log(). Con esto pudimos ver que una función asíncrona no bloquea el código, si no que permite que el resto sea ejecutada mientras el navegador se encarga de ejecutar el código asincrónico por nosotros.
Ahora ¿Cómo podemos implementarlo en nuestro ejemplo? De la siguiente manera

	async function fetchData(urlApi) {
	  const response = await fetch(urlApi);
	  const data =  await response.json();
	  return data;
	}

Si te estas preguntando ¿Qué paso con nuestra promesa? Repasa la clase, porque el fetch es una promesa en sí misma.
Ahora que tenemos la lógica para llamar a nuestra Api necesitamos otra que tenga la lógica para manejar los datos.

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

Seguramente después de ver este código te estas preguntando ¿pero donde esta mis “THEM” para hacer la consulta de nuestra promesa? ¿Dónde está mi espagueti?
Bueno, está es la magia de del async y el await. 

#Generadores
Entremos ahora en el tema de los generadores. Un generador en JavaScript consta de una función generadora que muestra un objeto iterable Generator. La palabra reservada yield se usa para pausar y reanudar una función o solicitud que hagamos.
Veamos un generador en acción.

	function* gen(){
		yield 1
		yield 2
		yield 3
	}

	const g =gen();

	console.log(g.next().value);

con este simple código llamamos a la función el cual, tiene tres valores, pero solo devuelve el primero.
¿Pero que pasa si llamamos tres veces la misma función con el método next? Bueno el resultado es que se llama a los 3 valores y no 3 veces al primero ¿No está muy claro verdad? Veamos con otro ejemplo.

	function* iterate(array){
		for (const value of array) {
			yield value;
		}
	}

	const i = iterate(['hola','soy','un','array'])
	console.log(i.next().value)

Tal vez te sea mas claro ahora, tal vez no. Pero un generador es una función generadora que genera una función cuando la necesitemos.
> Se lo que estás pensando en un programador que programa programas en un programa para programar.
Ahora que sabes hacer todo esto, solo queda practicar para dominar todo lo aprendido.

Con este ultimo tema, tienes las herramientas basicas para abordar el tema del asincronismo y en un plus, ahora sabes como conectarte con una Api. 
Solo es cuestion de practica antes que domines el tema !Esfuerzate!
