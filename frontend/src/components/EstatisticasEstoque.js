import React from 'react';
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

const EstatisticasEstoque = ({ produtos }) => {
  const totalProdutos = produtos.length;
  const totalQuantidade = produtos.reduce((acc, produto) => acc + produto.quantidade, 0);
  const categorias = [...new Set(produtos.map(produto => produto.categoria))].length;

  const estatisticas = [
    {
      titulo: 'Total de Produtos',
      valor: totalProdutos,
      icone: <Inventory />,
      cor: 'primary'
    },
    {
      titulo: 'Quantidade Total',
      valor: totalQuantidade,
      icone: <TrendingUp />,
      cor: 'success'
    },
    {
      titulo: 'Categorias',
      valor: categorias,
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