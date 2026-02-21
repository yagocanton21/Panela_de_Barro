// Imports principais
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
// Componentes Material-UI
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Fab,
  Zoom
} from '@mui/material';
// Ícones Material-UI
import {
  Inventory as InventoryIcon,
  Restaurant as RestaurantIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  KeyboardArrowUp,
  Category as CategoryIcon,
  Logout as LogoutIcon,
  History as HistoryIcon
} from '@mui/icons-material';
// Tema Material-UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// Páginas da aplicação
import Dashboard from './pages/Dashboard';
import ProdutosEstoque from './pages/ProdutosEstoque';
import AdicionarProduto from './pages/AdicionarProduto';
import EditarProduto from './pages/EditarProduto';
import GerenciarCategorias from './pages/GerenciarCategorias';
import Historico from './pages/Historico';
import Login from './pages/Login';
import { getAuthToken, initializeAuth, logout } from './services/auth';
import './App.css';

// Configuração do tema personalizado
const getTheme = () => createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#8b4513',
      light: '#a0522d',
      dark: '#654321',
    },
    secondary: {
      main: '#d2691e',
      light: '#f4a460',
      dark: '#a0522d',
    },
    background: {
      default: '#faf8f5',
      paper: '#ffffff',
    },
    success: {
      main: '#8fbc8f',
    },
    warning: {
      main: '#daa520',
    },
    error: {
      main: '#cd5c5c',
    },
    info: {
      main: '#d2b48c',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  const theme = getTheme();
  // Verifica se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!getAuthToken());

  React.useEffect(() => {
    initializeAuth();
    setIsAuthenticated(!!getAuthToken());
  }, []);

  // Se não autenticado, mostra tela de login
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </ThemeProvider>
    );
  }

  // Aplicação principal com navegação
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #faf8f5 0%, #f5f5dc 100%)',
        }}
      >
        <Router>
          <Navigation />
          
          {/* Container principal das páginas */}
          <Box sx={{ 
            background: 'rgba(255,255,255,0.1)',
            minHeight: 'calc(100vh - 64px)',
            backdropFilter: 'blur(10px)',
          }}>
            {/* Rotas da aplicação */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/estoque" element={<ProdutosEstoque />} />
              <Route path="/adicionar" element={<AdicionarProduto />} />
              <Route path="/editar/:id" element={<EditarProduto />} />
              <Route path="/categorias" element={<GerenciarCategorias />} />
              <Route path="/historico" element={<Historico />} />
            </Routes>
          </Box>
          
          <ScrollToTop />
        </Router>
      </Box>
    </ThemeProvider>
  );
}

// Botão flutuante para voltar ao topo
function ScrollToTop() {
  const [showScroll, setShowScroll] = useState(false);

  // Mostra botão após rolar 400px
  React.useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={showScroll}>
      <Fab
        color="primary"
        size="small"
        onClick={scrollTop}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <KeyboardArrowUp />
      </Fab>
    </Zoom>
  );
}

// Itens do menu de navegação
const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Estoque', icon: <InventoryIcon />, path: '/estoque' },
  { text: 'Adicionar', icon: <AddIcon />, path: '/adicionar' },
  { text: 'Categorias', icon: <CategoryIcon />, path: '/categorias' },
  { text: 'Histórico', icon: <HistoryIcon />, path: '/historico' },
];

// Componente de navegação (AppBar + Drawer)
function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Menu lateral (drawer) para mobile
  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <RestaurantIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
          Panela de Barro
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              backgroundColor: location.pathname === item.path ? 'primary.main' : 'transparent',
              color: location.pathname === item.path ? 'white' : 'inherit',
              '&:hover': {
                backgroundColor: location.pathname === item.path ? 'primary.dark' : 'action.hover',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <RestaurantIcon sx={{ mr: 2, fontSize: 28 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Panela de Barro
          </Typography>
          
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={() => {
              logout();
              window.location.reload();
            }}
            sx={{ ml: 2 }}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default App;

