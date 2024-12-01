let eventos = [];  // Ahora empezará vacío

let usuarioActual = {
    // ... objeto de usuario ...
};

const subcategorias = {
    // ... objeto de subcategorías ...
};

let map, userMarker;

function initMap() {
    // Centrar en España
    map = L.map('mapa').setView([40.416775, -3.703790], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Añadir control de escala
    L.control.scale().addTo(map);

    // Limitar el área visible a España
    const bounds = L.latLngBounds(
        L.latLng(35.8, -9.4),  // Esquina suroeste
        L.latLng(43.8, 4.4)    // Esquina noreste
    );
    map.setMaxBounds(bounds);
    map.setMinZoom(5);
    map.setMaxZoom(18);
}

// Función para cargar eventos desde la API
async function cargarEventos() {
    try {
        const response = await fetch('/api/events', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar eventos');
        }

        eventos = await response.json();
        mostrarEventos(eventos);
        mostrarEventosEnMapa(eventos);
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los eventos');
    }
}

// Añade este objeto con las imágenes por defecto para cada categoría
const imagenesPorCategoria = {
    musica: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    deporte: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    arte: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    cine: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    cafeteria: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    restaurante: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
};

function mostrarEventos(eventos) {
    const eventosContainer = document.getElementById('eventos');
    eventosContainer.innerHTML = eventos.map(evento => `
        <div class="evento">
            <div class="evento-banner" style="background-image: url('${evento.imagen || imagenesPorCategoria[evento.categoria] || 'https://via.placeholder.com/300x150'}')"></div>
            <span class="evento-categoria categoria-${evento.categoria}">${evento.categoria}</span>
            <h3>${evento.nombre}</h3>
            <p><i class="fas fa-calendar"></i> ${new Date(evento.fecha).toLocaleDateString()}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${evento.localizacion}</p>
            <p><i class="fas fa-euro-sign"></i> ${evento.precio || 'Gratis'}</p>
            <button class="btn-ver-mas" onclick="verDetallesEvento('${evento.id}')">Ver más</button>
            
            <div class="evento-detalles" id="detalles-${evento.id}" style="display: none;">
                <p><strong>Descripción:</strong> ${evento.descripcion || 'No hay descripción disponible'}</p>
                <p><strong>Dirección:</strong> ${evento.direccion || 'No especificada'}</p>
                <p><strong>Organizador:</strong> ${evento.organizador}</p>
                ${evento.telefono_contacto ? `<p><strong>Contacto:</strong> <a href="tel:${evento.telefono_contacto}">${evento.telefono_contacto}</a></p>` : ''}
                ${evento.url ? `<p><strong>URL del evento:</strong> <a href="${evento.url}" target="_blank">${evento.url}</a></p>` : ''}
                <p><strong>Fecha y hora:</strong> ${new Date(evento.fecha).toLocaleString()}</p>
            </div>
        </div>
    `).join('');

    // Añadir event listeners para los botones "Ver más"
    document.querySelectorAll('.btn-ver-mas').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const eventoId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            verDetallesEvento(eventoId);
        });
    });
}

function verDetallesEvento(eventoId) {
    const detallesDiv = document.getElementById(`detalles-${eventoId}`);
    const boton = document.querySelector(`[onclick="verDetallesEvento('${eventoId}')"]`);
    
    if (detallesDiv.style.display === 'none') {
        detallesDiv.style.display = 'block';
        boton.textContent = 'Ver menos';
    } else {
        detallesDiv.style.display = 'none';
        boton.textContent = 'Ver más';
    }
}

// Función mejorada para geocodificar direcciones
async function geocodificarDireccion(direccion) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?` + 
            `format=json&q=${encodeURIComponent(direccion + ', España')}` +
            `&countrycodes=es&limit=1&addressdetails=1&namedetails=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
            console.log('Localización encontrada:', data[0]);
            return {
                lat: parseFloat(data[0].lat),
                lng: parseFloat(data[0].lon)
            };
        }
        return null;
    } catch (error) {
        console.error('Error al geocodificar:', error);
        return null;
    }
}

