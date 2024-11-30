import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { authenticateAdmin } from './middleware/auth.js';
import { RequestHandler } from 'express';

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

const sendFileHandler = (filePath: string): RequestHandler => 
    (req, res) => void res.sendFile(filePath);

app.get('/', sendFileHandler(path.join(pagesPath, 'index.html')));
app.get('/registro', sendFileHandler(path.join(pagesPath, 'registro.html')));
app.get('/login', sendFileHandler(path.join(pagesPath, 'login.html')));
app.get('/admin', sendFileHandler(path.join(pagesPath, 'admin.html')));
app.get('/admin-dashboard', (req, res) => {
    console.log('Sirviendo admin-dashboard');
    res.sendFile(path.join(pagesPath, 'admin-dashboard.html'));
});
app.get('/eventos', sendFileHandler(path.join(pagesPath, 'eventos.html')));

// Manejar todas las demás rutas
app.get('*', (req, res) => {
    res.sendFile(path.join(pagesPath, 'index.html'));
});

export default app;