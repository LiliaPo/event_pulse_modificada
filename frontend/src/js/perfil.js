document.addEventListener('DOMContentLoaded', () => {
    const perfilForm = document.getElementById('perfilForm');
    const btnPerfil = document.querySelector('.btn-perfil');
    const modalPerfil = document.getElementById('ventanaPerfil');
    const btnCerrar = document.querySelector('#ventanaPerfil .cerrar');
    let selectedAvatar = localStorage.getItem('userAvatar') || '';

    // Función para actualizar la visualización de avatares
    function actualizarAvatares() {
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.classList.toggle('selected', option.dataset.avatar === selectedAvatar);
        });
        
        // Actualizar avatar en la navegación
        const navAvatar = document.querySelector('.foto-perfil-nav');
        if (navAvatar) {
            navAvatar.textContent = selectedAvatar;
        }
    }

    // Event listeners para los avatares
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', () => {
            selectedAvatar = option.dataset.avatar;
            actualizarAvatares();
        });
    });

    // Manejar el envío del formulario
    perfilForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            nombre: document.getElementById('nombreUsuario').value,
            email: document.getElementById('emailUsuario').value,
            imagen: selectedAvatar
        };

        console.log('Enviando datos:', userData);

        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar el perfil');
            }

            const data = await response.json();
            
            // Actualizar localStorage
            localStorage.setItem('userName', data.nombre);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userAvatar', selectedAvatar);

            // Actualizar UI
            actualizarAvatares();
            
            alert('Perfil actualizado correctamente');
            modalPerfil.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Error al actualizar el perfil');
        }
    });

    // Cargar datos cuando se abre el modal
    btnPerfil.addEventListener('click', () => {
        modalPerfil.style.display = 'block';
        document.getElementById('nombreUsuario').value = localStorage.getItem('userName') || '';
        document.getElementById('emailUsuario').value = localStorage.getItem('userEmail') || '';
        actualizarAvatares();
    });

    // Cerrar modal
    btnCerrar.addEventListener('click', () => {
        modalPerfil.style.display = 'none';
    });
});