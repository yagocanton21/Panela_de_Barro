import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Skeleton
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { estoqueAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    produtosBaixoEstoque: 0,
    categorias: 0,
    quantidadeTotal: 0,
    produtosVencendo: 0,
    categoriaMaisUsada: ''
  });
  const [produtosRecentes, setProdutosRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const response = await estoqueAPI.listar();
      const produtos = response.data.produtos || [];
      
      const produtosBaixoEstoque = produtos.filter(p => p.quantidade < 10).length;
      const categorias = [...new Set(produtos.map(p => p.categoria))];
      const quantidadeTotal = produtos.reduce((acc, p) => acc + p.quantidade, 0);
      
      // Produtos vencendo em 7 dias
      const hoje = new Date();
      const seteDias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
      const produtosVencendo = produtos.filter(p => {
        if (!p.dataValidade) return false;
        const dataValidade = new Date(p.dataValidade);
        return dataValidade <= seteDias && dataValidade >= hoje;
      }).length;
      
      // Categoria mais usada
      const categoriaCount = {};
      produtos.forEach(p => {
        categoriaCount[p.categoria] = (categoriaCount[p.categoria] || 0) + 1;
      });
      const categoriaMaisUsada = Object.keys(categoriaCount).reduce((a, b) => 
        categoriaCount[a] > categoriaCount[b] ? a : b, '') || 'Nenhuma';
      
      setStats({
        totalProdutos: produtos.length,
        produtosBaixoEstoque,
        categorias: categorias.length,
        quantidadeTotal,
        produtosVencendo,
        categoriaMaisUsada
      });
      
      // Últimos 5 produtos adicionados
      setProdutosRecentes(produtos.slice(-5).reverse());
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: 2, 
            bgcolor: `${color}.light`, 
            color: `${color}.main`,
            mr: 2
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: `${color}.main` }}>
              {loading ? <Skeleton width={40} /> : value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h6" color="text.primary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  const QuickAction = ({ title, icon, path, color }) => (
    <Button
      component={Link}
      to={path}
      variant="outlined"
      startIcon={icon}
      sx={{
        p: 2,
        height: '100%',
        borderColor: `${color}.main`,
        color: `${color}.main`,
        '&:hover': {
          borderColor: `${color}.dark`,
          bgcolor: `${color}.light`
        }
      }}
      fullWidth
    >
      {title}
    </Button>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral do seu estoque
        </Typography>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total de Produtos"
            value={stats.totalProdutos}
            icon={<InventoryIcon />}
            color="primary"
            subtitle="itens cadastrados"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Estoque Baixo"
            value={stats.produtosBaixoEstoque}
            icon={<WarningIcon />}
            color="warning"
            subtitle="precisam atenção"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Categorias"
            value={stats.categorias}
            icon={<CategoryIcon />}
            color="info"
            subtitle="diferentes tipos"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Quantidade Total"
            value={stats.quantidadeTotal}
            icon={<TrendingUpIcon />}
            color="success"
            subtitle="unidades em estoque"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Vencendo em 7 dias"
            value={stats.produtosVencendo}
            icon={<CalendarIcon />}
            color="error"
            subtitle="produtos próximos ao vencimento"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 2, 
                  bgcolor: 'secondary.light', 
                  color: 'secondary.main',
                  mr: 2
                }}>
                  <AssessmentIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                    {loading ? <Skeleton width={80} /> : stats.categoriaMaisUsada}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    categoria principal
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h6" color="text.primary">
                Categoria Mais Usada
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Ações Rápidas */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Ações Rápidas
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <QuickAction
                    title="Ver Estoque"
                    icon={<VisibilityIcon />}
                    path="/estoque"
                    color="primary"
                  />
                </Grid>
                <Grid item xs={12}>
                  <QuickAction
                    title="Adicionar Produto"
                    icon={<AddIcon />}
                    path="/adicionar"
                    color="success"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Produtos Recentes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Produtos Recentes
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Box key={i} sx={{ mb: 2 }}>
                    <Skeleton height={20} width="60%" />
                    <Skeleton height={16} width="40%" />
                  </Box>
                ))
              ) : produtosRecentes.length > 0 ? (
                <List dense>
                  {produtosRecentes.map((produto, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <InventoryIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={produto.nome}
                        secondary={`${produto.categoria} - ${produto.quantidade} ${produto.unidade || 'un'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  Nenhum produto cadastrado ainda
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;