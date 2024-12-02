document.addEventListener('DOMContentLoaded', () => {
    const ventanaForo = document.getElementById('ventanaForo');
    const chatForo = document.getElementById('chatForo');
    const formMensaje = document.getElementById('formMensaje');
    const mensajeInput = document.getElementById('mensajeChat');

    if (formMensaje) {
        formMensaje.addEventListener('submit', enviarMensaje);
    }

    // Abrir foro general
    document.getElementById('abrirForo').addEventListener('click', () => {
        ventanaForo.style.display = 'block';
        cargarMensajes();
    });

    // Cargar mensajes
    async function cargarMensajes() {
        try {
            const response = await fetch('/api/messages', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const mensajes = await response.json();
            mostrarMensajes(mensajes);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        }
    }

    // Mostrar mensajes
    function mostrarMensajes(mensajes) {
        chatForo.innerHTML = mensajes.map(mensaje => `
            <div class="mensaje ${mensaje.usuario_id === localStorage.getItem('userId') ? 'mensaje-propio' : ''}">
                <strong>${mensaje.nombre_usuario}</strong>
                <p>${mensaje.mensaje}</p>
                <small>${new Date(mensaje.fecha_creacion).toLocaleString()}</small>
            </div>
        `).join('');
        chatForo.scrollTop = chatForo.scrollHeight;
    }

    // Enviar mensaje
    async function enviarMensaje(e) {
        e.preventDefault();
        const mensaje = mensajeInput.value.trim();
        if (!mensaje) return;

        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ mensaje })
            });

            if (response.ok) {
                mensajeInput.value = '';
                await cargarMensajes();
            }
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    }

    // Cerrar foro
    document.querySelector('#ventanaForo .cerrar').addEventListener('click', () => {
        ventanaForo.style.display = 'none';
    });
}); 