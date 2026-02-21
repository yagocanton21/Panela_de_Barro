-- Tabela de usuarios para autenticacao
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuario admin padrao (username: admin, senha: admin123)
INSERT INTO usuarios (nome, username, senha, role)
VALUES ('Administrador', 'admin', crypt('admin123', gen_salt('bf')), 'admin')
ON CONFLICT (username) DO NOTHING;

-- Usuario teste (username: user, senha: user123)
INSERT INTO usuarios (nome, username, senha, role)
VALUES ('Usuario Teste', 'user', crypt('user123', gen_salt('bf')), 'user')
ON CONFLICT (username) DO NOTHING;
