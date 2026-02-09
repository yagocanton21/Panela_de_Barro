-- Script para popular o banco com 100 produtos de exemplo
-- Execute após o init.sql para testar a paginação

-- Produtos de Carnes (categoria_id = 1)
INSERT INTO produtos (nome, categoria_id, quantidade, unidade, estoque_minimo, data_validade, fornecedor) VALUES
('Picanha', 1, 25, 'kg', 5, '2024-12-20', 'Frigorífico Bom Gosto'),
('Alcatra', 1, 30, 'kg', 5, '2024-12-18', 'Frigorífico Bom Gosto'),
('Filé Mignon', 1, 15, 'kg', 3, '2024-12-22', 'Frigorífico Premium'),
('Costela Bovina', 1, 40, 'kg', 10, '2024-12-25', 'Frigorífico Bom Gosto'),
('Frango Inteiro', 1, 50, 'kg', 15, '2024-12-15', 'Avícola Silva'),
('Peito de Frango', 1, 35, 'kg', 10, '2024-12-16', 'Avícola Silva'),
('Coxa de Frango', 1, 28, 'kg', 8, '2024-12-16', 'Avícola Silva'),
('Linguiça Toscana', 1, 20, 'kg', 5, '2024-12-30', 'Embutidos Artesanais'),
('Linguiça Calabresa', 1, 22, 'kg', 5, '2024-12-30', 'Embutidos Artesanais'),
('Bacon', 1, 18, 'kg', 5, '2025-01-10', 'Embutidos Premium'),
('Carne Moída', 1, 25, 'kg', 8, '2024-12-14', 'Frigorífico Bom Gosto'),
('Cupim', 1, 12, 'kg', 3, '2024-12-20', 'Frigorífico Premium'),
('Maminha', 1, 20, 'kg', 5, '2024-12-19', 'Frigorífico Bom Gosto'),
('Contrafilé', 1, 18, 'kg', 5, '2024-12-21', 'Frigorífico Premium');

-- Produtos de Vegetais (categoria_id = 2)
INSERT INTO produtos (nome, categoria_id, quantidade, unidade, estoque_minimo, fornecedor) VALUES
('Tomate', 2, 45, 'kg', 10, 'Hortifruti Silva'),
('Cebola', 2, 60, 'kg', 15, 'Hortifruti Silva'),
('Alho', 2, 15, 'kg', 5, 'Hortifruti Silva'),
('Batata', 2, 80, 'kg', 20, 'Hortifruti Central'),
('Cenoura', 2, 35, 'kg', 10, 'Hortifruti Silva'),
('Alface', 2, 25, 'unidade', 10, 'Hortifruti Orgânico'),
('Rúcula', 2, 15, 'maço', 5, 'Hortifruti Orgânico'),
('Couve', 2, 20, 'maço', 8, 'Hortifruti Orgânico'),
('Brócolis', 2, 18, 'kg', 5, 'Hortifruti Silva'),
('Couve-flor', 2, 16, 'kg', 5, 'Hortifruti Silva'),
('Pimentão Verde', 2, 22, 'kg', 8, 'Hortifruti Central'),
('Pimentão Vermelho', 2, 20, 'kg', 8, 'Hortifruti Central'),
('Abobrinha', 2, 28, 'kg', 10, 'Hortifruti Silva'),
('Berinjela', 2, 18, 'kg', 5, 'Hortifruti Silva'),
('Pepino', 2, 25, 'kg', 8, 'Hortifruti Central'),
('Chuchu', 2, 30, 'kg', 10, 'Hortifruti Silva');

-- Produtos de Grãos (categoria_id = 3)
INSERT INTO produtos (nome, categoria_id, quantidade, unidade, estoque_minimo, fornecedor) VALUES
('Arroz Branco', 3, 100, 'kg', 30, 'Distribuidora Grãos & Cia'),
('Arroz Integral', 3, 50, 'kg', 15, 'Distribuidora Grãos & Cia'),
('Feijão Preto', 3, 80, 'kg', 25, 'Distribuidora Grãos & Cia'),
('Feijão Carioca', 3, 90, 'kg', 30, 'Distribuidora Grãos & Cia'),
('Lentilha', 3, 25, 'kg', 8, 'Empório Natural'),
('Grão de Bico', 3, 30, 'kg', 10, 'Empório Natural'),
('Ervilha Seca', 3, 20, 'kg', 8, 'Empório Natural'),
('Quinoa', 3, 15, 'kg', 5, 'Empório Natural'),
('Aveia', 3, 35, 'kg', 10, 'Empório Natural'),
('Farinha de Trigo', 3, 60, 'kg', 20, 'Moinho São José'),
('Farinha de Milho', 3, 40, 'kg', 15, 'Moinho São José'),
('Fubá', 3, 30, 'kg', 10, 'Moinho São José'),
('Macarrão Espaguete', 3, 45, 'kg', 15, 'Massas Itália'),
('Macarrão Penne', 3, 40, 'kg', 15, 'Massas Itália');

