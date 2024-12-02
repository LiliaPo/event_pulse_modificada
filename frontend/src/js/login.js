document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombreLogin').value;
        const email = document.getElementById('emailLogin').value;
        const password = document.getElementById('passwordLogin').value;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, email, password })
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userRole', data.user.rol);
                localStorage.setItem('userName', data.user.nombre);
                localStorage.setItem('userEmail', data.user.email);

                if (data.user.rol === 'admin') {
                    window.location.href = '/admin-dashboard';
                } else {
                    window.location.href = '/eventos';
                }
            } else {
                alert(data.message || 'Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al iniciar sesión');
        }
    });

    // Añadir validación de contraseña
    document.getElementById('passwordLogin').addEventListener('input', function(e) {
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
        document.getElementById('upperCheck').classList.toggle('valid', requirements.upper);
        document.getElementById('lowerCheck').classList.toggle('valid', requirements.lower);
        document.getElementById('specialCheck').classList.toggle('valid', requirements.special);
    });
}); 