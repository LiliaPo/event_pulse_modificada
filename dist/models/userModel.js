import { pool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
export class UserModel {
    static async createUser(userData) {
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
        }
        catch (error) {
            throw new Error(`Error al crear usuario: ${error}`);
        }
    }
    static async validateLogin(email, password) {
        const query = 'SELECT * FROM usuarios WHERE email = $1';
        try {
            const result = await pool.query(query, [email]);
            const user = result.rows[0];
            if (!user)
                return null;
            const isValid = await bcrypt.compare(password, user.password);
            return isValid ? user : null;
        }
        catch (error) {
            throw new Error(`Error en la validación: ${error}`);
        }
    }
    static async getUserById(id) {
        const query = 'SELECT * FROM usuarios WHERE id = $1';
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0] || null;
        }
        catch (error) {
            throw new Error(`Error al obtener usuario: ${error}`);
        }
    }
    static async updateUserProfile(id, userData) {
        const query = `
            UPDATE usuarios 
            SET 
                telefono = COALESCE($1, telefono),
                whatsapp = COALESCE($2, whatsapp),
                instagram = COALESCE($3, instagram),
                imagen_perfil = COALESCE($4, imagen_perfil),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *
        `;
        const values = [
            userData.telefono,
            userData.whatsapp,
            userData.instagram,
            userData.imagen_perfil,
            id
        ];
        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Error al actualizar perfil: ${error}`);
        }
    }
}
