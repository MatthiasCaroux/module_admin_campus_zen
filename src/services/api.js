import axios from 'axios'

const API_BASE_URL = 'http://54.38.35.105:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
}

export default apiService
