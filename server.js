import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Rutas para las páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/administrador', (req, res) => {
    res.sendFile(path.join(__dirname, 'administrador.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

// Login del administrador
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    
    // Credenciales fijas del administrador
    if (email === 'admin@admin.com' && password === 'admin123') {
        res.json({ success: true });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
});

// Obtener todos los usuarios
app.get('/api/users/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// Crear evento
app.post('/api/eventos', async (req, res) => {
    try {
        const { nombre, categoria, subcategoria, fecha, localizacion, direccion, organizador, precio } = req.body;
        
        const result = await pool.query(
            `INSERT INTO eventos (
                id, 
                nombre, 
                categoria, 
                subcategoria, 
                fecha, 
                localizacion, 
                direccion, 
                organizador, 
                precio
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9
            ) RETURNING *`,
            [Date.now().toString(), nombre, categoria, subcategoria, fecha, localizacion, direccion, organizador, precio]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ message: 'Error al crear evento' });
    }
});

// Actualizar evento
app.put('/api/eventos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, categoria, subcategoria, fecha, localizacion, direccion, organizador, precio } = req.body;
        
        console.log('ID del evento a actualizar:', id); // Debug
        console.log('Datos a actualizar:', req.body); // Debug
        
        const result = await pool.query(
            `UPDATE eventos 
             SET nombre = $1, 
                 categoria = $2, 
                 subcategoria = $3, 
                 fecha = $4,
                 localizacion = $5, 
                 direccion = $6, 
                 organizador = $7, 
                 precio = $8,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $9 
             RETURNING *`,
            [nombre, categoria, subcategoria, fecha, localizacion, direccion, organizador, precio, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        console.log('Evento actualizado:', result.rows[0]); // Debug
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ message: 'Error al actualizar evento' });
    }
});

// Eliminar evento
app.delete('/api/eventos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM eventos WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ message: 'Error al eliminar evento' });
    }
});

// Obtener eventos
app.get('/api/eventos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM eventos ORDER BY fecha DESC');
        console.log('Eventos obtenidos:', result.rows); // Para depuración
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error al obtener eventos' });
    }
});

// Obtener un evento específico
app.get('/api/eventos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM eventos WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener evento:', error);
        res.status(500).json({ message: 'Error al obtener evento' });
    }
});

// Obtener un usuario específico
app.get('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ message: 'Error al obtener usuario' });
    }
});

// Actualizar usuario
app.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, nombre, username, telefono, instagram, whatsapp } = req.body;
        
        const result = await pool.query(
            `UPDATE usuarios 
             SET email = $1, 
                 nombre = $2, 
                 username = $3, 
                 telefono = $4,
                 instagram = $5,
                 whatsapp = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 RETURNING *`,
            [email, nombre, username, telefono, instagram, whatsapp, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
});

// Eliminar usuario
app.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
});

// Registro
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, nombre, username } = req.body;
        
        // Verificar si el usuario ya existe
        const userExists = await pool.query(
            'SELECT * FROM usuarios WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'El email o username ya está registrado' });
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generar un UUID válido usando una subconsulta
        await pool.query(
            `WITH new_uuid AS (SELECT gen_random_uuid() AS uuid)
             INSERT INTO usuarios (id, email, password, nombre, username)
             SELECT uuid, $1, $2, $3, $4
             FROM new_uuid`,
            [email, hashedPassword, nombre, username]
        );

        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ message: 'Error en el registro' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
}); 