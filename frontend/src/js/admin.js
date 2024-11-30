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

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                window.location.href = '/admin-dashboard';
            } else {
                const errorMessage = document.getElementById('errorMessage');
                errorMessage.textContent = 'Credenciales inválidas';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = 'Error al intentar iniciar sesión';
            errorMessage.style.display = 'block';
        }
    });
}); 