-- Criar tabela de produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 0,
    unidade VARCHAR(20) NOT NULL,
    data_validade DATE,
    fornecedor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais
INSERT INTO produtos (nome, categoria, quantidade, unidade, data_validade, fornecedor) VALUES
('Tomate', 'Vegetais', 50, 'kg', '2024-02-15', 'Hortifruti Silva'),
('Frango', 'Carnes', 25, 'kg', '2024-01-20', 'Açougue Central'),
('Arroz', 'Grãos', 100, 'kg', '2024-12-31', 'Distribuidora Grãos');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at
CREATE TRIGGER update_produtos_updated_at 
    BEFORE UPDATE ON produtos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();