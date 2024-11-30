import { Pool } from 'pg';
import pool from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export interface IEvent {
    id?: string;
    nombre: string;
    categoria: string;
    subcategoria?: string;
    fecha: Date;
    localizacion: string;
    direccion?: string;
    imagen?: string;
    descripcion?: string;
    organizador: string;
    precio?: number;
    url?: string;
    lat?: number;
    lng?: number;
    valoracion?: number;
}

export class Event {
    static async create(eventData: IEvent) {
        const query = `
            INSERT INTO eventos (
                id, nombre, categoria, subcategoria, fecha,
                localizacion, direccion, imagen, descripcion,
                organizador, precio, url, lat, lng, usuario_id
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9,
                $10, $11, $12, $13, $14, $15
            )
            RETURNING *
        `;

        const values = [
            uuidv4(),
            eventData.nombre,
            eventData.categoria,
            eventData.subcategoria || null,
            eventData.fecha,
            eventData.localizacion,
            eventData.direccion || null,
            eventData.imagen || null,
            eventData.descripcion || null,
            eventData.organizador,
            eventData.precio || 0,
            eventData.url || null,
            eventData.lat || null,
            eventData.lng || null,
            null  // usuario_id
        ];

        try {
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error SQL:', error);
            throw error;
        }
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
                fecha = COALESCE($4, fecha),
                localizacion = COALESCE($5, localizacion),
                direccion = COALESCE($6, direccion),
                imagen = COALESCE($7, imagen),
                descripcion = COALESCE($8, descripcion),
                organizador = COALESCE($9, organizador),
                precio = COALESCE($10, precio),
                url = COALESCE($11, url),
                lat = COALESCE($12, lat),
                lng = COALESCE($13, lng),
                valoracion = COALESCE($14, valoracion)
            WHERE id = $15
            RETURNING *
        `;

        const values = [
            eventData.nombre,
            eventData.categoria,
            eventData.subcategoria,
            eventData.fecha,
            eventData.localizacion,
            eventData.direccion,
            eventData.imagen,
            eventData.descripcion,
            eventData.organizador,
            eventData.precio,
            eventData.url,
            eventData.lat,
            eventData.lng,
            eventData.valoracion,
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