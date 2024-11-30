document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('adminToken')) {
        window.location.href = '/admin';
        return;
    }

    loadUsers();
    loadEventos();

    document.getElementById('searchUser').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = users.filter(user => 
            user.nombre.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        displayUsers(filteredUsers);
    });
});

let users = [];

async function loadUsers() {
    try {
        console.log('Cargando usuarios...');
        const token = localStorage.getItem('adminToken');
        console.log('Token:', token);
        
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Respuesta status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const users = await response.json();
        console.log('Usuarios recibidos:', users);
        displayUsers(users);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

function displayUsers(users) {
    const container = document.getElementById('usuariosContainer');
    container.innerHTML = users.map(user => `
        <div class="user-card" data-user-id="${user.id}">
            <div class="user-header">
                <h3>${user.nombre}</h3>
                <span class="role">${user.rol}</span>
            </div>
            <div class="user-body">
                <p><i class="fas fa-envelope"></i> ${user.email}</p>
                <p><i class="fas fa-user"></i> ${user.username}</p>
                ${user.telefono ? `<p><i class="fas fa-phone"></i> ${user.telefono}</p>` : ''}
                ${user.whatsapp ? `<p><i class="fab fa-whatsapp"></i> ${user.whatsapp}</p>` : ''}
                ${user.instagram ? `<p><i class="fab fa-instagram"></i> ${user.instagram}</p>` : ''}
            </div>
            <div class="user-actions">
                <button onclick="editUser('${user.id}')" class="btn-primary">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="deleteUser('${user.id}')" class="btn-danger">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editUserForm').reset();
}

async function editUser(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const user = await response.json();

        // Rellenar el formulario con los datos del usuario
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editNombre').value = user.nombre;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editTelefono').value = user.telefono || '';
        document.getElementById('editWhatsapp').value = user.whatsapp || '';
        document.getElementById('editInstagram').value = user.instagram || '';
        document.getElementById('editRol').value = user.rol;

        // Mostrar el modal
        document.getElementById('editModal').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el usuario');
    }
}

document.getElementById('editUserForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userId = document.getElementById('editUserId').value;
    const userData = {
        nombre: document.getElementById('editNombre').value,
        email: document.getElementById('editEmail').value,
        username: document.getElementById('editUsername').value,
        telefono: document.getElementById('editTelefono').value,
        whatsapp: document.getElementById('editWhatsapp').value,
        instagram: document.getElementById('editInstagram').value,
        rol: document.getElementById('editRol').value
    };

    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            closeEditModal();
            await loadUsers(); // Recargar la lista de usuarios
            alert('Usuario actualizado exitosamente');
        } else {
            throw new Error('Error al actualizar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});

async function deleteUser(userId) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (response.ok) {
                const userElement = document.querySelector(`[data-user-id="${userId}"]`);
                if (userElement) {
                    userElement.remove();
                }
                alert('Usuario eliminado correctamente');
            } else {
                throw new Error('Error al eliminar usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }
}

async function loadEventos() {
    try {
        const response = await fetch('/api/events', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const eventos = await response.json();
        displayEventos(eventos);
    } catch (error) {
        console.error('Error al cargar eventos:', error);
    }
}

function displayEventos(eventos) {
    const container = document.getElementById('eventosContainer');
    container.innerHTML = eventos.map(evento => `
        <div class="evento-card" data-event-id="${evento.id}">
            <div class="evento-header">
                <h3>${evento.nombre}</h3>
                <span class="categoria">${evento.categoria}</span>
            </div>
            <div class="evento-body">
                <p><i class="fas fa-calendar"></i> ${new Date(evento.fecha).toLocaleString()}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${evento.localizacion}</p>
                <p><i class="fas fa-user"></i> ${evento.organizador}</p>
                <p><i class="fas fa-euro-sign"></i> ${evento.precio}€</p>
            </div>
            <div class="evento-actions">
                <button onclick="editEvento('${evento.id}')" class="btn-primary">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button onclick="deleteEvento('${evento.id}')" class="btn-danger">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    
    event.target.classList.add('active');
    
    if (tabName === 'usuarios') {
        loadUsers();
    } else if (tabName === 'eventos') {
        loadEventos();
    }
}

function openCreateEventoModal() {
    document.getElementById('createEventoModal').style.display = 'block';
}

function closeCreateEventoModal() {
    const form = document.getElementById('createEventoForm');
    form.reset();
    form.dataset.mode = 'create';
    delete form.dataset.eventId;
    document.querySelector('#createEventoForm button[type="submit"]').textContent = 'Crear Evento';
    document.getElementById('createEventoModal').style.display = 'none';
}

async function editEvento(id) {
    try {
        const response = await fetch(`/api/events/${id}`);
        const evento = await response.json();
        
        // Rellenar el formulario con los datos del evento
        document.getElementById('createEventoNombre').value = evento.nombre;
        document.getElementById('createEventoCategoria').value = evento.categoria;
        document.getElementById('createEventoFecha').value = evento.fecha.slice(0, 16);
        document.getElementById('createEventoLocalizacion').value = evento.localizacion;
        document.getElementById('createEventoDireccion').value = evento.direccion || '';
        document.getElementById('createEventoOrganizador').value = evento.organizador;
        document.getElementById('createEventoPrecio').value = evento.precio;
        document.getElementById('createEventoUrl').value = evento.url || '';

        // Modificar el formulario para modo edición
        const form = document.getElementById('createEventoForm');
        form.dataset.mode = 'edit';
        form.dataset.eventId = id;
        
        // Cambiar el texto del botón
        document.querySelector('#createEventoForm button[type="submit"]').textContent = 'Guardar Cambios';
        
        // Mostrar el modal
        openCreateEventoModal();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar el evento');
    }
}

async function deleteEvento(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (response.ok) {
                // Eliminar el evento del DOM
                const eventoElement = document.querySelector(`[data-event-id="${id}"]`);
                if (eventoElement) {
                    eventoElement.remove();
                }
                alert('Evento eliminado correctamente');
            } else {
                throw new Error('Error al eliminar el evento');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al eliminar el evento');
        }
    }
}

// Modificar el event listener del formulario para manejar tanto creación como edición
document.getElementById('createEventoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const isEdit = this.dataset.mode === 'edit';
    const eventId = this.dataset.eventId;
    
    const eventData = {
        nombre: document.getElementById('createEventoNombre').value,
        categoria: document.getElementById('createEventoCategoria').value,
        fecha: document.getElementById('createEventoFecha').value,
        localizacion: document.getElementById('createEventoLocalizacion').value,
        direccion: document.getElementById('createEventoDireccion').value,
        organizador: document.getElementById('createEventoOrganizador').value,
        precio: document.getElementById('createEventoPrecio').value,
        url: document.getElementById('createEventoUrl').value || null
    };

    try {
        const response = await fetch(`/api/events${isEdit ? `/${eventId}` : ''}`, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            },
            body: JSON.stringify(eventData)
        });

        if (response.ok) {
            const event = await response.json();
            if (isEdit) {
                // Actualizar el evento en la vista
                const eventoElement = document.querySelector(`[data-event-id="${eventId}"]`);
                if (eventoElement) {
                    eventoElement.innerHTML = generateEventoHTML(event);
                }
            } else {
                // Añadir el nuevo evento a la vista
                const eventosContainer = document.getElementById('eventosContainer');
                const eventoElement = document.createElement('div');
                eventoElement.className = 'evento-card';
                eventoElement.dataset.eventId = event.id;
                eventoElement.innerHTML = generateEventoHTML(event);
                eventosContainer.appendChild(eventoElement);
            }
            
            closeCreateEventoModal();
            alert(isEdit ? 'Evento actualizado exitosamente' : 'Evento creado exitosamente');
        } else {
            throw new Error(isEdit ? 'Error al actualizar evento' : 'Error al crear evento');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});

// Función auxiliar para generar el HTML de un evento
function generateEventoHTML(evento) {
    return `
        <div class="evento-header">
            <h3>${evento.nombre}</h3>
            <span class="categoria">${evento.categoria}</span>
        </div>
        <div class="evento-body">
            <p><i class="fas fa-calendar"></i> ${new Date(evento.fecha).toLocaleString()}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${evento.localizacion}</p>
            <p><i class="fas fa-user"></i> ${evento.organizador}</p>
            <p><i class="fas fa-euro-sign"></i> ${evento.precio}€</p>
        </div>
        <div class="evento-actions">
            <button onclick="editEvento('${evento.id}')" class="btn-primary">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button onclick="deleteEvento('${evento.id}')" class="btn-danger">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `;
} 