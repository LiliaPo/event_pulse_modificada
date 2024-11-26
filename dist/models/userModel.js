"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("../config/database");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserModel {
    static createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (0, uuid_1.v4)();
            const hashedPassword = yield bcrypt_1.default.hash(userData.password, 10);
            const query = `
            INSERT INTO usuarios (
                id, email, nombre, telefono, whatsapp, instagram, imagen_perfil, rol
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;
            const values = [
                userId,
                userData.email,
                userData.nombre,
                userData.telefono || null,
                userData.whatsapp || null,
                userData.instagram || null,
                userData.imagen_perfil || null,
                userData.rol || 'usuario'
            ];
            try {
                const result = yield database_1.pool.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                throw new Error(`Error al crear usuario: ${error}`);
            }
        });
    }
    static validateLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT * FROM usuarios WHERE email = $1';
            try {
                const result = yield database_1.pool.query(query, [email]);
                const user = result.rows[0];
                if (!user)
                    return null;
                const isValid = yield bcrypt_1.default.compare(password, user.password);
                return isValid ? user : null;
            }
            catch (error) {
                throw new Error(`Error en la validación: ${error}`);
            }
        });
    }
}
exports.UserModel = UserModel;
