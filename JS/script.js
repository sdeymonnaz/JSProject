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
        return this.precio * 1.21
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
function crearListaProductos(listaProductos, categoria, idcontenedor) {
    const listaProdFiltrada = listaProductos.filter(elemento =>  elemento.categoria === categoria);
    let contenedor = document.getElementById(idcontenedor);
    for (const producto of listaProdFiltrada){
        producto.precio = producto.calcularImp();
        let itemLista = document.createElement("li");
        let botonAgregar = document.createElement("button");
        itemLista.innerText = producto.nombre;
        itemLista.setAttribute("class", "list-group-item");
        contenedor.appendChild(itemLista);
        botonAgregar.innerText = "Agregar";
        botonAgregar.setAttribute("class", "btn btn-secondary");
        botonAgregar.onclick = () => {agregarNuevoItem(producto)}
        itemLista.appendChild(botonAgregar);
    }
}

//Función para limpiar el listado desplegable que se arma cuando se hace click en el carrito. Si el
//carrito no está vacío se eliminan las líneas de la lista y la línea del total.
function limpiarCart(){
    let comprasItems = document.getElementsByClassName("list-group-item compras");
    for(let i =  comprasItems.length -1; i >= 0; i--){
        comprasItems[i].remove();
    }
    let comprasTotal = document.getElementsByClassName("list-group-item total");
    comprasTotal[0].remove();
}

//Función para generar los li que se muestran en el desplegable del carrito. Primero se carga
//el local storage y luego se crea un li por cada objeto en el array asignándole una clase de CSS
//Luego se carga al final una linea con el total que se fue acumulado en la iteración del for of. 
function cargarCarrito(){
    carrito = JSON.parse(localStorage.getItem("carrito"));
    let contenedor = document.getElementById("contListado__items");
    let totalImp = 0;
    for (let elem of carrito){
        totalImp = totalImp + elem.precio;
        let cartItem = document.createElement("li");
        cartItem.innerText = elem.nombre + "  $" + (elem.precio).toFixed(2);
        cartItem.setAttribute("class", "list-group-item compras");
        contenedor.appendChild(cartItem);
    }
    let contenedorTotal = document.getElementById("contListado__total");
    let cartTotal = document.createElement("li");
    cartTotal.innerText = "Total $" + totalImp.toFixed(2);
    cartTotal.setAttribute("class", "list-group-item total list-group-item-dark");
    contenedorTotal.appendChild(cartTotal);

}

//Función para desplegar u ocultar el desplegable con los li del carrito cuando se hace click sobre el
//botón modificando la clase que tienen los productos y el total.
function desplegarCarrito(){
    let botonCartItem = document.getElementById("carrito__contListado");
    let botonCartTotal = document.getElementById("contListado__total");
    let visibilidad = document.getElementsByClassName("oculto");
    if (visibilidad.length == 2) {
        botonCartItem.setAttribute("class", "visible");
        botonCartTotal.setAttribute("class", "visible");
    } else {
        botonCartItem.setAttribute("class", "oculto");
        botonCartTotal.setAttribute("class", "oculto");
    }
}

//Verificar si el carrito tiene algún producto dentro y desplegarlo dentro del
//contenedor. Si se encunetra vacío se mantiene oculto
function mostrarCarrito(){
    carrito = JSON.parse(localStorage.getItem("carrito")) 
    if (carrito.length != 0){
        let botonCartItem = document.getElementById("carrito__contListado");
        let botonCartTotal = document.getElementById("contListado__total");
        let visibilidad = document.getElementsByClassName("oculto");
        botonCartItem.setAttribute("class", "visible");
        botonCartTotal.setAttribute("class", "visible");
        carrito = JSON.parse(localStorage.getItem("carrito"))
    }
}

//Función para agregar un nuevo objeto en el carrito y actualizar el local storage
function agregarNuevoItem (producto) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarBadge();
    limpiarCart();
    cargarCarrito();
    mostrarCarrito();
    confirmarItemAgregado();
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
    let cart = document.getElementById("cantCarrito");
    let contador = document.createElement("badge");
    contador.innerText = carrito.length;
    contador.setAttribute("class", "badge bg-dark");
    cart.appendChild(contador);
}

//Actualiza el valor del badge cuando se agregan nuevos productos al carrito.
function actualizarBadge(){
    let contador = document.getElementById("cantCarrito");
    contador.innerText = carrito.length;
    contador.setAttribute("class", "badge bg-dark");
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
let botonCart = document.getElementById("botonCarrito");
botonCart.onclick = () =>{limpiarCart(); cargarCarrito(); desplegarCarrito()};

//Asignación de la función para limpiar el carrito cuando se presiona el botón con el ícono de papelera
let botonVaciar = document.getElementById("btnvaciarCarrito");
botonVaciar.onclick = () =>{vaciarCarrito(), limpiarCart(); cargarCarrito(); desplegarCarrito()};


//EJECUCION DEL PROGRAMA
//Crear los cuatro grupos de productos en cada Bootstrap collapse filtrados por su categoría.
crearListaProductos(productos, "fideos", "listaFideos");
crearListaProductos(productos, "ravioles", "listaRavioles");
crearListaProductos(productos, "otras", "listaOtras");
crearListaProductos(productos, "salsas", "listaSalsas");

//Carga inicial de los elementos el carrito.
cargarCarrito();
//Carga inicial del badge.
crearBadge();
//Desplegar carrito al inicio si no se encuentra vacío
mostrarCarrito();

