import axios from 'axios'
import router from '../router'

const API_BASE_URL = 'https://incidents-bouake.com/api'
// const API_BASE_URL = 'http://localhost:8000/api'

// Instance axios avec credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT: Envoie les cookies HttpOnly automatiquement
})

// Variable pour éviter les appels multiples au refresh
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Intercepteur de réponse pour gérer les erreurs 401 et le refresh automatique
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Si erreur 401 et pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre en file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Tentative de refresh du token (le cookie est envoyé automatiquement)
        await api.post('/token/refresh/')
        
        isRefreshing = false
        processQueue(null)
        
        // Réessayer la requête originale
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false
        
        // Refresh échoué, déconnecter l'utilisateur
        localStorage.removeItem('isAuthenticated')
        router.push('/login')
        
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Generic CRUD operations
const apiService = {
  // Questionnaires
  getQuestionnaires: () => api.get('/questionnaires/'),
  getQuestionnaire: (id) => api.get(`/questionnaires/${id}/`),
  createQuestionnaire: (data) => api.post('/questionnaires/', data),
  updateQuestionnaire: (id, data) => api.put(`/questionnaires/${id}/`, data),
  deleteQuestionnaire: (id) => api.delete(`/questionnaires/${id}/`),

  // Questions
  getQuestions: () => api.get('/questions/'),
  getQuestion: (id) => api.get(`/questions/${id}/`),
  createQuestion: (data) => api.post('/questions/', data),
  updateQuestion: (id, data) => api.put(`/questions/${id}/`, data),
  deleteQuestion: (id) => api.delete(`/questions/${id}/`),

  // Reponses
  getReponses: () => api.get('/reponses/'),
  getReponse: (id) => api.get(`/reponses/${id}/`),
  createReponse: (data) => api.post('/reponses/', data),
  updateReponse: (id, data) => api.put(`/reponses/${id}/`, data),
  deleteReponse: (id) => api.delete(`/reponses/${id}/`),

  // Ressources
  getRessources: () => api.get('/ressources/'),
  getRessource: (id) => api.get(`/ressources/${id}/`),
  createRessource: (data) => api.post('/ressources/', data),
  updateRessource: (id, data) => api.put(`/ressources/${id}/`, data),
  deleteRessource: (id) => api.delete(`/ressources/${id}/`),

  // Climats
  getClimats: () => api.get('/climats/'),
  getClimat: (id) => api.get(`/climats/${id}/`),
  createClimat: (data) => api.post('/climats/', data),
  updateClimat: (id, data) => api.put(`/climats/${id}/`, data),
  deleteClimat: (id) => api.delete(`/climats/${id}/`),

  // Personnes
  getPersonnes: () => api.get('/personnes/'),
  getPersonne: (id) => api.get(`/personnes/${id}/`),
  createPersonne: (data) => api.post('/personnes/', data),
  updatePersonne: (id, data) => api.put(`/personnes/${id}/`, data),
  deletePersonne: (id) => api.delete(`/personnes/${id}/`),

  // Messages
  getMessages: () => api.get('/messages/'),
  getMessage: (id) => api.get(`/messages/${id}/`),
  createMessage: (data) => api.post('/messages/', data),
  updateMessage: (id, data) => api.put(`/messages/${id}/`, data),
  deleteMessage: (id) => api.delete(`/messages/${id}/`),

  // Statuts
  getStatuts: () => api.get('/statuts/'),

  // ===== AUTHENTIFICATION AVEC COOKIES HTTPONLY =====
  
  // Login - Les tokens sont automatiquement stockés dans les cookies HttpOnly
  login: (data) => api.post('/token/', data),
  
  // Logout - Supprime les cookies HttpOnly côté serveur
  logout: async () => {
    try {
      await api.post('/logout/')
      localStorage.removeItem('isAuthenticated')
      return { success: true }
    } catch (error) {
      // Même en cas d'erreur, on nettoie localement
      localStorage.removeItem('isAuthenticated')
      throw error
    }
  },

  // Vérifier si l'utilisateur est authentifié (test avec un endpoint protégé)
  checkAuth: () => api.get('/me/'),
  
  // Refresh token (appelé automatiquement par l'intercepteur)
  refreshToken: () => api.post('/token/refresh/'),
}

export default apiService
