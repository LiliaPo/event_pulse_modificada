import { Pool } from 'pg';
import { config } from '../config/database';

const pool = new Pool(config);

export const Evento = {
    async findAll() {
        const result = await pool.query('SELECT * FROM eventos');
        return result.rows;
    },

    async findById(id: string) {
        const result = await pool.query('SELECT * FROM eventos WHERE id = $1', [id]);
        return result.rows[0];
    },

    async create(evento: any) {
        const { nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen } = evento;
        const result = await pool.query(
            'INSERT INTO eventos (nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen]
        );
        return result.rows[0];
    },

    async update(id: string, evento: any) {
        const { nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen } = evento;
        const result = await pool.query(
            'UPDATE eventos SET nombre = $1, categoria = $2, subcategoria = $3, edad = $4, personas = $5, precio = $6, localizacion = $7, organizador = $8, fecha = $9, imagen = $10 WHERE id = $11 RETURNING *',
            [nombre, categoria, subcategoria, edad, personas, precio, localizacion, organizador, fecha, imagen, id]
        );
        return result.rows[0];
    },

    async delete(id: string) {
        await pool.query('DELETE FROM eventos WHERE id = $1', [id]);
    }
}; 