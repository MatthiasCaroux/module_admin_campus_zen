<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="header">
        <h1>Gestion des Questionnaires</h1>
        <button @click="openCreateModal" class="btn-primary">+ Nouveau Questionnaire</button>
      </div>

      <div v-if="loading" class="loading">Chargement...</div>

      <div v-else class="questionnaires-list">
        <div v-for="questionnaire in questionnaires" :key="questionnaire.idQuestionnaire" class="questionnaire-card">
          <!-- En-tête du questionnaire -->
          <div class="questionnaire-header" @click="toggleQuestionnaire(questionnaire.idQuestionnaire)">
            <div class="questionnaire-info">
              <span class="expand-icon">{{ expandedQuestionnaires.includes(questionnaire.idQuestionnaire) ? '▼' : '►' }}</span>
              <div>
                <h3>{{ questionnaire.nomQuestionnaire }}</h3>
                <p class="description">{{ questionnaire.descriptionQuestionnaire }}</p>
              </div>
            </div>
            <div class="questionnaire-actions" @click.stop>
              <button @click="openEditModal(questionnaire)" class="btn-edit">Modifier</button>
              <button @click="deleteQuestionnaire(questionnaire.idQuestionnaire)" class="btn-delete">Supprimer</button>
            </div>
          </div>

          <!-- Questions du questionnaire (déroulant) -->
          <div v-if="expandedQuestionnaires.includes(questionnaire.idQuestionnaire)" class="questions-container">
            <div class="add-question-btn-container">
              <button @click="openAddQuestionModal(questionnaire.idQuestionnaire)" class="btn-add-small">+ Ajouter une question</button>
            </div>

            <div v-if="getQuestionsByQuestionnaire(questionnaire.idQuestionnaire).length === 0" class="no-data">
              Aucune question pour ce questionnaire
            </div>
            <div v-else class="questions-list">
              <div v-for="question in getQuestionsByQuestionnaire(questionnaire.idQuestionnaire)" :key="question.idQuestion" class="question-item">
                <!-- En-tête de la question -->
                <div class="question-content">
                  <div class="question-header" @click="toggleQuestion(question.idQuestion)">
                    <span class="expand-icon">{{ expandedQuestions.includes(question.idQuestion) ? '▼' : '►' }}</span>
                    <div class="question-text">
                      <strong>Question {{ question.idQuestion }}:</strong> {{ question.intituleQuestion }}
                      <span class="question-weight">(Poids: {{ question.poids }})</span>
                    </div>
                  </div>
                  <div class="question-actions" @click.stop>
                    <button @click="openEditQuestionModal(question)" class="btn-edit-small">Modifier</button>
                    <button @click="deleteQuestion(question.idQuestion)" class="btn-delete-small">Supprimer</button>
                  </div>
                </div>

                <!-- Réponses de la question (déroulant) -->
                <div v-if="expandedQuestions.includes(question.idQuestion)" class="reponses-container">
                  <div class="add-reponse-btn-container">
                    <button @click="openAddReponseModal(question.idQuestion)" class="btn-add-tiny">+ Ajouter une réponse</button>
                  </div>

                  <div v-if="getReponsesByQuestion(question.idQuestion).length === 0" class="no-data">
                    Aucune réponse pour cette question
                  </div>
                  <div v-else class="reponses-list">
                    <div v-for="reponse in getReponsesByQuestion(question.idQuestion)" :key="reponse.idReponse" class="reponse-item">
                      <span class="reponse-text">{{ reponse.texte }}</span>
                      <div class="reponse-actions">
                        <span class="reponse-score">Score: {{ reponse.score }}</span>
                        <button @click="openEditReponseModal(reponse)" class="btn-edit-tiny">Modifier</button>
                        <button @click="deleteReponse(reponse.idReponse)" class="btn-delete-tiny">Supprimer</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Create/Edit Questionnaire -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>{{ isEditing ? 'Modifier' : 'Créer' }} un Questionnaire</h2>
          <form @submit.prevent="saveQuestionnaire">
            <div class="form-group">
              <label>Nom du questionnaire</label>
              <input v-model="form.nomQuestionnaire" type="text" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.descriptionQuestionnaire" required></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-secondary">Annuler</button>
              <button type="submit" class="btn-primary">{{ isEditing ? 'Modifier' : 'Créer' }}</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Create/Edit Question -->
      <div v-if="showQuestionModal" class="modal-overlay" @click="closeQuestionModal">
        <div class="modal-content" @click.stop>
          <h2>{{ isEditingQuestion ? 'Modifier' : 'Ajouter' }} une Question</h2>
          <form @submit.prevent="saveQuestion">
            <div class="form-group">
              <label>Intitulé de la question</label>
              <textarea v-model="questionForm.intituleQuestion" required></textarea>
            </div>
            <div class="form-group">
              <label>Poids</label>
              <input v-model.number="questionForm.poids" type="number" step="0.1" required />
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeQuestionModal" class="btn-secondary">Annuler</button>
              <button type="submit" class="btn-primary">{{ isEditingQuestion ? 'Modifier' : 'Ajouter' }}</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal Create/Edit Reponse -->
      <div v-if="showReponseModal" class="modal-overlay" @click="closeReponseModal">
        <div class="modal-content" @click.stop>
          <h2>{{ isEditingReponse ? 'Modifier' : 'Ajouter' }} une Réponse</h2>
          <form @submit.prevent="saveReponse">
            <div class="form-group">
              <label>Texte de la réponse</label>
              <input v-model="reponseForm.texte" type="text" required />
            </div>
            <div class="form-group">
              <label>Score</label>
              <input v-model.number="reponseForm.score" type="number" required />
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeReponseModal" class="btn-secondary">Annuler</button>
              <button type="submit" class="btn-primary">{{ isEditingReponse ? 'Modifier' : 'Ajouter' }}</button>
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

