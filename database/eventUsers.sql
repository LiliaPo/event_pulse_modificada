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

-- Corregir la tabla mensajes_foro
DROP TABLE IF EXISTS mensajes_foro;
CREATE TABLE mensajes_foro (
    id SERIAL PRIMARY KEY,
    evento_id INTEGER REFERENCES eventos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_mensajes_evento ON mensajes_foro(evento_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_usuario ON mensajes_foro(usuario_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_fecha ON mensajes_foro(fecha_creacion);

-- Permisos
GRANT ALL PRIVILEGES ON mensajes_foro TO eventpulse_user;

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

-- Insertar el usuario administrador si no existe
INSERT INTO usuarios (id, email, nombre, username, password, rol)
SELECT 
    gen_random_uuid(),
    'admin@admin.com',
    'Administrador',
    'admin',
    '$2b$10$YourHashedPasswordHere',  -- Contraseña: admin123 (hasheada)
    'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios WHERE email = 'admin@admin.com'
); 