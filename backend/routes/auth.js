// Rotas de autenticação
import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// POST /auth/login - Login
router.post('/login', AuthController.login);

// POST /auth/registrar - Registrar novo usuário
router.post('/registrar', AuthController.registrar);

// GET /auth/verificar - Verificar token
router.get('/verificar', AuthController.verificarToken);

export default router;
