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
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Fade,
  Pagination,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Inventory as InventoryIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  TrendingDown as TrendingDownIcon,
  Category as CategoryIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { estoqueAPI, categoriasAPI } from '../services/api';
import EstatisticasEstoque from '../components/EstatisticasEstoque';

const ProdutosEstoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, produto: null });
  const [filtro, setFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [produtoMenu, setProdutoMenu] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [movimentacaoInputs, setMovimentacaoInputs] = useState({});
  const [movimentacaoLoadingId, setMovimentacaoLoadingId] = useState(null);
  const [itensPorPagina, setItensPorPagina] = useState(() => {
    const saved = localStorage.getItem('itensPorPagina');
    return saved ? parseInt(saved) : 9;
  });

  useEffect(() => {
    carregarCategorias();
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [page, itensPorPagina, categoriaFiltro, filtro]);

  const carregarCategorias = async () => {
    try {
      const response = await categoriasAPI.listar();
      setCategorias(response.data.categorias);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  useEffect(() => {
    let produtosFiltrados = produtos;
    setProdutosFiltrados(produtosFiltrados);
  }, [produtos]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const params = { page, limit: itensPorPagina };
      
      if (filtro) params.nome = filtro;
      if (categoriaFiltro !== 'todas') {
        const categoria = categorias.find(c => c.nome === categoriaFiltro);
        if (categoria) params.categoriaId = categoria.id;
      }
      
      const response = await estoqueAPI.listar(params);
      setProdutos(response.data.produtos || []);
      setProdutosFiltrados(response.data.produtos || []);
      setTotalPages(response.data.paginacao?.totalPages || 1);
      setTotalProdutos(response.data.paginacao?.total || 0);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      showSnackbar('Erro ao carregar produtos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const confirmarRemocao = (produto) => {
    setDeleteDialog({ open: true, produto });
    setMenuAnchor(null);
  };

  const removerProduto = async () => {
    try {
      setLoading(true);
      await estoqueAPI.remover(deleteDialog.produto.id);
      await carregarProdutos();
      showSnackbar('Produto removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      showSnackbar('Erro ao remover produto', 'error');
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, produto: null });
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItensPorPaginaChange = (event) => {
    const newValue = event.target.value;
    setItensPorPagina(newValue);
    localStorage.setItem('itensPorPagina', newValue);
    setPage(1);
  };

  const handleCategoriaChange = (event) => {
    setCategoriaFiltro(event.target.value);
    setPage(1);
  };

  const handleFiltroChange = (event) => {
    setFiltro(event.target.value);
    setPage(1);
  };

  const getCorCategoria = (categoria) => {
    // Gerar cor baseada no hash do nome da categoria
    let hash = 0;
    for (let i = 0; i < categoria.length; i++) {
      hash = categoria.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const cores = [
      '#8b4513', '#8fbc8f', '#daa520', '#d2b48c', 
      '#cd853f', '#a0522d', '#d2691e', '#9370db',
      '#20b2aa', '#ff6347', '#32cd32', '#ff69b4'
    ];
    
    return cores[Math.abs(hash) % cores.length];
  };

  const categoriasFiltro = ['todas', ...categorias.map(c => c.nome)];

  const handleMenuClick = (event, produto) => {
    setMenuAnchor(event.currentTarget);
    setProdutoMenu(produto);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setProdutoMenu(null);
  };

  const formatarData = (data) => {
    if (!data) return null;
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  const handleMovimentacaoInputChange = (produtoId, valor) => {
    setMovimentacaoInputs((prev) => ({ ...prev, [produtoId]: valor }));
  };

  const movimentarQuantidadeRapida = async (produto, operacao) => {
    const valor = movimentacaoInputs[produto.id];
    const quantidade = Number.parseInt(valor, 10);

    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      showSnackbar('Informe uma quantidade válida maior que zero', 'warning');
      return;
    }

    try {
      setMovimentacaoLoadingId(produto.id);
      const response = await estoqueAPI.movimentarQuantidade(produto.id, { operacao, quantidade });
      const novaQuantidade = response.data?.produto?.quantidade;

      if (typeof novaQuantidade === 'number') {
        setProdutos((prev) =>
          prev.map((item) =>
            item.id === produto.id ? { ...item, quantidade: novaQuantidade } : item
          )
        );
        setProdutosFiltrados((prev) =>
          prev.map((item) =>
            item.id === produto.id ? { ...item, quantidade: novaQuantidade } : item
          )
        );
      }

      setMovimentacaoInputs((prev) => ({ ...prev, [produto.id]: '' }));
      showSnackbar(response.data?.mensagem || 'Quantidade atualizada com sucesso');
    } catch (error) {
      const mensagemErro = error.response?.data?.erro || 'Erro ao movimentar quantidade';
      showSnackbar(mensagemErro, 'error');
    } finally {
      setMovimentacaoLoadingId(null);
    }
  };

  const ProductCard = ({ produto }) => (
      <Card 
        elevation={0}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 12px 24px ${getCorCategoria(produto.categoria)}20`,
            borderColor: getCorCategoria(produto.categoria),
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: getCorCategoria(produto.categoria),
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: `${getCorCategoria(produto.categoria)}15`,
                color: getCorCategoria(produto.categoria),
                width: 48,
                height: 48
              }}
            >
              <InventoryIcon />
            </Avatar>
            <IconButton 
              size="small" 
              onClick={(e) => handleMenuClick(e, produto)}
              sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
          
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.2 }}>
            {produto.nome}
          </Typography>
          
          <Chip 
            label={produto.categoria}
            size="small"
            sx={{ 
              bgcolor: `${getCorCategoria(produto.categoria)}15`,
              color: getCorCategoria(produto.categoria),
              fontWeight: 600,
              mb: 2
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Quantidade
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {produto.quantidade} {produto.unidade}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1.5, mb: 1.5 }}>
            <TextField
              size="small"
              type="number"
              label="Qtd"
              value={movimentacaoInputs[produto.id] ?? ''}
              onChange={(e) => handleMovimentacaoInputChange(produto.id, e.target.value)}
              inputProps={{ min: 1 }}
              sx={{ width: 90 }}
            />
            <Button
              size="small"
              variant="outlined"
              color="warning"
              disabled={movimentacaoLoadingId === produto.id}
              onClick={() => movimentarQuantidadeRapida(produto, 'saida')}
            >
              Saída
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="success"
              disabled={movimentacaoLoadingId === produto.id}
              onClick={() => movimentarQuantidadeRapida(produto, 'entrada')}
            >
              Entrada
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Validade
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: produto.dataValidade ? 'text.primary' : 'text.disabled' }}>
              {produto.dataValidade ? formatarData(produto.dataValidade) : 'Não informada'}
            </Typography>
          </Box>
          
          {produto.preco && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Preço unitário
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: 'success.main' }}>
                R$ {produto.preco.toFixed(2)}
              </Typography>
            </Box>
          )}
          
          {produto.quantidade < 10 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
              <TrendingDownIcon sx={{ color: 'warning.dark', mr: 1, fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: 'warning.dark', fontWeight: 600 }}>
                Estoque baixo!
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Fade in={!loading} timeout={800}>
          <Box sx={{ mb: 4 }}>
            <EstatisticasEstoque />
          </Box>
        </Fade>
        
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 4, border: '1px solid', borderColor: 'divider' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buscar produtos..."
                value={filtro}
                onChange={handleFiltroChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Filtrar por categoria"
                value={categoriaFiltro}
                onChange={handleCategoriaChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              >
                {categoriasFiltro.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria === 'todas' ? 'Todas as categorias' : categoria}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', mb: 4, gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                <InventoryIcon sx={{ mr: 2, fontSize: 32 }} />
                Produtos
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Mostrando {produtosFiltrados.length > 0 ? ((page - 1) * itensPorPagina) + 1 : 0} - {Math.min(page * itensPorPagina, totalProdutos)} de {totalProdutos} produtos
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: { xs: '100%', sm: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 } }}>
                <InputLabel>Por página</InputLabel>
                <Select
                  value={itensPorPagina}
                  label="Por página"
                  onChange={handleItensPorPaginaChange}
                >
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={9}>9</MenuItem>
                  <MenuItem value={12}>12</MenuItem>
                  <MenuItem value={24}>24</MenuItem>
                </Select>
              </FormControl>
              <Button
                component={Link}
                to="/adicionar"
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ borderRadius: 3, px: 3, width: { xs: '100%', sm: 'auto' } }}
              >
                Adicionar Produto
              </Button>
            </Box>
          </Box>
          
          {loading ? (
            <Grid container spacing={3}>
              {[...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                      <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                      <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                      <Skeleton variant="rectangular" height={24} width={80} sx={{ mb: 2 }} />
                      <Skeleton variant="text" height={20} />
                      <Skeleton variant="text" height={20} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : produtosFiltrados.length === 0 ? (
            <Box textAlign="center" py={8}>
              <InventoryIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
                {filtro || categoriaFiltro !== 'todas' ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {filtro || categoriaFiltro !== 'todas' 
                  ? 'Tente ajustar os filtros de busca' 
                  : 'Comece adicionando produtos ao seu estoque'
                }
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/adicionar"
                startIcon={<AddIcon />}
                sx={{ borderRadius: 3 }}
              >
                Adicionar Primeiro Produto
              </Button>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {produtosFiltrados.map((produto, index) => (
                  <Grid item xs={12} sm={6} md={4} key={produto.id}>
                    <ProductCard produto={produto} />
                  </Grid>
                ))}
              </Grid>
              
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, overflowX: 'auto', pb: 2 }}>
                  <Pagination 
                    count={totalPages} 
                    page={page} 
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    siblingCount={0}
                    boundaryCount={1}
                  />
                </Box>
              )}
            </>
          )}
        </Paper>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                mt: 0.5,
                ml: -1
              }
            }
          }}
        >
          <MenuItem component={Link} to={`/editar/${produtoMenu?.id}`} onClick={handleMenuClose}>
            <EditIcon sx={{ mr: 1, color: 'primary.main' }} />
            Editar
          </MenuItem>
          <MenuItem onClick={() => confirmarRemocao(produtoMenu)}>
            <DeleteIcon sx={{ mr: 1, color: 'error.main' }} />
            Remover
          </MenuItem>
        </Menu>

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, produto: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>Confirmar Remoção</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja remover o produto <strong>"{deleteDialog.produto?.nome}"</strong>?
              <br />Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setDeleteDialog({ open: false, produto: null })}
              sx={{ borderRadius: 2 }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={removerProduto} 
              color="error" 
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Remover
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ProdutosEstoque;
