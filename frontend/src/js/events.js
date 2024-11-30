export function mostrarEventos(eventos) {
    const contenedorEventos = document.getElementById('eventos');
    contenedorEventos.innerHTML = '';

    eventos.forEach(evento => {
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

export function filtrarEventos() {
    const categoria = document.getElementById('categoria').value;
    const subcategoria = document.getElementById('subcategoria').value;
    const edad = document.getElementById('edad').value;
    const personasMin = parseInt(document.getElementById('personasMin').value) || 0;
    const personasMax = parseInt(document.getElementById('personasMax').value) || Infinity;
    const localizacion = document.getElementById('localizacion').value.toLowerCase();
    const fechaInicio = document.getElementById('fechaEventoInicio').value;
    const fechaFin = document.getElementById('fechaEventoFin').value;

    // Lógica de filtrado
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