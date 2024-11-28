import { Pool } from 'pg';
import { config } from '../config/database';

const pool = new Pool(config);

export const User = {
    async findByEmail(email: string) {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    },

    async create(user: any) {
        const { email, password, nombre, username } = user;
        const result = await pool.query(
            'INSERT INTO users (email, password, nombre, username) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, password, nombre, username]
        );
        return result.rows[0];
    },

    async findById(id: string) {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    },

    async update(id: string, userData: any) {
        const { email, nombre, username } = userData;
        const result = await pool.query(
            'UPDATE users SET email = $1, nombre = $2, username = $3 WHERE id = $4 RETURNING *',
            [email, nombre, username, id]
        );
        return result.rows[0];
    },

    async delete(id: string) {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
    }
}; 