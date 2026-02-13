import pool from '../database.js';

class AuthController {
  async login(req, res) {
    try {
      const { username, senha } = req.body;

      if (!username || !senha) {
        return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
      }

      const result = await pool.query(
        'SELECT id, nome, email, username, role FROM usuarios WHERE username = $1 AND senha = $2',
        [username, senha]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ erro: 'Usuário ou senha inválidos' });
      }

      const usuario = result.rows[0];
      
      // Token simples (em produção, use JWT)
      const token = Buffer.from(`${usuario.id}:${usuario.username}:${Date.now()}`).toString('base64');

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

  async registrar(req, res) {
    try {
      const { nome, username, senha } = req.body;

      if (!nome || !username || !senha) {
        return res.status(400).json({ erro: 'Nome, usuário e senha são obrigatórios' });
      }

      const result = await pool.query(
        'INSERT INTO usuarios (nome, username, senha, role) VALUES ($1, $2, $3, $4) RETURNING id, nome, username, role',
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

  async verificarToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
      }

      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [userId] = decoded.split(':');

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
