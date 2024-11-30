let eventos = [
    { 
        id: 1, 
        nombre: "Concierto de Rock", 
        categoria: "musica", 
        subcategoria: "rock", 
        edad: "jovenes", 
        personas: 100, 
        localizacion: "Madrid", 
        organizador: "Juan", 
        fecha: "2023-06-15T20:00", 
        imagen: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 2, 
        nombre: "Partido de Fútbol", 
        categoria: "deporte", 
        subcategoria: "futbol", 
        edad: "adultos", 
        personas: 50, 
        localizacion: "Barcelona", 
        organizador: "María", 
        fecha: "2023-06-20T16:00", 
        imagen: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 3, 
        nombre: "Exposición de Arte Moderno", 
        categoria: "arte", 
        subcategoria: "pintura", 
        edad: "adultos", 
        personas: 30, 
        localizacion: "Valencia", 
        organizador: "Carlos", 
        fecha: "2023-06-25T10:00", 
        imagen: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 4, 
        nombre: "Taller de Pintura para Niños", 
        categoria: "arte", 
        subcategoria: "pintura", 
        edad: "niños", 
        personas: 15, 
        localizacion: "Sevilla", 
        organizador: "Ana", 
        fecha: "2023-07-01T11:00", 
        imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 5, 
        nombre: "Festival de Jazz", 
        categoria: "musica", 
        subcategoria: "jazz", 
        edad: "adultos", 
        personas: 200, 
        localizacion: "Madrid", 
        organizador: "Pedro", 
        fecha: "2023-07-10T19:00", 
        imagen: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 6, 
        nombre: "Maratón Urbano", 
        categoria: "deporte", 
        subcategoria: "atletismo", 
        edad: "adultos", 
        personas: 1000, 
        localizacion: "Barcelona", 
        organizador: "Laura", 
        fecha: "2023-07-15T08:00", 
        imagen: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 7, 
        nombre: "Cine al Aire Libre", 
        categoria: "cine", 
        subcategoria: "clásicos", 
        edad: "todas_las_edades", 
        personas: 150, 
        localizacion: "Valencia", 
        organizador: "Miguel", 
        fecha: "2023-07-20T21:00", 
        imagen: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 8, 
        nombre: "Noche de Comedia", 
        categoria: "arte", 
        subcategoria: "stand-up", 
        edad: "adultos", 
        personas: 80, 
        localizacion: "Madrid", 
        organizador: "Sara", 
        fecha: "2023-07-25T22:00", 
        imagen: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 9, 
        nombre: "Degustación de Café", 
        categoria: "cafeteria", 
        subcategoria: "cata", 
        edad: "adultos", 
        personas: 25, 
        localizacion: "Sevilla", 
        organizador: "Javier", 
        fecha: "2023-08-01T16:00", 
        imagen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 10, 
        nombre: "Festival Gastronómico", 
        categoria: "restaurante", 
        subcategoria: "internacional", 
        edad: "todas_las_edades", 
        personas: 500, 
        localizacion: "Barcelona", 
        organizador: "Elena", 
        fecha: "2023-08-05T12:00", 
        imagen: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 11, 
        nombre: "Concierto de Pop", 
        categoria: "musica", 
        subcategoria: "pop", 
        edad: "jovenes", 
        personas: 150, 
        localizacion: "Málaga", 
        organizador: "Laura", 
        fecha: "2023-08-10T20:00", 
        imagen: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    },
    { 
        id: 12, 
        nombre: "Torneo de Baloncesto", 
        categoria: "deporte", 
        subcategoria: "baloncesto", 
        edad: "jovenes", 
        personas: 80, 
        localizacion: "Zaragoza", 
        organizador: "Carlos", 
        fecha: "2023-08-15T10:00", 
        imagen: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
    }
];

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

function mostrarEventos(eventos) {
    const eventosContainer = document.getElementById('eventos');
    eventosContainer.innerHTML = eventos.map(evento => `
        <div class="evento">
            <div class="evento-banner" style="background-image: url('${evento.imagen || 'https://via.placeholder.com/300x150'}')"></div>
            <span class="evento-categoria categoria-${evento.categoria}">${evento.categoria}</span>
            <h3>${evento.nombre}</h3>
            <p><i class="fas fa-calendar"></i> ${new Date(evento.fecha).toLocaleDateString()}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${evento.localizacion}</p>
            <p><i class="fas fa-euro-sign"></i> ${evento.precio || 'Gratis'}</p>
            <button class="btn-ver-mas" onclick="verDetallesEvento('${evento.id}')">Ver más</button>
        </div>
    `).join('');
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

// Función para abrir el modal de nuevo evento
function abrirModalEvento() {
    console.log('Intentando abrir modal de nuevo evento'); // Debug
    const modal = document.getElementById('formularioEvento');
    console.log('Modal encontrado:', modal); // Debug
    
    if (modal) {
        modal.style.display = 'flex';
        modal.style.zIndex = '10000'; // Asegurarnos que está por encima
        console.log('Modal abierto, display:', modal.style.display); // Debug
    }
}

// Función para cerrar el modal de nuevo evento
function cerrarModalEvento() {
    const modal = document.getElementById('formularioEvento');
    if (modal) {
        modal.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Cargado'); // Debug
    
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

    // Event listeners para el modal de nuevo evento
    const btnAbrirFormulario = document.getElementById('abrirFormulario');
    if (btnAbrirFormulario) {
        btnAbrirFormulario.removeEventListener('click', abrirModalEvento); // Remover listeners previos
        btnAbrirFormulario.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Evitar propagación
            console.log('Click en botón nuevo evento'); // Debug
            abrirModalEvento();
        });
    }

    // Event listener para cerrar el modal
    const btnCerrarFormulario = document.querySelector('#formularioEvento .cerrar');
    if (btnCerrarFormulario) {
        btnCerrarFormulario.removeEventListener('click', cerrarModalEvento); // Remover listeners previos
        btnCerrarFormulario.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Evitar propagación
            cerrarModalEvento();
        });
    }
});

function mostrarEventosEnMapa(eventos) {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    eventos.forEach(evento => {
        // Coordenadas aleatorias en España
        const lat = 36 + Math.random() * 8; // Entre 36 y 44 grados de latitud
        const lng = -9 + Math.random() * 12; // Entre -9 y 3 grados de longitud
        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${evento.nombre}</b><br>${evento.fecha}`);
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
    const subcategoria = document.getElementById('subcategoria').value;
    const edad = document.getElementById('edad').value;
    const personasMin = parseInt(document.getElementById('personasMin').value) || 0;
    const personasMax = parseInt(document.getElementById('personasMax').value) || Infinity;
    const localizacion = document.getElementById('localizacion').value.toLowerCase();
    const fechaInicio = document.getElementById('fechaEventoInicio').value;
    const fechaFin = document.getElementById('fechaEventoFin').value;

    const eventosFiltrados = eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        return (!categoria || evento.categoria === categoria) &&
               (!subcategoria || evento.subcategoria === subcategoria) &&
               (!edad || evento.edad === edad) &&
               (evento.personas >= personasMin && evento.personas <= personasMax) &&
               (!localizacion || evento.localizacion.toLowerCase().includes(localizacion)) &&
               (!fechaInicio || fechaEvento >= new Date(fechaInicio)) &&
               (!fechaFin || fechaEvento <= new Date(fechaFin));
    });

    mostrarEventos(eventosFiltrados);
    mostrarEventosEnMapa(eventosFiltrados);
}