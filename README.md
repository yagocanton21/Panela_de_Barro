# 🍽️ Sistema de Estoque - Restaurante

Sistema completo para gerenciamento de estoque de produtos alimentícios com **arquitetura MVC**, **API REST** e **frontend moderno em React**.

## 🏗️ Arquitetura do Projeto

```
├── backend/              # API REST (Node.js + Express)
│   ├── controllers/      # Lógica de negócio
│   ├── models/          # Modelos de dados (PostgreSQL)
│   └── routes/          # Definição de rotas
├── frontend/            # Interface React + Material-UI
│   ├── components/      # Componentes reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   └── services/       # Integração com API
├── database/           # Scripts SQL de inicialização
└── docker/            # Configurações Docker
```

## ✨ Funcionalidades

### 🎯 Gerenciamento de Produtos
- ✅ Listar todos os produtos do estoque
- ✅ **Paginação inteligente** (controle de itens por página)
- ✅ Buscar produtos por nome ou ID
- ✅ Filtrar produtos por categoria
- ✅ Adicionar novos produtos
- ✅ Editar informações de produtos
- ✅ Controlar entrada e saída de estoque
- ✅ Remover produtos
- ✅ Alertas de estoque baixo (< 10 unidades)

### 📊 Gerenciamento de Categorias
- ✅ Criar categorias personalizadas
- ✅ Editar categorias existentes
- ✅ Remover categorias
- ✅ Categorias padrão: Carnes, Vegetais, Grãos, Laticínios, Bebidas, Temperos, Frutas

### 🎨 Interface Moderna
- **Material-UI v5**: Design system profissional
- **Dashboard Interativo**: Estatísticas em tempo real
- **Busca e Filtros**: Localização rápida de produtos
- **Formulários Validados**: Entrada de dados segura
- **Responsivo**: Funciona em desktop, tablet e mobile

## 🚀 Como Executar

### Opção 1: Com Docker (Recomendado)

```bash
# Navegar até a pasta docker
cd docker

# Subir todos os serviços
docker-compose up --build

# Acessar:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# PostgreSQL: localhost:5432
```

### Opção 2: Desenvolvimento Local

**Pré-requisitos:**
- Node.js 18+
- PostgreSQL 15+

```bash
# 1. Configurar banco de dados
psql -U postgres
CREATE DATABASE estoque;
\i database/init.sql

# (Opcional) Popular com 100 produtos de exemplo para testar paginação
\i database/seed-produtos.sql

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# 3. Backend
cd backend
npm install
npm start          # Produção
npm run dev        # Desenvolvimento (hot reload)

# 4. Frontend (em outro terminal)
cd frontend
npm install
npm start
```

## 📋 API Endpoints

### 🛒 Produtos (/estoque)

| Método | Endpoint | Descrição |
|--------|----------|----------|
| GET | `/estoque` | Lista todos os produtos |
| GET | `/estoque?page=1&limit=10` | Lista produtos com paginação |
| GET | `/estoque/buscar?nome=xxx` | Busca produtos por nome |
| GET | `/estoque/:id` | Busca produto por ID |
| GET | `/estoque/categoria/:categoriaId` | Filtra por categoria (ID) |
| GET | `/estoque/alerta/baixo` | Produtos com estoque < 10 |
| POST | `/estoque` | Adiciona novo produto |
| PUT | `/estoque/:id` | Atualiza produto completo |
| PATCH | `/estoque/:id/quantidade` | Atualiza quantidade (entrada/saída) |
| DELETE | `/estoque/:id` | Remove produto |

### 🏷️ Categorias (/categorias)

| Método | Endpoint | Descrição |
|--------|----------|----------|
| GET | `/categorias` | Lista todas as categorias |
| POST | `/categorias` | Cria nova categoria |
| PUT | `/categorias/:id` | Atualiza categoria |
| DELETE | `/categorias/:id` | Remove categoria |

## 📊 Exemplos de Requisições

### Listar Produtos com Paginação
```bash
# Página 1, 10 itens por página
curl http://localhost:3001/estoque?page=1&limit=10

# Página 2, 20 itens por página
curl http://localhost:3001/estoque?page=2&limit=20
```

**Resposta:**
```json
{
  "produtos": [...],
  "paginacao": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### Adicionar Produto
```bash
curl -X POST http://localhost:3001/estoque \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Cebola",
    "categoriaId": 2,
    "quantidade": 30,
    "unidade": "kg",
    "dataValidade": "2024-12-31",
    "fornecedor": "Hortifruti Silva"
  }'
```

### Movimentar Estoque (Entrada)
```bash
curl -X PATCH http://localhost:3001/estoque/1/quantidade \
  -H "Content-Type: application/json" \
  -d '{"operacao": "entrada", "quantidade": 10}'
```

### Movimentar Estoque (Saída)
```bash
curl -X PATCH http://localhost:3001/estoque/1/quantidade \
  -H "Content-Type: application/json" \
  -d '{"operacao": "saida", "quantidade": 5}'
```

### Buscar Produtos por Nome
```bash
curl http://localhost:3001/estoque/buscar?nome=cebola
```

### Criar Nova Categoria
```bash
curl -X POST http://localhost:3001/categorias \
  -H "Content-Type: application/json" \
  -d '{"nome": "Congelados"}'
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: categorias
```sql
id              SERIAL PRIMARY KEY
nome            VARCHAR(100) UNIQUE NOT NULL
created_at      TIMESTAMP
```

### Tabela: produtos
```sql
id              SERIAL PRIMARY KEY
nome            VARCHAR(255) NOT NULL
categoria_id    INTEGER REFERENCES categorias(id)
quantidade      INTEGER DEFAULT 0
unidade         VARCHAR(20) NOT NULL
data_validade   DATE
fornecedor      VARCHAR(255)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **pg** - Driver PostgreSQL para Node.js
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **React 18** - Biblioteca UI
- **Material-UI v5** - Componentes e design system
- **React Router v6** - Navegação SPA
- **Axios** - Cliente HTTP
- **@emotion** - CSS-in-JS

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **GitHub Actions** - CI/CD

## 📁 Páginas do Frontend

- **Dashboard** - Visão geral e estatísticas do estoque
- **Produtos Estoque** - Listagem e gerenciamento de produtos
- **Adicionar Produto** - Formulário de cadastro
- **Editar Produto** - Formulário de edição
- **Gerenciar Categorias** - CRUD de categorias


## 🧪 Testes

```bash
# Frontend
cd frontend
npm test
``