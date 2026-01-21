import Categoria from '../models/Categoria.js';

// Controller para gerenciar operações de categorias
class CategoriaController {
  // Listar todas as categorias
  static async listar(req, res) {
    try {
      const categorias = await Categoria.listarTodas();
      res.json({ categorias });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar categorias' });
    }
  }

  // Criar nova categoria
  static async criar(req, res) {
    try {
      const { nome } = req.body;
      
      // Validar nome obrigatório
      if (!nome) {
        return res.status(400).json({ erro: 'Nome da categoria é obrigatório' });
      }
      
      const categoria = await Categoria.criar(nome);
      res.status(201).json({
        mensagem: 'Categoria criada com sucesso',
        categoria
      });
    } catch (error) {
      // Erro de categoria duplicada
      if (error.code === '23505') {
        return res.status(400).json({ erro: 'Categoria já existe' });
      }
      res.status(500).json({ erro: 'Erro ao criar categoria' });
    }
  }

  // Atualizar categoria existente
  static async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nome } = req.body;
      
      // Validar nome obrigatório
      if (!nome) {
        return res.status(400).json({ erro: 'Nome da categoria é obrigatório' });
      }
      
      const categoria = await Categoria.atualizar(id, nome);
      
      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
      }
      
      res.json({
        mensagem: 'Categoria atualizada com sucesso',
        categoria
      });
    } catch (error) {
      // Erro de categoria duplicada
      if (error.code === '23505') {
        return res.status(400).json({ erro: 'Categoria já existe' });
      }
      res.status(500).json({ erro: 'Erro ao atualizar categoria' });
    }
  }

  // Remover categoria
  static async remover(req, res) {
    try {
      const id = parseInt(req.params.id);
      const categoria = await Categoria.remover(id);
      
      if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada' });
      }
      
      res.json({
        mensagem: 'Categoria removida com sucesso',
        categoria
      });
    } catch (error) {
      // Erro de constraint - categoria tem produtos associados
      if (error.code === '23503') {
        return res.status(400).json({ erro: 'Não é possível remover categoria com produtos associados' });
      }
      res.status(500).json({ erro: 'Erro ao remover categoria' });
    }
  }
}

export default CategoriaController;