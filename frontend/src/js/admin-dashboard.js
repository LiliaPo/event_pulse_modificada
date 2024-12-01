document.addEventListener('DOMContentLoaded', () => {
    // Verificar si el usuario es admin
    if (!localStorage.getItem('token') || localStorage.getItem('userRole') !== 'admin') {
        window.location.href = '/admin';
        return;
    }

    // Cargar datos iniciales
    loadUsers();
    loadEventos();

    // Manejar cambio de pestañas
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // Añadir clase active al botón clickeado y su contenido
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Búsqueda de usuarios
    document.getElementById('searchUser')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = users.filter(user => 
            user.nombre?.toLowerCase().includes(searchTerm) ||
            user.email?.toLowerCase().includes(searchTerm)
        );
        displayUsers(filteredUsers);
    });

    // Inicializar formulario de eventos
    document.getElementById('eventoForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const eventoData = {
            nombre: document.getElementById('nombreEvento').value,
            categoria: document.getElementById('categoriaEvento').value,
            fecha: document.getElementById('fechaEvento').value,
            localizacion: document.getElementById('localizacionEvento').value,
            direccion: document.getElementById('direccionEvento').value,
            descripcion: document.getElementById('descripcionEvento').value,
            telefono_contacto: document.getElementById('telefonoEvento').value,
            organizador: document.getElementById('organizadorEvento').value,
            precio: parseFloat(document.getElementById('precioEvento').value)
        };

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(eventoData)
            });

            if (!response.ok) {
                throw new Error('Error al crear el evento');
            }

            closeEventModal();
            loadEventos();
            alert('Evento creado correctamente');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear el evento');
        }
    });

    // Cerrar modal de eventos
    document.querySelector('#eventoModal .close')?.addEventListener('click', closeEventModal);
});

let users = [];

// Funciones para modales
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}

// Funciones para eventos
window.showCreateEventModal = function() {
    openModal('eventoModal');
    document.getElementById('eventoForm').reset();
}

window.closeEventModal = function() {
    closeModal('eventoModal');
}

// Funciones para usuarios
async function loadUsers() {
    try {
        const response = await fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

function displayUsers(users) {
    const container = document.getElementById('usuariosContainer');
    if (!container) return;

    container.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.nombre || ''}</td>
                        <td>${user.email || ''}</td>
                        <td>${user.username || ''}</td>
                        <td>${user.rol || 'usuario'}</td>
                        <td class="actions">
                            <button onclick="editUser('${user.id}')" class="btn-primary">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteUser('${user.id}')" class="btn-danger">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Funciones para eventos
async function loadEventos() {
    try {
        const response = await fetch('/api/events', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar eventos');
        }

        const eventos = await response.json();
        displayEventos(eventos);
    } catch (error) {
        console.error('Error al cargar eventos:', error);
    }
}

function displayEventos(eventos) {
    const container = document.getElementById('eventosContainer');
    if (!container) return;

    container.innerHTML = eventos.map(evento => `
        <div class="evento-card">
            <h3>${evento.nombre}</h3>
            <p><i class="fas fa-calendar"></i> ${new Date(evento.fecha).toLocaleDateString()}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${evento.localizacion}</p>
            <p><i class="fas fa-tag"></i> ${evento.categoria}</p>
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

// Funciones globales para editar/eliminar usuarios
window.editUser = async function(userId) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Error al obtener usuario');

        const user = await response.json();
        showEditUserModal(user);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos del usuario');
    }
}

function showEditUserModal(user) {
    const modal = document.getElementById('editModal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeEditUserModal()">&times;</span>
            <h2>Editar Usuario</h2>
            <form id="editUserForm">
                <input type="hidden" id="editUserId" value="${user.id}">
                <div class="form-group">
                    <label for="editNombre">Nombre:</label>
                    <input type="text" id="editNombre" value="${user.nombre || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editEmail">Email:</label>
                    <input type="email" id="editEmail" value="${user.email || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editUsername">Username:</label>
                    <input type="text" id="editUsername" value="${user.username || ''}" required>
                </div>
                <div class="form-group">
                    <label for="editRol">Rol:</label>
                    <select id="editRol">
                        <option value="usuario" ${user.rol === 'usuario' ? 'selected' : ''}>Usuario</option>
                        <option value="admin" ${user.rol === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Guardar Cambios</button>
            </form>
        </div>
    `;

    openModal('editModal');
    setupEditUserForm();
}

function setupEditUserForm() {
    const form = document.getElementById('editUserForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = document.getElementById('editUserId').value;
        
        const userData = {
            nombre: document.getElementById('editNombre').value,
            email: document.getElementById('editEmail').value,
            username: document.getElementById('editUsername').value,
            rol: document.getElementById('editRol').value
        };

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) throw new Error('Error al actualizar usuario');

            closeModal('editModal');
            loadUsers();
            alert('Usuario actualizado correctamente');
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar el usuario');
        }
    });
}

window.closeEditUserModal = function() {
    closeModal('editModal');
}

window.deleteUser = async function(userId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;
    
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Error al eliminar usuario');

        loadUsers();
        alert('Usuario eliminado correctamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el usuario');
    }
}

// Funciones para eventos
window.editEvento = async function(eventoId) {
    try {
        const response = await fetch(`/api/events/${eventoId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Error al obtener evento');

        const evento = await response.json();
        showEditEventModal(evento);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos del evento');
    }
}

window.deleteEvento = async function(eventoId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return;
    
    try {
        const response = await fetch(`/api/events/${eventoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) throw new Error('Error al eliminar evento');

        loadEventos();
        alert('Evento eliminado correctamente');
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el evento');
    }
}

function showEditEventModal(evento) {
    const modal = document.getElementById('eventoModal');
    if (!modal) return;

    document.querySelector('#eventoModal h2').textContent = 'Editar Evento';
    
    const form = document.getElementById('eventoForm');
    form.dataset.eventoId = evento.id;
    
    document.getElementById('nombreEvento').value = evento.nombre || '';
    document.getElementById('categoriaEvento').value = evento.categoria || '';
    document.getElementById('fechaEvento').value = evento.fecha ? new Date(evento.fecha).toISOString().slice(0, 16) : '';
    document.getElementById('localizacionEvento').value = evento.localizacion || '';
    document.getElementById('direccionEvento').value = evento.direccion || '';
    document.getElementById('descripcionEvento').value = evento.descripcion || '';
    document.getElementById('telefonoEvento').value = evento.telefono_contacto || '';
    document.getElementById('organizadorEvento').value = evento.organizador || '';
    document.getElementById('precioEvento').value = evento.precio || 0;

    openModal('eventoModal');
} 