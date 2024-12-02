let map; // Variable global para el mapa
window.eventos = []; // Hacer eventos disponible globalmente

// Función para inicializar el mapa de Google
export function initMap() {
    console.log('Inicializando mapa...'); // Debug
    const espanaCenter = { lat: 40.416775, lng: -3.703790 };
    try {
        map = new google.maps.Map(document.getElementById('mapa'), {
            center: espanaCenter,
            zoom: 6,
            minZoom: 5,
            maxZoom: 18,
            restriction: {
                latLngBounds: {
                    north: 43.8,
                    south: 35.8,
                    west: -9.4,
                    east: 4.4
                }
            }
        });
        console.log('Mapa inicializado:', map); // Debug
        cargarEventos(); // Cargar eventos después de inicializar el mapa
    } catch (error) {
        console.error('Error al inicializar el mapa:', error);
    }
}

// Función para cargar eventos
export async function cargarEventos() {
    try {
        console.log('Cargando eventos...');
        const response = await fetch('/api/events', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al cargar eventos');
        }

        const eventosData = await response.json();
        console.log('Eventos cargados:', eventosData);
        console.log('Ejemplo de coordenadas del primer evento:', 
            eventosData[0] ? {
                nombre: eventosData[0].nombre,
                lat: eventosData[0].lat,
                lng: eventosData[0].lng
            } : 'No hay eventos');

        eventos = eventosData;
        window.eventos = eventos;
        mostrarEventos(eventos);
        mostrarEventosEnMapa(eventos);
    } catch (error) {
        console.error('Error al cargar eventos:', error);
    }
}

export function mostrarEventos(eventos) {
    const contenedorEventos = document.getElementById('eventos');
    if (!contenedorEventos) {
        console.error('No se encontró el contenedor de eventos');
        return;
    }

    contenedorEventos.innerHTML = eventos.map(evento => {
        const precio = typeof evento.precio === 'number' ? evento.precio.toFixed(2) : '0.00';
        
        return `
            <div class="evento">
                <div class="evento-banner" style="background-image: url('${evento.imagen || getDefaultImage(evento.categoria)}')"></div>
                <span class="evento-categoria categoria-${evento.categoria}">${evento.categoria}</span>
                <h3>${evento.nombre}</h3>
                <p><i class="fas fa-calendar"></i> ${new Date(evento.fecha).toLocaleDateString()}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${evento.localizacion}</p>
                <p><i class="fas fa-euro-sign"></i> ${precio} €</p>
                <button class="btn-ver-mas" onclick="window.verDetallesEvento('${evento.id}')">Ver más</button>
                <div class="evento-detalles" style="display: none;">
                    <p><strong>Descripción:</strong> ${evento.descripcion || 'No hay descripción disponible'}</p>
                    <p><strong>Dirección:</strong> ${evento.direccion || evento.localizacion}</p>
                    <p><strong>Organizador:</strong> ${evento.organizador || 'No especificado'}</p>
                    ${evento.telefono_contacto ? `<p><strong>Contacto:</strong> ${evento.telefono_contacto}</p>` : ''}
                    <p><strong>Fecha y hora:</strong> ${new Date(evento.fecha).toLocaleString()}</p>
                </div>
            </div>
        `;
    }).join('');
}

// Imágenes por defecto según categoría
function getDefaultImage(categoria) {
    const imagenes = {
        musica: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
        deporte: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211',
        arte: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5',
        cine: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
        cafeteria: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
        restaurante: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
    };
    return imagenes[categoria] || 'https://via.placeholder.com/300x150';
}

