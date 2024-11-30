import express, { Request, Response, NextFunction } from 'express';
import type { ErrorRequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/config.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use('/css', express.static(path.join(__dirname, '../../frontend/src/css')));
app.use('/js', express.static(path.join(__dirname, '../../frontend/src/js')));
app.use('/images', express.static(path.join(__dirname, '../../frontend/public/images')));
app.use('/icons', express.static(path.join(__dirname, '../../frontend/public/icons')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Frontend Routes
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/pages/index.html'));
});

app.get('/login', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/pages/login.html'));
});

app.get('/registro', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/pages/registro.html'));
});

app.get('/admin', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/pages/admin.html'));
});

app.get('/eventos', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/pages/eventos.html'));
});

// Error handling
const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
};

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Servidor corriendo en http://localhost:${config.port}`);
}); 