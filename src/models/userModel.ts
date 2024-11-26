import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export interface User {
    id: string;
    email: string;
    nombre: string;
    username: string;
    password: string;
    telefono?: string;
    whatsapp?: string;
    instagram?: string;
    imagen_perfil?: string;
    rol?: string;
}

export class UserModel {
    static async createUser(userData: Omit<User, 'id'>): Promise<User> {
        const userId = uuidv4();
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const query = `
            INSERT INTO usuarios (
                id, email, nombre, username, password, telefono, whatsapp, instagram, imagen_perfil, rol
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

        const values = [
            userId,
            userData.email,
            userData.nombre,
            userData.username,
            hashedPassword,
            userData.telefono || null,
            userData.whatsapp || null,
            userData.instagram || null,
            userData.imagen_perfil || null,
            userData.rol || 'usuario'
        ];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error al crear usuario: ${error}`);
        }
    }

    static async validateLogin(email: string, password: string): Promise<User | null> {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        
        try {
            const result = await pool.query(query, [email]);
            const user = result.rows[0];
            
            if (!user) return null;
            
            const isValid = await bcrypt.compare(password, user.password);
            return isValid ? user : null;
        } catch (error) {
            throw new Error(`Error en la validación: ${error}`);
        }
    }
} 