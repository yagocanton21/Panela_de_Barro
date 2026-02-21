// Página do dashboard com estatísticas
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Skeleton,
  LinearProgress,
  Fade,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Assessment as AssessmentIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { estoqueAPI, categoriasAPI } from '../services/api';

const Dashboard = () => {
  // Estado das estatísticas
  const [stats, setStats] = useState({
    totalProdutos: 0,
    produtosBaixoEstoque: 0,
    categorias: 0,
    quantidadeTotal: 0,
    produtosVencendo: 0,
    categoriaMaisUsada: ''
  });
  const [produtosVencendoLista, setProdutosVencendoLista] = useState([]);
  const [dialogVencimento, setDialogVencimento] = useState(false);
  const [loading, setLoading] = useState(true);

  // Carrega dados ao montar
  useEffect(() => {
    carregarDados();
  }, []);

  // Busca produtos e calcula estatísticas
  const carregarDados = async () => {
    try {
      const response = await estoqueAPI.listar({ page: 1, limit: 9999 });
      const produtos = response.data.produtos || [];
      
      const produtosBaixoEstoque = produtos.filter(p => p.quantidade < 10).length;
      const quantidadeTotal = produtos.reduce((acc, p) => acc + p.quantidade, 0);
      // Buscar contagem real de categorias a partir da API de categorias
      let categoriasCount = 0;
      try {
        const respCats = await categoriasAPI.listar();
        categoriasCount = (respCats.data.categorias || []).length;
      } catch (e) {
        console.warn('Não foi possível buscar categorias, usando valor derivado dos produtos');
        categoriasCount = [...new Set(produtos.map(p => p.categoria))].length;
      }
      
      // Produtos vencendo em 7 dias
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const seteDias = new Date(hoje);
      seteDias.setDate(hoje.getDate() + 7);
      
      const listaProdutosVencendo = produtos.filter(p => {
        if (!p.dataValidade) return false;
        const dataValidade = new Date(p.dataValidade);
        dataValidade.setHours(0, 0, 0, 0);
        return dataValidade >= hoje && dataValidade <= seteDias;
      });
      
      setProdutosVencendoLista(listaProdutosVencendo);
      
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
        categorias: categoriasCount,
        quantidadeTotal,
        produtosVencendo: listaProdutosVencendo.length,
        categoriaMaisUsada
      });
      

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Componente de card de estatística
  const StatCard = ({ title, value, icon, color, subtitle, progress, index }) => (
    <Zoom in={!loading} timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
      <Card 
        elevation={0}
        sx={{ 
          height: '100%', 
          border: '1px solid', 
          borderColor: 'divider',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 12px 24px ${color}20`,
            borderColor: color,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: 3, 
              bgcolor: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box sx={{ color: color, display: 'flex' }}>
                {icon}
              </Box>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {subtitle}
            </Typography>
          </Box>
          
          <Typography variant="h3" sx={{ fontWeight: 700, color: color, mb: 1 }}>
            {loading ? <Skeleton width={60} /> : value}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
            {title}
          </Typography>
          
          {progress !== undefined && (
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                bgcolor: `${color}15`,
                '& .MuiLinearProgress-bar': {
                  bgcolor: color,
                  borderRadius: 3
                }
              }} 
            />
          )}
        </CardContent>
      </Card>
    </Zoom>
  );



  const calcularProgresso = (valor, total) => {
    if (total === 0) return 0;
    return Math.min((valor / total) * 100, 100);
  };

  const formatarData = (data) => {
    if (!data) return '';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
            Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Visão geral do seu estoque em tempo real
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total de Produtos"
            value={stats.totalProdutos}
            icon={<InventoryIcon sx={{ fontSize: 28 }} />}
            color="#8b4513"
            subtitle="CADASTRADOS"
            progress={calcularProgresso(stats.totalProdutos, 100)}
            index={0}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Estoque Baixo"
            value={stats.produtosBaixoEstoque}
            icon={<WarningIcon sx={{ fontSize: 28 }} />}
            color="#daa520"
            subtitle="ATENÇÃO"
            progress={calcularProgresso(stats.produtosBaixoEstoque, stats.totalProdutos)}
            index={1}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Categorias Ativas"
            value={stats.categorias}
            icon={<CategoryIcon sx={{ fontSize: 28 }} />}
            color="#d2691e"
            subtitle="TIPOS"
            progress={calcularProgresso(stats.categorias, 20)}
            index={2}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Quantidade Total"
            value={stats.quantidadeTotal}
            icon={<TrendingUpIcon sx={{ fontSize: 28 }} />}
            color="#8fbc8f"
            subtitle="UNIDADES"
            progress={calcularProgresso(stats.quantidadeTotal, 1000)}
            index={3}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12} md={6}>
          <Zoom in={!loading} timeout={300} style={{ transitionDelay: '400ms' }}>
            <Card 
              elevation={0}
              onClick={() => stats.produtosVencendo > 0 && setDialogVencimento(true)}
              sx={{ 
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #cd5c5c15 0%, #cd5c5c05 100%)',
                transition: 'all 0.3s ease',
                cursor: stats.produtosVencendo > 0 ? 'pointer' : 'default',
                '&:hover': {
                  transform: stats.produtosVencendo > 0 ? 'translateY(-4px)' : 'none',
                  boxShadow: stats.produtosVencendo > 0 ? '0 12px 24px #cd5c5c20' : 'none',
                  borderColor: stats.produtosVencendo > 0 ? '#cd5c5c' : 'divider',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #cd5c5c, #cd5c5c80)',
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 3, 
                    bgcolor: '#cd5c5c15',
                    mr: 2
                  }}>
                    <CalendarIcon sx={{ fontSize: 32, color: '#cd5c5c' }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#cd5c5c' }}>
                      {loading ? <Skeleton width={40} /> : stats.produtosVencendo}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      PRÓXIMOS 7 DIAS
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Produtos Vencendo
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.produtosVencendo > 0 ? 'Clique para ver detalhes' : 'Nenhum produto vencendo'}
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>

        <Grid item xs={12} md={6}>
          <Zoom in={!loading} timeout={300} style={{ transitionDelay: '500ms' }}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #d2691e15 0%, #d2691e05 100%)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px #d2691e20',
                  borderColor: '#d2691e',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #d2691e, #d2691e80)',
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: 3, 
                    bgcolor: '#d2691e15',
                    mr: 2
                  }}>
                    <AssessmentIcon sx={{ fontSize: 32, color: '#d2691e' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#d2691e', mb: 0.5 }}>
                      {loading ? <Skeleton width={100} /> : stats.categoriaMaisUsada}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      CATEGORIA PRINCIPAL
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Categoria Mais Usada
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categoria com maior número de produtos
                </Typography>
              </CardContent>
            </Card>
          </Zoom>
        </Grid>
      </Grid>

      <Dialog
        open={dialogVencimento}
        onClose={() => setDialogVencimento(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ mr: 1, color: '#cd5c5c' }} />
            Produtos Vencendo (7 dias)
          </Box>
          <IconButton onClick={() => setDialogVencimento(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <List>
            {produtosVencendoLista.map((produto) => (
              <ListItem
                key={produto.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  mb: 1,
                  '&:last-child': { mb: 0 }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {produto.nome}
                      </Typography>
                      <Chip
                        label={produto.categoria}
                        size="small"
                        sx={{ bgcolor: '#cd5c5c15', color: '#cd5c5c' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Validade: <strong>{formatarData(produto.dataValidade)}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantidade: {produto.quantidade} {produto.unidade}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Dashboard;