// Función mejorada para usar ubicación actual
function usarUbicacionActual() {
    if ("geolocation" in navigator) {
        const btnUbicacion = document.getElementById('ubicacionActual');
        btnUbicacion.disabled = true;
        btnUbicacion.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo ubicación...';

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            async function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                try {
                    // Obtener el nombre de la ciudad usando geocodificación inversa
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?` +
                        `format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
                    );
                    const data = await response.json();
                    
                    if (data.address) {
                        const ciudad = data.address.city || data.address.town || data.address.village;
                        if (ciudad) {
                            document.getElementById('localizacion').value = ciudad;
                            filtrarEventos();
                        }
                    }

                    // Centrar el mapa en la ubicación actual
                    map.setView([lat, lng], 15);

                    // Si existe un marcador anterior, eliminarlo
                    if (userMarker) {
                        map.removeLayer(userMarker);
                    }

                    // Crear nuevo marcador con la ubicación actual
                    userMarker = L.marker([lat, lng], {
                        icon: L.divIcon({
                            className: 'ubicacion-actual',
                            html: '<i class="fas fa-user-circle"></i>',
                            iconSize: [30, 30]
                        })
                    }).addTo(map)
                    .bindPopup('Tu ubicación actual')
                    .openPopup();

                } catch (error) {
                    console.error('Error al obtener detalles de ubicación:', error);
                }

                btnUbicacion.disabled = false;
                btnUbicacion.innerHTML = '<i class="fas fa-map-marker-alt"></i> Usar ubicación actual';
            },
            function(error) {
                console.error('Error de geolocalización:', error);
                let mensaje = 'Error al obtener tu ubicación: ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        mensaje += 'Permiso denegado';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        mensaje += 'Ubicación no disponible';
                        break;
                    case error.TIMEOUT:
                        mensaje += 'Tiempo de espera agotado';
                        break;
                    default:
                        mensaje += 'Error desconocido';
                }
                alert(mensaje);
                btnUbicacion.disabled = false;
                btnUbicacion.innerHTML = '<i class="fas fa-map-marker-alt"></i> Usar ubicación actual';
            },
            options
        );
    } else {
        alert('Tu navegador no soporta geolocalización');
    }
}

// Función para mostrar el perfil
function mostrarPerfil() {
    console.log('Función mostrarPerfil llamada'); // Debug
    const modalPerfil = document.getElementById('ventanaPerfil');
    console.log('Modal encontrado:', modalPerfil); // Debug
    
    if (!modalPerfil) {
        console.error('No se encontró el modal del perfil');
        return;
    }
    
    console.log('Mostrando modal...'); // Debug
    modalPerfil.style.display = 'flex'; // Cambiado de 'block' a 'flex'
    modalPerfil.classList.add('mostrar'); // Añadido clase mostrar
}

// Función para cerrar el perfil
function cerrarPerfil() {
    const modalPerfil = document.getElementById('ventanaPerfil');
    if (modalPerfil) {
        modalPerfil.style.display = 'none';
        modalPerfil.classList.remove('mostrar');
    }
}

// Unificar todos los event listeners en un solo DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Cargado');
    
    // Inicializar mapa y cargar eventos
    initMap();
    cargarEventos();
    
    // Event listeners para filtros
    const filtros = {
        categoria: document.getElementById('categoria'),
        localizacion: document.getElementById('localizacion'),
        fechaInicio: document.getElementById('fechaEventoInicio'),
        fechaFin: document.getElementById('fechaEventoFin'),
        ubicacionBtn: document.getElementById('ubicacionActual'),
        filtrarBtn: document.getElementById('filtrar')
    };

    // Añadir event listeners para filtros
    if (filtros.categoria) {
        filtros.categoria.addEventListener('change', filtrarEventos);
    }
    if (filtros.localizacion) {
        filtros.localizacion.addEventListener('input', filtrarEventos);
    }
    if (filtros.fechaInicio) {
        filtros.fechaInicio.addEventListener('change', filtrarEventos);
    }
    if (filtros.fechaFin) {
        filtros.fechaFin.addEventListener('change', filtrarEventos);
    }
    if (filtros.ubicacionBtn) {
        filtros.ubicacionBtn.addEventListener('click', usarUbicacionActual);
    }
    if (filtros.filtrarBtn) {
        filtros.filtrarBtn.addEventListener('click', filtrarEventos);
    }

    // Event listeners para perfil
    const btnPerfil = document.getElementById('mostrarPerfil');
    if (btnPerfil) {
        btnPerfil.onclick = function(e) {
            e.preventDefault();
            mostrarPerfil();
        };
    }

    const btnCerrar = document.querySelector('#ventanaPerfil .cerrar');
    if (btnCerrar) {
        btnCerrar.onclick = cerrarPerfil;
    }

    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        const modalPerfil = document.getElementById('ventanaPerfil');
        if (event.target === modalPerfil) {
            cerrarPerfil();
        }
    };

    console.log('Event listeners configurados');
});

