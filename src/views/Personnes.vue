<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="header">
        <h1>Gestion des Personnes</h1>
        <button @click="openCreateModal" class="btn-primary">+ Nouvelle Personne</button>
      </div>

      <div v-if="loading" class="loading">Chargement...</div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Identifiant</th>
              <th>Rôle</th>
              <th>Dernière Connexion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="personne in personnes" :key="personne.idPers">
              <td>{{ personne.idPers }}</td>
              <td>{{ personne.login }}</td>
              <td>
                <span class="badge" :class="'badge-' + personne.role">
                  {{ personne.role }}
                </span>
              </td>
              <td>{{ formatDate(personne.lastConnection) }}</td>
              <td>
                <button @click="openEditModal(personne)" class="btn-edit">Modifier</button>
                <button @click="deletePersonne(personne.idPers)" class="btn-delete">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Create/Edit -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>{{ isEditing ? 'Modifier' : 'Créer' }} une Personne</h2>
          <form @submit.prevent="savePersonne">
            <div class="form-group">
              <label>Identifiant *</label>
              <input
                v-model="form.login"
                type="text"
                required
                placeholder="Identifiant"
                :disabled="isEditing"
              />
              <small v-if="isEditing" class="form-note">L'identifiant ne peut pas être modifié</small>
            </div>
            <div class="form-group">
              <label>Mot de passe {{ isEditing ? '' : '*' }}</label>
              <input 
                v-model="form.passwordPers" 
                type="password" 
                :required="!isEditing"
                :placeholder="isEditing ? 'Laisser vide pour ne pas modifier' : 'Mot de passe'"
              />
              <small v-if="isEditing" class="form-note">Laisser vide pour conserver le mot de passe actuel</small>
            </div>
            <div class="form-group">
              <label>Rôle *</label>
              <select v-model="form.role" required>
                <option value="">-- Sélectionner un rôle --</option>
                <option value="étudiant">Étudiant</option>
                <option value="admin">Admin</option>
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

const personnes = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({
  login: '',
  passwordPers: '',
  role: '',
})
const editingId = ref(null)

const loadPersonnes = async () => {
  try {
    loading.value = true
    const response = await apiService.getPersonnes()
    personnes.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des personnes:', error)
    alert('Erreur lors du chargement des personnes')
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    login: '',
    passwordPers: '',
    role: '',
  }
  showModal.value = true
}

const openEditModal = (personne) => {
  isEditing.value = true
  editingId.value = personne.idPers
  form.value = {
    login: personne.login,
    passwordPers: '', // Ne pas pré-remplir le mot de passe
    role: personne.role,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    login: '',
    passwordPers: '',
    role: '',
  }
  editingId.value = null
}

const savePersonne = async () => {
  try {
    const data = {
      login: form.value.login,
      role: form.value.role,
    }
    
    // Ajouter le mot de passe seulement s'il est renseigné
    if (form.value.passwordPers) {
      data.passwordPers = form.value.passwordPers
    }
    
    if (isEditing.value) {
      await apiService.updatePersonne(editingId.value, data)
    } else {
      await apiService.createPersonne(data)
    }
    closeModal()
    loadPersonnes()
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
      alert('Erreur lors de la sauvegarde de la personne')
    }
  }
}

const deletePersonne = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette personne ?')) {
    try {
      await apiService.deletePersonne(id)
      loadPersonnes()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de la personne')
    }
  }
}

onMounted(() => {
  loadPersonnes()
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

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
}

.badge-étudiant {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-admin {
  background: #fce4ec;
  color: #c2185b;
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-note {
  display: block;
  margin-top: 0.25rem;
  color: #7f8c8d;
  font-size: 0.85rem;
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
