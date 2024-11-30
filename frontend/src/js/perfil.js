document.addEventListener('DOMContentLoaded', () => {
    function cargarDatosPerfil() {
        const nombreInput = document.getElementById('nombreUsuario');
        const emailInput = document.getElementById('emailUsuario');
        
        console.log('Intentando cargar datos del perfil');
        console.log('Elementos encontrados:', {
            nombreInput: nombreInput ? 'sí' : 'no',
            emailInput: emailInput ? 'sí' : 'no'
        });
        
        console.log('Datos en localStorage:', {
            nombre: localStorage.getItem('userName'),
            email: localStorage.getItem('userEmail')
        });

        if (nombreInput && emailInput) {
            nombreInput.value = localStorage.getItem('userName') || '';
            emailInput.value = localStorage.getItem('userEmail') || '';
            
            console.log('Valores establecidos:', {
                nombre: nombreInput.value,
                email: emailInput.value
            });
        }
    }

    // Cargar datos cuando se abre el modal
    document.querySelector('.btn-perfil').addEventListener('click', () => {
        const modal = document.getElementById('ventanaPerfil');
        modal.style.display = 'block';
        cargarDatosPerfil();
    });

    // Cerrar modal
    document.querySelector('.cerrar').addEventListener('click', () => {
        document.getElementById('ventanaPerfil').style.display = 'none';
    });
});