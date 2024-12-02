import { Request, Response } from 'express';
import pool from '../config/database.js';

// Función auxiliar para geocodificar dirección
async function geocodificarDireccion(direccion: string) {
    try {
        console.log('Geocodificando dirección:', direccion);

        if (!direccion.trim()) {
            console.error('Dirección vacía');
            return null;
        }

        // Coordenadas específicas para ciudades conocidas
        const ciudadesConocidas: { [key: string]: { lat: number, lng: number } } = {
            'castellon': { lat: 39.9864, lng: -0.0513 },
            'castellón': { lat: 39.9864, lng: -0.0513 },
            'castellon de la plana': { lat: 39.9864, lng: -0.0513 },
            'castellón de la plana': { lat: 39.9864, lng: -0.0513 }
        };

        // Comprobar si es una ciudad conocida
        const ciudadNormalizada = direccion.toLowerCase().trim();
        if (ciudadesConocidas[ciudadNormalizada]) {
            console.log('Usando coordenadas predefinidas para:', direccion);
            return ciudadesConocidas[ciudadNormalizada];
        }

        // Si no es una ciudad conocida, usar la API de geocodificación
        const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
        url.searchParams.append('address', `${direccion}, España`);
        url.searchParams.append('key', 'AIzaSyDx4-sx2MxIhgWXYgLWxMzWS_SpTj0oy5U');
        url.searchParams.append('language', 'es');
        url.searchParams.append('region', 'ES');
        url.searchParams.append('components', 'country:ES');

        console.log('URL de geocodificación:', url.toString());

        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Respuesta de geocodificación:', data);

        if (data.status === 'OK' && data.results[0]) {
            const result = data.results[0];
            const location = result.geometry.location;
            const lat = parseFloat(location.lat);
            const lng = parseFloat(location.lng);

            if (isNaN(lat) || isNaN(lng)) {
                console.error('Coordenadas inválidas recibidas:', location);
                return null;
            }

            const resultado = { lat, lng };
            console.log('Coordenadas obtenidas:', resultado);
            return resultado;
        }

        console.error('No se encontraron resultados para la dirección');
        return null;
    } catch (error) {
        console.error('Error geocodificando dirección:', error);
        return null;
    }
}

export const createEvent = async (req: Request, res: Response) => {
    try {
        console.log('Creando evento con datos:', req.body);
        const {
            nombre,
            categoria,
            fecha,
            localizacion,
            direccion,
            descripcion,
            telefono_contacto,
            organizador,
            precio
        } = req.body;

        let coordenadas = null;

        // Intentar primero con la ciudad específica
        if (localizacion) {
            coordenadas = await geocodificarDireccion(localizacion);
        }

        // Si no funciona, intentar con la dirección completa
        if (!coordenadas && direccion) {
            const direccionCompleta = `${direccion}, ${localizacion}`;
            coordenadas = await geocodificarDireccion(direccionCompleta);
        }

        if (!coordenadas) {
            return res.status(400).json({
                message: 'No se pudo obtener la ubicación exacta. Por favor, verifica que la ciudad esté correctamente escrita.'
            });
        }

        // Verificar que las coordenadas sean válidas
        if (isNaN(coordenadas.lat) || isNaN(coordenadas.lng)) {
            return res.status(400).json({
                message: 'Las coordenadas obtenidas no son válidas. Por favor, verifica la dirección.'
            });
        }

        console.log('Coordenadas finales obtenidas:', coordenadas);

        // Crear la consulta SQL con las coordenadas
        const query = `
            INSERT INTO eventos (
                nombre, 
                categoria, 
                fecha, 
                localizacion, 
                direccion,
                descripcion,
                telefono_contacto,
                organizador, 
                precio,
                lat,
                lng,
                created_at,
                updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            ) RETURNING *;
        `;

        const values = [
            nombre,
            categoria,
            new Date(fecha),
            localizacion,
            direccion || null,
            descripcion || null,
            telefono_contacto || null,
            organizador || null,
            parseFloat(precio) || 0,
            coordenadas.lat,
            coordenadas.lng
        ];

        console.log('Ejecutando query con valores:', values);

        const result = await pool.query(query, values);
        console.log('Evento creado:', result.rows[0]);

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear evento:', error);
        return res.status(500).json({ 
            message: 'Error al crear el evento',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const getAllEvents = async (req: Request, res: Response) => {
    try {
        console.log('Recibida petición GET /api/events');
        const result = await pool.query(`
            SELECT * FROM eventos 
            ORDER BY fecha DESC
        `);
        
        console.log('Eventos obtenidos de la BD:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ 
            message: 'Error al obtener eventos',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('Actualizando evento con ID:', id);
        console.log('Datos recibidos:', req.body);

        // Primero verificar si el evento existe
        const checkEvent = await pool.query(
            'SELECT * FROM eventos WHERE id = $1',
            [id]
        );

        if (checkEvent.rows.length === 0) {
            console.log('Evento no encontrado para actualizar, ID:', id);
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        const {
            nombre,
            categoria,
            fecha,
            localizacion,
            direccion,
            descripcion,
            telefono_contacto,
            organizador,
            precio
        } = req.body;

        // Geocodificar la dirección si ha cambiado
        let coordenadas = null;
        if (localizacion !== checkEvent.rows[0].localizacion || direccion !== checkEvent.rows[0].direccion) {
            coordenadas = await geocodificarDireccion(localizacion);
            if (!coordenadas && direccion) {
                coordenadas = await geocodificarDireccion(`${direccion}, ${localizacion}`);
            }
        }

        const result = await pool.query(
            `UPDATE eventos 
             SET nombre = $1,
                 categoria = $2,
                 fecha = $3,
                 localizacion = $4,
                 direccion = $5,
                 descripcion = $6,
                 telefono_contacto = $7,
                 organizador = $8,
                 precio = $9,
                 lat = COALESCE($10, lat),
                 lng = COALESCE($11, lng),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $12 
             RETURNING *`,
            [
                nombre,
                categoria,
                new Date(fecha),
                localizacion,
                direccion || null,
                descripcion || null,
                telefono_contacto || null,
                organizador || null,
                parseFloat(precio) || 0,
                coordenadas ? coordenadas.lat : null,
                coordenadas ? coordenadas.lng : null,
                id
            ]
        );

        console.log('Evento actualizado:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ 
            message: 'Error al actualizar el evento',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM eventos WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json({ message: 'Evento eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ message: 'Error al eliminar el evento' });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log('Buscando evento con ID:', id);

        const result = await pool.query(
            'SELECT * FROM eventos WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            console.log('Evento no encontrado con ID:', id);
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        console.log('Evento encontrado:', result.rows[0]);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener evento por ID:', error);
        res.status(500).json({ 
            message: 'Error al obtener el evento',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};

export const testEndpoint = async (req: Request, res: Response) => {
    res.json({ message: 'El endpoint funciona' });
}; 