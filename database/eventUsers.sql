-- Eliminar la tabla si existe
DROP TABLE IF EXISTS eventos CASCADE;

-- Crear la tabla con la estructura correcta
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    localizacion VARCHAR(255) NOT NULL,
    direccion TEXT,
    descripcion TEXT,
    telefono_contacto VARCHAR(20),  -- Añadida esta columna
    organizador VARCHAR(255),
    precio DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ahora insertar los eventos
INSERT INTO eventos (
    nombre, 
    categoria, 
    fecha, 
    localizacion, 
    direccion, 
    descripcion, 
    telefono_contacto, 
    organizador, 
    precio
) VALUES 
('Concierto de Rock', 'musica', '2024-04-15 20:00:00', 'Castellón', 'Plaza Mayor 1', 'Gran concierto de rock con bandas locales', '666777888', 'Ayuntamiento de Castellón', 15.00),
('Partido de Baloncesto', 'deporte', '2024-04-20 18:30:00', 'Castellón', 'Pabellón Municipal', 'Partido de liga local', '666999888', 'Club Baloncesto Castellón', 10.00),
('Exposición de Arte', 'arte', '2024-04-25 10:00:00', 'Castellón', 'Museo de Bellas Artes', 'Exposición de artistas locales', '666555444', 'Museo de Castellón', 5.00),
('Cine al aire libre', 'cine', '2024-05-01 21:30:00', 'Castellón', 'Parque Ribalta', 'Proyección de películas clásicas', '666333222', 'CineForum Castellón', 0.00),
('Festival Gastronómico', 'restaurante', '2024-05-05 12:00:00', 'Castellón', 'Plaza Santa Clara', 'Degustación de platos típicos', '666111000', 'Asociación de Restaurantes', 25.00);