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
      return;
    }
  }
}
