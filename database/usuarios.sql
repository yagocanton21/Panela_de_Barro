-- Tabela de usuários para autenticação
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuário admin padrão (email: admin@restaurante.com, senha: admin123)
INSERT INTO usuarios (nome, email, senha, role) 
VALUES ('Administrador', 'admin@restaurante.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Usuário teste (email: user@restaurante.com, senha: user123)
INSERT INTO usuarios (nome, email, senha, role) 
VALUES ('Usuário Teste', 'user@restaurante.com', 'user123', 'user')
ON CONFLICT (email) DO NOTHING;
