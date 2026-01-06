<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="header">
        <h1>Gestion des Questions</h1>
        <button @click="openCreateModal" class="btn-primary">+ Nouvelle Question</button>
      </div>

      <div v-if="loading" class="loading">Chargement...</div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Intitulé</th>
              <th>Poids</th>
              <th>Questionnaire</th>
              <th>Réponses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="question in questions" :key="question.idQuestion">
              <td>{{ question.idQuestion }}</td>
              <td>{{ question.intituleQuestion }}</td>
              <td>{{ question.poids }}</td>
              <td>{{ getQuestionnaireName(question.questionnaireId) }}</td>
              <td>
                <button @click="showResponses(question)" class="btn-responses">
                  {{ getResponseCount(question.idQuestion) }} réponse(s)
                </button>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="openEditModal(question)" class="btn-edit">Modifier</button>
                  <button @click="deleteQuestion(question.idQuestion)" class="btn-delete">Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Create/Edit -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>{{ isEditing ? 'Modifier' : 'Créer' }} une Question</h2>
          <form @submit.prevent="saveQuestion">
            <div class="form-group">
              <label>Intitulé de la question</label>
              <textarea v-model="form.intituleQuestion" required></textarea>
            </div>
            <div class="form-group">
              <label>Poids</label>
              <input v-model.number="form.poids" type="number" step="0.1" required />
            </div>
            <div class="form-group">
              <label>Questionnaire</label>
              <select v-model="form.questionnaireId" required>
                <option value="">-- Sélectionner un questionnaire --</option>
                <option v-for="q in questionnaires" :key="q.idQuestionnaire" :value="q.idQuestionnaire">
                  {{ q.nomQuestionnaire }}
                </option>
              </select>
            </div>

            <!-- Option pour créer les réponses Likert -->
            <div v-if="!isEditing" class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="createLikertResponses" />
                <span>Créer automatiquement les réponses Likert (échelle de 1 à 7)</span>
              </label>
              <p v-if="createLikertResponses" class="help-text">
                7 réponses seront créées : Jamais (1), Très rarement (2), Rarement (3), Parfois (4), Souvent (5), Très souvent (6), Toujours (7)
              </p>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">Annuler</button>
              <button type="submit" class="btn-primary">{{ isEditing ? 'Modifier' : 'Créer' }}</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Réponses -->
      <div v-if="showResponsesModal" class="modal-overlay" @click="closeResponsesModal">
        <div class="modal-content modal-large" @click.stop>
          <h2>Réponses pour : {{ selectedQuestion?.intituleQuestion }}</h2>

          <div v-if="loadingResponses" class="loading">Chargement des réponses...</div>

          <div v-else-if="questionResponses.length === 0" class="no-responses">
            <p>Aucune réponse pour cette question.</p>
          </div>

          <div v-else class="responses-list">
            <div v-for="reponse in questionResponses" :key="reponse.idReponse" class="response-item">
              <div class="response-header">
                <span class="response-text">{{ reponse.texte }}</span>
                <span class="response-score">Score: {{ reponse.score }}</span>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeResponsesModal" class="btn-primary">Fermer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import apiService from '../services/api'

const questions = ref([])
const questionnaires = ref([])
const reponses = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const createLikertResponses = ref(false)
const showResponsesModal = ref(false)
const loadingResponses = ref(false)
const selectedQuestion = ref(null)
const questionResponses = ref([])
const form = ref({
  intituleQuestion: '',
  poids: 1.0,
  questionnaireId: '',
})
const editingId = ref(null)

// Template des réponses Likert à 7 niveaux
const likertTemplate = [
  { texte: 'Jamais', score: 1 },
  { texte: 'Très rarement', score: 2 },
  { texte: 'Rarement', score: 3 },
  { texte: 'Parfois', score: 4 },
  { texte: 'Souvent', score: 5 },
  { texte: 'Très souvent', score: 6 },
  { texte: 'Toujours', score: 7 },
]

