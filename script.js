let map;

// Datos de ejemplo
const eventos = [
    { id: 1, nombre: "Concierto de Rock", categoria: "musica", subcategoria: "rock", edad: "jovenes", personas: 100, localizacion: "Madrid", organizador: "Juan", fecha: "2023-06-15T20:00", imagen: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 2, nombre: "Partido de Fútbol", categoria: "deporte", subcategoria: "fútbol", edad: "adultos", personas: 50, localizacion: "Barcelona", organizador: "María", fecha: "2023-06-20T16:00", imagen: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 3, nombre: "Exposición de Arte", categoria: "arte", subcategoria: "pintura", edad: "adultos", personas: 30, localizacion: "Valencia", organizador: "Carlos", fecha: "2023-06-25T10:00", imagen: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }
];

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