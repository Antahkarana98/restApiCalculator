let cliente = {
  mesa: '',
  hora: '',
  pedido: []
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
  console.log(cliente);

  mostrarSecciones();
}

function mostrarSecciones() {
  const secciones = document.querySelectorAll('.d-none');

  secciones.forEach(seccion => {
    seccion.classList.remove('d-none');
  })
}
