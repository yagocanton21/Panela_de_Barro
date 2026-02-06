import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Fade,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Scale as ScaleIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { estoqueAPI, categoriasAPI } from '../services/api';

const AdicionarProduto = () => {
  const [formData, setFormData] = useState({
    nome: '',
    categoriaId: '',
    quantidade: '',
    unidade: '',
    preco: '',
    dataValidade: '',
    fornecedor: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);

  const steps = ['Informações Principais', 'Revisão e Confirmação'];

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const response = await categoriasAPI.listar();
      setCategorias(response.data.categorias);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const unidadesPredefinidas = [
    { value: 'kg', label: 'Quilograma (kg)', icon: '⚖️' },
    { value: 'g', label: 'Grama (g)', icon: '⚖️' },
    { value: 'L', label: 'Litro (L)', icon: '🥤' },
    { value: 'ml', label: 'Mililitro (ml)', icon: '🥤' },
    { value: 'unidade', label: 'Unidade', icon: '📦' },
    { value: 'pacote', label: 'Pacote', icon: '📦' },
    { value: 'caixa', label: 'Caixa', icon: '📦' }
  ];

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const adicionarProduto = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const produtoData = {
        nome: formData.nome,
        categoriaId: parseInt(formData.categoriaId),
        quantidade: parseInt(formData.quantidade),
        unidade: formData.unidade,
        ...(formData.preco && { preco: parseFloat(formData.preco) }),
        ...(formData.dataValidade && { dataValidade: formData.dataValidade }),
        ...(formData.fornecedor && { fornecedor: formData.fornecedor })
      };
      
      await estoqueAPI.adicionar(produtoData);
      
      // Limpar formulário
      setFormData({
        nome: '',
        categoriaId: '',
        quantidade: '',
        unidade: '',
        preco: '',
        dataValidade: '',
        fornecedor: ''
      });
      setActiveStep(0);
      
      showSnackbar('Produto adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      showSnackbar('Erro ao adicionar produto. Verifique os dados.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.nome && formData.categoriaId && formData.quantidade && formData.unidade;
      case 1:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1 && isStepValid(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true} timeout={500}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Produto"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                {categorias.length > 0 ? (
                  <FormControl fullWidth required>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                      value={formData.categoriaId}
                      label="Categoria"
                      onChange={(e) => handleInputChange('categoriaId', e.target.value)}
                      sx={{
                        borderRadius: 2,
                      }}
                    >
                      {categorias.map((categoria) => (
                        <MenuItem key={categoria.id} value={categoria.id}>
                          {categoria.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Alert severity="warning" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2">
                      Nenhuma categoria encontrada. 
                      <Button 
                        component={Link} 
                        to="/categorias" 
                        size="small" 
                        sx={{ ml: 1 }}
                      >
                        Criar Categoria
                      </Button>
                    </Typography>
                  </Alert>
                )}
              </Grid>
              
              <Grid item xs={12}>
                {categorias.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {categorias.slice(0, 5).map((categoria) => (
                      <Chip
                        key={categoria.id}
                        label={categoria.nome}
                        variant={formData.categoriaId === categoria.id ? 'filled' : 'outlined'}
                        color={formData.categoriaId === categoria.id ? 'primary' : 'default'}
                        onClick={() => handleInputChange('categoriaId', categoria.id)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Quantidade"
                  type="number"
                  value={formData.quantidade}
                  onChange={(e) => handleInputChange('quantidade', e.target.value)}
                  required
                  variant="outlined"
                  inputProps={{ min: 0 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScaleIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Unidade</InputLabel>
                  <Select
                    value={formData.unidade}
                    label="Unidade"
                    onChange={(e) => handleInputChange('unidade', e.target.value)}
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    {unidadesPredefinidas.map((unidade) => (
                      <MenuItem key={unidade.value} value={unidade.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span>{unidade.icon}</span>
                          {unidade.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Preço Unitário (Opcional)"
                  type="number"
                  value={formData.preco}
                  onChange={(e) => handleInputChange('preco', e.target.value)}
                  variant="outlined"
                  inputProps={{ min: 0, step: 0.01 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Data de Validade (Opcional)"
                  type="date"
                  value={formData.dataValidade}
                  onChange={(e) => handleInputChange('dataValidade', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fornecedor (Opcional)"
                  value={formData.fornecedor}
                  onChange={(e) => handleInputChange('fornecedor', e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BusinessIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Fade>
        );
      
      case 1:
        return (
          <Fade in={true} timeout={500}>
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar sx={{ bgcolor: 'success.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                    <CheckCircleIcon sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Confirmar Dados
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Revise as informações antes de adicionar o produto
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Nome:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.nome}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Categoria:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {categorias.find(c => c.id === parseInt(formData.categoriaId))?.nome}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Quantidade:</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.quantidade} {formData.unidade}</Typography>
                  </Grid>
                  {formData.preco && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Preço:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>R$ {parseFloat(formData.preco).toFixed(2)}</Typography>
                    </Grid>
                  )}
                  {formData.dataValidade && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Validade:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{new Date(formData.dataValidade).toLocaleDateString('pt-BR')}</Typography>
                    </Grid>
                  )}
                  {formData.fornecedor && (
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Fornecedor:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>{formData.fornecedor}</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Fade>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 4, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <AddIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Panela de Barro
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Cadastre um novo item no seu estoque
            </Typography>
          </Paper>
        </Fade>

        {/* Stepper */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Formulário */}
        <Paper elevation={0} sx={{ p: 0, border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
          {/* Conteúdo do formulário */}
          <Box sx={{ p: 4 }}>
            <Box component="form" onSubmit={adicionarProduto}>
              {renderStepContent(activeStep)}
            </Box>
          </Box>

          {/* Botões no rodapé */}
          <Box
            sx={{
              p: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
            }}
          >
            <Button
              type="button"
              onClick={prevStep}
              disabled={activeStep === 0}
              sx={{ borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}
            >
              Voltar
            </Button>

            <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button
                component={Link}
                to="/estoque"
                variant="outlined"
                sx={{ borderRadius: 2, width: { xs: '100%', sm: 'auto' } }}
              >
                Ver Estoque
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={adicionarProduto}
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={loading}
                  sx={{ borderRadius: 2, px: { xs: 2, sm: 4 }, width: { xs: '100%', sm: 'auto' } }}
                >
                  {loading ? 'Adicionando...' : 'Adicionar Produto'}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={nextStep}
                  variant="contained"
                  disabled={!isStepValid(activeStep)}
                  sx={{ borderRadius: 2, px: { xs: 2, sm: 4 }, width: { xs: '100%', sm: 'auto' } }}
                >
                  Próximo
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

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

export default AdicionarProduto;