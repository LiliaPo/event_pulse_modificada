let map;

function initMap() {
    map = L.map('mapa').setView([40.416775, -3.703790], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
}

function mostrarEventos(eventosAMostrar) {
    const contenedorEventos = document.getElementById('eventos');
    contenedorEventos.innerHTML = '';

    eventosAMostrar.forEach(evento => {
        const eventoElement = document.createElement('div');
        eventoElement.classList.add('evento');
        eventoElement.innerHTML = `
            <div class="evento-banner" style="background-image: url('${evento.imagen}')"></div>
            <span class="evento-categoria categoria-${evento.categoria}">${evento.categoria}</span>
            <h3>${evento.nombre}</h3>
            <p><i class="fas fa-calendar"></i> ${new Date(evento.fecha).toLocaleDateString()}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${evento.localizacion}</p>
            <p><i class="fas fa-euro-sign"></i> ${evento.precio ? evento.precio.toFixed(2) : '0.00'} €</p>
            <button class="btn-ver-mas" data-id="${evento.id}">Ver más</button>
        `;
        contenedorEventos.appendChild(eventoElement);
    });
}

function mostrarEventosEnMapa(eventos) {
    if (map) {
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        eventos.forEach(evento => {
            const lat = 36 + Math.random() * 8;
            const lng = -9 + Math.random() * 12;
            
            L.marker([lat, lng])
                .addTo(map)
                .bindPopup(`<b>${evento.nombre}</b><br>${evento.fecha}`);
        });
    }
}

function entrarSinLogin() {
    console.log('Entrando como invitado...'); // Para debug
    const portada = document.getElementById('portada');
    const contenido = document.getElementById('contenido');
    
    if (portada && contenido) {
        portada.style.display = 'none';
        contenido.style.display = 'block';
        
        // Inicializar el mapa y mostrar eventos
        setTimeout(() => {
            initMap();
            mostrarEventos(eventos);
            mostrarEventosEnMapa(eventos);
        }, 100);
    } else {
        console.error('No se encontraron los elementos necesarios');
    }
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Documento cargado'); // Para debug
    
    // Añadir event listener a todos los botones de la portada
    const botonesAuth = document.querySelectorAll('.btn-auth');
    botonesAuth.forEach(boton => {
        if (boton.classList.contains('btn-guest')) {
            boton.addEventListener('click', entrarSinLogin);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const nombre = document.getElementById('nombre').value;
        const username = document.getElementById('username').value;

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, nombre, username }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirigir a la página de eventos
                window.location.href = '/EventPulse/index.html'; // Asegúrate de que esta URL sea correcta
            } else {
                // Mostrar mensaje de error
                errorMessage.textContent = `Error: ${data.message}`;
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error completo:', error);
            errorMessage.textContent = 'Error de conexión';
            errorMessage.style.display = 'block';
        }
    });
});

// Función para editar un evento
async function editarEvento(eventoId) {
    try {
        const response = await fetch(`/api/eventos/${eventoId}`);
        const evento = await response.json();
        
        // Rellenar el formulario con los datos del evento
        document.getElementById('editNombre').value = evento.nombre;
        document.getElementById('editCategoria').value = evento.categoria;
        document.getElementById('editSubcategoria').value = evento.subcategoria;
        document.getElementById('editEdad').value = evento.edad;
        document.getElementById('editPersonas').value = evento.personas;
        document.getElementById('editPrecio').value = evento.precio;
        document.getElementById('editLocalizacion').value = evento.localizacion;
        document.getElementById('editOrganizador').value = evento.organizador;
        document.getElementById('editFecha').value = evento.fecha;
        
        // Guardar el ID del evento actual
        document.getElementById('eventoIdActual').value = eventoId;
        
        // Mostrar el modal
        const editModal = new bootstrap.Modal(document.getElementById('editEventoModal'));
        editModal.show();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cargar el evento', 'danger');
    }
}

// Función para guardar los cambios del evento
async function guardarCambiosEvento() {
    const eventoId = document.getElementById('eventoIdActual').value;
    const eventoActualizado = {
        nombre: document.getElementById('editNombre').value,
        categoria: document.getElementById('editCategoria').value,
        subcategoria: document.getElementById('editSubcategoria').value,
        edad: document.getElementById('editEdad').value,
        personas: parseInt(document.getElementById('editPersonas').value),
        precio: parseFloat(document.getElementById('editPrecio').value),
        localizacion: document.getElementById('editLocalizacion').value,
        organizador: document.getElementById('editOrganizador').value,
        fecha: document.getElementById('editFecha').value
    };

    try {
        const response = await fetch(`/api/eventos/${eventoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventoActualizado)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el evento');
        }

        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editEventoModal'));
        modal.hide();

        // Recargar eventos
        cargarEventos();
        mostrarAlerta('Evento actualizado exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al actualizar el evento', 'danger');
    }
}

// Función para borrar un evento
async function borrarEvento(eventoId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        return;
    }

    try {
        const response = await fetch(`/api/eventos/${eventoId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el evento');
        }

        // Recargar eventos
        cargarEventos();
        mostrarAlerta('Evento eliminado exitosamente', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al eliminar el evento', 'danger');
    }
}

// Función para cargar eventos
async function cargarEventos() {
    try {
        const response = await fetch('/api/eventos');
        if (!response.ok) {
            throw new Error('Error al cargar los eventos');
        }
        const eventos = await response.json();
        mostrarEventos(eventos);
        mostrarEventosEnMapa(eventos);
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cargar los eventos', 'danger');
    }
}

// Función auxiliar para mostrar alertas
function mostrarAlerta(mensaje, tipo) {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertaDiv.role = 'alert';
    alertaDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const contenedor = document.querySelector('.container');
    contenedor.insertBefore(alertaDiv, contenedor.firstChild);
    
    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alertaDiv.remove();
    }, 3000);
}

async function login(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.token);
            return true;
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error de login:', error);
        throw error;
    }
}

// Función para actualizar usuario
async function actualizarUsuario(userId, userData) {
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error al actualizar usuario');
        }

        const data = await response.json();
        mostrarAlerta('Usuario actualizado exitosamente', 'success');
        return data;
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta(error.message, 'danger');
        throw error;
    }
}

// Función para obtener perfil de usuario
async function obtenerPerfilUsuario() {
    try {
        const response = await fetch('/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener perfil de usuario');
        }

        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta(error.message, 'danger');
        throw error;
    }
}