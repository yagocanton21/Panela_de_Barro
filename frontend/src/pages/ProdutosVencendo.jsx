import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Box,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, CalendarToday as CalendarIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { estoqueAPI } from '../services/api';

const ProdutosVencendo = () => {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await estoqueAPI.buscarVencendo(7);
            setProdutos(response.data.produtos || []);
        } catch (err) {
            console.error('Erro ao carregar produtos vencendo:', err);
            setError('Não foi possível carregar a lista de produtos vencendo.');
        } finally {
            setLoading(false);
        }
    };

    const formatarData = (dataStr) => {
        if (!dataStr) return 'N/A';
        const date = new Date(dataStr);
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/')}
                    sx={{ mr: 2 }}
                    color="inherit"
                >
                    Voltar
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ mr: 2, fontSize: 32, color: '#cd5c5c' }} />
                    Produtos Próximos ao Vencimento
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                            <CircularProgress color="primary" />
                        </Box>
                    ) : produtos.length === 0 ? (
                        <Box sx={{ p: 5, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Nenhum produto vence nos próximos 7 dias. Excelente!
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Box}>
                            <Table>
                                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Produto</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Categoria</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }} align="right">Quantidade</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Validade</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Fornecedor</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {produtos.map((produto) => (
                                        <TableRow key={produto.id} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{produto.nome}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={produto.categoria}
                                                    size="small"
                                                    sx={{ bgcolor: '#cd5c5c15', color: '#cd5c5c', fontWeight: 500 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {produto.quantidade} {produto.unidade}
                                            </TableCell>
                                            <TableCell sx={{ color: '#cd5c5c', fontWeight: 600 }}>
                                                {formatarData(produto.dataValidade)}
                                            </TableCell>
                                            <TableCell>{produto.fornecedor || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default ProdutosVencendo;
