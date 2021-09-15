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
            //Agrega funcionalidad al boton Agregar agregando el producto al carrito
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
                mensajeExito('Producto agregado al carrito');
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
    //Luego se agrega la funcionalidad para borrar el producto individual del carrito.
    function cargarCarrito(){
        if (carrito != null) {
            carrito = JSON.parse(localStorage.getItem("carrito"));
            let totalImp = 0;
            //Crea una nueva lista de objetos "contador" a partir del carrito con valores únicos en un set y cuenta
            //la cantidad de repeticiones.
            const contador = [...carrito.reduce( (mp, o) => {
            if (!mp.has(o.id)) mp.set(o.id, { ...o, cantidad: 0 });
                mp.get(o.id).cantidad++;
                return mp;
            }, new Map).values()];
            //Render de los encabezados de las columnas de la tabla carrito usando Bootstrap
            $("#contListado__items").append(
                `<tr class="table table-light">
                    <th class="table table-secondary" style="padding: 10px;">Producto</th>
                    <th class="table table-secondary" style="padding: 10px;">Precio</th>
                    <th class="table table-secondary" style="width: 15px; padding: 10px; text-align: center">Cant.</th>
                    <th class="table table-secondary" style="padding: 10px;">Subtotal</th>
                </tr>`)
            //Render de cada objeto de la lista contador
            for (let elem of contador){
                totalImp = totalImp + parseFloat(elem.precio * elem.cantidad);
                $("#contListado__items").append(
                    `<tr class="table table-light">
                        <td class="table table-secondary" style="padding: 10px;">${elem.nombre}</td>
                        <td class="table table-secondary" style="padding: 10px;">$${elem.precio}</td>
                        <td class="table table-secondary" style="width: 15px; padding: 10px; text-align: center">${elem.cantidad}</td>
                        <td class="table table-secondary" style="padding: 10px;">$${parseFloat(elem.precio * elem.cantidad).toFixed(2)}</td>
                        <td class="table table-secondary"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" class="bi bi-x-circle-fill"  id="quitar${elem.id}" style="background-color: #f5f5f5" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                            </svg></i>
                        </td>
                    </tr>`);

                //Funcionalidad de eliminar un producto individual del carrito
                $(`#quitar${elem.id}`).click(function() {
                    const elimProd = carrito.slice().reverse().find(v => v.id == `${elem.id}`);
                    const elimIndex = carrito.indexOf(elimProd);
                    carrito.splice(elimIndex, 1);
                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    actualizarBadge();
                    limpiarCart();
                    cargarCarrito();
                    mostrarCarrito();       
                })
            }

            //Crea la línea con el total agregando el botón Pagar
            $("#contListado__total").append(
                `<tr class="table table-light">
                    <td class="table table-secondary align-middle">Total $ </td>
                    <td class="table table-secondary align-middle">${totalImp.toFixed(2)}</td>
                    <td class="table table-secondary"><button class="btn btn-danger" id="botonPagar">Pagar</button></td>
                </tr>`);
                     
            if (carrito.length != 0){
                mostrarPagar();
            }
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


    //Obtener año y mes actual para usar en formulario de pago como validación
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;


    //Renderiza el form para pagar y activa el fadeToggle cuando se presiona el boton Pagar
    function mostrarPagar(){
        $("#botonPagar").click(function() {
            //Agrega el contemedor form con la información para hacer el pago usando un form de Bootstrap
            $(".carrito__cont").append(
                `<form id="formPago" style="display: none">
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">Nro tarjeta de crédito</span>
                        <input type="number" class="form-control" placeholder="#### #### #### ####" id="creditCardNr" aria-label="Nro tarjeta de crédito">
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" for="inputMes">Mes</span>
                        <select class="form-select" id="inputMes" placeholder="Mes">
                            <option selected>Mes</option>
                            <option value="1">01</option>
                            <option value="2">02</option>
                            <option value="3">03</option>
                            <option value="4">04</option>
                            <option value="5">05</option>
                            <option value="6">06</option>
                            <option value="7">07</option>
                            <option value="8">08</option>
                            <option value="9">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>
                        <span class="input-group-text" for="inputAnio">Año</span>
                        <select class="form-select" id="inputAnio">
                            <option selected>Año</option>
                            <option value=${currentYear}>${currentYear}</option>
                            <option value=${currentYear+1}>${currentYear+1}</option>
                            <option value=${currentYear+2}>${currentYear+2}</option>
                            <option value=${currentYear+3}>${currentYear+3}</option>
                            <option value=${currentYear+4}>${currentYear+4}</option>
                        </select>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">Código de seguridad</span>
                        <input type="number" id="creditCardCode" class="form-control" placeholder="###" aria-label="Código de seguridad">
                    </div>
                    <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon">Titular</span>
                    <input type="text" id="titular" class="form-control" placeholder="Nombre del titular" aria-label="Titular">
                </div>
                    <div>
                        <button type="button" value="submit" class="btn btn-danger" id="botonEnviar">Enviar</button>
                    </div>
                </form>`,
            );

            //Agrega la animación de fadeIn y fadeOut cuando se presiona el boton pagar mostrando y ocultando el form
            $("#formPago").fadeToggle(1500, function(){
                if ($("#botonPagar").html() == "Pagar") {
                    $("#botonPagar").html("Ocultar");
                } else {
                    $("#botonPagar").html("Pagar");
                }
            });

            //Agrega la funcionalidad al boton Enviar para validar las entradas en los inputs y mostrar confirmación
            $("#botonEnviar").click(function(){
                if (carrito.length != 0){
                    let ccNr = $("#creditCardNr").val();
                    let ccCode = $("#creditCardCode").val();
                    let ccTitular = $("#titular").val();
                    let ccMes = $("#inputMes").val();
                    let ccAnio = $("#inputAnio").val();
                    //Verifica que el largo del número de tarjeta de crédito es de 16 dígitos
                    if (ccNr.length != 16){
                        mensajeError('Número de tarjeta de crédito inválido');
                    }
                    //Verifica que el mes y año de vencimiento esten seleccionados y no son anteriores a mes y año actual
                    else if ((ccMes == "Mes" | ccAnio == "Año") | (ccMes <= currentMonth & ccAnio == currentYear)){
                        mensajeError('Combinación de mes y año inválida'); 
                    }
                    //Verifica que el código de seguridad sea de 3 dígitos
                    else if (ccCode.length != 3){
                        mensajeError('Código de seguridad inválido'); 
                    }
                    //Verifica que el campo titular no esté vacío
                    else if (ccTitular.length == 0){
                        mensajeError('Titular de tarjeta vacío');
                    }
                    //Verifica que el valor ingresado en el campo Titular no contenga números mediante una expresión regular
                    else if(ccTitular.match(/[0123456789]+/)){
                        mensajeError('Titular de tarjeta contiene números');
                    }
                    //Si los campos son váidos, oculta el form de pago, limpia los valores, vacía el array carrito y localStorage,
                    //limpia la tabla que muestra los productos en el carrito, oculta el carrito y muestra una confirmación que el
                    //pedido fue aceptado
                    else{
                        let pedido = calcularPedido();
                        $("#formPago").fadeOut(1500);
                        document.getElementById("formPago").reset();
                        vaciarCarrito();
                        limpiarCart();
                        desplegarCarrito();
                        confirmacionPedido(pedido);
                    }
                }
            }); 
        });
    }


    //Se calcula el total del pedido y la cantidad de productos solicitados para mostralo en la confirmación
    function calcularPedido (){
        let cantTotal = 0;
        let importeTotal = 0;
        carrito = JSON.parse(localStorage.getItem("carrito"))     
        for (let producto of carrito){
            let importe = parseFloat(producto.precio);
            cantTotal = cantTotal + 1;
            importeTotal = importeTotal + importe;
        }
        const pedido = [cantTotal, importeTotal.toFixed(2)]
        return pedido;
    }


    //SweetAlert2 configuración de mixin para usarlo en mensajes de error y confirmación
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

    //Agregar confirmación que el producto fue agregado al carrito
    function mensajeExito(mensaje) {
        Toast.fire({
            icon: 'success',
            title: mensaje
        })
    }

    //Mostrar mensaje de error cuando el valor ingresado como tarjeta de credito es incorrecto,
    //la fecha es anterior a la fecha actual, el código de seguridad no tiene 3 dígitos o el
    //campo titular está vacío
    function mensajeError(mensaje) {
        Toast.fire({
            icon: 'error',
            title: mensaje
        })
    }

    function confirmacionPedido(pedido){
        Swal.fire(
            'Pedido enviado',
            'Recibimos su pedido de '+ pedido[0] + ' producto(s) por un total de $' + pedido[1] + '. En breve lo contactaremos para coordinar la entrega. Muchas gracias.',
            'success'
        )
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


    //Obtiene información meteorológica desde Open-Meteo seteando los parámetros para Buenos Aires. Luego ejecuta Ajax
    //para obtener un JSON con una lista de objetos que se usan generando variables que se agregan al contenedor
    const URLClima = 'https://api.open-meteo.com/v1/forecast?latitude=-34.6118&longitude=-58.4173&current_weather=true&timezone=America/Argentina/Buenos_Aires'

    const codes = {"0":"Despejado", "1":"Mayormente despejado", "2":"Parcialmente nublado", "3":"Cubierto", "51":"Llovizna ligera", "52":"Llovizna moderada", "53":"Llovizna intensa", "61":"Lluvia ligera", "53":"Lluvia moderada", "53":"Lluvia intensa", "80":"Tormenta ligera", "81":"Tormenta intermedia", "82":"Tormenta fuerte"}

    const obtenerClima = () => {
        $.ajax(URLClima).done(function (response) {
            let hora = new Date();
            let dataTemp = response.current_weather.temperature;
            let dataWind = response.current_weather.windspeed;
            let dataCode = response.current_weather.weathercode;

            $("#clima").append(
                `<p>Hora: ${hora.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                <p>Clima: ${codes[dataCode]}</p>
                <p>Temperatura: ${dataTemp}°</p>
                <p>Viento: ${dataWind} km/h</p>`)
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

    //Carga la información del clima desde la API Open-Meteo en el contenedor #clima
    obtenerClima();
});