// Función mejorada para mostrar eventos en el mapa
function mostrarEventosEnMapa(eventos) {
    if (!map) return;

    // Limpiar marcadores existentes
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Grupo para todos los marcadores
    const markersGroup = L.featureGroup();

    // Procesar cada evento
    eventos.forEach(async (evento) => {
        let coords;
        if (evento.lat && evento.lng) {
            coords = { lat: evento.lat, lng: evento.lng };
        } else {
            coords = await geocodificarDireccion(evento.direccion || evento.localizacion);
        }

        if (coords) {
            // Crear icono personalizado según la categoría
            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="marker-pin ${evento.categoria}">
                        <i class="${obtenerIconoCategoria(evento.categoria)}"></i>
                      </div>`,
                iconSize: [30, 42],
                iconAnchor: [15, 42],
                popupAnchor: [0, -42]
            });

            // Crear marcador
            const marker = L.marker([coords.lat, coords.lng], { icon })
                .bindPopup(`
                    <div class="evento-popup">
                        <h3>${evento.nombre}</h3>
                        <p><i class="fas fa-calendar"></i> ${new Date(evento.fecha).toLocaleDateString()}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${evento.direccion || evento.localizacion}</p>
                        <p><i class="fas fa-tag"></i> ${evento.categoria}</p>
                        ${evento.descripcion ? `<p><i class="fas fa-info-circle"></i> ${evento.descripcion}</p>` : ''}
                        ${evento.telefono_contacto ? `<p><i class="fas fa-phone"></i> ${evento.telefono_contacto}</p>` : ''}
                        <button onclick="centrarEnEvento(${coords.lat}, ${coords.lng})" class="btn-ver-ubicacion">
                            Ver ubicación
                        </button>
                    </div>
                `);

            markersGroup.addLayer(marker);
        }
    });

    // Añadir grupo al mapa
    markersGroup.addTo(map);

    // Ajustar vista a todos los marcadores si hay alguno
    if (markersGroup.getLayers().length > 0) {
        map.fitBounds(markersGroup.getBounds().pad(0.1));
    }
}

// Función para centrar el mapa en una ubicación específica
function centrarEnEvento(lat, lng) {
    map.setView([lat, lng], 16, {
        animate: true,
        duration: 1
    });
}

function obtenerIconoCategoria(categoria) {
    const iconos = {
        musica: 'fas fa-music',
        deporte: 'fas fa-futbol',
        arte: 'fas fa-palette',
        cine: 'fas fa-film',
        cafeteria: 'fas fa-coffee',
        restaurante: 'fas fa-utensils'
    };
    return iconos[categoria] || 'fas fa-calendar-alt';
}

// Función de filtrado actualizada
async function filtrarEventos() {
    console.log('Filtrando eventos...'); // Debug
    const categoria = document.getElementById('categoria').value;
    const localizacion = document.getElementById('localizacion').value;
    const fechaInicio = document.getElementById('fechaEventoInicio').value;
    const fechaFin = document.getElementById('fechaEventoFin').value;

    console.log('Valores de filtros:', { categoria, localizacion, fechaInicio, fechaFin }); // Debug

    // Filtrar eventos
    const eventosFiltrados = eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        const cumpleFiltros = 
            (!categoria || evento.categoria === categoria) &&
            (!localizacion || evento.localizacion.toLowerCase().includes(localizacion.toLowerCase())) &&
            (!fechaInicio || fechaEvento >= new Date(fechaInicio)) &&
            (!fechaFin || fechaEvento <= new Date(fechaFin));
        return cumpleFiltros;
    });

    console.log('Eventos filtrados:', eventosFiltrados.length); // Debug

    // Si hay una localización, intentar centrar el mapa
    if (localizacion) {
        const coords = await geocodificarDireccion(localizacion);
        if (coords) {
            map.setView([coords.lat, coords.lng], 13);
        }
    }

    // Mostrar eventos filtrados
    mostrarEventos(eventosFiltrados);
    mostrarEventosEnMapa(eventosFiltrados);
}

// Función para editar evento
window.editEvento = async function(eventoId) {
    try {
        const response = await fetch(`/api/events/${eventoId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener evento');
        }

        const evento = await response.json();
        
        // Limpiar cualquier ID anterior que pudiera existir
        const oldIdInput = document.getElementById('eventoId');
        if (oldIdInput) {
            oldIdInput.remove();
        }

        // Rellenar el formulario
        const form = document.getElementById('eventoForm');
        form.reset(); // Limpiar el formulario primero

        document.getElementById('nombreEvento').value = evento.nombre || '';
        document.getElementById('categoriaEvento').value = evento.categoria || '';
        document.getElementById('fechaEvento').value = evento.fecha ? new Date(evento.fecha).toISOString().slice(0, 16) : '';
        document.getElementById('localizacionEvento').value = evento.localizacion || '';
        document.getElementById('direccionEvento').value = evento.direccion || '';
        document.getElementById('descripcionEvento').value = evento.descripcion || '';
        document.getElementById('telefonoEvento').value = evento.telefono_contacto || '';
        document.getElementById('organizadorEvento').value = evento.organizador || '';
        document.getElementById('precioEvento').value = evento.precio || 0;

        // Crear y añadir el campo oculto con el ID
        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.id = 'eventoId';
        idInput.name = 'eventoId'; // Añadir name también
        idInput.value = evento.id;
        form.appendChild(idInput);

        // Mostrar el modal
        const modal = document.getElementById('eventoModal');
        if (modal) {
            document.querySelector('#eventoModal h2').textContent = 'Editar Evento';
            modal.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos del evento');
    }
}

// Manejador del formulario
document.getElementById('eventoForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const eventoId = form.querySelector('#eventoId')?.value;
    const isEdit = !!eventoId;

    console.log('Modo:', isEdit ? 'edición' : 'creación');
    console.log('ID del evento:', eventoId);

    const eventoData = {
        nombre: form.querySelector('#nombreEvento').value.trim(),
        categoria: form.querySelector('#categoriaEvento').value,
        fecha: form.querySelector('#fechaEvento').value,
        localizacion: form.querySelector('#localizacionEvento').value.trim(),
        direccion: form.querySelector('#direccionEvento').value.trim(),
        descripcion: form.querySelector('#descripcionEvento').value.trim(),
        telefono_contacto: form.querySelector('#telefonoEvento').value.trim(),
        organizador: form.querySelector('#organizadorEvento').value.trim(),
        precio: parseFloat(form.querySelector('#precioEvento').value) || 0
    };

    try {
        const url = isEdit ? `/api/events/${eventoId}` : '/api/events';
        const method = isEdit ? 'PUT' : 'POST';

        console.log('URL:', url);
        console.log('Método:', method);
        console.log('Datos a enviar:', eventoData);

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(eventoData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Error al ${isEdit ? 'actualizar' : 'crear'} el evento`);
        }

        // Limpiar formulario y cerrar modal
        form.reset();
        const idInput = form.querySelector('#eventoId');
        if (idInput) {
            idInput.remove();
        }

        const modal = document.getElementById('eventoModal');
        if (modal) {
            modal.style.display = 'none';
            document.querySelector('#eventoModal h2').textContent = 'Crear Evento';
        }

        // Recargar eventos
        await cargarEventos();
        
        // Mensaje específico según la acción realizada
        if (isEdit) {
            alert(`El evento "${eventoData.nombre}" ha sido actualizado correctamente`);
        } else {
            alert(`El evento "${eventoData.nombre}" ha sido creado correctamente`);
        }
    } catch (error) {
        console.error('Error completo:', error);
        alert(error.message);
    }
});

// Función para eliminar evento
window.deleteEvento = async function(eventoId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) return;

    try {
        const response = await fetch(`/api/events/${eventoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Error al eliminar evento');
        }

        await cargarEventos();
        alert('Evento eliminado correctamente');
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}