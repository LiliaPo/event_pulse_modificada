import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import userRoutes from './routes/userRoutes.js';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../../frontend/src')));
app.use('/css', express.static(path.join(__dirname, '../../frontend/src/css')));
app.use('/js', express.static(path.join(__dirname, '../../frontend/src/js')));
app.use('/pages', express.static(path.join(__dirname, '../../frontend/src/pages')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Rutas de páginas
const pagesPath = path.join(__dirname, '../../frontend/src/pages');

app.get('/', (req, res) => {
    res.sendFile(path.join(pagesPath, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(pagesPath, 'admin.html'));
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(pagesPath, 'admin-dashboard.html'));
});

app.get('/eventos', (req, res) => {
    res.sendFile(path.join(pagesPath, 'eventos.html'));
});

// Manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).send('Página no encontrada');
});

export default app;