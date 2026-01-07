import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';

// Definição das rotas para produtos do estoque
const router = express.Router();

// GET /estoque - Listar todos os produtos
router.get('/', ProdutoController.listar);

// GET /estoque/:id - Buscar produto por ID
router.get('/:id', ProdutoController.buscarPorId);

// GET /estoque/categoria/:categoria - Filtrar por categoria
router.get('/categoria/:categoria', ProdutoController.filtrarPorCategoria);

// GET /estoque/alerta/baixo - Produtos com estoque baixo
router.get('/alerta/baixo', ProdutoController.alertaEstoqueBaixo);

// POST /estoque - Criar novo produto
router.post('/', ProdutoController.criar);

// PUT /estoque/:id - Atualizar produto completo
router.put('/:id', ProdutoController.atualizar);

// PATCH /estoque/:id/quantidade - Atualizar apenas quantidade
router.patch('/:id/quantidade', ProdutoController.atualizarQuantidade);

// DELETE /estoque/:id - Remover produto
router.delete('/:id', ProdutoController.remover);

export default router;