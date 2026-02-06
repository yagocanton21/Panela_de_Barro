import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Chip,
  Fade
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { estoqueAPI, categoriasAPI } from '../services/api';


const unidades = ['kg', 'g', 'L', 'ml', 'unidades', 'caixas', 'pacotes'];

const steps = ['Informações Básicas', 'Detalhes', 'Confirmação'];

function EditarProduto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [categorias, setCategorias] = useState([]);
  
  const [produto, setProduto] = useState({
    nome: '',
    categoriaId: '',
    quantidade: '',
    unidade: '',
    dataValidade: '',
    fornecedor: ''
  });

  useEffect(() => {
    carregarCategorias();
    carregarProduto();
  }, [id]);

  const carregarCategorias = async () => {
    try {
      const response = await categoriasAPI.listar();
      setCategorias(response.data.categorias);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const carregarProduto = async () => {
    try {
      setLoading(true);
      const response = await estoqueAPI.buscarPorId(id);
      const produtoData = response.data;
      
      setProduto({
        nome: produtoData.nome || '',
        categoriaId: produtoData.categoria_id || '',
        quantidade: produtoData.quantidade || '',
        unidade: produtoData.unidade || '',
        dataValidade: produtoData.data_validade ? produtoData.data_validade.split('T')[0] : '',
        fornecedor: produtoData.fornecedor || ''
      });
    } catch (error) {
      setErro('Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (event) => {
    setProduto(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setErro('');
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!produto.nome || !produto.categoriaId) {
        setErro('Nome e categoria são obrigatórios');
        return;
      }
    }
    if (activeStep === 1) {
      if (!produto.quantidade || !produto.unidade) {
        setErro('Quantidade e unidade são obrigatórios');
        return;
      }
    }
    setActiveStep(prev => prev + 1);
    setErro('');
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setErro('');
  };

  const handleSubmit = async () => {
    try {
      setSalvando(true);
      setErro('');
      
      const dadosParaEnvio = {
        nome: produto.nome,
        categoriaId: Number(produto.categoriaId),
        quantidade: Number(produto.quantidade),
        unidade: produto.unidade,
        dataValidade: produto.dataValidade || null,
        fornecedor: produto.fornecedor || null
      };

      await estoqueAPI.atualizar(id, dadosParaEnvio);
      setSucesso('Produto atualizado com sucesso!');
      
      setTimeout(() => {
        navigate('/estoque');
      }, 2000);
    } catch (error) {
      setErro('Erro ao atualizar produto');
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Produto"
                value={produto.nome}
                onChange={handleChange('nome')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              {categorias.length > 0 ? (
                <TextField
                  select
                  fullWidth
                  label="Categoria"
                  value={produto.categoriaId}
                  onChange={handleChange('categoriaId')}
                  required
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.id}>
                      {categoria.nome}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <Alert severity="warning">
                  Nenhuma categoria encontrada. Crie uma categoria primeiro.
                </Alert>
              )}
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={produto.quantidade}
                onChange={handleChange('quantidade')}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Unidade"
                value={produto.unidade}
                onChange={handleChange('unidade')}
                required
              >
                {unidades.map((unidade) => (
                  <MenuItem key={unidade} value={unidade}>
                    {unidade}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Validade"
                type="date"
                value={produto.dataValidade}
                onChange={handleChange('dataValidade')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Fornecedor"
                value={produto.fornecedor}
                onChange={handleChange('fornecedor')}
              />
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Confirme os dados do produto:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Nome:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{produto.nome}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Categoria:</Typography>
                <Chip label={categorias.find(c => c.id === parseInt(produto.categoriaId))?.nome || 'N/A'} size="small" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Quantidade:</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {produto.quantidade} {produto.unidade}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">Data de Validade:</Typography>
                <Typography variant="body1">
                  {produto.dataValidade || 'Não informada'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">Fornecedor:</Typography>
                <Typography variant="body1">
                  {produto.fornecedor || 'Não informado'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Fade in={true} timeout={600}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/estoque')}
                sx={{ mr: 2 }}
              >
                Voltar
              </Button>
              <EditIcon sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Editar Produto
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {erro && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {erro}
              </Alert>
            )}

            {sucesso && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {sucesso}
              </Alert>
            )}

            <Box sx={{ mb: 4 }}>
              {renderStepContent(activeStep)}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Voltar
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={salvando}
                  startIcon={salvando ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{ borderRadius: 3 }}
                >
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ borderRadius: 3 }}
                >
                  Próximo
                </Button>
              )}
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
}

export default EditarProduto;