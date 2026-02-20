// Serviço de autenticação
import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Endpoints de autenticação
export const authAPI = {
  login: (username, senha) => axios.post(`${API_URL}/auth/login`, { username, senha }),
  registrar: (nome, username, senha) => axios.post(`${API_URL}/auth/registrar`, { nome, username, senha }),
  verificarToken: (token) => axios.get(`${API_URL}/auth/verificar`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

// Salva token no storage (localStorage ou sessionStorage)
export const setAuthToken = (token, lembrar = false) => {
  if (token) {
    if (lembrar) {
      localStorage.setItem('token', token);
      localStorage.setItem('lembrar', 'true');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('lembrar');
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('lembrar');
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Recupera token do storage
export const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Recupera dados do usuário do storage
export const getUsuario = () => {
  const usuario = localStorage.getItem('usuario') || sessionStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

// Salva dados do usuário no storage
export const setUsuario = (usuario, lembrar = false) => {
  if (usuario) {
    const storage = lembrar ? localStorage : sessionStorage;
    storage.setItem('usuario', JSON.stringify(usuario));
  } else {
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('usuario');
  }
};

// Remove token e dados do usuário (logout)
export const logout = () => {
  setAuthToken(null);
  setUsuario(null);
};
