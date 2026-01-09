import express from "express";
import dotenv from "dotenv";
import estoqueRoutes from "./routes/estoque.js";
import categoriasRoutes from "./routes/categorias.js";

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware para parsing JSON
app.use(express.json());

// Middleware CORS - permitir requisições do frontend
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Rotas da API
app.use('/estoque', estoqueRoutes);
app.use('/categorias', categoriasRoutes);

// Rota raiz com informações da API
app.get('/', (req, res) => {
    res.json({
        nome: 'API Sistema de Estoque - Restaurante',
        versao: '1.0.0',
        arquitetura: 'MVC',
        endpoints: {
            'GET /estoque': 'Listar todos os produtos',
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
            'DELETE /categorias/:id': 'Remover categoria'
        }
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🍽️  Sistema de Estoque do Restaurante rodando na porta ${PORT}`);
    console.log(`📊 Acesse http://localhost:${PORT} para ver os endpoints disponíveis`);
});