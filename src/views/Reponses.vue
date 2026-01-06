<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="header">
        <h1>Gestion des Réponses</h1>
        <button @click="openCreateModal" class="btn-primary">+ Nouvelle Réponse</button>
      </div>

      <div v-if="loading" class="loading">Chargement...</div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Texte</th>
              <th>Score</th>
              <th>Question</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reponse in reponses" :key="reponse.idReponse">
              <td>{{ reponse.idReponse }}</td>
              <td>{{ reponse.texte }}</td>
              <td>{{ reponse.score }}</td>
              <td>{{ getQuestionText(reponse.question) }}</td>
              <td>
                <button @click="openEditModal(reponse)" class="btn-edit">Modifier</button>
                <button @click="deleteReponse(reponse.idReponse)" class="btn-delete">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Create/Edit -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>{{ isEditing ? 'Modifier' : 'Créer' }} une Réponse</h2>
          <form @submit.prevent="saveReponse">
            <div class="form-group">
              <label>Texte de la réponse</label>
              <input v-model="form.texte" type="text" required />
            </div>
            <div class="form-group">
              <label>Score</label>
              <input v-model.number="form.score" type="number" required />
            </div>
            <div class="form-group">
              <label>Question</label>
              <select v-model="form.question" required>
                <option value="">-- Sélectionner une question --</option>
                <option v-for="q in questions" :key="q.idQuestion" :value="q.idQuestion">
                  {{ q.intituleQuestion }}
                </option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">Annuler</button>
              <button type="submit" class="btn-primary">{{ isEditing ? 'Modifier' : 'Créer' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import apiService from '../services/api'

const reponses = ref([])
const questions = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({
  texte: '',
  score: 1,
  question: '',
})
const editingId = ref(null)

const loadReponses = async () => {
  try {
    loading.value = true
    const response = await apiService.getReponses()
    reponses.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des réponses:', error)
    alert('Erreur lors du chargement des réponses')
  } finally {
    loading.value = false
  }
}

const loadQuestions = async () => {
  try {
    const response = await apiService.getQuestions()
    questions.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des questions:', error)
  }
}

const getQuestionText = (id) => {
  const q = questions.value.find(q => q.idQuestion === id)
  return q ? q.intituleQuestion.substring(0, 50) + '...' : 'N/A'
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    texte: '',
    score: 1,
    question: '',
  }
  showModal.value = true
}

const openEditModal = (reponse) => {
  isEditing.value = true
  editingId.value = reponse.idReponse
  form.value = {
    texte: reponse.texte,
    score: reponse.score,
    question: reponse.question,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    texte: '',
    score: 1,
    question: '',
  }
  editingId.value = null
}

const saveReponse = async () => {
  try {
    if (isEditing.value) {
      await apiService.updateReponse(editingId.value, form.value)
    } else {
      await apiService.createReponse(form.value)
    }
    closeModal()
    loadReponses()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Erreur lors de la sauvegarde de la réponse')
  }
}

const deleteReponse = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
    try {
      await apiService.deleteReponse(id)
      loadReponses()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de la réponse')
    }
  }
}

onMounted(() => {
  loadReponses()
  loadQuestions()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: #2c3e50;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 1rem;
  text-align: left;
  color: #2c3e50;
  font-weight: 600;
}

td {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-edit {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: background 0.3s;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-delete:hover {
  background: #c0392b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-content h2 {
  margin-top: 0;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
