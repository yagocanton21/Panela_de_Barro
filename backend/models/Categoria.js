import pool from '../database.js';

class Categoria {
  static async listarTodas() {
    const result = await pool.query('SELECT * FROM categorias ORDER BY nome');
    return result.rows;
  }

  static async buscarPorId(id) {
    const result = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async criar(nome) {
    const result = await pool.query(
      'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    return result.rows[0];
  }

  static async atualizar(id, nome) {
    const result = await pool.query(
      'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    return result.rows[0];
  }

  static async remover(id) {
    const result = await pool.query('DELETE FROM categorias WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
}

export default Categoria;