const questionnaires = ref([])
const questions = ref([])
const reponses = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const expandedQuestionnaires = ref([])
const expandedQuestions = ref([])
const form = ref({
  nomQuestionnaire: '',
  descriptionQuestionnaire: '',
})
const editingId = ref(null)

// Question modal
const showQuestionModal = ref(false)
const isEditingQuestion = ref(false)
const questionForm = ref({
  intituleQuestion: '',
  poids: 1.0,
  questionnaireId: null,
})
const editingQuestionId = ref(null)

// Reponse modal
const showReponseModal = ref(false)
const isEditingReponse = ref(false)
const reponseForm = ref({
  texte: '',
  score: 1,
  question: null,
})
const editingReponseId = ref(null)

const loadQuestionnaires = async () => {
  try {
    loading.value = true
    const [questionnairesRes, questionsRes, reponsesRes] = await Promise.all([
      apiService.getQuestionnaires(),
      apiService.getQuestions(),
      apiService.getReponses()
    ])
    questionnaires.value = questionnairesRes.data
    questions.value = questionsRes.data
    reponses.value = reponsesRes.data
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    alert('Erreur lors du chargement des données')
  } finally {
    loading.value = false
  }
}

const getQuestionsByQuestionnaire = (questionnaireId) => {
  return questions.value.filter(q => q.questionnaireId === questionnaireId)
}

const getReponsesByQuestion = (questionId) => {
  return reponses.value.filter(r => r.question === questionId).sort((a, b) => a.score - b.score)
}

const toggleQuestionnaire = (id) => {
  const index = expandedQuestionnaires.value.indexOf(id)
  if (index > -1) {
    expandedQuestionnaires.value.splice(index, 1)
  } else {
    expandedQuestionnaires.value.push(id)
  }
}

const toggleQuestion = (id) => {
  const index = expandedQuestions.value.indexOf(id)
  if (index > -1) {
    expandedQuestions.value.splice(index, 1)
  } else {
    expandedQuestions.value.push(id)
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    nomQuestionnaire: '',
    descriptionQuestionnaire: '',
  }
  showModal.value = true
}

const openEditModal = (questionnaire) => {
  isEditing.value = true
  editingId.value = questionnaire.idQuestionnaire
  form.value = {
    nomQuestionnaire: questionnaire.nomQuestionnaire,
    descriptionQuestionnaire: questionnaire.descriptionQuestionnaire,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    nomQuestionnaire: '',
    descriptionQuestionnaire: '',
  }
  editingId.value = null
}

const saveQuestionnaire = async () => {
  try {
    if (isEditing.value) {
      await apiService.updateQuestionnaire(editingId.value, form.value)
    } else {
      await apiService.createQuestionnaire(form.value)
    }
    closeModal()
    loadQuestionnaires()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Erreur lors de la sauvegarde du questionnaire')
  }
}

const deleteQuestionnaire = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce questionnaire ?')) {
    try {
      await apiService.deleteQuestionnaire(id)
      loadQuestionnaires()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression du questionnaire')
    }
  }
}

