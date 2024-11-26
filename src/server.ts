import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../')));

// Rutas API
app.use('/api', userRoutes);

// Rutas para las páginas
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../registro.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 