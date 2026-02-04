<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="header">
        <h1>Gestion des Ressources</h1>
        <button @click="openCreateModal" class="btn-primary">+ Nouvelle Ressource</button>
      </div>

      <div v-if="loading" class="loading">Chargement...</div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Titre</th>
              <th>Description</th>
              <th>Lien</th>
              <th>Climat</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ressource in ressources" :key="ressource.idR">
              <td>{{ ressource.idR }}</td>
              <td><span class="badge" :class="'badge-' + ressource.typeR">{{ ressource.typeR }}</span></td>
              <td>{{ ressource.titreR }}</td>
              <td>{{ ressource.descriptionR }}</td>
              <td><a :href="ressource.lienR" target="_blank" class="link">Voir</a></td>
              <td>{{ getClimatName(ressource.climat) }}</td>
              <td>
                <button @click="openEditModal(ressource)" class="btn-edit">Modifier</button>
                <button @click="deleteRessource(ressource.idR)" class="btn-delete">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Create/Edit -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>{{ isEditing ? 'Modifier' : 'Créer' }} une Ressource</h2>
          <form @submit.prevent="saveRessource">
            <div class="form-group">
              <label>Type</label>
              <select v-model="form.typeR" required>
                <option value="">-- Sélectionner un type --</option>
                <option value="video">Vidéo</option>
                <option value="article">Article</option>
                <option value="podcast">Podcast</option>
                <option value="autre">Autre</option>
              </select>
            </div>
            <div class="form-group">
              <label>Titre</label>
              <input v-model="form.titreR" type="text" required />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.descriptionR" required></textarea>
            </div>
            <div class="form-group">
              <label>Lien</label>
              <input v-model="form.lienR" type="url" required placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>Climat</label>
              <select v-model="form.climat" required>
                <option value="">-- Sélectionner un climat --</option>
                <option v-for="climat in climats" :key="climat.idClimat" :value="climat.idClimat">{{ climat.nomClimat }}</option>
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

const ressources = ref([])
const climats = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({
  typeR: '',
  titreR: '',
  descriptionR: '',
  lienR: '',
  climat: '',
})
const editingId = ref(null)

const loadRessources = async () => {
  try {
    loading.value = true
    const response = await apiService.getRessources()
    ressources.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error)
    alert('Erreur lors du chargement des ressources')
  } finally {
    loading.value = false
  }
}

const loadClimats = async () => {
  try {
    const res = await apiService.getClimats()
    climats.value = res.data
  } catch (error) {
    console.error('Erreur lors du chargement des climats:', error)
  }
}

const getClimatName = (id) => {
  if (id === null || id === undefined) return ''
  const c = climats.value.find(cl => cl.idClimat === id)
  return c ? c.nomClimat : id
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    typeR: '',
    titreR: '',
    descriptionR: '',
    lienR: '',
    climat: '',
  }
  showModal.value = true
}

const openEditModal = (ressource) => {
  isEditing.value = true
  editingId.value = ressource.idR
  form.value = {
    typeR: ressource.typeR,
    titreR: ressource.titreR,
    descriptionR: ressource.descriptionR,
    lienR: ressource.lienR,
    climat: ressource.climat ?? '',
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    typeR: '',
    titreR: '',
    descriptionR: '',
    lienR: '',
    climat: '',
  }
  editingId.value = null
}

const saveRessource = async () => {
  try {
    if (isEditing.value) {
      await apiService.updateRessource(editingId.value, form.value)
    } else {
      await apiService.createRessource(form.value)
    }
    closeModal()
    loadRessources()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Erreur lors de la sauvegarde de la ressource')
  }
}

const deleteRessource = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
    try {
      await apiService.deleteRessource(id)
      loadRessources()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de la ressource')
    }
  }
}

onMounted(() => {
  // load both ressources and climat options
  loadRessources()
  loadClimats()
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
}

.badge-video {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-article {
  background: #f3e5f5;
  color: #7b1fa2;
}

.badge-podcast {
  background: #e8f5e9;
  color: #388e3c;
}

.badge-autre {
  background: #fff3e0;
  color: #f57c00;
}

.link {
  color: #667eea;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
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
</style>
