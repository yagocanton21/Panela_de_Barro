import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  Category
} from '@mui/icons-material';
import { estoqueAPI } from '../services/api';

const EstatisticasEstoque = () => {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalQuantidade: 0,
    categorias: 0
  });

  useEffect(() => {
    carregarEstatisticas();
  }, []);

  const carregarEstatisticas = async () => {
    try {
      const response = await estoqueAPI.listar({ page: 1, limit: 9999 });
      const produtos = response.data.produtos || [];
      
      const totalProdutos = produtos.length;
      const totalQuantidade = produtos.reduce((acc, produto) => acc + produto.quantidade, 0);
      const categorias = [...new Set(produtos.map(produto => produto.categoria))].length;

      setStats({ totalProdutos, totalQuantidade, categorias });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const estatisticas = [
    {
      titulo: 'Total de Produtos',
      valor: stats.totalProdutos,
      icone: <Inventory />,
      cor: 'primary'
    },
    {
      titulo: 'Quantidade Total',
      valor: stats.totalQuantidade,
      icone: <TrendingUp />,
      cor: 'success'
    },
    {
      titulo: 'Categorias',
      valor: stats.categorias,
      icone: <Category />,
      cor: 'warning'
    }
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {estatisticas.map((stat, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              alignItems: 'center',
              height: '100px'
            }}
          >
            <Box sx={{ mr: 2, color: `${stat.cor}.main` }}>
              {stat.icone}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {stat.titulo}
              </Typography>
              <Typography variant="h6" component="div">
                {stat.valor}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default EstatisticasEstoque;