// Question functions
const openAddQuestionModal = (questionnaireId) => {
  isEditingQuestion.value = false
  questionForm.value = {
    intituleQuestion: '',
    poids: 1.0,
    questionnaireId: questionnaireId,
  }
  showQuestionModal.value = true
}

const openEditQuestionModal = (question) => {
  isEditingQuestion.value = true
  editingQuestionId.value = question.idQuestion
  questionForm.value = {
    intituleQuestion: question.intituleQuestion,
    poids: question.poids,
    questionnaireId: question.questionnaireId,
  }
  showQuestionModal.value = true
}

const closeQuestionModal = () => {
  showQuestionModal.value = false
  questionForm.value = {
    intituleQuestion: '',
    poids: 1.0,
    questionnaireId: null,
  }
  editingQuestionId.value = null
}

const saveQuestion = async () => {
  try {
    if (isEditingQuestion.value) {
      await apiService.updateQuestion(editingQuestionId.value, questionForm.value)
    } else {
      await apiService.createQuestion(questionForm.value)
    }
    closeQuestionModal()
    loadQuestionnaires()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Erreur lors de la sauvegarde de la question')
  }
}

const deleteQuestion = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
    try {
      await apiService.deleteQuestion(id)
      loadQuestionnaires()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de la question')
    }
  }
}

// Reponse functions
const openAddReponseModal = (questionId) => {
  isEditingReponse.value = false
  reponseForm.value = {
    texte: '',
    score: 1,
    question: questionId,
  }
  showReponseModal.value = true
}

const openEditReponseModal = (reponse) => {
  isEditingReponse.value = true
  editingReponseId.value = reponse.idReponse
  reponseForm.value = {
    texte: reponse.texte,
    score: reponse.score,
    question: reponse.question,
  }
  showReponseModal.value = true
}

const closeReponseModal = () => {
  showReponseModal.value = false
  reponseForm.value = {
    texte: '',
    score: 1,
    question: null,
  }
  editingReponseId.value = null
}

const saveReponse = async () => {
  try {
    if (isEditingReponse.value) {
      await apiService.updateReponse(editingReponseId.value, reponseForm.value)
    } else {
      await apiService.createReponse(reponseForm.value)
    }
    closeReponseModal()
    loadQuestionnaires()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Erreur lors de la sauvegarde de la réponse')
  }
}

const deleteReponse = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
    try {
      await apiService.deleteReponse(id)
      loadQuestionnaires()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de la réponse')
    }
  }
}

onMounted(() => {
  loadQuestionnaires()
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

.questionnaires-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.questionnaire-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.questionnaire-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: background 0.3s;
  gap: 1rem;
}

.questionnaire-header:hover {
  background: #f8f9fa;
}

.questionnaire-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.expand-icon {
  font-size: 1rem;
  color: #667eea;
  min-width: 20px;
}

.questionnaire-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.questionnaire-info .description {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.questionnaire-actions {
  display: flex;
  gap: 0.5rem;
}

.questions-container {
  background: #f8f9fa;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid #e9ecef;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.question-item {
  background: white;
  border-radius: 6px;
  overflow: hidden;
  border-left: 3px solid #667eea;
}

.question-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  flex: 1;
}

.question-header:hover {
  background: #f8f9fa;
}

.question-actions {
  display: flex;
  gap: 0.5rem;
  padding-right: 1rem;
}

.question-text {
  flex: 1;
  color: #2c3e50;
}

.question-weight {
  margin-left: 0.5rem;
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: normal;
}

.reponses-container {
  background: #f8f9fa;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
}

.reponses-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reponse-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  border-left: 2px solid #9b59b6;
}

.reponse-text {
  flex: 1;
  color: #2c3e50;
}

.reponse-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reponse-score {
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.no-data {
  text-align: center;
  padding: 1rem;
  color: #7f8c8d;
  font-style: italic;
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
.form-group textarea {
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
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.add-question-btn-container,
.add-reponse-btn-container {
  margin-bottom: 1rem;
}

.btn-add-small {
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.3s;
}

.btn-add-small:hover {
  background: #229954;
}

.btn-add-tiny {
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.3s;
}

.btn-add-tiny:hover {
  background: #229954;
}

.btn-edit-small,
.btn-edit-tiny {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.3s;
}

.btn-edit-small:hover,
.btn-edit-tiny:hover {
  background: #2980b9;
}

.btn-delete-small,
.btn-delete-tiny {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.3s;
}

.btn-delete-small:hover,
.btn-delete-tiny:hover {
  background: #c0392b;
}
</style>
