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


//Inicializa una lista vacia para agregar los nuevos objetos de tipo Producto.
const productos = [];

//Agregar todos los productos a la venta con su id, nombre, categoria y precio en objectos.
productos.push(new Producto(1, "Spaguetti", "fideos", "images/thumbnail.png", 180));
productos.push(new Producto(2, "Tagliatelle", "fideos", "images/thumbnail.png", 170));
productos.push(new Producto(3, "Mostacholes", "fideos", "images/thumbnail.png", 150));
productos.push(new Producto(4, "Pappardelle", "fideos", "images/thumbnail.png", 220));
productos.push(new Producto(5, "Fetuccini", "fideos", "images/thumbnail.png", 200));
productos.push(new Producto(6, "Ravioles espinaca y queso", "ravioles", "images/thumbnail.png", 300));
productos.push(new Producto(7, "Ravioles pollo, carne y verdura", "ravioles", "images/thumbnail.png", 310));
productos.push(new Producto(8, "Ravioles ricota, queso y jamón", "ravioles", "images/thumbnail.png", 340));
productos.push(new Producto(9, "Ravioles cuatro quesos", "ravioles", "images/thumbnail.png", 320));
productos.push(new Producto(10, "Ravioles brócoli y zucchini", "ravioles", "images/thumbnail.png", 350));
productos.push(new Producto(11, "Canelones", "otras", "images/thumbnail.png", 550));
productos.push(new Producto(12, "Sorrentinos", "otras", "images/thumbnail.png", 400));
productos.push(new Producto(13, "Cappelettis", "otras", "images/thumbnail.png", 390));
productos.push(new Producto(14, "Lasagna", "otras", "images/thumbnail.png", 800));
productos.push(new Producto(15, "Gnocchi", "otras", "images/thumbnail.png", 190));
productos.push(new Producto(16, "Salsa bechamel", "salsas", "images/thumbnail.png", 120));
productos.push(new Producto(18, "Salsa bolognesa", "salsas", "images/thumbnail.png", 160));
productos.push(new Producto(19, "Salsa scarparo", "salsas", "images/thumbnail.png", 150));
productos.push(new Producto(20, "Salsa cuatro quesos", "salsas", "images/thumbnail.png", 180));
productos.push(new Producto(21, "Salsa liviana - Tomate y hortalizas", "salsas", "images/thumbnail.png", 160));


//Inicializar una lista carrito vacía que va a recibir los productos seleccionados
carrito = [];

//Función para crear el listado de productos y ubicarlo dentro del contenedor respectivo junto a un botón
//con la leyenda "Agregar" para añadir productos al carrito.
function crearListaProd (listaProductos, categoria, idcontenedor) {
    const listaProdFiltrada = listaProductos.filter(elemento =>  elemento.categoria === categoria);
    for (const producto of listaProdFiltrada){
        producto.precio = producto.calcularImp();
        $(idcontenedor).append(
        `<tr class="table-light">
            <td class="table-light"><img src="${producto.imagen}" width="60" heigh="60" alt="${producto.categoria}"></td>
            <td class="table-light">${producto.nombre}</td>
            <td class="table-light">Precio  $${producto.precio}</td>
            <td class="table-light text-center"><button class="btn btn-secondary btn-sm" id="botonAgregar${producto.id}"> Agregar</button></td>
        </tr>`);
        $(`#botonAgregar${producto.id}`).click(function(){
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
    let totalImp = 0;
    for (let elem of carrito){
        totalImp = totalImp + parseFloat(elem.precio);
        $("#contListado__items").append(
        `<tr class="table">
            <td class="table table-secondary">${elem.nombre}</td>
            <td class="table table-secondary">$${elem.precio}</td>
        </tr>`);
    }
    $("#contListado__total").append(
        `<tr class="table table-light">
            <td class="table table-secondary">Total $ </td>
            <td class="table table-secondary">${totalImp.toFixed(2)}</td>
        </tr>`)
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
    if (carrito.length != 0){
        $("#carrito__contListado").attr("class", "visible");
        $("#contListado__total").attr("class", "visible");
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
    $("#cantCarrito").append(`<badge class='badge bg-dark'>${carrito.length}</badge>`);
}

//Actualiza el valor del badge cuando se agregan nuevos productos al carrito.
function actualizarBadge(){
    $("#cantCarrito").html(`<badge class='badge bg-dark'>${carrito.length}</badge>`);

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

//Asignación de la función para limpiar el carrito cuando se presiona el botón con el ícono de papelera
//let botonVaciar = document.getElementById("btnvaciarCarrito");
//botonVaciar.onclick = () =>{vaciarCarrito(), limpiarCart(); cargarCarrito(); desplegarCarrito()};
$("#btnvaciarCarrito").on("click", function() {
    vaciarCarrito(), limpiarCart(); cargarCarrito(); desplegarCarrito()}
);


//EJECUCION DEL PROGRAMA
//Crear los cuatro grupos de productos en cada Bootstrap collapse filtrados por su categoría.
crearListaProd(productos, "fideos", "#listaFideos");
crearListaProd(productos, "ravioles", "#listaRavioles");
crearListaProd(productos, "otras", "#listaOtras");
crearListaProd(productos, "salsas", "#listaSalsas");

//Carga inicial de los elementos el carrito.
cargarCarrito();
//Carga inicial del badge.
crearBadge();
//Desplegar carrito al inicio si no se encuentra vacío
mostrarCarrito();

