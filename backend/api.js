import express from "express";
import pool from "./database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// GET - Listar todos os produtos do estoque
app.get('/estoque', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos ORDER BY id');
        res.json({
            total: result.rows.length,
            produtos: result.rows
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
});

// GET - Buscar produto por ID
app.get('/estoque/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
});

// GET - Filtrar produtos por categoria
app.get('/estoque/categoria/:categoria', async (req, res) => {
    try {
        const categoria = req.params.categoria;
        const result = await pool.query(
            'SELECT * FROM produtos WHERE LOWER(categoria) = LOWER($1)', 
            [categoria]
        );
        
        res.json({
            categoria,
            total: result.rows.length,
            produtos: result.rows
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao filtrar produtos' });
    }
});

// GET - Produtos com estoque baixo (menos de 10 unidades)
app.get('/estoque/alerta/baixo', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produtos WHERE quantidade < 10');
        
        res.json({
            alerta: 'Estoque baixo',
            total: result.rows.length,
            produtos: result.rows
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar produtos com estoque baixo' });
    }
});

// POST - Adicionar novo produto
app.post('/estoque', async (req, res) => {
    try {
        const { nome, categoria, quantidade, unidade, dataValidade, fornecedor } = req.body;
        
        if (!nome || !categoria || quantidade === undefined || !unidade) {
            return res.status(400).json({ 
                erro: 'Campos obrigatórios: nome, categoria, quantidade, unidade' 
            });
        }
        
        const result = await pool.query(
            'INSERT INTO produtos (nome, categoria, quantidade, unidade, data_validade, fornecedor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nome, categoria, Number(quantidade), unidade, dataValidade || null, fornecedor || null]
        );
        
        res.status(201).json({
            mensagem: 'Produto adicionado com sucesso',
            produto: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao adicionar produto' });
    }
});

// PUT - Atualizar produto completo
app.put('/estoque/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nome, categoria, quantidade, unidade, dataValidade, fornecedor } = req.body;
        
        if (!nome || !categoria || quantidade === undefined || !unidade) {
            return res.status(400).json({ 
                erro: 'Campos obrigatórios: nome, categoria, quantidade, unidade' 
            });
        }
        
        const result = await pool.query(
            'UPDATE produtos SET nome = $1, categoria = $2, quantidade = $3, unidade = $4, data_validade = $5, fornecedor = $6 WHERE id = $7 RETURNING *',
            [nome, categoria, Number(quantidade), unidade, dataValidade || null, fornecedor || null, id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        res.json({
            mensagem: 'Produto atualizado com sucesso',
            produto: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }
});

// PATCH - Atualizar apenas a quantidade (entrada/saída de estoque)
app.patch('/estoque/:id/quantidade', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { operacao, quantidade } = req.body;
        
        if (!operacao || quantidade === undefined) {
            return res.status(400).json({ 
                erro: 'Campos obrigatórios: operacao (entrada/saida), quantidade' 
            });
        }
        
        const qtd = Number(quantidade);
        
        // Buscar produto atual
        const produtoResult = await pool.query('SELECT * FROM produtos WHERE id = $1', [id]);
        
        if (produtoResult.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        const produto = produtoResult.rows[0];
        let novaQuantidade;
        
        if (operacao === 'entrada') {
            novaQuantidade = produto.quantidade + qtd;
        } else if (operacao === 'saida') {
            if (produto.quantidade < qtd) {
                return res.status(400).json({ 
                    erro: 'Quantidade insuficiente em estoque',
                    disponivel: produto.quantidade
                });
            }
            novaQuantidade = produto.quantidade - qtd;
        } else {
            return res.status(400).json({ 
                erro: 'Operação deve ser "entrada" ou "saida"' 
            });
        }
        
        const result = await pool.query(
            'UPDATE produtos SET quantidade = $1 WHERE id = $2 RETURNING *',
            [novaQuantidade, id]
        );
        
        res.json({
            mensagem: `${operacao} de ${qtd} ${produto.unidade} realizada`,
            produto: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar quantidade' });
    }
});

// DELETE - Remover produto
app.delete('/estoque/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        
        res.json({
            mensagem: 'Produto removido com sucesso',
            produto: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao remover produto' });
    }
});

// Rota raiz com informações da API
app.get('/', (req, res) => {
    res.json({
        nome: 'API Sistema de Estoque - Restaurante',
        versao: '1.0.0',
        endpoints: {
            'GET /estoque': 'Listar todos os produtos',
            'GET /estoque/:id': 'Buscar produto por ID',
            'GET /estoque/categoria/:categoria': 'Filtrar por categoria',
            'GET /estoque/alerta/baixo': 'Produtos com estoque baixo',
            'POST /estoque': 'Adicionar novo produto',
            'PUT /estoque/:id': 'Atualizar produto completo',
            'PATCH /estoque/:id/quantidade': 'Atualizar quantidade (entrada/saída)',
            'DELETE /estoque/:id': 'Remover produto'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🍽️  Sistema de Estoque do Restaurante rodando na porta ${PORT}`);
    console.log(`📊 Acesse http://localhost:${PORT} para ver os endpoints disponíveis`);
});