// Función para mostrar eventos en el mapa
export function mostrarEventosEnMapa(eventos) {
    if (!map) {
        console.error('El mapa no está inicializado');
        return;
    }

    console.log('Total de eventos a mostrar:', eventos.length);

    // Limpiar marcadores existentes
    if (window.markers) {
        window.markers.forEach(marker => marker.setMap(null));
    }
    window.markers = [];

    const bounds = new google.maps.LatLngBounds();
    let marcadoresCreados = 0;

    eventos.forEach(evento => {
        // Validar que las coordenadas existan y sean números válidos
        const lat = evento.lat ? parseFloat(evento.lat) : null;
        const lng = evento.lng ? parseFloat(evento.lng) : null;

        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            console.log(`Evento sin coordenadas válidas: ${evento.nombre}. Intentando geocodificar...`);
            
            // Intentar geocodificar la dirección
            const geocoder = new google.maps.Geocoder();
            const direccion = evento.direccion || evento.localizacion;
            
            geocoder.geocode({ 
                address: direccion + ', España',
                region: 'ES'
            }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const position = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    };
                    crearMarcador(evento, position, bounds);
                } else {
                    console.error(`No se pudo geocodificar la dirección para: ${evento.nombre}`);
                }
            });
        } else {
            // Usar las coordenadas existentes
            const position = { lat, lng };
            crearMarcador(evento, position, bounds);
        }
    });

    // Función auxiliar para crear marcadores
    function crearMarcador(evento, position, bounds) {
        try {
            const marker = new google.maps.Marker({
                position: position,
                map: map,
                title: evento.nombre,
                animation: google.maps.Animation.DROP,
                icon: {
                    url: getMarkerIcon(evento.categoria),
                    scaledSize: new google.maps.Size(32, 32)
                }
            });

            const infowindow = new google.maps.InfoWindow({
                content: `
                    <div class="evento-popup">
                        <h3>${evento.nombre}</h3>
                        <p><i class="fas fa-calendar"></i> ${new Date(evento.fecha).toLocaleDateString()}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${evento.direccion || evento.localizacion}</p>
                        <p><i class="fas fa-tag"></i> ${evento.categoria}</p>
                        ${evento.descripcion ? `<p>${evento.descripcion}</p>` : ''}
                        <p><i class="fas fa-euro-sign"></i> ${typeof evento.precio === 'number' ? evento.precio.toFixed(2) : '0.00'} €</p>
                    </div>
                `
            });

            marker.addListener('click', () => {
                if (window.currentInfoWindow) {
                    window.currentInfoWindow.close();
                }
                infowindow.open(map, marker);
                window.currentInfoWindow = infowindow;

                map.panTo(position);
                map.setZoom(14);
            });

            window.markers.push(marker);
            bounds.extend(position);
            marcadoresCreados++;
        } catch (error) {
            console.error('Error al crear marcador para:', evento.nombre, error);
        }
    }

    // Ajustar el mapa después de crear todos los marcadores
    setTimeout(() => {
        if (marcadoresCreados > 0) {
            map.fitBounds(bounds);
            if (marcadoresCreados === 1) {
                map.setZoom(14);
            }
        } else {
            map.setCenter({ lat: 40.416775, lng: -3.703790 });
            map.setZoom(6);
        }
    }, 500);
}

// Función para obtener el icono según la categoría
function getMarkerIcon(categoria) {
    const iconos = {
        musica: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        deporte: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        arte: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
        cine: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        cafeteria: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
        restaurante: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    };
    return iconos[categoria] || 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
}

export function filtrarEventos() {
    const categoria = document.getElementById('categoria').value;
    const localizacion = document.getElementById('localizacion').value.toLowerCase();
    const fechaInicio = document.getElementById('fechaEventoInicio').value;
    const fechaFin = document.getElementById('fechaEventoFin').value;

    const eventosFiltrados = eventos.filter(evento => {
        const fechaEvento = new Date(evento.fecha);
        const cumpleFiltros = 
            (!categoria || evento.categoria === categoria) &&
            (!localizacion || evento.localizacion.toLowerCase().includes(localizacion)) &&
            (!fechaInicio || fechaEvento >= new Date(fechaInicio)) &&
            (!fechaFin || fechaEvento <= new Date(fechaFin));

        return cumpleFiltros;
    });

    mostrarEventos(eventosFiltrados);
    mostrarEventosEnMapa(eventosFiltrados);
}

// Función para geocodificar direcciones usando la API de Google
export async function geocodificarDireccion(direccion) {
    const geocoder = new google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
        geocoder.geocode({ address: direccion + ', España' }, (results, status) => {
            if (status === 'OK') {
                resolve({
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                });
            } else {
                reject(new Error('No se pudo geocodificar la dirección'));
            }
        });
    });
}

// Inicializar cuando el DOM esté listo y Google Maps esté cargado
function init() {
    if (window.google) {
        initMap();
    } else {
        setTimeout(init, 100); // Esperar a que Google Maps se cargue
    }
}

document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Event listeners para filtros
    const categoriaSelect = document.getElementById('categoria');
    if (categoriaSelect) {
        categoriaSelect.addEventListener('change', () => {
            console.log('Categoría seleccionada:', categoriaSelect.value);
            filtrarEventos();
        });
    }

    const btnUbicacion = document.getElementById('ubicacionActual');
    if (btnUbicacion) {
        btnUbicacion.addEventListener('click', usarUbicacionActual);
    }

    const btnFiltrar = document.getElementById('filtrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', filtrarEventos);
    }
});

