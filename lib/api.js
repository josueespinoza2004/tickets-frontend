// Utilidad para hacer llamadas a la API PHP
// Utilidad para hacer llamadas a la API PHP
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/tickets/tickets-backend'

// Exportamos fetchApi
export const fetchApi = async (endpoint, options = {}) => {
    // Asegurar que el endpoint empiece con /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return apiCall(path, options);
};

// Función para hacer peticiones autenticadas
export async function apiCall(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('authToken') : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  }

  // Si el body es FormData, quitamos Content-Type para que el navegador ponga el boundary
  if (options.body instanceof FormData) {
      delete headers['Content-Type']
  }

  const config = {
    ...options,
    headers
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config)
    const text = await response.text()
    
    // Intentar parsear JSON
    try {
        const data = JSON.parse(text)
        if (!response.ok) {
            throw new Error(data.error || 'Error en la petición')
        }
        return data
    } catch (e) {
        // Si falla el parseo, lanzar error con el texto (útil para debug errores PHP)
        if (!response.ok) throw new Error(text || 'Error en el servidor')
        throw new Error('Respuesta inválida del servidor: ' + text.substring(0, 50))
    }
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Funciones específicas para cada endpoint
export const authAPI = {
  login: (email, password) => 
    apiCall('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  logout: async () => {
    try {
        await apiCall('/auth/logout.php', { method: 'POST' })
    } catch (e) {
        console.warn("Logout backend failed", e)
    } finally {
        sessionStorage.removeItem('currentUser')
        sessionStorage.removeItem('authToken')
        // Forzar recarga o redirección si es necesario
        window.location.href = "/"
    }
  }
}

export const usersAPI = {
  getAll: () => apiCall('/api/users.php'), // TODO: Crear este endpoint si no existe
  
  create: (userData) => 
    apiCall('/api/create_user.php', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  update: (id, userData) => 
    apiCall(`/api/users.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),

  delete: (id) => 
    apiCall(`/api/users.php?id=${id}`, {
      method: 'DELETE'
    })
}

export const ticketsAPI = {
  getAll: () => apiCall('/api/tickets.php'),
  
  create: (ticketData) => 
    apiCall('/api/create_ticket.php', {
      method: 'POST',
      body: ticketData instanceof FormData ? ticketData : JSON.stringify(ticketData)
    }),

  update: (id, ticketData) => 
    apiCall(`/api/tickets.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData)
    }),

  delete: (id) => 
    apiCall(`/api/tickets.php?id=${id}`, {
      method: 'DELETE'
    })
}