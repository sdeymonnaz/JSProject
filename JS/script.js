//Crea clase Producto y le asigna propiedades y un método.
class Producto {
    constructor(id, producto, categoria, imagen, precio) {
        this.id = id;
        this.nombre = producto;
        this.categoria = categoria;
        this.imagen = imagen;
        this.precio = parseFloat(precio);
    }

    calcularImp(){
        return (this.precio * 1.21).toFixed(2)
    }
}


//Inicializa una lista vacia global para agregar los nuevos objetos de tipo Producto.
let productos = [];

//Inicializar una lista carrito vacía que va a recibir los productos seleccionados
let carrito = [];

//Carga del método ready
$( document ).ready(function() {

    //Obtener los productos desde un archivo JSON en forma asincrónica
    const obtenerJsonProductos= () =>{
        //cargar productos desde archivo JSON
        const URLJSON = "productos.json";
        $.getJSON(URLJSON, function(respuesta, estado){
            //Si se logra establecer la conexión cargar el contenido del JSON y ejecutar la función para renderizarlos
            if (estado == "success"){
                productos = respuesta.stock;
                crearListaProd(productos, "fideos", "#listaFideos");
                crearListaProd(productos, "ravioles", "#listaRavioles");
                crearListaProd(productos, "otras", "#listaOtras");
                crearListaProd(productos, "salsas", "#listaSalsas");
            }
        });
    };


    //Función para crear el listado de productos y ubicarlo dentro del contenedor respectivo junto a un botón
    //con la leyenda "Agregar" para añadir productos al carrito.
    function crearListaProd (listaProductos, categoria, idcontenedor) {
        //Filtra la lista de productos por categoria para agruparlo en el contenedor correspondiente
        const listaProdFiltrada = listaProductos.filter(elemento =>  elemento.categoria === categoria);
        //Itera sobre la lista filtrada para armar los listados de productos
        for (let producto of listaProdFiltrada){
            //Convierte el objeto extraído del JSON en un objeto de clase Producto para aplicarle el método calcularImp()
            producto = new Producto (producto.id, producto.nombre, producto.categoria, producto.imagen, producto.precio)
            producto.precio = producto.calcularImp();
            $(idcontenedor).append(
            `<tr class="table-light">
                <td class="table-light"><img src="${producto.imagen}" width="60" heigh="60" alt="${producto.categoria}"></td>
                <td class="table-light">${producto.nombre}</td>
                <td class="table-light">$${producto.precio}</td>
                <td class="table-light text-center"><button class="btn btn-secondary btn-sm" id="botonAgregar${producto.id}"> Agregar</button></td>
            </tr>`);
            $(`#botonAgregar${producto.id}`).click(function(){
                carrito = JSON.parse(localStorage.getItem("carrito"));
                if (carrito == null){
                    carrito = []
                }
                carrito.push(producto);
                localStorage.setItem("carrito", JSON.stringify(carrito));
                actualizarBadge();
                limpiarCart();
                cargarCarrito();
                mostrarCarrito();
                confirmarItemAgregado();
            })
        }
    }

    

    //Funcion para agregar toggle a los botones Comprar en cada sección de productos
    function crearToggle (boton, listado) {
        $(boton).click(function () {
            if ($(boton).html() == "Mostrar opciones") {
                    $(listado).show("slow");
                    $(boton).html("Ocultar opciones").css("opacity", "0.7");
            }
            else {
                    $(listado).hide("slow");
                    $(boton).css("opacity", "1").html("Mostrar opciones"); 
            };
        });
    }
    

    //Agregar toogle a cada boton que despliega la lista de productos
    crearToggle("#botonFideos", ".texto_lista_fideos");
    crearToggle("#botonRavioles", ".texto_lista_ravioles");
    crearToggle("#botonOtras", ".texto_lista_otras");
    crearToggle("#botonSalsas", ".texto_lista_salsas");


    //Función para limpiar el listado desplegable que se arma cuando se hace click en el carrito. Si el
    //carrito no está vacío se eliminan las líneas de la lista y la línea del total.
    function limpiarCart(){
        for(let i =  $(".table-secondary").length -1; i >= 0; i--){
            $(".table-secondary")[i].remove();
        }
    }


    //Funcion para cargar desde el localStorage los elementos a mostrar en el carrito. Cada producto se
    //agrega en una fila de una tabla de Bootsrap y se calcula un total que se agrega al final de la tabla.
    function cargarCarrito(){
        carrito = JSON.parse(localStorage.getItem("carrito"));
        if (carrito != null) {
            let totalImp = 0;
            for (let elem of carrito){
                totalImp = totalImp + parseFloat(elem.precio);
                $("#contListado__items").append(
                `<tr class="table">
                    <td class="table table-secondary">${elem.nombre}</td>
                    <td class="table table-secondary">$${elem.precio}</td>
                </tr>`);
            }
            //Crea la línea con el total agregando el botón Pagar
            $("#contListado__total").append(
                `<tr class="table table-light">
                    <td class="table table-secondary align-middle">Total $ </td>
                    <td class="table table-secondary align-middle">${totalImp.toFixed(2)}</td>
                    <td class="table table-secondary"><button class="btn btn-danger" id="botonPagar">Pagar</button></td>
                </tr>`);
            
            //Agrega el div con la información para hacer el pago usando form de Bootstrap
            $(".carrito__cont").append(
                `<div id="formPago" style="display: none">
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">Nro tarjeta de crédito</span>
                        <input type="text" class="form-control" placeholder="Nro Tarjeta de crédito" aria-label="Nro tarjeta de crédito">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text">Mes y año de vencimiento</span>
                        <input type="text" aria-label="Mes" class="form-control" placeholder="Mes">
                        <input type="text" aria-label="Anio" class="form-control" placeholder="Año">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">Código de seguridad</span>
                        <input type="text" class="form-control" placeholder="Código de seguridad" aria-label="Código de seguridad">
                    </div>
                    <div>
                        <button type="submit" value="submit" class="btn btn-danger" id="botonEnviar">Enviar</button>
                    </div>
                </div>`,
            );

            //Activa el boton Pagar mostrando el div con animación faeToggle y cambia el valor html del botón a Ocultar
            $("#botonPagar").click(function() {
                $("#formPago").fadeToggle(1500, function(){
                    if ($("#botonPagar").html() == "Pagar") {
                        $("#botonPagar").html("Ocultar");
                    } else {
                        $("#botonPagar").html("Pagar");
                    }
                });
            });
        }
    }


    //Función para desplegar u ocultar el desplegable con los li del carrito cuando se hace click sobre el
    //botón modificando la clase que tienen los productos y el total.
    function desplegarCarrito(){
        let visib = $(".oculto").length;
        if ($(".oculto").length == 2) {
            $("#carrito__contListado").attr("class", "visible");
            $("#contListado__total").attr("class", "visible");
        } else {
            $("#carrito__contListado").attr("class", "oculto");
            $("#contListado__total").attr("class", "oculto");
        }
    }

    //Verificar si el carrito tiene algún producto dentro y desplegarlo dentro del
    //contenedor. Si se encunetra vacío se mantiene oculto
    function mostrarCarrito(){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        if(carrito != null){
            if (carrito.length != 0){
                $("#carrito__contListado").attr("class", "visible");
                $("#contListado__total").attr("class", "visible");
            }
        }
    }


    //Agregar confirmación que el producto fue agregado al carrito
    function confirmarItemAgregado() {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        
        Toast.fire({
            icon: 'success',
            title: 'Producto agregado al carrito'
        })
    }

    //Si el carrito no está vacío se muestra un badge con la catitidad de artículos en la lista carrito.
    function crearBadge(){
        if (carrito != null) {
            $("#cantCarrito").append(`<badge class='badge bg-dark'>${carrito.length}</badge>`);
        }
    }

    //Actualiza el valor del badge cuando se agregan nuevos productos al carrito.
    function actualizarBadge(){
        if (carrito != null) {
            $("#cantCarrito").html(`<badge class='badge bg-dark'>${carrito.length}</badge>`);
        }
    }

    //Función para vaciar el carrito en localStorage y en la lista carrito. Luego se actualiza el badge
    //que indica la cantidad de productos almacenados.
    function vaciarCarrito() {
        carrito = [];
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarBadge();
        return carrito;
    }

    //Asignación de las funciones que limpian el carrito, cargan los productos desde el local storage y los
    //hacen visible o invisible al botón carrito.
    $("#botonCarrito").on("click", function() {
        limpiarCart(), cargarCarrito(), desplegarCarrito()}
    );

    //Asignación de la función para limpiar el carrito cuando se presiona el botón con el ícono de papelera.
    //Se vacia la lista carrito y local storage, se limpia la tabla carrito en el div y se carga en blanco. Por
    //último, se oculta el desplegable de pagar
    $("#btnvaciarCarrito").on("click", function() {
        vaciarCarrito(), limpiarCart(); cargarCarrito(); desplegarCarrito(); $("#botonPagar").html("Pagar")}
    );

    //Obtiene información meteorológica desde RapidAPI seteando los parámetros para Buenos Aires. Luego ejecuta ajax
    //para obtener un JSON con una lista de objetos que se usan generando variables y se agregan al contenedor
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://community-open-weather-map.p.rapidapi.com/weather?q=Buenos%20Aires%2C%20Argentina&id=2172797&lang=sp&units=metric",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
            "x-rapidapi-key": "ebf68201a4msh9533cb8582d2216p16a177jsnbabb10154d3e"
        }
    };
    
    const obtenerClima = () => {
        $.ajax(settings).done(function (response) {
            let dataCielo = response.weather[0];
            let dataTemp = response.main;
            $("#clima").append(
                `<p>Ciudad: ${response.name}</p>
                  <p>Cielo: ${dataCielo.description}</p>
                  <p>Temperatura: ${dataTemp.temp}</p>
                  <p>Sens. Térm.: ${dataTemp.feels_like}</p>`)
        });
    }
    

    //EJECUCION DEL PROGRAMA
    //Ejecutar función para obtener los datos de productos del archivo JSON y renderizarlos en cada contenedor
    obtenerJsonProductos();

    //Carga inicial de los elementos el carrito.
    cargarCarrito();
    //Carga inicial del badge.
    crearBadge();
    //Desplegar carrito al inicio si no se encuentra vacío
    mostrarCarrito();

    //Carga la información del clima desde la API RapidAPI en el contenedor #clima
    obtenerClima();
});
