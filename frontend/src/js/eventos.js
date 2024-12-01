let eventos = [];  // Ahora empezará vacío

let usuarioActual = {
    // ... objeto de usuario ...
};

const subcategorias = {
    // ... objeto de subcategorías ...
};

let map, userMarker;

function initMap() {
    map = L.map('mapa').setView([40.416775, -3.703790], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
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

function usarUbicacionActual() {
    if ("geolocation" in navigator) {
        const btnUbicacion = document.getElementById('ubicacionActual');
        btnUbicacion.disabled = true;
        btnUbicacion.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo ubicación...';

        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;

                // Centrar el mapa en la ubicación actual
                map.setView([lat, lng], 13);

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
                .bindPopup('¡Estás aquí!')
                .openPopup();

                btnUbicacion.disabled = false;
                btnUbicacion.innerHTML = '<i class="fas fa-map-marker-alt"></i> Usar ubicación actual';
            },
            function(error) {
                let mensaje = 'No pudimos obtener tu ubicación. ';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        mensaje += 'Has denegado el permiso de ubicación.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        mensaje += 'La información de ubicación no está disponible.';
                        break;
                    case error.TIMEOUT:
                        mensaje += 'Se agotó el tiempo de espera para obtener la ubicación.';
                        break;
                    default:
                        mensaje += 'Ocurrió un error desconocido.';
                }
                alert(mensaje);
                btnUbicacion.disabled = false;
                btnUbicacion.innerHTML = '<i class="fas fa-map-marker-alt"></i> Usar ubicación actual';
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        alert('Lo sentimos, tu navegador no soporta geolocalización');
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Cargado');
    
    initMap();
    cargarEventos();
    
    const btnPerfil = document.getElementById('mostrarPerfil');
    console.log('Botón perfil encontrado:', btnPerfil); // Debug
    
    if (btnPerfil) {
        console.log('Añadiendo event listener al botón'); // Debug
        btnPerfil.onclick = function(e) {
            e.preventDefault();
            console.log('Botón clickeado'); // Debug
            mostrarPerfil();
        };
    } else {
        console.error('No se encontró el botón de perfil');
    }

    // Añadir event listener para cerrar el modal
    const btnCerrar = document.querySelector('#ventanaPerfil .cerrar');
    if (btnCerrar) {
        btnCerrar.onclick = function() {
            cerrarPerfil();
        };
    }

    // Cerrar modal al hacer clic fuera
    window.onclick = function(event) {
        const modalPerfil = document.getElementById('ventanaPerfil');
        if (event.target === modalPerfil) {
            cerrarPerfil();
        }
    };

    // Restaurar la inicialización del mapa y eventos
    initMap();
    mostrarEventos(eventos);
    mostrarEventosEnMapa(eventos);
    actualizarSubcategorias();
});

function mostrarEventosEnMapa(eventos) {
    if (!map) return;

    // Limpiar marcadores existentes
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Añadir nuevos marcadores
    eventos.forEach(evento => {
        if (evento.lat && evento.lng) {
            L.marker([evento.lat, evento.lng])
                .addTo(map)
                .bindPopup(`
                    <b>${evento.nombre}</b><br>
                    ${evento.localizacion}<br>
                    ${new Date(evento.fecha).toLocaleDateString()}
                `);
        }
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

function filtrarEventos() {
    const categoria = document.getElementById('categoria').value;
    const localizacion = document.getElementById('localizacion').value.toLowerCase();
    const fechaInicio = document.getElementById('fechaEventoInicio').value;
    const fechaFin = document.getElementById('fechaEventoFin').value;

    const eventosFiltrados = eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        return (!categoria || evento.categoria === categoria) &&
               (!localizacion || evento.localizacion.toLowerCase().includes(localizacion)) &&
               (!fechaInicio || fechaEvento >= new Date(fechaInicio)) &&
               (!fechaFin || fechaEvento <= new Date(fechaFin));
    });

    mostrarEventos(eventosFiltrados);
    mostrarEventosEnMapa(eventosFiltrados);
}

// Añadir evento change al select de categorías
document.getElementById('categoria').addEventListener('change', filtrarEventos);