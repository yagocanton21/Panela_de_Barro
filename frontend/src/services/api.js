import axios from 'axios';
import { getAuthToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const withAuth = (config = {}) => {
  const token = getAuthToken();
  if (!token) return config;

  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
};

export const estoqueAPI = {
  listar: (params = {}) => axios.get(`${API_BASE_URL}/estoque`, withAuth({ params })),
  buscarPorId: (id) => axios.get(`${API_BASE_URL}/estoque/${id}`, withAuth()),
  adicionar: (produto) => axios.post(`${API_BASE_URL}/estoque`, produto, withAuth()),
  atualizar: (id, produto) => axios.put(`${API_BASE_URL}/estoque/${id}`, produto, withAuth()),
  movimentarQuantidade: (id, dados) => axios.patch(`${API_BASE_URL}/estoque/${id}/quantidade`, dados, withAuth()),
  remover: (id) => axios.delete(`${API_BASE_URL}/estoque/${id}`, withAuth()),
};

export const categoriasAPI = {
  listar: () => axios.get(`${API_BASE_URL}/categorias`, withAuth()),
  criar: (categoria) => axios.post(`${API_BASE_URL}/categorias`, categoria, withAuth()),
  atualizar: (id, categoria) => axios.put(`${API_BASE_URL}/categorias/${id}`, categoria, withAuth()),
  remover: (id) => axios.delete(`${API_BASE_URL}/categorias/${id}`, withAuth()),
};
