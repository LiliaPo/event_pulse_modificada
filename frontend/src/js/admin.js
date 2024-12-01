document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');

    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;
        
        try {
            const response = await fetch('/api/auth/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log('Respuesta login:', data);

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('userRole', 'admin');
                window.location.href = '/admin-dashboard';
            } else {
                console.error('No se recibió token');
                document.getElementById('errorMessage').textContent = 'Credenciales inválidas';
                document.getElementById('errorMessage').style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
}); 