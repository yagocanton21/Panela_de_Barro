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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { categoriasAPI } from '../services/api';

// Componente para gerenciar categorias
const GerenciarCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [dialog, setDialog] = useState({ open: false, categoria: null, nome: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Carregar categorias ao inicializar
  useEffect(() => {
    carregarCategorias();
  }, []);

  // Buscar categorias da API
  const carregarCategorias = async () => {
    try {
      const response = await categoriasAPI.listar();
      setCategorias(response.data.categorias);
    } catch (error) {
      showSnackbar('Erro ao carregar categorias', 'error');
    }
  };

  // Exibir mensagem de feedback
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Abrir dialog para criar/editar categoria
  const abrirDialog = (categoria = null) => {
    setDialog({
      open: true,
      categoria,
      nome: categoria ? categoria.nome : ''
    });
  };

  // Fechar dialog
  const fecharDialog = () => {
    setDialog({ open: false, categoria: null, nome: '' });
  };

  // Salvar categoria (criar ou atualizar)
  const salvarCategoria = async () => {
    try {
      if (dialog.categoria) {
        // Atualizar categoria existente
        await categoriasAPI.atualizar(dialog.categoria.id, {
          nome: dialog.nome
        });
        showSnackbar('Categoria atualizada com sucesso!');
      } else {
        // Criar nova categoria
        await categoriasAPI.criar({
          nome: dialog.nome
        });
        showSnackbar('Categoria criada com sucesso!');
      }
      carregarCategorias();
      fecharDialog();
    } catch (error) {
      showSnackbar(error.response?.data?.erro || 'Erro ao salvar categoria', 'error');
    }
  };

  // Remover categoria
  const removerCategoria = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta categoria?')) {
      try {
        await categoriasAPI.remover(id);
        showSnackbar('Categoria removida com sucesso!');
        carregarCategorias();
      } catch (error) {
        showSnackbar(error.response?.data?.erro || 'Erro ao remover categoria', 'error');
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Gerenciar Categorias
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Crie e gerencie as categorias dos seus produtos
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={3}>
          {categorias.map((categoria) => (
            <Grid item xs={12} sm={6} md={4} key={categoria.id}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CategoryIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {categoria.nome}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => abrirDialog(categoria)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => removerCategoria(categoria.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {categorias.length === 0 && (
          <Box textAlign="center" py={8}>
            <CategoryIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
              Nenhuma categoria cadastrada
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Comece criando sua primeira categoria
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => abrirDialog()}
              startIcon={<AddIcon />}
            >
              Criar Primeira Categoria
            </Button>
          </Box>
        )}
      </Paper>

      <Fab
        color="primary"
        onClick={() => abrirDialog()}
        sx={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>

      <Dialog open={dialog.open} onClose={fecharDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialog.categoria ? 'Editar Categoria' : 'Nova Categoria'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Categoria"
            fullWidth
            variant="outlined"
            value={dialog.nome}
            onChange={(e) => setDialog({ ...dialog, nome: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialog}>Cancelar</Button>
          <Button 
            onClick={salvarCategoria} 
            variant="contained"
            disabled={!dialog.nome.trim()}
          >
            {dialog.categoria ? 'Atualizar' : 'Criar'}
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
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GerenciarCategorias;