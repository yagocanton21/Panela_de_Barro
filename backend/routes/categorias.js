import express from 'express';
import CategoriaController from '../controllers/CategoriaController.js';

// Rotas para gerenciamento de categorias
const router = express.Router();

// GET /categorias - Listar todas as categorias
router.get('/', CategoriaController.listar);

// POST /categorias - Criar nova categoria
router.post('/', CategoriaController.criar);

// PUT /categorias/:id - Atualizar categoria
router.put('/:id', CategoriaController.atualizar);

// DELETE /categorias/:id - Remover categoria
router.delete('/:id', CategoriaController.remover);

export default router;