-- Produtos de Laticínios (categoria_id = 4)
INSERT INTO produtos (nome, categoria_id, quantidade, unidade, estoque_minimo, data_validade, fornecedor) VALUES
('Leite Integral', 4, 60, 'litro', 20, '2024-12-25', 'Laticínios Bela Vista'),
('Leite Desnatado', 4, 40, 'litro', 15, '2024-12-25', 'Laticínios Bela Vista'),
('Iogurte Natural', 4, 35, 'kg', 10, '2024-12-20', 'Laticínios Bela Vista'),
('Queijo Mussarela', 4, 25, 'kg', 8, '2025-01-15', 'Queijaria Mineira'),
('Queijo Prato', 4, 20, 'kg', 5, '2025-01-15', 'Queijaria Mineira'),
('Queijo Parmesão', 4, 15, 'kg', 5, '2025-02-01', 'Queijaria Premium'),
('Requeijão', 4, 30, 'kg', 10, '2025-01-10', 'Laticínios Bela Vista'),
('Manteiga', 4, 22, 'kg', 8, '2025-01-20', 'Laticínios Bela Vista'),
('Creme de Leite', 4, 40, 'litro', 15, '2024-12-30', 'Laticínios Bela Vista'),
('Nata', 4, 18, 'kg', 5, '2024-12-28', 'Laticínios Bela Vista');

-- Produtos de Bebidas (categoria_id = 5)
INSERT INTO produtos (nome, categoria_id, quantidade, unidade, estoque_minimo, fornecedor) VALUES
('Água Mineral 500ml', 5, 200, 'unidade', 50, 'Distribuidora Bebidas'),
('Refrigerante Cola 2L', 5, 80, 'unidade', 30, 'Distribuidora Bebidas'),
('Refrigerante Guaraná 2L', 5, 75, 'unidade', 30, 'Distribuidora Bebidas'),
('Suco de Laranja', 5, 40, 'litro', 15, 'Sucos Naturais'),
('Suco de Uva', 5, 35, 'litro', 15, 'Sucos Naturais'),
('Cerveja Lata', 5, 150, 'unidade', 50, 'Distribuidora Bebidas'),
('Vinho Tinto', 5, 30, 'garrafa', 10, 'Adega Premium'),
('Vinho Branco', 5, 25, 'garrafa', 10, 'Adega Premium'),
('Café em Grão', 5, 20, 'kg', 8, 'Cafeteria Especial'),
('Chá Preto', 5, 15, 'kg', 5, 'Empório Natural');

-- Produtos de Temperos (categoria_id = 6)
INSERT INTO produtos (nome, categoria_id, quantidade, unidade, estoque_minimo, fornecedor) VALUES
('Sal Refinado', 6, 50, 'kg', 15, 'Distribuidora Temperos'),
('Açúcar Cristal', 6, 60, 'kg', 20, 'Distribuidora Temperos'),
('Pimenta do Reino', 6, 8, 'kg', 3, 'Empório Especiarias'),
('Orégano', 6, 5, 'kg', 2, 'Empório Especiarias'),
('Manjericão', 6, 4, 'kg', 2, 'Empório Especiarias'),
('Alecrim', 6, 3, 'kg', 1, 'Empório Especiarias'),
('Cominho', 6, 6, 'kg', 2, 'Empório Especiarias'),
('Páprica', 6, 7, 'kg', 3, 'Empório Especiarias'),
('Curry', 6, 5, 'kg', 2, 'Empório Especiarias'),
('Canela em Pó', 6, 4, 'kg', 2, 'Empório Especiarias'),
('Noz Moscada', 6, 3, 'kg', 1, 'Empório Especiarias'),
('Cravo', 6, 2, 'kg', 1, 'Empório Especiarias'),
('Azeite de Oliva', 6, 25, 'litro', 10, 'Importadora Mediterrâneo'),
('Vinagre', 6, 30, 'litro', 10, 'Distribuidora Temperos'),
('Molho de Soja', 6, 20, 'litro', 8, 'Importadora Oriental');

-- Produtos de Frutas (categoria_id = 7)
INSERT INTO produtos (nome, categoria_id, quantidade, unidade, estoque_minimo, fornecedor) VALUES
('Banana', 7, 50, 'kg', 15, 'Hortifruti Silva'),
('Maçã', 7, 40, 'kg', 12, 'Hortifruti Central'),
('Laranja', 7, 55, 'kg', 18, 'Hortifruti Silva'),
('Limão', 7, 30, 'kg', 10, 'Hortifruti Silva'),
('Mamão', 7, 35, 'kg', 10, 'Hortifruti Central'),
('Melancia', 7, 45, 'kg', 15, 'Hortifruti Silva'),
('Abacaxi', 7, 25, 'unidade', 10, 'Hortifruti Central'),
('Manga', 7, 30, 'kg', 10, 'Hortifruti Silva'),
('Uva', 7, 20, 'kg', 8, 'Hortifruti Premium'),
('Morango', 7, 15, 'kg', 5, 'Hortifruti Orgânico'),
('Pera', 7, 22, 'kg', 8, 'Hortifruti Central'),
('Kiwi', 7, 12, 'kg', 5, 'Hortifruti Premium'),
('Abacate', 7, 28, 'kg', 10, 'Hortifruti Silva'),
('Melão', 7, 32, 'kg', 12, 'Hortifruti Central');

-- Mensagem de confirmação
SELECT 'Banco populado com sucesso! Total de produtos:' as mensagem, COUNT(*) as total FROM produtos;
