import pool from '../database.js';

class HistoricoController {
  async listar(req, res) {
    try {
      const { produtoId, usuarioId, tipo, limit = 50, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT 
          h.*,
          p.nome as produto_nome,
          u.nome as usuario_nome,
          u.username as usuario_username
        FROM historico_movimentacoes h
        LEFT JOIN produtos p ON h.produto_id = p.id
        LEFT JOIN usuarios u ON h.usuario_id = u.id
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 1;

      if (produtoId) {
        query += ` AND h.produto_id = $${paramCount}`;
        params.push(produtoId);
        paramCount++;
      }

      if (usuarioId) {
        query += ` AND h.usuario_id = $${paramCount}`;
        params.push(usuarioId);
        paramCount++;
      }

      if (tipo) {
        query += ` AND h.tipo = $${paramCount}`;
        params.push(tipo);
        paramCount++;
      }

      query += ` ORDER BY h.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      params.push(limit, offset);

      const result = await pool.query(query, params);

      const countQuery = `SELECT COUNT(*) FROM historico_movimentacoes WHERE 1=1`;
      const countResult = await pool.query(countQuery);
      const total = parseInt(countResult.rows[0].count);

      res.json({
        historico: result.rows,
        paginacao: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (erro) {
      console.error('Erro ao listar histórico:', erro);
      res.status(500).json({ erro: 'Erro ao listar histórico' });
    }
  }

  async registrar(produtoId, usuarioId, tipo, quantidadeAnterior, quantidadeNova, descricao) {
    try {
      await pool.query(
        `INSERT INTO historico_movimentacoes 
        (produto_id, usuario_id, tipo, quantidade_anterior, quantidade_nova, descricao) 
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [produtoId, usuarioId, tipo, quantidadeAnterior, quantidadeNova, descricao]
      );
    } catch (erro) {
      console.error('Erro ao registrar histórico:', erro);
    }
  }
}

export default new HistoricoController();
