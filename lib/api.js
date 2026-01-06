// Utilidad para hacer llamadas a la API PHP
const API_BASE = '/api'

// Función para hacer peticiones autenticadas
export async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('authToken')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Error en la petición')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Funciones específicas para cada endpoint
export const authAPI = {
  login: (email, password) => 
    apiCall('/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  logout: () => {
    localStorage.removeItem('currentUser')
    localStorage.removeItem('authToken')
  }
}

export const usersAPI = {
  getAll: () => apiCall('/users.php'),
  
  create: (userData) => 
    apiCall('/users.php', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  update: (id, userData) => 
    apiCall(`/users.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),

  delete: (id) => 
    apiCall(`/users.php?id=${id}`, {
      method: 'DELETE'
    })
}

export const ticketsAPI = {
  getAll: () => apiCall('/tickets.php'),
  
  create: (ticketData) => 
    apiCall('/tickets.php', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    }),

  update: (id, ticketData) => 
    apiCall(`/tickets.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData)
    }),

  delete: (id) => 
    apiCall(`/tickets.php?id=${id}`, {
      method: 'DELETE'
    })
}