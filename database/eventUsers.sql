-- Crear tabla de usuarios
CREATE TABLE usuarios (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    whatsapp VARCHAR(20),
    instagram VARCHAR(255),
    imagen_perfil TEXT,
    rol VARCHAR(20) DEFAULT 'usuario',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de eventos
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    subcategoria VARCHAR(50),
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    localizacion VARCHAR(255) NOT NULL,
    direccion TEXT,
    imagen TEXT,
    descripcion TEXT,
    organizador VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2),
    url TEXT,
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    usuario_id UUID REFERENCES usuarios(id),
    valoracion DECIMAL(3,1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de mensajes del foro
CREATE TABLE mensajes_foro (
    id SERIAL PRIMARY KEY,
    evento_id VARCHAR(255) REFERENCES eventos(id),
    usuario_id UUID REFERENCES usuarios(id),
    mensaje TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices
CREATE INDEX idx_eventos_categoria ON eventos(categoria);
CREATE INDEX idx_eventos_fecha ON eventos(fecha);
CREATE INDEX idx_eventos_usuario_id ON eventos(usuario_id);
CREATE INDEX idx_mensajes_evento_id ON mensajes_foro(evento_id);

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_eventos_updated_at
    BEFORE UPDATE ON eventos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 