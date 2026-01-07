import Produto from '../models/Produto.js';

// Controller responsável pela lógica de negócio dos produtos
class ProdutoController {
  // Listar todos os produtos do estoque
  static async listar(req, res) {
    try {
      const produtos = await Produto.listarTodos();
      res.json({
        total: produtos.length,
        produtos
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
  }

  // Buscar produto específico por ID
  static async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const produto = await Produto.buscarPorId(id);
      
      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }
      
      res.json(produto);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
  }

  // Filtrar produtos por categoria
  static async filtrarPorCategoria(req, res) {
    try {
      const categoria = req.params.categoria;
      const produtos = await Produto.buscarPorCategoria(categoria);
      
      res.json({
        categoria,
        total: produtos.length,
        produtos
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao filtrar produtos' });
    }
  }

  // Buscar produtos com estoque baixo (menos de 10 unidades)
  static async alertaEstoqueBaixo(req, res) {
    try {
      const produtos = await Produto.buscarEstoqueBaixo();
      
      res.json({
        alerta: 'Estoque baixo',
        total: produtos.length,
        produtos
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar produtos com estoque baixo' });
    }
  }

  // Criar novo produto
  static async criar(req, res) {
    try {
      const { nome, categoria, quantidade, unidade } = req.body;
      
      // Validar campos obrigatórios
      if (!nome || !categoria || quantidade === undefined || !unidade) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios: nome, categoria, quantidade, unidade' 
        });
      }
      
      const produto = await Produto.criar(req.body);
      
      res.status(201).json({
        mensagem: 'Produto adicionado com sucesso',
        produto
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao adicionar produto' });
    }
  }

  // Atualizar produto completo
  static async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nome, categoria, quantidade, unidade } = req.body;
      
      // Validar campos obrigatórios
      if (!nome || !categoria || quantidade === undefined || !unidade) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios: nome, categoria, quantidade, unidade' 
        });
      }
      
      const produto = await Produto.atualizar(id, req.body);
      
      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }
      
      res.json({
        mensagem: 'Produto atualizado com sucesso',
        produto
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }
  }

  // Atualizar apenas quantidade (entrada/saída de estoque)
  static async atualizarQuantidade(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { operacao, quantidade } = req.body;
      
      // Validar campos obrigatórios
      if (!operacao || quantidade === undefined) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios: operacao (entrada/saida), quantidade' 
        });
      }
      
      const qtd = Number(quantidade);
      const produtoAtual = await Produto.buscarPorId(id);
      
      if (!produtoAtual) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }
      
      let novaQuantidade;
      
      // Calcular nova quantidade baseada na operação
      if (operacao === 'entrada') {
        novaQuantidade = produtoAtual.quantidade + qtd;
      } else if (operacao === 'saida') {
        // Verificar se há quantidade suficiente
        if (produtoAtual.quantidade < qtd) {
          return res.status(400).json({ 
            erro: 'Quantidade insuficiente em estoque',
            disponivel: produtoAtual.quantidade
          });
        }
        novaQuantidade = produtoAtual.quantidade - qtd;
      } else {
        return res.status(400).json({ 
          erro: 'Operação deve ser "entrada" ou "saida"' 
        });
      }
      
      const produto = await Produto.atualizarQuantidade(id, novaQuantidade);
      
      res.json({
        mensagem: `${operacao} de ${qtd} ${produtoAtual.unidade} realizada`,
        produto
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar quantidade' });
    }
  }

  // Remover produto do estoque
  static async remover(req, res) {
    try {
      const id = parseInt(req.params.id);
      const produto = await Produto.remover(id);
      
      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }
      
      res.json({
        mensagem: 'Produto removido com sucesso',
        produto
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover produto' });
    }
  }
}

export default ProdutoController;