// Función para usar ubicación actual
function usarUbicacionActual() {
    const btnUbicacion = document.getElementById('ubicacionActual');
    if (!btnUbicacion) return;

    btnUbicacion.disabled = true;
    btnUbicacion.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Obteniendo ubicación...';

    if (!navigator.geolocation) {
        alert('Tu navegador no soporta geolocalización');
        btnUbicacion.disabled = false;
        btnUbicacion.textContent = 'Usar ubicación actual';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const latlng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Centrar mapa en la ubicación actual
                map.setCenter(latlng);
                map.setZoom(15);

                // Actualizar marcador de ubicación actual
                if (window.currentLocationMarker) {
                    window.currentLocationMarker.setMap(null);
                }

                window.currentLocationMarker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    title: 'Tu ubicación actual',
                    icon: {
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        scaledSize: new google.maps.Size(32, 32)
                    },
                    animation: google.maps.Animation.DROP,
                    zIndex: 1000
                });

                // Obtener dirección para el campo de localización
                const geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 
                    location: latlng,
                    language: 'es',
                    region: 'ES'
                }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const locInput = document.getElementById('localizacion');
                        if (locInput) {
                            // Buscar específicamente la ciudad
                            const addressComponents = results[0].address_components;
                            let cityName = '';

                            // Primero intentar encontrar la localidad
                            const locality = addressComponents.find(component => 
                                component.types.includes('locality')
                            );

                            // Si no hay localidad, buscar el municipio
                            if (!locality) {
                                const municipality = addressComponents.find(component =>
                                    component.types.includes('administrative_area_level_4') ||
                                    component.types.includes('administrative_area_level_3')
                                );
                                if (municipality) {
                                    cityName = municipality.long_name;
                                }
                            } else {
                                cityName = locality.long_name;
                            }

                            // Si aún no tenemos ciudad, usar la provincia
                            if (!cityName) {
                                const province = addressComponents.find(component =>
                                    component.types.includes('administrative_area_level_2')
                                );
                                if (province) {
                                    cityName = province.long_name;
                                }
                            }

                            if (cityName) {
                                console.log('Ciudad detectada:', cityName);
                                locInput.value = cityName;
                                filtrarEventos();
                            }
                        }
                    }
                });

                // Añadir infowindow a la ubicación actual
                const infowindow = new google.maps.InfoWindow({
                    content: '<div><strong>Tu ubicación actual</strong></div>'
                });

                window.currentLocationMarker.addListener('click', () => {
                    infowindow.open(map, window.currentLocationMarker);
                });

            } catch (error) {
                console.error('Error al obtener ubicación:', error);
            } finally {
                btnUbicacion.disabled = false;
                btnUbicacion.innerHTML = '<i class="fas fa-map-marker-alt"></i> Usar ubicación actual';
            }
        },
        (error) => {
            console.error('Error de geolocalización:', error);
            alert(getGeolocationErrorMessage(error));
            btnUbicacion.disabled = false;
            btnUbicacion.innerHTML = '<i class="fas fa-map-marker-alt"></i> Usar ubicación actual';
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function getGeolocationErrorMessage(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            return "Permiso denegado para obtener ubicación.";
        case error.POSITION_UNAVAILABLE:
            return "Información de ubicación no disponible.";
        case error.TIMEOUT:
            return "Tiempo de espera agotado para obtener ubicación.";
        default:
            return "Error desconocido al obtener ubicación.";
    }
}

// Función para ver detalles del evento
window.verDetallesEvento = function(eventoId) {
    // Encontrar el evento en el array de eventos
    const evento = window.eventos.find(e => e.id === eventoId);
    if (!evento) return;

    // Manejar la visualización de detalles
    const eventoDiv = document.querySelector(`button[onclick="window.verDetallesEvento('${eventoId}')"]`).closest('.evento');
    const detallesDiv = eventoDiv.querySelector('.evento-detalles');
    const btn = eventoDiv.querySelector('.btn-ver-mas');

    if (detallesDiv.style.display === 'none') {
        detallesDiv.style.display = 'block';
        btn.textContent = 'Ver menos';
    } else {
        detallesDiv.style.display = 'none';
        btn.textContent = 'Ver más';
    }

    // Centrar el mapa en el evento
    if (evento.lat && evento.lng) {
        const position = {
            lat: parseFloat(evento.lat),
            lng: parseFloat(evento.lng)
        };

        // Centrar y hacer zoom
        map.panTo(position);
        map.setZoom(14);

        // Encontrar y activar el marcador correspondiente
        const marker = window.markers.find(m => 
            m.getPosition().lat() === position.lat && 
            m.getPosition().lng() === position.lng
        );

        if (marker) {
            // Simular un clic en el marcador para mostrar el infowindow
            google.maps.event.trigger(marker, 'click');
        }
    }
};

// Hacer la función disponible globalmente
window.verDetallesEvento = verDetallesEvento;
window.usarUbicacionActual = usarUbicacionActual; 