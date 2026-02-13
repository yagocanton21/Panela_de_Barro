import axios from 'axios';

const API_URL = 'http://localhost:3001';

export const authAPI = {
  login: (username, senha) => axios.post(`${API_URL}/auth/login`, { username, senha }),
  registrar: (nome, username, senha) => axios.post(`${API_URL}/auth/registrar`, { nome, username, senha }),
  verificarToken: (token) => axios.get(`${API_URL}/auth/verificar`, {
    headers: { Authorization: `Bearer ${token}` }
  })
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = () => localStorage.getItem('token');

export const getUsuario = () => {
  const usuario = localStorage.getItem('usuario');
  return usuario ? JSON.parse(usuario) : null;
};

export const setUsuario = (usuario) => {
  if (usuario) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  } else {
    localStorage.removeItem('usuario');
  }
};

export const logout = () => {
  setAuthToken(null);
  setUsuario(null);
};
