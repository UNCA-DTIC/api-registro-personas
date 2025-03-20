CREATE TABLE personas (
    id SERIAL PRIMARY KEY,
    cuit VARCHAR(20) UNIQUE NOT NULL,  -- cuit como identificador único
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    nacionalidad VARCHAR(50),
    sexo CHAR(1),
    estado_civil VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE domicilios (
    id SERIAL PRIMARY KEY,
    persona_id INT REFERENCES personas(id) ON DELETE CASCADE,
    calle VARCHAR(255),
    numero VARCHAR(10),
    ciudad VARCHAR(255),
    provincia VARCHAR(255),   
    pais VARCHAR(255), 
    codigo_postal VARCHAR(10),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE telefonos (
    id SERIAL PRIMARY KEY,
    persona_id INT REFERENCES personas(id) ON DELETE CASCADE,
    telefono VARCHAR(20) NOT NULL,
    tipo VARCHAR(20),  -- Ejemplo: "Celular", "Fijo"
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE emails (
    id SERIAL PRIMARY KEY,
    persona_id INT REFERENCES personas(id) ON DELETE CASCADE,
    email VARCHAR(100) NOT NULL,
    tipo VARCHAR(20),  -- Ejemplo: "Personal", "Trabajo"
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

