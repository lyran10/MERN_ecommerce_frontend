import axios from 'axios'

// const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

const API_BASE = 'https://mern-ecommerce-backend-gn7s.onrender.com'

const api = axios.create({
  baseURL: API_BASE + '/api',
  withCredentials: true
})

// interceptor to attach bearer token if present in localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token && config.headers) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

export default api
