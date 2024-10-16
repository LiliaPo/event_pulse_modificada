// Datos de ejemplo (en una aplicación real, estos datos vendrían de una API o base de datos)
let eventos = [
    { id: 1, nombre: "Concierto de Rock", categoria: "musica", subcategoria: "rock", edad: "jovenes", personas: 100, localizacion: "Madrid", organizador: "Juan", fecha: "2023-06-15T20:00", imagen: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 2, nombre: "Partido de Fútbol", categoria: "deporte", subcategoria: "fútbol", edad: "adultos", personas: 50, localizacion: "Barcelona", organizador: "María", fecha: "2023-06-20T16:00", imagen: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 3, nombre: "Exposición de Arte Moderno", categoria: "arte", subcategoria: "pintura", edad: "adultos", personas: 30, localizacion: "Valencia", organizador: "Carlos", fecha: "2023-06-25T10:00", imagen: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 4, nombre: "Taller de Pintura para Niños", categoria: "arte", subcategoria: "pintura", edad: "niños", personas: 15, localizacion: "Sevilla", organizador: "Ana", fecha: "2023-07-01T11:00", imagen: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 5, nombre: "Festival de Jazz", categoria: "musica", subcategoria: "jazz", edad: "adultos", personas: 200, localizacion: "Madrid", organizador: "Pedro", fecha: "2023-07-10T19:00", imagen: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 6, nombre: "Maratón Urbano", categoria: "deporte", subcategoria: "atletismo", edad: "adultos", personas: 1000, localizacion: "Barcelona", organizador: "Laura", fecha: "2023-07-15T08:00", imagen: "https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 7, nombre: "Cine al Aire Libre", categoria: "cine", subcategoria: "clásicos", edad: "todas_las_edades", personas: 150, localizacion: "Valencia", organizador: "Miguel", fecha: "2023-07-20T21:00", imagen: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 8, nombre: "Noche de Comedia", categoria: "arte", subcategoria: "stand-up", edad: "adultos", personas: 80, localizacion: "Madrid", organizador: "Sara", fecha: "2023-07-25T22:00", imagen: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 9, nombre: "Degustación de Café", categoria: "cafeteria", subcategoria: "cata", edad: "adultos", personas: 25, localizacion: "Sevilla", organizador: "Javier", fecha: "2023-08-01T16:00", imagen: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 10, nombre: "Festival Gastronómico", categoria: "restaurante", subcategoria: "internacional", edad: "todas_las_edades", personas: 500, localizacion: "Barcelona", organizador: "Elena", fecha: "2023-08-05T12:00", imagen: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 11, nombre: "Concierto de Pop", categoria: "musica", subcategoria: "pop", edad: "jovenes", personas: 150, localizacion: "Málaga", organizador: "Laura", fecha: "2023-08-10T20:00", imagen: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 12, nombre: "Torneo de Baloncesto", categoria: "deporte", subcategoria: "baloncesto", edad: "jovenes", personas: 80, localizacion: "Zaragoza", organizador: "Carlos", fecha: "2023-08-15T10:00", imagen: "https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }
];

let usuarioActual = {
    nombre: '',
    email: '',
    telefono: '',
    whatsapp: '',
    instagram: '',
    imagenPerfil: ''
};

const subcategorias = {
    musica: ['Rock', 'Pop', 'Jazz', 'Clásica', 'Electrónica', 'Hip Hop', 'Reggae', 'Otro'],
    deporte: ['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Atletismo', 'Ciclismo', 'Yoga', 'Otro'],
    arte: ['Pintura', 'Escultura', 'Fotografa', 'Teatro', 'Danza', 'Literatura', 'Cine', 'Otro'],
    cine: ['Acción', 'Comedia', 'Drama', 'Ciencia Ficción', 'Terror', 'Documental', 'Animación', 'Otro'],
    cafeteria: ['Café Especialidad', 'Té', 'Repostería', 'Brunch', 'Lectura', 'Trabajo', 'Reuniones', 'Otro'],
    restaurante: ['Italiana', 'Japonesa', 'Mexicana', 'Vegetariana', 'Mariscos', 'Parrilla', 'Fusión', 'Otro']
};

let map, userMarker;

