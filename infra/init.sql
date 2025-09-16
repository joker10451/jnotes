-- Инициализация базы данных JNotes
CREATE DATABASE jnotes;
CREATE USER jnotes WITH PASSWORD 'jnotes_password';
GRANT ALL PRIVILEGES ON DATABASE jnotes TO jnotes;

-- Создание расширений
\c jnotes;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
