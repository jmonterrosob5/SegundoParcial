
let cliente_id = null;

function registrarCliente() {
  fetch('/clientes/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: document.getElementById('nombre').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value
    })
  }).then(res => res.json()).then(data => alert('Cliente registrado'));
}

function loginCliente() {
  fetch('/clientes/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('login_email').value,
      telefono: document.getElementById('login_telefono').value
    })
  }).then(res => res.json()).then(data => {
    cliente_id = data.id;
    document.getElementById('ordenes').style.display = 'block';
    listarOrdenes();
  });
}

function crearOrden() {
  fetch('/ordenes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cliente_id,
      platillo_nombre: document.getElementById('platillo').value,
      notes: document.getElementById('notes').value,
      estado: 'pending'
    })
  }).then(res => res.json()).then(data => listarOrdenes());
}

function listarOrdenes() {
  fetch('/ordenes/listar?cliente_id=' + cliente_id)
    .then(res => res.json())
    .then(data => {
      const lista = document.getElementById('lista_ordenes');
      lista.innerHTML = '';
      data.forEach(o => {
        const li = document.createElement('li');
        li.textContent = `${o.platillo_nombre} - ${o.estado}`;
        const btn = document.createElement('button');
        btn.textContent = 'Actualizar Estado';
        btn.onclick = () => {
          fetch('/ordenes/' + o.id + '/estado', { method: 'PUT' })
            .then(res => res.json())
            .then(() => listarOrdenes());
        };
        li.appendChild(btn);
        lista.appendChild(li);
      });
    });
}
