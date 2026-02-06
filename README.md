# 🍽️ Sistema de Estoque - Restaurante

API REST para gerenciamento de estoque de produtos alimentícios de um restaurante com **frontend moderno e intuitivo**.

## ✨ Novo Frontend Moderno

O frontend foi completamente redesenhado com:

### 🎨 Design Moderno
- **Tema Dark/Light**: Alternância entre temas claro e escuro
- **Gradientes e Animações**: Interface mais atrativa com transições suaves
- **Cards Interativos**: Efeitos hover e animações de entrada
- **Tipografia Melhorada**: Fonte Inter para melhor legibilidade
- **Cores Inteligentes**: Sistema de cores por categoria de produtos

### 📱 Interface Responsiva
- **Mobile First**: Otimizado para dispositivos móveis
- **Navegação Adaptativa**: Menu drawer em telas pequenas
- **Layout Flexível**: Adapta-se a qualquer tamanho de tela

### 🚀 Funcionalidades Avançadas
- **Dashboard com Estatísticas**: Métricas em tempo real do estoque
- **Filtros Inteligentes**: Busca por nome e categoria
- **Formulário em Etapas**: Processo guiado para adicionar produtos
- **Notificações**: Feedback visual para todas as ações
- **Scroll to Top**: Botão flutuante para voltar ao topo

### 🎯 Experiência do Usuário
- **Loading States**: Indicadores de carregamento elegantes
- **Validação em Tempo Real**: Feedback imediato nos formulários
- **Confirmações**: Diálogos de confirmação para ações críticas
- **Estados Vazios**: Mensagens amigáveis quando não há dados

## 🚀 Como usar

### Opção 1: Com Docker (Recomendado)

```bash
# Subir todos os serviços
docker-compose up --build

# Acessar:
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Banco: localhost:5432
```

### Opção 2: Desenvolvimento local

```bash
# 1. Subir apenas o banco
docker-compose up postgres -d

# 2. Instalar dependências do backend
npm install

# 3. Rodar backend
npm start

# 4. Em outro terminal, rodar frontend
cd frontend
npm install
npm start
```

## 📋 Endpoints Disponíveis

### Listar Produtos
- **GET** `/estoque` - Lista todos os produtos do estoque

### Buscar Produto
- **GET** `/estoque/:id` - Busca produto por ID

### Filtrar por Categoria
- **GET** `/estoque/categoria/:categoria` - Filtra produtos por categoria
  - Exemplos: `/estoque/categoria/carnes`, `/estoque/categoria/vegetais`

### Alerta de Estoque Baixo
- **GET** `/estoque/alerta/baixo` - Lista produtos com menos de 10 unidades

### Adicionar Produto
- **POST** `/estoque`
```json
{
  "nome": "Cebola",
  "categoria": "Vegetais",
  "quantidade": 30,
  "unidade": "kg",
  "dataValidade": "2024-02-10",
  "fornecedor": "Hortifruti Silva"
}
```

### Atualizar Produto
- **PUT** `/estoque/:id` - Atualiza produto completo

### Movimentar Estoque
- **PATCH** `/estoque/:id/quantidade` - Entrada ou saída de produtos
```json
{
  "operacao": "entrada",
  "quantidade": 10
}
```
ou
```json
{
  "operacao": "saida",
  "quantidade": 5
}
```

### Remover Produto
- **DELETE** `/estoque/:id` - Remove produto do estoque

## 📊 Exemplos de Uso

### Testar com curl:

```bash
# Listar todos os produtos
curl http://localhost:3000/estoque

# Adicionar novo produto
curl -X POST http://localhost:3000/estoque \
  -H "Content-Type: application/json" \
  -d '{"nome":"Batata","categoria":"Vegetais","quantidade":40,"unidade":"kg"}'

# Dar baixa no estoque (saída)
curl -X PATCH http://localhost:3000/estoque/1/quantidade \
  -H "Content-Type: application/json" \
  -d '{"operacao":"saida","quantidade":5}'

# Verificar produtos com estoque baixo
curl http://localhost:3000/estoque/alerta/baixo
```

## 🏗️ Estrutura dos Dados

Cada produto possui:
- **id**: Identificador único
- **nome**: Nome do produto
- **categoria**: Categoria (Carnes, Vegetais, Grãos, etc.)
- **quantidade**: Quantidade em estoque
- **unidade**: Unidade de medida (kg, litros, unidades)
- **dataValidade**: Data de validade (opcional)
- **fornecedor**: Nome do fornecedor (opcional)

## 🎨 Tecnologias do Frontend

- **React 18**: Framework principal
- **Material-UI v5**: Componentes e design system
- **React Router v7**: Navegação
- **Axios**: Requisições HTTP
- **CSS3**: Animações e efeitos customizados
- **Inter Font**: Tipografia moderna

## 🌟 Destaques do Novo Design

### Dashboard Inteligente
- Estatísticas em tempo real
- Gráficos de progresso
- Alertas visuais para estoque baixo
- Cards com animações

### Lista de Produtos Moderna
- Cards com cores por categoria
- Filtros avançados
- Busca em tempo real
- Menu de ações por produto
- Skeleton loading

### Formulário Intuitivo
- Processo em 3 etapas
- Validação em tempo real
- Chips para seleção rápida
- Confirmação visual dos dados

### Navegação Fluida
- Header com gradiente
- Menu responsivo
- Botão de tema dark/light
- Scroll suave

O frontend agora oferece uma experiência profissional e moderna, mantendo a funcionalidade completa do sistema de estoque!