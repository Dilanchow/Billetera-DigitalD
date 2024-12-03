import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

const handleApiError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string }>;
    if (axiosError.response) {
      console.error('Error de respuesta:', axiosError.response.data);
      return new Error(axiosError.response.data?.error || 'Error en la solicitud');
    } else if (axiosError.request) {
      console.error('Error de solicitud:', axiosError.request);
      return new Error('No se pudo conectar con el servidor');
    }
  }
  console.error('Error inesperado:', error);
  return new Error('Error inesperado');
};

export const register = async (nombre: string, telefono: string, email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/register', { nombre, telefono, email, password });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const login = async (telefono: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { telefono, password });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logout = async () => {
  try {
    await api.post('/api/auth/logout');
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserData = async () => {
  try {
    const response = await api.get('/api/auth/user');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getTransactions = async () => {
  try {
    const response = await api.get('/api/transactions');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserBalance = async () => {
  try {
    const response = await api.get('/api/balance');
    return response.data.balance;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createTransaction = async (type: string, amount: number, description: string, recipientId?: number) => {
  try {
    const response = await api.post('/api/transactions', { type, amount, description, recipientId });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const payUtility = async (amount: number, description: string) => {
  try {
    const response = await api.post('/api/services/utility-payment', { amount, description });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const mobileRecharge = async (amount: number, description: string) => {
  try {
    const response = await api.post('/api/services/mobile-recharge', { amount, description });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export default api;










