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
exports.user = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
class user {
    static create(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, nombre, email, password } = userData;
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const query = `
            INSERT INTO ${this.tableName} (username, nombre, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, nombre, email
        `;
            try {
                const result = yield database_1.default.query(query, [
                    username,
                    nombre,
                    email,
                    hashedPassword
                ]);
                return result.rows[0];
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error al crear usuario: ${error.message}`);
                }
                throw error;
            }
        });
    }
    static findByCredentials(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = credentials;
            const query = `
            SELECT id, username, nombre, email, password
            FROM ${this.tableName}
            WHERE username = $1 OR email = $2
        `;
            try {
                const result = yield database_1.default.query(query, [username, email]);
                if (result.rows.length === 0) {
                    return null;
                }
                const user = result.rows[0];
                const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
                return isValidPassword ? user : null;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error al buscar credenciales: ${error.message}`);
                }
                throw error;
            }
        });
    }
    static findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, username, nombre, email, password
            FROM ${this.tableName}
            WHERE username = $1
        `;
            try {
                const result = yield database_1.default.query(query, [username]);
                return result.rows[0] || null;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error al buscar por username: ${error.message}`);
                }
                throw error;
            }
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `
            SELECT id, username, nombre, email, password
            FROM ${this.tableName}
            WHERE email = $1
        `;
            try {
                const result = yield database_1.default.query(query, [email]);
                return result.rows[0] || null;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Error al buscar por email: ${error.message}`);
                }
                throw error;
            }
        });
    }
}
exports.user = user;
user.tableName = 'eventusers';
