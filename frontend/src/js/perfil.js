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

    // Cargar datos del perfil
    function cargarDatosPerfil() {
        const nombreInput = document.getElementById('nombreUsuario');
        const emailInput = document.getElementById('emailUsuario');

        if (nombreInput && emailInput) {
            nombreInput.value = localStorage.getItem('userName') || '';
            emailInput.value = localStorage.getItem('userEmail') || '';
        }

        selectedAvatar = localStorage.getItem('userAvatar') || '👤';
        actualizarAvatares();
    }

    // Abrir modal de perfil
    if (btnPerfil) {
        btnPerfil.addEventListener('click', () => {
            if (modalPerfil) {
                modalPerfil.style.display = 'block';
                cargarDatosPerfil();
            }
        });
    }

    // Cerrar modal
    if (btnCerrar) {
        btnCerrar.addEventListener('click', () => {
            if (modalPerfil) {
                modalPerfil.style.display = 'none';
            }
        });
    }

    // Manejar el envío del formulario
    if (perfilForm) {
        perfilForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const userData = {
                    nombre: document.getElementById('nombreUsuario').value,
                    email: document.getElementById('emailUsuario').value,
                    avatar: selectedAvatar
                };

                console.log('Enviando datos:', userData);

                const response = await fetch('/api/users/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(userData)
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el perfil');
                }

                const data = await response.json();
                localStorage.setItem('userName', data.nombre);
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('userAvatar', selectedAvatar);

                // Actualizar avatar en la navegación
                const navAvatar = document.querySelector('.foto-perfil-nav');
                if (navAvatar) {
                    navAvatar.textContent = selectedAvatar;
                }

                alert('Perfil actualizado correctamente');
                if (modalPerfil) {
                    modalPerfil.style.display = 'none';
                }
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Error al guardar los cambios');
            }
        });
    }

    // Inicializar avatar al cargar la página
    actualizarAvatares();
});