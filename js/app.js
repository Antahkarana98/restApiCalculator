let cliente = {
  mesa: '',
  hora: '',
  pedido: []
}

const categorias = {
  1: 'Comida',
  2: 'Bebida',
  3: 'Postre'
}

const btnGuardar = document.querySelector('#guardar-cliente');
btnGuardar.addEventListener('click', guardarCliente);

function guardarCliente() {
  const mesa = document.querySelector('#mesa').value;
  const hora = document.querySelector('#hora').value;

  // revisar si hay campos vacios

  const camposVacios = [mesa, hora].some(campo => campo === '');

  if(camposVacios){
    const existeAlerta = document.querySelector('.invalid-feedback');

    if(!existeAlerta){

      const alerta = document.createElement('div');
      alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
      alerta.textContent = 'Todos los campos son obligatorios';
      document.querySelector('.modal-body form').appendChild(alerta);

      setTimeout(() => {
        alerta.remove();
      }, 2000);
    }
    return;
  }
  //asignar valores al objeto
  // primero creamos el objeto vacio hy luego le agregamos el valor de las variables porque
  // si lo hacemos al contrario agrega las variables y otro objeto vacio entonces se sobre escribe
  cliente = {...cliente, mesa, hora}

  //ocultar modal una vez se completo la validacion y el guardado de datos

  const modalFormulario = document.querySelector('#formulario');
  const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
  modalBootstrap.hide();

  //mostrar secciones ocultas
  mostrarSecciones();

  //consultar nuestra api
  obtenerPlatillos();
}

function mostrarSecciones() {
  const secciones = document.querySelectorAll('.d-none');

  secciones.forEach(seccion => {
    seccion.classList.remove('d-none');
  })
}

function obtenerPlatillos() {
  const url = 'http://localhost:4000/platillos';

  fetch(url)
    .then(response => response.json())
    .then(result => mostrarPlatillos(result))
}

function mostrarPlatillos(result) {
  const contenido = document.querySelector('#platillos .contenido')
  //mostrar los platillos en el html con scripting
  result.forEach(platillo => {
    const row = document.createElement('DIV');
    row.classList.add('row', 'py-3', 'border-top');

    const nombre = document.createElement('DIV');
    nombre.classList.add('col-md-4');
    nombre.textContent = platillo.nombre;

    const precio = document.createElement('DIV');
    precio.classList.add('col-md-3', 'fw-bold');
    precio.textContent = platillo.precio;

    const categoria = document.createElement('DIV');
    categoria.classList.add('col-md-3');
    categoria.textContent = categorias[platillo.categoria];

    const inputCantidad = document.createElement('INPUT');
    inputCantidad.classList.add('form-control');
    inputCantidad.type = 'number';
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.id = `producto-${platillo.id}`;

    // agregar producto con la cantidad

    inputCantidad.onchange = function () {
      const cantidad = parseInt(inputCantidad.value);
      agregarPlatillo({...platillo, cantidad});
    };

    const agregar = document.createElement('DIV');
    agregar.classList.add('col-md-2');
    agregar.appendChild(inputCantidad);


    row.appendChild(nombre);
    row.appendChild(precio);
    row.appendChild(categoria);
    row.appendChild(agregar);
    contenido.appendChild(row);

  })
}

function agregarPlatillo(producto) {

  //traernos el arreglo de pedidos
  let { pedido } = cliente;

  //validar si la cantidad es mayor a 0 para no agregar cosas de mas
  if(producto.cantidad > 0){
    //verificar si el producto ya existe
    if(pedido.some(articulo => articulo.id === producto.id)){
      //itermaos sobre el pedido y verificamos si es el mismo producto
      const pedidoActualizado = pedido.map(articulo => {
        if(articulo.id === producto.id){
          articulo.cantidad = producto.cantidad;
        }
        return articulo;
      })
      cliente.pedido = [...pedidoActualizado];
    }else{
      // si el producto no exite entonces lo agregamos
      cliente.pedido = [...pedido, producto];
    }
  }else{
    //eliminar los productos que tengan cantidad de 0

    const resultado = pedido.filter(articulo => articulo.id !== producto.id);
    //actualizar pedido
    cliente.pedido = [...resultado];
  }

  console.log(cliente.pedido);

  limpiarHTML();

  if(cliente.pedido.length){

    actualizarResumen();
  }else{
    mensajePedidoVacio();
  }

}