function initMap() {
    map = L.map('mapa').setView([40.416775, -3.703790], 13);
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
            <h3><i class="evento-icono ${obtenerIconoCategoria(evento.categoria)}"></i>${evento.nombre}</h3>
            <p><i class="fas fa-calendar"></i> ${new Date(evento.fecha).toLocaleDateString()}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${evento.localizacion}</p>
            <button class="btn-ver-mas" data-id="${evento.id}">Ver más</button>
        `;
        contenedorEventos.appendChild(eventoElement);
    });

    // Añadir event listeners a los botones "Ver más"
    document.querySelectorAll('.btn-ver-mas').forEach(btn => {
        btn.addEventListener('click', (e) => mostrarDetallesEvento(e.target.dataset.id));
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

function mostrarDetallesEvento(eventoId) {
    const evento = eventos.find(e => e.id == eventoId);
    if (!evento) return;

    const modal = document.getElementById('modalEvento');
    const tituloEvento = document.getElementById('tituloEvento');
    const detallesEvento = document.getElementById('detallesEvento');

    tituloEvento.textContent = evento.nombre;
    detallesEvento.innerHTML = `
        <p><strong>Categoría:</strong> ${evento.categoria}</p>
        <p><strong>Subcategoría:</strong> ${evento.subcategoria}</p>
        <p><strong>Fecha:</strong> ${new Date(evento.fecha).toLocaleString()}</p>
        <p><strong>Localización:</strong> ${evento.localizacion}</p>
        <p><strong>Organizador:</strong> ${evento.organizador}</p>
        <p><strong>Capacidad:</strong> ${evento.personas} personas</p>
        <p><strong>Descripción:</strong> ${evento.descripcion || 'No hay descripción disponible.'}</p>
    `;

    modal.style.display = 'block';

    // Cerrar el modal
    const span = modal.querySelector('.cerrar');
    span.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Botón para ir al foro
    const btnIrAlForo = document.getElementById('irAlForo');
    btnIrAlForo.onclick = function() {
        modal.style.display = 'none';
        abrirForo(eventoId);
    }
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

function añadirEvento(e) {
    e.preventDefault();
    const nuevoEvento = {
        id: eventos.length + 1,
        nombre: document.getElementById('nuevoNombre').value,
        categoria: document.querySelector('input[name="categoria"]:checked').value,
        subcategoria: document.getElementById('nuevoSubcategoria').value,
        edad: document.getElementById('nuevoEdad').value,
        personas: parseInt(document.getElementById('nuevoPersonas').value),
        localizacion: document.getElementById('nuevoLocalizacion').value,
        fecha: document.getElementById('nuevoFecha').value,
        descripcion: document.getElementById('nuevoDescripcion').value,
        organizador: usuarioActual.nombre || "Usuario",
        imagen: `https://source.unsplash.com/300x200/?${document.querySelector('input[name="categoria"]:checked').value}`
    };
    eventos.push(nuevoEvento);
    mostrarEventos(eventos);
    mostrarEventosEnMapa(eventos);
    document.getElementById('formularioEvento').style.display = 'none';
    e.target.reset();
}

function mostrarPersonasSimilares(eventosFiltrados) {
    const personasSimilares = new Set();
    eventosFiltrados.forEach(evento => {
        eventos.forEach(e => {
            if (e.id !== evento.id && e.categoria === evento.categoria && e.organizador !== evento.organizador) {
                personasSimilares.add(e.organizador);
            }
        });
    });

    const contenedorPersonas = document.getElementById('personasSimilares');
    contenedorPersonas.innerHTML = Array.from(personasSimilares).map(persona => `
        <div class="persona-card">
            <img src="${persona.imagenPerfil || 'https://via.placeholder.com/100'}" alt="${persona.nombre}">
            <h3>${persona.nombre}</h3>
            <div class="contacto">
                ${persona.email ? `<a href="mailto:${persona.email}">Email</a>` : ''}
                ${persona.telefono ? `<a href="tel:${persona.telefono}">Teléfono</a>` : ''}
                ${persona.whatsapp ? `<a href="https://wa.me/${persona.whatsapp}">WhatsApp</a>` : ''}
                ${persona.instagram ? `<a href="https://www.instagram.com/${persona.instagram}">Instagram</a>` : ''}
            </div>
        </div>
    `).join('');
}

