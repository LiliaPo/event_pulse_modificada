let map;

export function initMap() {
    if (map) {
        map.remove();
    }
    
    map = L.map('mapa', {
        scrollWheelZoom: true,
        attributionControl: true,
        minZoom: 3,
        maxZoom: 18
    }).setView([40.416775, -3.703790], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    setTimeout(() => {
        map.invalidateSize(true);
        map._onResize();
    }, 100);

    window.addEventListener('resize', () => {
        map.invalidateSize(true);
    });
}

export function mostrarEventosEnMapa(eventos) {
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