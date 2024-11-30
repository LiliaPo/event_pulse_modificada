// Importar módulos
import { initMap, mostrarEventosEnMapa } from './map.js';
import { mostrarEventos, filtrarEventos } from './events.js';
import { setupProfile } from './profile.js';
import { setupAuth } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    setupProfile();
    setupAuth();
    
    // Cargar eventos iniciales
    cargarEventos();
}); 