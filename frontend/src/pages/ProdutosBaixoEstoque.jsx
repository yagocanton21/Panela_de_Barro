import React, { useState, useEffect, useMemo } from 'react';
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
    Box,
    Button,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Warning as WarningIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { estoqueAPI, categoriasAPI } from '../services/api';

const ProdutosBaixoEstoque = () => {
    const navigate = useNavigate();
    const [produtos, setProdutos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroNome, setFiltroNome] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('todos');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);

            const [respProdutos, respCategorias] = await Promise.all([
                estoqueAPI.buscarBaixoEstoque(),
                categoriasAPI.listar()
            ]);

            const listaProdutos = respProdutos?.data?.produtos || [];
            const listaCategorias = respCategorias?.data?.categorias || [];

            setProdutos(Array.isArray(listaProdutos) ? listaProdutos : []);
            setCategorias(Array.isArray(listaCategorias) ? listaCategorias : []);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            setError('Não foi possível carregar as informações de estoque baixo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    const produtosFiltrados = useMemo(() => {
        if (!Array.isArray(produtos)) return [];
        return produtos.filter(p => {
            if (!p) return false;
            const nome = p.nome || '';
            const matchesNome = nome.toLowerCase().includes(filtroNome.toLowerCase());
            const matchesCategoria = filtroCategoria === 'todos' || p.categoria === filtroCategoria;
            return matchesNome && matchesCategoria;
        });
    }, [produtos, filtroNome, filtroCategoria]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        sx={{ mr: 2 }}
                        color="inherit"
                    >
                        Voltar
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', display: 'flex', alignItems: 'center' }}>
                        <WarningIcon sx={{ mr: 2, fontSize: 32, color: '#daa520' }} />
                        Estoque Baixo
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' }, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Categoria</InputLabel>
                        <Select
                            value={filtroCategoria}
                            label="Categoria"
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                            sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                        >
                            <MenuItem value="todos">Todas as Categorias</MenuItem>
                            {categorias.map((cat) => (
                                <MenuItem key={cat.id} value={cat.nome}>
                                    {cat.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        placeholder="Buscar por nome..."
                        size="small"
                        variant="outlined"
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: 2, bgcolor: 'background.paper', width: { xs: '100%', sm: 250 } }
                        }}
                    />
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
                <CardContent sx={{ p: 0 }}>
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                            <CircularProgress color="primary" />
                        </Box>
                    ) : produtosFiltrados.length === 0 ? (
                        <Box sx={{ p: 5, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                {filtroNome ? `Nenhum produto encontrado para "${filtroNome}"` : 'Nenhum produto com estoque baixo. Tudo em dia!'}
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600 }}>Produto</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Categoria</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }} align="right">Qtd. Atual</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }} align="right">Mínimo</TableCell>
                                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {produtosFiltrados.map((produto) => (
                                        <TableRow key={produto.id || Math.random()} hover>
                                            <TableCell sx={{ fontWeight: 500 }}>{produto.nome}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={produto.categoria || 'Sem categoria'}
                                                    size="small"
                                                    sx={{ bgcolor: 'rgba(218, 165, 32, 0.1)', color: '#daa520', fontWeight: 500 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, color: 'error.main' }}>
                                                {produto.quantidade} {produto.unidade}
                                            </TableCell>
                                            <TableCell align="right">
                                                {produto.estoqueMinimo || 10} {produto.unidade}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label="Repor Estoque"
                                                    size="small"
                                                    color="warning"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 'bold' }}
                                                />
                                            </TableCell>
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

export default ProdutosBaixoEstoque;
