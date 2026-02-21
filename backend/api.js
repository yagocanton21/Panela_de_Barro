// Arquivo principal da API
import express from "express";
import dotenv from "dotenv";
import estoqueRoutes from "./routes/estoque.js";
import categoriasRoutes from "./routes/categorias.js";
import authRoutes from "./routes/auth.js";
import historicoRoutes from "./routes/historico.js";
import { authMiddleware } from "./middleware/auth.js";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

// Middleware para parsing JSON
app.use(express.json());

// Middleware CORS - permitir requisições do frontend
app.use((req, res, next) => {
    const requestOrigin = req.headers.origin;
    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        res.header("Access-Control-Allow-Origin", requestOrigin);
    }
    res.header("Vary", "Origin");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Rotas da API
app.use('/auth', authRoutes);
app.use('/estoque', authMiddleware, estoqueRoutes);
app.use('/categorias', authMiddleware, categoriasRoutes);
app.use('/historico', authMiddleware, historicoRoutes);

// Rota raiz com informações da API
app.get('/', (req, res) => {
    res.json({
        nome: 'API Sistema de Estoque - Restaurante',
        versao: '1.0.0',
        arquitetura: 'MVC',
        endpoints: {
            'POST /auth/login': 'Login de usuário',
            'POST /auth/registrar': 'Registrar novo usuário',
            'GET /auth/verificar': 'Verificar token',
            'GET /estoque': 'Listar todos os produtos',
            'GET /estoque/buscar?nome=xxx': 'Buscar produtos por nome',
            'GET /estoque/:id': 'Buscar produto por ID',
            'GET /estoque/categoria/:categoriaId': 'Filtrar por categoria',
            'GET /estoque/alerta/baixo': 'Produtos com estoque baixo',
            'POST /estoque': 'Adicionar novo produto',
            'PUT /estoque/:id': 'Atualizar produto completo',
            'PATCH /estoque/:id/quantidade': 'Atualizar quantidade (entrada/saída)',
            'DELETE /estoque/:id': 'Remover produto',
            'GET /categorias': 'Listar todas as categorias',
            'POST /categorias': 'Criar nova categoria',
            'PUT /categorias/:id': 'Atualizar categoria',
            'DELETE /categorias/:id': 'Remover categoria',
            'GET /historico': 'Listar histórico de movimentações'
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🍽️  Sistema de Estoque do Restaurante rodando na porta ${PORT}`);
    console.log(`📊 Acesse http://localhost:${PORT} para ver os endpoints disponíveis`);
});
