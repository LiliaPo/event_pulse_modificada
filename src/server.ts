import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/userRoutes';
import open from 'open';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../')));

// Rutas API
app.use('/api/users', userRoutes);

// Rutas para las páginas
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../registro.html'));
});

app.get('/guest', (req, res) => {
    res.sendFile(path.join(__dirname, '../EventPulse/index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    await open(`http://localhost:${PORT}`);
}); 