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
}
