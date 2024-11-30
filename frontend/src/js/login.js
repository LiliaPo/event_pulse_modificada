document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el token
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.user.id);
            localStorage.setItem('userRole', data.user.rol);

            // Redirigir según el rol
            if (data.user.rol === 'admin') {
                window.location.href = '/admin-dashboard';
            } else {
                window.location.href = '/eventos';
            }
        } else {
            alert(data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión');
    }
}); 