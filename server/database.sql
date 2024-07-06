CREATE DATABASE attendance_app;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(50),
    position VARCHAR(100),
    photo_profil VARCHAR,
    password VARCHAR(255) NOT NULL,
    default_password BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

--example fake users
INSERT INTO users (role_id, full_name, email, phone_number, position, photo_profil, password)
VALUES (
    (SELECT id FROM Roles WHERE name = 'User'), 
    'Employee1', 
    'employee1@gmail.com', 
    '085798118457', 
    'Developer', 
    'default.jpg', 
    'employee123'
);
