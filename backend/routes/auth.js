import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/registrar', AuthController.registrar);
router.get('/verificar', AuthController.verificarToken);

export default router;
