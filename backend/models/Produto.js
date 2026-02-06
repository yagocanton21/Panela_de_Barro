import pool from '../database.js';

// Model responsável pelo acesso aos dados dos produtos
class Produto {
  // Buscar todos os produtos ordenados por ID
  static async listarTodos() {
    const result = await pool.query(`
      SELECT p.*, c.nome as categoria 
      FROM produtos p 
      JOIN categorias c ON p.categoria_id = c.id 
      ORDER BY p.id
    `);
    return result.rows;
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

  // Buscar produtos com estoque baixo (menos de 10 unidades)
  static async buscarEstoqueBaixo() {
    const result = await pool.query(`
      SELECT p.*, c.nome as categoria 
      FROM produtos p 
      JOIN categorias c ON p.categoria_id = c.id 
      WHERE p.quantidade < 10
    `);
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
    const { nome, categoriaId, quantidade, unidade, dataValidade, fornecedor } = dados;
    const result = await pool.query(
      'INSERT INTO produtos (nome, categoria_id, quantidade, unidade, data_validade, fornecedor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, categoriaId, Number(quantidade), unidade, dataValidade || null, fornecedor || null]
    );
    return result.rows[0];
  }

  // Atualizar produto existente
  static async atualizar(id, dados) {
    const { nome, categoriaId, quantidade, unidade, dataValidade, fornecedor } = dados;
    const result = await pool.query(
      'UPDATE produtos SET nome = $1, categoria_id = $2, quantidade = $3, unidade = $4, data_validade = $5, fornecedor = $6 WHERE id = $7 RETURNING *',
      [nome, categoriaId, Number(quantidade), unidade, dataValidade || null, fornecedor || null, id]
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