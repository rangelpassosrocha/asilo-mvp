CREATE DATABASE IF NOT EXISTS asilo_db;
USE asilo_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('admin','funcionario','cliente') NOT NULL DEFAULT 'cliente'
);


CREATE TABLE IF NOT EXISTS idosos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE,
    quarto VARCHAR(50),
    observacoes TEXT
);

CREATE TABLE IF NOT EXISTS medicacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    dosagem VARCHAR(100),
    horario VARCHAR(100),
    observacoes TEXT
);


CREATE TABLE IF NOT EXISTS funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(100),
    telefone VARCHAR(20),
    observacoes TEXT
);


CREATE TABLE IF NOT EXISTS visitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    visitante VARCHAR(100) NOT NULL,
    idoso VARCHAR(100) NOT NULL,
    data_visita DATE,
    horario VARCHAR(20),
    observacoes TEXT
);


-- usuário admin inicial (senha: admin123)
INSERT INTO usuarios (nome, email, senha, tipo)
VALUES (
  'Administrador',
  'admin@asilo.com',
  '$2a$10$V1lSH9sI7SCFZmPpbi.T2O2GQnqYztyj7jKhXGbGJkmcT7GWCOkSe',
  'admin'
)
ON DUPLICATE KEY UPDATE email = email;
