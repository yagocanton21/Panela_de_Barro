// Middleware de autenticação
import pool from '../database.js';

// Verifica token e autentica usuário
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId] = decoded.split(':');

    const result = await pool.query(
      'SELECT id, nome, email, role FROM usuarios WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ erro: 'Token inválido' });
    }

    req.usuario = result.rows[0];
    next();
  } catch (erro) {
    console.error('Erro na autenticação:', erro);
    res.status(401).json({ erro: 'Token inválido' });
  }
};
