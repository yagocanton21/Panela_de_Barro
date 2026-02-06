import pool from '../database.js';

// Model para operações de categoria no banco de dados
class Categoria {
  // Listar todas as categorias ordenadas por nome
  static async listarTodas() {
    const result = await pool.query('SELECT * FROM categorias ORDER BY nome');
    return result.rows;
  }

  // Buscar categoria por ID
  static async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Criar nova categoria
  static async criar(nome) {
    const result = await pool.query(
      'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    return result.rows[0];
  }

  // Atualizar categoria existente
  static async atualizar(id, nome) {
    const result = await pool.query(
      'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    return result.rows[0];
  }

  // Remover categoria
  static async remover(id) {
    const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

export default Categoria;