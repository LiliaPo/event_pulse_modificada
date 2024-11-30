export function setupAuth() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('usernameLogin').value;
            const email = document.getElementById('emailLogin').value;
            const password = document.getElementById('passwordLogin').value;

            console.log('Intentando login con:', { username, email });

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });

                console.log('Respuesta del servidor:', response.status);

                const data = await response.json();
                console.log('Datos recibidos:', data);

                if (response.ok) {
                    console.log('Login exitoso, guardando datos...');
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('userRole', data.user.rol);

                    console.log('Redirigiendo...');
                    window.location.href = '/eventos';
                } else {
                    console.log('Error en login:', data.message);
                    alert(data.message || 'Error al iniciar sesión');
                }
            } catch (error) {
                console.error('Error en la petición:', error);
                alert('Error al iniciar sesión');
            }
        });
    }
}

// Asegurarnos de que la función se ejecute cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, inicializando auth.js');
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Formulario de registro encontrado');
        
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Formulario de registro enviado');
            
            const userData = {
                nombre: document.getElementById('nombreRegistro').value,
                username: document.getElementById('usernameRegistro').value,
                email: document.getElementById('emailRegistro').value,
                password: document.getElementById('passwordRegistro').value
            };

            console.log('Datos del formulario:', { ...userData, password: '****' });

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                console.log('Respuesta del servidor:', response.status);
                const data = await response.json();
                console.log('Datos recibidos:', data);

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userId', data.user.id);
                    localStorage.setItem('userRole', data.user.rol);
                    
                    console.log('Registro exitoso, redirigiendo...');
                    window.location.href = '/eventos';
                } else {
                    console.error('Error en registro:', data.message);
                    alert(data.message || 'Error en el registro');
                }
            } catch (error) {
                console.error('Error en la petición:', error);
                alert('Error en el registro');
            }
        });
    } else {
        console.log('Formulario de registro no encontrado');
    }
});

// Función para validar la contraseña en tiempo real
function setupPasswordValidation(passwordInputId) {
    document.getElementById(passwordInputId).addEventListener('input', function(e) {
        const password = e.target.value;
        const requirements = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        // Actualizar el estilo del input
        e.target.classList.toggle('invalid-input', !Object.values(requirements).every(Boolean));

        // Actualizar los indicadores de requisitos
        document.getElementById('lengthCheck').classList.toggle('valid', requirements.length);
        document.getElementById('lengthCheck').classList.toggle('invalid', !requirements.length);
        
        document.getElementById('upperCheck').classList.toggle('valid', requirements.upper);
        document.getElementById('upperCheck').classList.toggle('invalid', !requirements.upper);
        
        document.getElementById('lowerCheck').classList.toggle('valid', requirements.lower);
        document.getElementById('lowerCheck').classList.toggle('invalid', !requirements.lower);
        
        document.getElementById('specialCheck').classList.toggle('valid', requirements.special);
        document.getElementById('specialCheck').classList.toggle('invalid', !requirements.special);
    });
}

// Inicializar la validación para cada página
if (document.getElementById('passwordLogin')) {
    setupPasswordValidation('passwordLogin');
}
if (document.getElementById('passwordRegistro')) {
    setupPasswordValidation('passwordRegistro');
}
if (document.getElementById('adminPassword')) {
    setupPasswordValidation('adminPassword');
} 