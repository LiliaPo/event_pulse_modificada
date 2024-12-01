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
        
        const form = e.target;
        const eventoId = form.dataset.eventoId;
        const isEdit = !!eventoId;

        const eventoData = {
            nombre: document.getElementById('nombreEvento').value.trim(),
            categoria: document.getElementById('categoriaEvento').value,
            fecha: document.getElementById('fechaEvento').value,
            localizacion: document.getElementById('localizacionEvento').value.trim(),
            direccion: document.getElementById('direccionEvento').value.trim(),
            descripcion: document.getElementById('descripcionEvento').value.trim(),
            telefono_contacto: document.getElementById('telefonoEvento').value.trim(),
            organizador: document.getElementById('organizadorEvento').value.trim(),
            precio: parseFloat(document.getElementById('precioEvento').value) || 0
        };

        try {
            console.log('Modo:', isEdit ? 'edición' : 'creación');
            console.log('ID del evento:', eventoId);
            console.log('Datos a enviar:', eventoData);

            const response = await fetch(
                isEdit ? `/api/events/${eventoId}` : '/api/events',
                {
                    method: isEdit ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(eventoData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Error al ${isEdit ? 'actualizar' : 'crear'} el evento`);
            }

            // Limpiar formulario y resetear estado
            form.reset();
            delete form.dataset.eventoId;
            document.getElementById('btnSubmitEvento').textContent = 'Crear Evento';

            // Cerrar modal
            const modal = document.getElementById('eventoModal');
            if (modal) {
                modal.style.display = 'none';
                document.querySelector('#eventoModal h2').textContent = 'Crear Evento';
            }

            // Recargar eventos
            await loadEventos();
            
            alert(isEdit ? 
                `El evento "${eventoData.nombre}" ha sido actualizado correctamente` : 
                `El evento "${eventoData.nombre}" ha sido creado correctamente`
            );
        } catch (error) {
            console.error('Error completo:', error);
            alert(error.message);
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
        console.log('Iniciando carga de eventos...');
        const token = localStorage.getItem('token');
        console.log('Token:', token);

        const response = await fetch('/api/events', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Respuesta del servidor:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const eventos = await response.json();
        console.log('Eventos recibidos:', eventos);

        if (!eventos || eventos.length === 0) {
            console.log('No hay eventos para mostrar');
        }

        displayEventos(eventos);
    } catch (error) {
        console.error('Error al cargar eventos:', error);
    }
}

function displayEventos(eventos) {
    const container = document.getElementById('eventosContainer');
    if (!container) {
        console.error('No se encontró el contenedor de eventos');
        return;
    }

    if (!eventos || eventos.length === 0) {
        container.innerHTML = '<p>No hay eventos disponibles</p>';
        return;
    }

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

// Asegúrate de que los eventos se cargan cuando se cambia a la pestaña de eventos
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        if (tabId === 'eventos') {
            loadEventos();
        }
    });
});

// Cargar eventos al iniciar
document.addEventListener('DOMContentLoaded', () => {
    // ... código existente ...
    loadEventos(); // Asegúrate de que esta línea esté presente
});

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
        const modal = document.getElementById('eventoModal');
        const form = document.getElementById('eventoForm');
        const submitBtn = document.getElementById('btnSubmitEvento');

        if (!modal || !form || !submitBtn) {
            throw new Error('No se encontraron los elementos necesarios');
        }

        const response = await fetch(`/api/events/${eventoId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener evento');
        }

        const evento = await response.json();
        console.log('Evento a editar:', evento);

        // Limpiar formulario
        form.reset();
        form.dataset.eventoId = evento.id;

        // Lista de campos a rellenar
        const campos = {
            nombreEvento: evento.nombre,
            categoriaEvento: evento.categoria,
            fechaEvento: evento.fecha ? new Date(evento.fecha).toISOString().slice(0, 16) : '',
            localizacionEvento: evento.localizacion,
            direccionEvento: evento.direccion,
            descripcionEvento: evento.descripcion,
            telefonoEvento: evento.telefono_contacto,
            organizadorEvento: evento.organizador,
            precioEvento: evento.precio || 0
        };

        // Rellenar campos
        for (const [id, valor] of Object.entries(campos)) {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.value = valor || '';
                console.log(`Campo ${id} rellenado con:`, valor);
            } else {
                console.error(`No se encontró el elemento con id: ${id}`);
            }
        }

        // Cambiar textos
        modal.querySelector('h2').textContent = 'Editar Evento';
        submitBtn.textContent = 'Actualizar Evento';

        // Mostrar modal
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error detallado:', error);
        alert('Error al cargar los datos del evento: ' + error.message);
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