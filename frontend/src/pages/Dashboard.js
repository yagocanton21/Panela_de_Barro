import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Avatar,
  LinearProgress,
  Chip,
  IconButton,
  Fade,
  Grow
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Restaurant as RestaurantIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { estoqueAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    produtosBaixoEstoque: 0,
    categorias: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const response = await estoqueAPI.listar();
      const produtos = response.data.produtos || [];
      
      const produtosBaixoEstoque = produtos.filter(p => p.quantidade < 10).length;
      const categorias = [...new Set(produtos.map(p => p.categoria))].length;
      
      setStats({
        totalProdutos: produtos.length,
        produtosBaixoEstoque,
        categorias
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle, progress, delay = 0 }) => (
    <Grow in={!loading} timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
      <Card 
        elevation={0}
        sx={{ 
          height: '100%',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
          border: `1px solid ${color}30`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
              {icon}
            </Avatar>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
                {loading ? '-' : value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
          {progress !== undefined && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: `${color}20`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: color,
                  }
                }} 
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {progress}% do objetivo
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Grow>
  );

  const ActionCard = ({ title, description, icon, color, path, delay = 0 }) => (
    <Grow in={!loading} timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
      <Card 
        elevation={0}
        sx={{ 
          height: '100%',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${color}20`,
            borderColor: color,
          }
        }}
        component={Link}
        to={path}
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Avatar 
            sx={{ 
              bgcolor: `${color}15`, 
              color: color,
              width: 80, 
              height: 80, 
              mx: 'auto',
              mb: 3,
              fontSize: '2rem'
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>
          <Button
            variant="contained"
            sx={{ 
              bgcolor: color,
              '&:hover': { bgcolor: `${color}dd` },
              borderRadius: 3,
              px: 4,
              py: 1.5
            }}
            startIcon={icon}
          >
            Acessar
          </Button>
        </CardContent>
      </Card>
    </Grow>
  );

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header Hero */}
        <Fade in={!loading} timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              mb: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <RestaurantIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
                Panela de Barro
              </Typography>
              <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                Gerencie seu estoque com inteligência e eficiência
              </Typography>
              <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Sistema Completo" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  icon={<SpeedIcon />} 
                  label="Rápido & Eficiente" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip 
                  icon={<AnalyticsIcon />} 
                  label="Relatórios Detalhados" 
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Estatísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={6}>
            <StatCard
              title="Total de Produtos"
              value={stats.totalProdutos}
              icon={<InventoryIcon />}
              color="#00b894"
              subtitle="itens cadastrados"
              progress={Math.min((stats.totalProdutos / 100) * 100, 100)}
              delay={100}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <StatCard
              title="Estoque Baixo"
              value={stats.produtosBaixoEstoque}
              icon={<WarningIcon />}
              color="#fdcb6e"
              subtitle="precisam atenção"
              progress={stats.totalProdutos > 0 ? (stats.produtosBaixoEstoque / stats.totalProdutos) * 100 : 0}
              delay={200}
            />
          </Grid>
        </Grid>

        {/* Ações Rápidas */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
          Ações Rápidas
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ActionCard
              title="Visualizar Estoque"
              description="Veja todos os produtos, faça buscas e gerencie quantidades em tempo real"
              icon={<VisibilityIcon />}
              color="#00b894"
              path="/estoque"
              delay={500}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ActionCard
              title="Adicionar Produto"
              description="Cadastre novos itens no seu estoque de forma rápida e organizada"
              icon={<AddIcon />}
              color="#00cec9"
              path="/adicionar"
              delay={600}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;