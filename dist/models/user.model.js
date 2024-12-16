import bcrypt from 'bcrypt';
import pool from '../config/database';
export class userModel {
    static async create(userData) {
        const { username, nombre, email, password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO ${this.tableName} (username, nombre, email, password)
            VALUES ($1, $2, $3, $4)
            RETURNING id, username, nombre, email
        `;
        try {
            const result = await pool.query(query, [
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
    }
    static async findByUsername(username) {
        const query = `
            SELECT id, username, nombre, email, password
            FROM ${this.tableName}
            WHERE username = $1
        `;
        try {
            const result = await pool.query(query, [username]);
            return result.rows[0] || null;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error al buscar por username: ${error.message}`);
            }
            throw error;
        }
    }
    static async findByIdentifier(identifier) {
        const query = `
            SELECT id, username, nombre, email, password
            FROM ${this.tableName}
            WHERE id = $1 OR username = $2
        `;
        try {
            const result = await pool.query(query, [identifier, identifier]);
            return result.rows[0] || null;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error al buscar usuario: ${error.message}`);
            }
            throw error;
        }
    }
}
userModel.tableName = 'eventusers';
