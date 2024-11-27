import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Rutas de páginas HTML
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../login.html'));
});

router.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, '../../registro.html'));
});

router.get('/guest', (req, res) => {
    res.sendFile(path.join(__dirname, '../../EventPulse/index.html'));
});

router.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../../administrador.html'));
});

router.get('/admin-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../admin-dashboard.html'));
});

export default router; 