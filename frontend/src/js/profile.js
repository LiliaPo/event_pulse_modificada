export function setupProfile() {
    const perfilForm = document.getElementById('perfilForm');
    const btnMostrarPerfil = document.getElementById('mostrarPerfil');
    const modalPerfil = document.getElementById('ventanaPerfil');
    const cerrarModalPerfil = modalPerfil.querySelector('.cerrar');
    const imagenPerfil = document.getElementById('imagenPerfil');
    const imagenPerfilPreview = document.getElementById('imagenPerfilPreview');
    const imagenPerfilNav = document.getElementById('imagenPerfilNav');

    btnMostrarPerfil.addEventListener('click', () => {
        modalPerfil.style.display = 'block';
        cargarDatosUsuario();
    });

    cerrarModalPerfil.addEventListener('click', () => {
        modalPerfil.style.display = 'none';
    });

    perfilForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            nombre: document.getElementById('nombreUsuario').value,
            email: document.getElementById('emailUsuario').value,
            telefono: document.getElementById('telefonoUsuario').value,
            whatsapp: document.getElementById('whatsappUsuario').value,
            instagram: document.getElementById('instagramUsuario').value
        };

        try {
            const response = await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('userData', JSON.stringify(updatedUser));
                alert('Perfil actualizado correctamente');
                modalPerfil.style.display = 'none';
            } else {
                throw new Error('Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar los cambios');
        }
    });

    imagenPerfil.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagenPerfilPreview.src = e.target.result;
                imagenPerfilNav.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

async function cargarDatosUsuario() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (!userData) {
            const response = await fetch('/api/users/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('userData', JSON.stringify(data));
                rellenarCamposPerfil(data);
            }
        } else {
            rellenarCamposPerfil(userData);
        }
    } catch (error) {
        console.error('Error al cargar datos:', error);
    }
}

function rellenarCamposPerfil(userData) {
    document.getElementById('nombreUsuario').value = userData.nombre || '';
    document.getElementById('emailUsuario').value = userData.email || '';
    document.getElementById('telefonoUsuario').value = userData.telefono || '';
    document.getElementById('whatsappUsuario').value = userData.whatsapp || '';
    document.getElementById('instagramUsuario').value = userData.instagram || '';
} 