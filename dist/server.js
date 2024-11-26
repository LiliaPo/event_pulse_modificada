"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Servir archivos estáticos
app.use(express_1.default.static(path_1.default.join(__dirname, '../')));
// Rutas API
app.use('/api', user_routes_1.default);
// Rutas para las páginas
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../login.html'));
});
app.get('/registro', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../registro.html'));
});
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../index.html'));
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
