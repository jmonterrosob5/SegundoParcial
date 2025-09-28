
const BASE_URL = 'https://restaurantebackend-5srw.onrender.com';

document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    const res = await fetch(`${BASE_URL}/clientes/registrar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono })
    });

    const data = await res.json();
    alert(data.message || 'Cliente registrado');
});

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const telefono = document.getElementById('loginTelefono').value;

    const res = await fetch(`${BASE_URL}/clientes/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, telefono })
    });

    const data = await res.json();
    if (data.cliente_id) {
        document.getElementById('clienteId').value = data.cliente_id;
        document.getElementById('ordenSection').style.display = 'block';
    } else {
        alert(data.message || 'Login fallido');
    }
});

document.getElementById('ordenForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const cliente_id = document.getElementById('clienteId').value;
    const platillo_nombre = document.getElementById('platillo').value;
    const notes = document.getElementById('notes').value;

    const res = await fetch(`${BASE_URL}/ordenes/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id, platillo_nombre, notes })
    });

    const data = await res.json();
    alert(data.message || 'Orden creada');
});
