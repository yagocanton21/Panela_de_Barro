import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const estoqueAPI = {
  listar: (params = {}) => axios.get(`${API_BASE_URL}/estoque`, { params }),
  
  buscarPorId: (id) => axios.get(`${API_BASE_URL}/estoque/${id}`),
  adicionar: (produto) => axios.post(`${API_BASE_URL}/estoque`, produto),
  atualizar: (id, produto) => axios.put(`${API_BASE_URL}/estoque/${id}`, produto),
  remover: (id) => axios.delete(`${API_BASE_URL}/estoque/${id}`)
};

export const categoriasAPI = {
  listar: () => axios.get(`${API_BASE_URL}/categorias`),
  criar: (categoria) => axios.post(`${API_BASE_URL}/categorias`, categoria),
  atualizar: (id, categoria) => axios.put(`${API_BASE_URL}/categorias/${id}`, categoria),
  remover: (id) => axios.delete(`${API_BASE_URL}/categorias/${id}`)
};