function limpiarHTML() {
  const contenido = document.querySelector('#resumen .contenido');
  while(contenido.firstChild) {
      contenido.removeChild(contenido.firstChild);
  }
}

function actualizarResumen() {
  const contenido = document.querySelector('#resumen .contenido');

  const resumen = document.createElement('DIV');
  resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

  // Mostrar la Mesa

  const mesa = document.createElement('P');
  mesa.textContent = 'Mesa: ';
  mesa.classList.add('fw-bold');

  const mesaSpan = document.createElement('SPAN');
  mesaSpan.textContent = cliente.mesa;
  mesaSpan.classList.add('fw-normal');
  mesa.appendChild(mesaSpan);

  // Hora
  const hora = document.createElement('P');
  hora.textContent = 'Hora: ';
  hora.classList.add('fw-bold');

  const horaSpan = document.createElement('SPAN');
  horaSpan.textContent = cliente.hora;
  horaSpan.classList.add('fw-normal');
  hora.appendChild(horaSpan);


  // Mostrar los platillos Consumidos!

  const heading = document.createElement('H3');
  heading.textContent = 'Platillos Pedidos';
  heading.classList.add('my-4');


  const grupo = document.createElement('UL');
  grupo.classList.add('list-group');

  // Producto pedido
  const { pedido } = cliente;
  pedido.forEach( articulo => {

      const { nombre, cantidad, precio, id } = articulo;

      const lista = document.createElement('LI');
      lista.classList.add('list-group-item');

      const nombreEl = document.createElement('h4');
      nombreEl.classList.add('text-center', 'my-4');
      nombreEl.textContent = nombre;

      const cantidadEl = document.createElement('P');
      cantidadEl.classList.add('fw-bold');
      cantidadEl.textContent = 'Cantidad: ';

      const cantidadValor = document.createElement('SPAN');
      cantidadValor.classList.add('fw-normal');
      cantidadValor.textContent = cantidad;

      const precioEl = document.createElement('P');
      precioEl.classList.add('fw-bold');
      precioEl.textContent = 'Precio: ';


      const precioValor = document.createElement('SPAN');
      precioValor.classList.add('fw-normal');
      precioValor.textContent = `$${precio}`;

      const subtotalEl = document.createElement('P');
      subtotalEl.classList.add('fw-bold');
      subtotalEl.textContent = 'Subtotal: ';


      const subtotalValor = document.createElement('SPAN');
      subtotalValor.classList.add('fw-normal');
      subtotalValor.textContent = calcularSubtotal(precio, cantidad);

      const btnEliminar = document.createElement('BUTTON');
      btnEliminar.classList.add('btn', 'btn-danger');
      btnEliminar.textContent = 'Eliminar platillo';
      btnEliminar.onclick = function() {
        eliminarPlatillo(id);
      }

      // Agregar los Labels a sus contenedores
      cantidadEl.appendChild(cantidadValor);
      precioEl.appendChild(precioValor);
      subtotalEl.appendChild(subtotalValor);



      lista.appendChild(nombreEl);
      lista.appendChild(cantidadEl);
      lista.appendChild(precioEl);
      lista.appendChild(subtotalEl);
      lista.appendChild(btnEliminar);

      grupo.appendChild(lista);


  })

  resumen.appendChild(mesa);
  resumen.appendChild(hora);
  resumen.appendChild(heading);
  resumen.appendChild(grupo);


  // agregar al contenido
  contenido.appendChild(resumen)
}

function calcularSubtotal(precio, cantidad) {
  return `$ ${precio * cantidad}`;
}

function eliminarPlatillo(id) {
  const {pedido} = cliente;

  const resultado = pedido.filter(articulo => articulo.id !== id);
    //actualizar pedido
  cliente.pedido = [...resultado];

  limpiarHTML();

  if(cliente.pedido.length){
    actualizarResumen();
  }else{
    mensajePedidoVacio();
  }

  const productoEliminado = `#producto-${id}`;
  const inputEliminado = document.querySelector(productoEliminado)
  inputEliminado.value = 0;
}

function mensajePedidoVacio() {
  const contenido = document.querySelector('#resumen .contenido');

  const texto = document.createElement('P');
  texto.classList.add('text-center');
  texto.textContent = 'Añade los elemento del pedido';

  contenido.appendChild(texto);
}
