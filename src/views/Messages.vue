<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="header">
        <h1>Gestion des Messages</h1>
        <button @click="openCreateModal" class="btn-primary">+ Nouveau Message</button>
      </div>

      <div class="filter-section">
        <label for="climat-filter">Filtrer par climat:</label>
        <select v-model="selectedClimatFilter" id="climat-filter">
          <option value="">-- Tous les climats --</option>
          <option v-for="climat in climats" :key="climat.idClimat" :value="climat.idClimat">
            {{ climat.nomClimat }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="loading">Chargement...</div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Message</th>
              <th>Climat</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="message in filteredMessages" :key="message.idMessage">
              <td>{{ message.idMessage }}</td>
              <td class="message-text">{{ message.message }}</td>
              <td>
                <span class="badge">{{ getClimatName(message.idClimat) }}</span>
              </td>
              <td>
                <button @click="openEditModal(message)" class="btn-edit">Modifier</button>
                <button @click="deleteMessage(message.idMessage)" class="btn-delete">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Create/Edit -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>{{ isEditing ? 'Modifier' : 'Créer' }} un Message</h2>
          <form @submit.prevent="saveMessage">
            <div class="form-group">
              <label>Message *</label>
              <textarea 
                v-model="form.message" 
                required 
                placeholder="Entrez le contenu du message..."
                rows="6"
              ></textarea>
              <small class="form-note">{{ form.message.length }} / 10000 caractères</small>
            </div>
            <div class="form-group">
              <label>Climat associé *</label>
              <select v-model="form.idClimat" required>
                <option value="">-- Sélectionner un climat --</option>
                <option v-for="climat in climats" :key="climat.idClimat" :value="climat.idClimat">
                  {{ climat.nomClimat }}
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
import { ref, onMounted, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import apiService from '../services/api'

const messages = ref([])
const climats = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const selectedClimatFilter = ref('')
const form = ref({
  message: '',
  idClimat: '',
})
const editingId = ref(null)

const filteredMessages = computed(() => {
  if (selectedClimatFilter.value === '') {
    return messages.value
  }
  return messages.value.filter(message => message.idClimat === parseInt(selectedClimatFilter.value))
})

const loadMessages = async () => {
  try {
    loading.value = true
    const response = await apiService.getMessages()
    messages.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error)
    alert('Erreur lors du chargement des messages')
  } finally {
    loading.value = false
  }
}

const loadClimats = async () => {
  try {
    const response = await apiService.getClimats()
    climats.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des climats:', error)
    alert('Erreur lors du chargement des climats')
  }
}

const getClimatName = (climatId) => {
  const climat = climats.value.find(c => c.idClimat === climatId)
  return climat ? climat.nomClimat : `ID: ${climatId}`
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    message: '',
    idClimat: '',
  }
  showModal.value = true
}

const openEditModal = (message) => {
  isEditing.value = true
  editingId.value = message.idMessage
  form.value = {
    message: message.message,
    idClimat: message.idClimat,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    message: '',
    idClimat: '',
  }
  editingId.value = null
}

const saveMessage = async () => {
  try {
    if (isEditing.value) {
      await apiService.updateMessage(editingId.value, form.value)
    } else {
      await apiService.createMessage(form.value)
    }
    closeModal()
    loadMessages()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    if (error.response?.data) {
      const errors = error.response.data
      let errorMessage = 'Erreur lors de la sauvegarde :\n'
      for (const key in errors) {
        errorMessage += `${key}: ${errors[key]}\n`
      }
      alert(errorMessage)
    } else {
      alert('Erreur lors de la sauvegarde du message')
    }
  }
}

const deleteMessage = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
    try {
      await apiService.deleteMessage(id)
      loadMessages()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression du message')
    }
  }
}

onMounted(() => {
  loadClimats()
  loadMessages()
})
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-section label {
  margin-right: 1rem;
  color: #2c3e50;
  font-weight: 500;
}

.filter-section select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 250px;
}

.filter-section select:focus {
  outline: none;
  border-color: #667eea;
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
  overflow-x: auto;
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

.message-text {
  max-width: 400px;
  white-space: pre-wrap;
  word-break: break-word;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: #e8f5e9;
  color: #388e3c;
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
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

.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-note {
  display: block;
  margin-top: 0.25rem;
  color: #7f8c8d;
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