// Añadir mensajes de ejemplo para cada categoría
const mensajesEjemplo = {
    musica: [
        { nombre: "Organizador", mensaje: "¡Bienvenidos al foro del evento musical! Recuerden traer protección auditiva." },
        { nombre: "Organizador", mensaje: "Habrá puestos de comida y bebida disponibles en el lugar." }
    ],
    deporte: [
        { nombre: "Organizador", mensaje: "¡Bienvenidos al foro del evento deportivo! No olviden traer ropa cómoda y agua." },
        { nombre: "Organizador", mensaje: "Habrá vestuarios disponibles para cambiarse." }
    ],
    arte: [
        { nombre: "Organizador", mensaje: "¡Bienvenidos al foro del evento artístico! Disfruten de las obras expuestas." },
        { nombre: "Organizador", mensaje: "Por favor, no toquen las obras de arte sin permiso." }
    ],
    cine: [
        { nombre: "Organizador", mensaje: "¡Bienvenidos al foro del evento cinematográfico! La función comenzará puntualmente." },
        { nombre: "Organizador", mensaje: "Recuerden silenciar sus teléfonos durante la proyección." }
    ],
    cafeteria: [
        { nombre: "Organizador", mensaje: "¡Bienvenidos al foro del evento en la cafetería! Disfruten de nuestras especialidades." },
        { nombre: "Organizador", mensaje: "Tenemos opciones veganas y sin gluten disponibles." }
    ],
    restaurante: [
        { nombre: "Organizador", mensaje: "¡Bienvenidos al foro del evento gastronómico! Esperamos que disfruten de nuestro menú." },
        { nombre: "Organizador", mensaje: "Si tienen alguna alergia alimentaria, por favor infórmenlo al personal." }
    ]
};

function abrirForo(eventoId) {
    const evento = eventos.find(e => e.id == eventoId);
    if (!evento) return;

    const ventanaForo = document.getElementById('ventanaForo');
    const tituloEventoForo = document.getElementById('tituloEventoForo');
    const detallesEvento = document.getElementById('detallesEvento');
    const chatForo = document.getElementById('chatForo');

    tituloEventoForo.textContent = evento.nombre;
    detallesEvento.innerHTML = `
        <p>Categoría: ${evento.categoria}</p>
        <p>Subcategoría: ${evento.subcategoria}</p>
        <p>Fecha: ${new Date(evento.fecha).toLocaleString()}</p>
        <p>Localización: ${evento.localizacion}</p>
        <p>Organizador: ${evento.organizador}</p>
    `;

    // Cargar mensajes de ejemplo
    chatForo.innerHTML = '';
    if (mensajesEjemplo[evento.categoria]) {
        mensajesEjemplo[evento.categoria].forEach(msg => {
            chatForo.innerHTML += `<p><strong>${msg.nombre}:</strong> ${msg.mensaje}</p>`;
        });
    }
    chatForo.innerHTML += '<p>Bienvenido al foro del evento. ¡Comienza a chatear!</p>';

    ventanaForo.style.display = 'block';

    // Añadir evento para cerrar la ventana del foro
    const cerrarForo = ventanaForo.querySelector('.cerrar');
    cerrarForo.addEventListener('click', function() {
        ventanaForo.style.display = 'none';
    });

    // Cerrar la ventana del foro al hacer clic fuera de ella
    window.addEventListener('click', function(event) {
        if (event.target == ventanaForo) {
            ventanaForo.style.display = 'none';
        }
    });
}

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

function usarUbicacionActual() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            map.setView([lat, lng], 13);
            if (userMarker) {
                map.removeLayer(userMarker);
            }
            userMarker = L.marker([lat, lng]).addTo(map);
            document.getElementById('localizacion').value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            filtrarEventos();
        });
    } else {
        alert("Geolocalización no está disponible en tu navegador.");
    }
}

