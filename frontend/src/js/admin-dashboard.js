document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin';
        return;
    }

    cargarUsuarios();
    cargarEventos();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin';
    });
});

async function cargarUsuarios() {
    try {
        const response = await fetch('/api/users/all', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar usuarios');
        }

        const usuarios = await response.json();
        const listaUsuarios = document.getElementById('usuariosLista');
        
        listaUsuarios.innerHTML = usuarios.map(usuario => `
            <div class="item-card">
                <div class="item-info">
                    <h3>${usuario.nombre}</h3>
                    <p>${usuario.email}</p>
                    <p>Usuario desde: ${new Date(usuario.created_at).toLocaleDateString()}</p>
                </div>
                <div class="item-actions">
                    <button onclick="eliminarUsuario('${usuario.id}')" class="btn-eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar usuarios');
    }
}

async function cargarEventos() {
    try {
        const response = await fetch('/api/events', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar eventos');
        }

        const eventos = await response.json();
        const listaEventos = document.getElementById('eventosLista');
        
        listaEventos.innerHTML = eventos.map(evento => `
            <div class="item-card">
                <div class="item-info">
                    <h3>${evento.nombre}</h3>
                    <p>${evento.categoria} - ${evento.subcategoria}</p>
                    <p>Fecha: ${new Date(evento.fecha).toLocaleDateString()}</p>
                    <p>Organizador: ${evento.organizador}</p>
                </div>
                <div class="item-actions">
                    <button onclick="eliminarEvento('${evento.id}')" class="btn-eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar eventos');
    }
}

async function eliminarUsuario(userId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar usuario');
        }

        cargarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar usuario');
    }
}

async function eliminarEvento(eventoId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        return;
    }

    try {
        const response = await fetch(`/api/events/${eventoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al eliminar evento');
        }

        cargarEventos();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar evento');
    }
} 