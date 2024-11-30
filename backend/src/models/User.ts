import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import pool from '../config/database.js';

export interface IUser {
    id?: string;
    email: string;
    password: string;
    nombre: string;
    username: string;
    role?: string;
    telefono?: string;
    whatsapp?: string;
    instagram?: string;
}

export class User {
    static async create(userData: IUser) {
        const { email, password, nombre, username } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO usuarios (email, password, nombre, username)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, nombre, username
        `;

        const result = await pool.query(query, [email, hashedPassword, nombre, username]);
        return result.rows[0];
    }

    static async findByEmail(email: string) {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findById(id: string) {
        const query = 'SELECT * FROM usuarios WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async update(id: string, data: Partial<IUser>) {
        const query = `
            UPDATE usuarios
            SET nombre = COALESCE($1, nombre),
                email = COALESCE($2, email),
                telefono = COALESCE($3, telefono),
                whatsapp = COALESCE($4, whatsapp),
                instagram = COALESCE($5, instagram)
            WHERE id = $6
            RETURNING *
        `;

        const values = [
            data.nombre,
            data.email,
            data.telefono,
            data.whatsapp,
            data.instagram,
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
} 