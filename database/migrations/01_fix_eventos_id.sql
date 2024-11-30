-- Primero eliminamos la restricción de la clave primaria actual
ALTER TABLE eventos DROP CONSTRAINT eventos_pkey;

-- Cambiamos el tipo de la columna id a SERIAL
ALTER TABLE eventos 
    ALTER COLUMN id DROP NOT NULL,
    ALTER COLUMN id SET DEFAULT nextval('eventos_id_seq'::regclass);

-- Creamos la secuencia si no existe
CREATE SEQUENCE IF NOT EXISTS eventos_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Asignamos la secuencia a la columna id
ALTER TABLE eventos ALTER COLUMN id SET DEFAULT nextval('eventos_id_seq');

-- Volvemos a añadir la restricción de clave primaria
ALTER TABLE eventos ADD PRIMARY KEY (id); 