import { Pool } from 'pg';
import pool from '../config/database.js';

export interface IEvent {
    id?: string;
    nombre: string;
    categoria: string;
    subcategoria?: string;
    edad?: string;
    personas: number;
    precio?: number;
    localizacion: string;
    organizador: string;
    fecha: Date;
    imagen?: string;
}

export class Event {
    static async create(eventData: IEvent) {
        const query = `
            INSERT INTO eventos (
                nombre, categoria, subcategoria, edad,
                personas, precio, localizacion, organizador,
                fecha, imagen
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `;

        const values = [
            eventData.nombre,
            eventData.categoria,
            eventData.subcategoria,
            eventData.edad,
            eventData.personas,
            eventData.precio,
            eventData.localizacion,
            eventData.organizador,
            eventData.fecha,
            eventData.imagen
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findAll() {
        const query = 'SELECT * FROM eventos ORDER BY fecha DESC';
        const result = await pool.query(query);
        return result.rows;
    }

    static async findById(id: string) {
        const query = 'SELECT * FROM eventos WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async update(id: string, eventData: Partial<IEvent>) {
        const query = `
            UPDATE eventos
            SET nombre = COALESCE($1, nombre),
                categoria = COALESCE($2, categoria),
                subcategoria = COALESCE($3, subcategoria),
                edad = COALESCE($4, edad),
                personas = COALESCE($5, personas),
                precio = COALESCE($6, precio),
                localizacion = COALESCE($7, localizacion),
                organizador = COALESCE($8, organizador),
                fecha = COALESCE($9, fecha),
                imagen = COALESCE($10, imagen)
            WHERE id = $11
            RETURNING *
        `;

        const values = [
            eventData.nombre,
            eventData.categoria,
            eventData.subcategoria,
            eventData.edad,
            eventData.personas,
            eventData.precio,
            eventData.localizacion,
            eventData.organizador,
            eventData.fecha,
            eventData.imagen,
            id
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id: string) {
        const query = 'DELETE FROM eventos WHERE id = $1';
        await pool.query(query, [id]);
    }
} 