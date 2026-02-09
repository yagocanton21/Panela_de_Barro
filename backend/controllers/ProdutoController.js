import Produto from '../models/Produto.js';

// Converter snake_case para camelCase
const converterParaCamelCase = (produto) => {
  if (!produto) return null;
  return {
    ...produto,
    categoriaId: produto.categoria_id,
    estoqueMinimo: produto.estoque_minimo,
    dataValidade: produto.data_validade,
    createdAt: produto.created_at,
    updatedAt: produto.updated_at
  };
};

// Controller responsável pela lógica de negócio dos produtos
class ProdutoController {
  // Listar todos os produtos do estoque (com paginação e filtros)
  static async listar(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { nome, categoriaId } = req.query;

      const { produtos, total } = await Produto.listarTodos(limit, offset, nome, categoriaId);
      
      res.json({
        produtos: produtos.map(converterParaCamelCase),
        paginacao: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
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
      
      res.json(converterParaCamelCase(produto));
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
  }

  // Filtrar produtos por categoria
  static async filtrarPorCategoria(req, res) {
    try {
      const categoriaId = parseInt(req.params.categoriaId);
      const produtos = await Produto.buscarPorCategoria(categoriaId);
      
      res.json({
        categoriaId,
        total: produtos.length,
        produtos: produtos.map(converterParaCamelCase)
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
        produtos: produtos.map(converterParaCamelCase)
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar produtos com estoque baixo' });
    }
  }

  // Buscar produtos por nome
  static async buscarPorNome(req, res) {
    try {
      const { nome } = req.query;
      
      if (!nome) {
        return res.status(400).json({ erro: 'Parâmetro "nome" é obrigatório' });
      }
      
      const produtos = await Produto.buscarPorNome(nome);
      
      res.json({
        busca: nome,
        total: produtos.length,
        produtos: produtos.map(converterParaCamelCase)
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar produtos por nome' });
    }
  }

  // Criar novo produto
  static async criar(req, res) {
    try {
      const { nome, categoriaId, quantidade, unidade, estoqueMinimo } = req.body;
      
      // Validar campos obrigatórios
      if (!nome || !categoriaId || quantidade === undefined || !unidade) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios: nome, categoriaId, quantidade, unidade' 
        });
      }

      // Validar nome não vazio
      if (nome.trim().length < 2) {
        return res.status(400).json({ erro: 'Nome deve ter no mínimo 2 caracteres' });
      }

      // Validar quantidade positiva
      if (quantidade < 0) {
        return res.status(400).json({ erro: 'Quantidade não pode ser negativa' });
      }

      // Validar estoque mínimo positivo
      if (estoqueMinimo !== undefined && estoqueMinimo < 0) {
        return res.status(400).json({ erro: 'Estoque mínimo não pode ser negativo' });
      }
      
      const produto = await Produto.criar(req.body);
      
      res.status(201).json({
        mensagem: 'Produto adicionado com sucesso',
        produto: converterParaCamelCase(produto)
      });
    } catch (error) {
      // Verificar se é erro de duplicação
      if (error.code === '23505') {
        return res.status(409).json({ 
          erro: 'Produto já existe no estoque. Atualize a quantidade ao invés de criar um novo.' 
        });
      }
      // Verificar se é erro de constraint
      if (error.code === '23514') {
        return res.status(400).json({ erro: 'Dados inválidos. Verifique os valores informados.' });
      }
      res.status(500).json({ erro: 'Erro ao adicionar produto' });
    }
  }

  // Atualizar produto completo
  static async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { nome, categoriaId, quantidade, unidade, estoqueMinimo } = req.body;
      
      // Validar campos obrigatórios
      if (!nome || !categoriaId || quantidade === undefined || !unidade) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios: nome, categoriaId, quantidade, unidade' 
        });
      }

      // Validar nome não vazio
      if (nome.trim().length < 2) {
        return res.status(400).json({ erro: 'Nome deve ter no mínimo 2 caracteres' });
      }

      // Validar quantidade positiva
      if (quantidade < 0) {
        return res.status(400).json({ erro: 'Quantidade não pode ser negativa' });
      }

      // Validar estoque mínimo positivo
      if (estoqueMinimo !== undefined && estoqueMinimo < 0) {
        return res.status(400).json({ erro: 'Estoque mínimo não pode ser negativo' });
      }
      
      const produto = await Produto.atualizar(id, req.body);
      
      if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
      }
      
      res.json({
        mensagem: 'Produto atualizado com sucesso',
        produto: converterParaCamelCase(produto)
      });
    } catch (error) {
      if (error.code === '23514') {
        return res.status(400).json({ erro: 'Dados inválidos. Verifique os valores informados.' });
      }
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

      // Validar quantidade positiva
      if (quantidade <= 0) {
        return res.status(400).json({ erro: 'Quantidade deve ser maior que zero' });
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
        produto: converterParaCamelCase(produto)
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
        produto: converterParaCamelCase(produto)
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao remover produto' });
    }
  }
}

export default ProdutoController;