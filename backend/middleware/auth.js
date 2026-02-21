// Middleware de autenticação
import pool from '../database.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'troque-este-segredo-em-producao';

// Verifica token e autentica usuário
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.sub;

    const result = await pool.query(
      'SELECT id, nome, username, role FROM usuarios WHERE id = $1',
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
