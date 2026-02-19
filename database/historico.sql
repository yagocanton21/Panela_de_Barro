-- Tabela de histórico de movimentações
CREATE TABLE IF NOT EXISTS historico_movimentacoes (
  id SERIAL PRIMARY KEY,
  produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
  usuario_id INTEGER REFERENCES usuarios(id),
  tipo VARCHAR(50) NOT NULL, -- 'adicionar', 'editar', 'remover', 'entrada', 'saida'
  quantidade_anterior INTEGER,
  quantidade_nova INTEGER,
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_historico_produto ON historico_movimentacoes(produto_id);
CREATE INDEX IF NOT EXISTS idx_historico_usuario ON historico_movimentacoes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_historico_data ON historico_movimentacoes(created_at);
