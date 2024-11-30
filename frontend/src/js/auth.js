export function setupAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    window.location.href = '/eventos';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error en el login');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const userData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                nombre: document.getElementById('nombre').value,
                username: document.getElementById('username').value
            };

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registro exitoso');
                    window.location.href = '/eventos';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error en el registro');
            }
        });
    }
}

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