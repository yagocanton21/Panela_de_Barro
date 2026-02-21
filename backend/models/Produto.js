import pool from '../database.js';

// Model responsável pelo acesso aos dados dos produtos
class Produto {
  // Buscar todos os produtos ordenados por ID (com paginação e filtros)
  static async listarTodos(limit, offset, nome, categoriaId) {
    let query = 'SELECT p.*, c.nome as categoria FROM produtos p JOIN categorias c ON p.categoria_id = c.id';
    let countQuery = 'SELECT COUNT(*) FROM produtos p';
    const params = [];
    const conditions = [];
    
    if (nome) {
      conditions.push(`p.nome ILIKE $${params.length + 1}`);
      params.push(`%${nome}%`);
    }
    
    if (categoriaId) {
      conditions.push(`p.categoria_id = $${params.length + 1}`);
      params.push(categoriaId);
    }
    
    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      query += whereClause;
      countQuery += whereClause;
    }
    
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    query += ` ORDER BY p.id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    return { produtos: result.rows, total };
  }

  // Buscar produto por ID específico
  static async buscarPorId(id) {
    const result = await pool.query(`
      SELECT p.*, c.nome as categoria 
      FROM produtos p 
      JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.id = $1
    `, [id]);
    return result.rows[0];
  }

  // Buscar produtos por categoria
  static async buscarPorCategoria(categoriaId) {
    const result = await pool.query(`
      SELECT p.*, c.nome as categoria 
      FROM produtos p 
      JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.categoria_id = $1
    `, [categoriaId]);
    return result.rows;
  }

  // Buscar produtos com estoque baixo (quantidade < estoque_minimo)
  static async buscarEstoqueBaixo() {
    const result = await pool.query(`
      SELECT p.*, c.nome as categoria 
      FROM produtos p 
      JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.quantidade < COALESCE(p.estoque_minimo, 10)
    `);
    return result.rows;
  }

  // Buscar produtos vencendo nos próximos X dias
  static async buscarVencendo(dias = 7) {
    const result = await pool.query(`
      SELECT p.*, c.nome as categoria 
      FROM produtos p 
      JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.data_validade IS NOT NULL
      AND p.data_validade BETWEEN CURRENT_DATE AND (CURRENT_DATE + $1::INTEGER)
      ORDER BY p.data_validade ASC
    `, [dias]);
    return result.rows;
  }

  // Buscar produtos por nome (busca parcial, case-insensitive)
  static async buscarPorNome(nome) {
    const result = await pool.query(`
      SELECT p.*, c.nome as categoria 
      FROM produtos p 
      JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.nome ILIKE $1
      ORDER BY p.nome
    `, [`%${nome}%`]);
    return result.rows;
  }

  // Criar novo produto no banco
  static async criar(dados) {
    const { nome, categoriaId, quantidade, unidade, estoqueMinimo, dataValidade, fornecedor } = dados;
    const result = await pool.query(
      'INSERT INTO produtos (nome, categoria_id, quantidade, unidade, estoque_minimo, data_validade, fornecedor) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nome, categoriaId, Number(quantidade), unidade, estoqueMinimo || 10, dataValidade || null, fornecedor || null]
    );
    return result.rows[0];
  }

  // Atualizar produto existente
  static async atualizar(id, dados) {
    const { nome, categoriaId, quantidade, unidade, estoqueMinimo, dataValidade, fornecedor } = dados;
    const result = await pool.query(
      'UPDATE produtos SET nome = $1, categoria_id = $2, quantidade = $3, unidade = $4, estoque_minimo = $5, data_validade = $6, fornecedor = $7 WHERE id = $8 RETURNING *',
      [nome, categoriaId, Number(quantidade), unidade, estoqueMinimo || 10, dataValidade || null, fornecedor || null, id]
    );
    return result.rows[0];
  }

  // Atualizar apenas a quantidade do produto
  static async atualizarQuantidade(id, novaQuantidade) {
    const result = await pool.query(
      'UPDATE produtos SET quantidade = $1 WHERE id = $2 RETURNING *',
      [novaQuantidade, id]
    );
    return result.rows[0];
  }

  // Remover produto do banco
  static async remover(id) {
    const result = await pool.query('DELETE FROM produtos WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

export default Produto;