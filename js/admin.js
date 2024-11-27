document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const errorMessage = document.getElementById('errorMessage');

    adminLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        console.log('Intentando login con:', { email, password });

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            console.log('Respuesta completa:', response);
            const data = await response.json();
            console.log('Datos de respuesta:', data);

            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                window.location.href = '/admin-dashboard';
            } else {
                errorMessage.textContent = `Error: ${data.message}`;
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error completo:', error);
            errorMessage.textContent = 'Error de conexión';
            errorMessage.style.display = 'block';
        }
    });
}); 