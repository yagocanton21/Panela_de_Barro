import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Pagination,
  TextField,
  MenuItem,
  Grid,
  Skeleton
} from '@mui/material';
import {
  History as HistoryIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp as EntradaIcon,
  TrendingDown as SaidaIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';
import { getAuthToken } from '../services/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Historico = () => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filtroTipo, setFiltroTipo] = useState('entrada');

  useEffect(() => {
    carregarHistorico();
  }, [page, filtroTipo]);

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      params.tipo = filtroTipo;

      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/historico`, {
        params,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      setHistorico(response.data.historico);
      setTotalPages(response.data.paginacao.totalPages);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTipoConfig = (tipo) => {
    const configs = {
      adicionar: { label: 'Adicionado', color: 'success', icon: <AddIcon /> },
      editar: { label: 'Editado', color: 'info', icon: <EditIcon /> },
      remover: { label: 'Removido', color: 'error', icon: <DeleteIcon /> },
      entrada: { label: 'Entrada', color: 'primary', icon: <EntradaIcon /> },
      saida: { label: 'Saída', color: 'warning', icon: <SaidaIcon /> }
    };
    return configs[tipo] || { label: tipo, color: 'default', icon: <HistoryIcon /> };
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleString('pt-BR');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', mb: 1 }}>
          <HistoryIcon sx={{ mr: 2, fontSize: 32 }} />
          Histórico de Movimentações
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Registro completo de todas as ações realizadas no estoque
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Filtrar por tipo"
              value={filtroTipo}
              onChange={(e) => {
                setFiltroTipo(e.target.value);
                setPage(1);
              }}
              size="small"
            >
              <MenuItem value="entrada">Entrada</MenuItem>
              <MenuItem value="saida">Saída</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell><strong>Tipo</strong></TableCell>
              <TableCell><strong>Produto</strong></TableCell>
              <TableCell><strong>Descrição</strong></TableCell>
              <TableCell align="center"><strong>Qtd. Anterior</strong></TableCell>
              <TableCell align="center"><strong>Qtd. Nova</strong></TableCell>
              <TableCell><strong>Usuário</strong></TableCell>
              <TableCell><strong>Data/Hora</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [...Array(10)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton width={80} /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                  <TableCell><Skeleton /></TableCell>
                </TableRow>
              ))
            ) : historico.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                  <HistoryIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Nenhum registro encontrado
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              historico.map((item) => {
                const config = getTipoConfig(item.tipo);
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Chip
                        icon={config.icon}
                        label={config.label}
                        color={config.color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.produto_nome || 'Produto removido'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.descricao}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        {item.quantidade_anterior !== null ? item.quantidade_anterior : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.quantidade_nova !== null ? item.quantidade_nova : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                          <PersonIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2">
                          {item.usuario_nome || 'Sistema'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {formatarData(item.created_at)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default Historico;
