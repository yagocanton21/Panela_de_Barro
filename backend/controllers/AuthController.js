// Controller de autenticação
import pool from '../database.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'troque-este-segredo-em-producao';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

class AuthController {
  // Login de usuário
  async login(req, res) {
    try {
      const { username, senha } = req.body;

      if (!username || !senha) {
        return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
      }

      const result = await pool.query(
        'SELECT id, nome, username, role FROM usuarios WHERE username = $1 AND senha = crypt($2, senha)',
        [username, senha]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
      }

      const usuario = result.rows[0];
      
      // Token simples (em produção, use JWT)
      const token = jwt.sign(
        { sub: usuario.id, username: usuario.username, role: usuario.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      res.json({
        mensagem: 'Login realizado com sucesso',
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          username: usuario.username,
          role: usuario.role
        },
        token
      });
    } catch (erro) {
      console.error('Erro no login:', erro);
      res.status(500).json({ erro: 'Erro ao realizar login' });
    }
  }

  // Registrar novo usuário
  async registrar(req, res) {
    try {
      const { nome, username, senha } = req.body;

      if (!nome || !username || !senha) {
        return res.status(400).json({ erro: 'Nome, usuário e senha são obrigatórios' });
      }

      const result = await pool.query(
        'INSERT INTO usuarios (nome, username, senha, role) VALUES ($1, $2, crypt($3, gen_salt(\'bf\')), $4) RETURNING id, nome, username, role',
        [nome, username, senha, 'user']
      );

      res.status(201).json({
        mensagem: 'Usuário registrado com sucesso',
        usuario: result.rows[0]
      });
    } catch (erro) {
      if (erro.code === '23505') {
        return res.status(409).json({ erro: 'Usuário já cadastrado' });
      }
      console.error('Erro ao registrar:', erro);
      res.status(500).json({ erro: 'Erro ao registrar usuário' });
    }
  }

  // Verificar validade do token
  async verificarToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
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

      res.json({ usuario: result.rows[0] });
    } catch (erro) {
      console.error('Erro ao verificar token:', erro);
      res.status(401).json({ erro: 'Token inválido' });
    }
  }
}

export default new AuthController();