const loadQuestions = async () => {
  try {
    loading.value = true
    const response = await apiService.getQuestions()
    questions.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des questions:', error)
    alert('Erreur lors du chargement des questions')
  } finally {
    loading.value = false
  }
}

const loadQuestionnaires = async () => {
  try {
    const response = await apiService.getQuestionnaires()
    questionnaires.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des questionnaires:', error)
  }
}

const loadReponses = async () => {
  try {
    const response = await apiService.getReponses()
    reponses.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des réponses:', error)
  }
}

const getQuestionnaireName = (id) => {
  const q = questionnaires.value.find(q => q.idQuestionnaire === id)
  return q ? q.nomQuestionnaire : 'N/A'
}

const getResponseCount = (questionId) => {
  return reponses.value.filter(r => r.question === questionId).length
}

const showResponses = async (question) => {
  selectedQuestion.value = question
  showResponsesModal.value = true
  loadingResponses.value = true

  try {
    questionResponses.value = reponses.value
      .filter(r => r.question === question.idQuestion)
      .sort((a, b) => a.score - b.score)
  } catch (error) {
    console.error('Erreur lors du chargement des réponses:', error)
  } finally {
    loadingResponses.value = false
  }
}

const closeResponsesModal = () => {
  showResponsesModal.value = false
  selectedQuestion.value = null
  questionResponses.value = []
}

const openCreateModal = () => {
  isEditing.value = false
  createLikertResponses.value = false
  form.value = {
    intituleQuestion: '',
    poids: 1.0,
    questionnaireId: '',
  }
  showModal.value = true
}

const openEditModal = (question) => {
  isEditing.value = true
  editingId.value = question.idQuestion
  form.value = {
    intituleQuestion: question.intituleQuestion,
    poids: question.poids,
    questionnaireId: question.questionnaireId,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    intituleQuestion: '',
    poids: 1.0,
    questionnaireId: '',
  }
  editingId.value = null
}

const saveQuestion = async () => {
  try {
    if (isEditing.value) {
      await apiService.updateQuestion(editingId.value, form.value)
      closeModal()
      loadQuestions()
    } else {
      // Créer la question
      const response = await apiService.createQuestion(form.value)
      const newQuestion = response.data

      // Si l'option Likert est cochée, créer les 7 réponses
      if (createLikertResponses.value && newQuestion.idQuestion) {
        const questionId = newQuestion.idQuestion

        // Créer les 7 réponses Likert en parallèle
        const reponsePromises = likertTemplate.map(reponse =>
          apiService.createReponse({
            texte: reponse.texte,
            score: reponse.score,
            question: questionId
          })
        )

        await Promise.all(reponsePromises)
        alert('Question créée avec succès avec 7 réponses Likert !')
      }

      closeModal()
      loadQuestions()
      loadReponses()
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Erreur lors de la sauvegarde de la question')
  }
}

const deleteQuestion = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
    try {
      await apiService.deleteQuestion(id)
      loadQuestions()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de la question')
    }
  }
}

onMounted(() => {
  loadQuestions()
  loadQuestionnaires()
  loadReponses()
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

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-edit {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  min-width: 90px;
  font-size: 0.9rem;
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
  min-width: 90px;
  font-size: 0.9rem;
}

.btn-delete:hover {
  background: #c0392b;
}

.btn-responses {
  background: #9b59b6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 0.9rem;
  min-width: 110px;
  white-space: nowrap;
}

.btn-responses:hover {
  background: #8e44ad;
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

.modal-large {
  max-width: 700px;
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
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.checkbox-group {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e9ecef;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
}

.checkbox-label span {
  flex: 1;
}

.help-text {
  margin-top: 0.75rem;
  margin-bottom: 0;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  padding-left: 2rem;
}

.no-responses {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.responses-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.response-item {
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  border-radius: 4px;
  padding: 1rem;
  transition: all 0.3s;
}

.response-item:hover {
  background: #e9ecef;
  border-left-color: #5568d3;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.response-text {
  flex: 1;
  color: #2c3e50;
  font-weight: 500;
}

.response-score {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}
</style>
