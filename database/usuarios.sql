-- Tabela de usuários para autenticação
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuário admin padrão (username: admin, senha: admin123)
INSERT INTO usuarios (nome, username, senha, role) 
VALUES ('Administrador', 'admin', 'admin123', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Usuário teste (username: user, senha: user123)
INSERT INTO usuarios (nome, username, senha, role) 
VALUES ('Usuário Teste', 'user', 'user123', 'user')
ON CONFLICT (username) DO NOTHING;