function actualizarSubcategorias() {
    const categoriaSelect = document.getElementById('categoria');
    const subcategoriaSelect = document.getElementById('subcategoria');
    const categoria = categoriaSelect.value;

    subcategoriaSelect.innerHTML = '<option value="">Todas las subcategorías</option>';
    if (categoria && subcategorias[categoria]) {
        subcategorias[categoria].forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.toLowerCase();
            option.textContent = sub;
            subcategoriaSelect.appendChild(option);
        });
        subcategoriaSelect.disabled = false;
    } else {
        subcategoriaSelect.disabled = true;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const entrarBtn = document.getElementById('entrar');
    const portada = document.getElementById('portada');
    const contenido = document.getElementById('contenido');
    const modalEvento = document.getElementById('formularioEvento');
    const modalPerfil = document.getElementById('ventanaPerfil');
    const abrirFormulario = document.getElementById('abrirFormulario');
    const btnMostrarPerfil = document.getElementById('mostrarPerfil');
    const cerrarModalEvento = modalEvento.querySelector('.cerrar');
    const cerrarModalPerfil = modalPerfil.querySelector('.cerrar');
    const categoriaSelect = document.getElementById('categoria');
    const imagenPerfil = document.getElementById('imagenPerfil');
    const imagenPerfilPreview = document.getElementById('imagenPerfilPreview');
    const imagenPerfilNav = document.getElementById('imagenPerfilNav');

    entrarBtn.addEventListener('click', function() {
        portada.style.display = 'none';
        contenido.style.display = 'block';
    });

    abrirFormulario.addEventListener('click', function() {
        modalEvento.style.display = 'block';
    });

    btnMostrarPerfil.addEventListener('click', function() {
        modalPerfil.style.display = 'block';
    });

    cerrarModalEvento.addEventListener('click', function() {
        modalEvento.style.display = 'none';
    });

    cerrarModalPerfil.addEventListener('click', function() {
        modalPerfil.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modalEvento) {
            modalEvento.style.display = 'none';
        }
        if (event.target == modalPerfil) {
            modalPerfil.style.display = 'none';
        }
    });

    const categoriaRadios = document.querySelectorAll('input[name="categoria"]');
    const nuevoSubcategoriaSelect = document.getElementById('nuevoSubcategoria');

    categoriaRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const categoria = this.value;
            nuevoSubcategoriaSelect.innerHTML = '<option value="">Selecciona subcategoría</option>';
            subcategorias[categoria].forEach(sub => {
                const option = document.createElement('option');
                option.value = sub.toLowerCase();
                option.textContent = sub;
                nuevoSubcategoriaSelect.appendChild(option);
            });
        });
    });

    document.getElementById('filtrar').addEventListener('click', filtrarEventos);
    document.getElementById('nuevoEventoForm').addEventListener('submit', añadirEvento);

    const perfilUsuario = document.getElementById('perfilUsuario');
    const seccionEventos = document.getElementById('seccionEventos');
    const perfilForm = document.getElementById('perfilForm');

    btnMostrarPerfil.addEventListener('click', function() {
        perfilUsuario.style.display = 'block';
        seccionEventos.style.display = 'none';
    });

    perfilForm.addEventListener('submit', function(e) {
        e.preventDefault();
        usuarioActual.nombre = document.getElementById('nombreUsuario').value;
        usuarioActual.email = document.getElementById('emailUsuario').value;
        usuarioActual.telefono = document.getElementById('telefonoUsuario').value;
        usuarioActual.whatsapp = document.getElementById('whatsappUsuario').value;
        usuarioActual.instagram = document.getElementById('instagramUsuario').value;
        usuarioActual.formasContacto = Array.from(document.querySelectorAll('input[name="contacto"]:checked')).map(input => input.value);

        const imagenPerfilFile = document.getElementById('imagenPerfil').files[0];
        if (imagenPerfilFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                usuarioActual.imagenPerfil = e.target.result;
                imagenPerfilPreview.src = e.target.result;
                imagenPerfilNav.src = e.target.result;
            };
            reader.readAsDataURL(imagenPerfilFile);
        }

        alert('Perfil guardado con éxito');
        modalPerfil.style.display = 'none';
    });

    categoriaSelect.addEventListener('change', actualizarSubcategorias);

    imagenPerfil.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagenPerfilPreview.src = e.target.result;
                imagenPerfilNav.src = e.target.result;
                usuarioActual.imagenPerfil = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const formMensaje = document.getElementById('formMensaje');
    formMensaje.addEventListener('submit', function(e) {
        e.preventDefault();
        const mensaje = document.getElementById('mensajeChat').value;
        const chatForo = document.getElementById('chatForo');
        chatForo.innerHTML += `<p><strong>${usuarioActual.nombre}:</strong> ${mensaje}</p>`;
        document.getElementById('mensajeChat').value = '';
    });

    initMap();

    const filtros = document.querySelectorAll('.filters select, .filters input');
    filtros.forEach(filtro => {
        filtro.addEventListener('change', filtrarEventos);
    });

    document.getElementById('ubicacionActual').addEventListener('click', usarUbicacionActual);

    // Añadir evento al botón de filtrar
    const btnFiltrar = document.getElementById('filtrar');
    btnFiltrar.addEventListener('click', filtrarEventos);

    // Mostrar todos los eventos al cargar la página
    mostrarEventos(eventos);
    mostrarEventosEnMapa(eventos);

    // Actualizar subcategorías iniciales
    actualizarSubcategorias();
});