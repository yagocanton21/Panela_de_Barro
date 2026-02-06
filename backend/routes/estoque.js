import express from 'express';
import ProdutoController from '../controllers/ProdutoController.js';

// Definição das rotas para produtos do estoque
const router = express.Router();

// GET /estoque - Listar todos os produtos
router.get('/', ProdutoController.listar);

// GET /estoque/buscar?nome=xxx - Buscar produtos por nome
router.get('/buscar', ProdutoController.buscarPorNome);

// GET /estoque/alerta/baixo - Produtos com estoque baixo (rotas específicas primeiro)
router.get('/alerta/baixo', ProdutoController.alertaEstoqueBaixo);

// GET /estoque/categoria/:categoriaId - Filtrar por categoria
router.get('/categoria/:categoriaId', ProdutoController.filtrarPorCategoria);

// GET /estoque/:id - Buscar produto por ID (rota genérica por último)
router.get('/:id', ProdutoController.buscarPorId);

// POST /estoque - Criar novo produto
router.post('/', ProdutoController.criar);

// PUT /estoque/:id - Atualizar produto completo
router.put('/:id', ProdutoController.atualizar);

// PATCH /estoque/:id/quantidade - Atualizar apenas quantidade
router.patch('/:id/quantidade', ProdutoController.atualizarQuantidade);

// DELETE /estoque/:id - Remover produto
router.delete('/:id', ProdutoController.remover);

export default router;