import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import {
  Inventory as InventoryIcon,
  Restaurant as RestaurantIcon,
  Add as AddIcon,
  Dashboard as DashboardIcon,
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  KeyboardArrowUp
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './pages/Dashboard';
import ProdutosEstoque from './pages/ProdutosEstoque';
import AdicionarProduto from './pages/AdicionarProduto';
import EditarProduto from './pages/EditarProduto';
import './App.css';

const getTheme = (darkMode) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: darkMode ? '#d4a574' : '#8b4513',
      light: darkMode ? '#deb887' : '#a0522d',
      dark: darkMode ? '#a0522d' : '#654321',
    },
    secondary: {
      main: darkMode ? '#cd853f' : '#d2691e',
      light: darkMode ? '#daa520' : '#f4a460',
      dark: darkMode ? '#8b4513' : '#a0522d',
    },
    background: {
      default: darkMode ? '#2f2f2f' : '#faf8f5',
      paper: darkMode ? '#3e3e3e' : '#ffffff',
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
  const [darkMode, setDarkMode] = useState(false);
  const theme = getTheme(darkMode);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          background: darkMode 
            ? 'linear-gradient(135deg, #2f2f2f 0%, #3e3e3e 100%)'
            : 'linear-gradient(135deg, #faf8f5 0%, #f5f5dc 100%)',
        }}
      >
        <Router>
          <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          <Box sx={{ 
            background: darkMode ? 'transparent' : 'rgba(255,255,255,0.1)',
            minHeight: 'calc(100vh - 64px)',
            backdropFilter: 'blur(10px)',
          }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/estoque" element={<ProdutosEstoque />} />
              <Route path="/adicionar" element={<AdicionarProduto />} />
              <Route path="/editar/:id" element={<EditarProduto />} />
            </Routes>
          </Box>
          
          <ScrollToTop />
        </Router>
      </Box>
    </ThemeProvider>
  );
}

function ScrollToTop() {
  const [showScroll, setShowScroll] = useState(false);

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

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Estoque', icon: <InventoryIcon />, path: '/estoque' },
  { text: 'Adicionar', icon: <AddIcon />, path: '/adicionar' },
];

function Navigation({ darkMode, toggleDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
            button
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
          background: darkMode 
            ? 'linear-gradient(135deg, #3e3e3e 0%, #2f2f2f 100%)'
            : 'linear-gradient(135deg, #8b4513 0%, #a0522d 100%)',
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
          
          <IconButton color="inherit" onClick={toggleDarkMode} sx={{ ml: 1 }}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
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