<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="header">
        <h1>Gestion des Climats</h1>
        <button @click="openCreateModal" class="btn-primary">+ Nouveau Climat</button>
      </div>

      <div v-if="loading" class="loading">Chargement...</div>

      <div v-else class="cards-grid">
        <div v-for="climat in climats" :key="climat.idClimat" class="climat-card">
          <h3>{{ climat.nomClimat }}</h3>
          <p class="climat-id">ID: {{ climat.idClimat }}</p>
          <div class="card-actions">
            <button @click="openEditModal(climat)" class="btn-edit">Modifier</button>
            <button @click="deleteClimat(climat.idClimat)" class="btn-delete">Supprimer</button>
          </div>
        </div>
      </div>

      <!-- Modal Create/Edit -->
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h2>{{ isEditing ? 'Modifier' : 'Créer' }} un Climat</h2>
          <form @submit.prevent="saveClimat">
            <div class="form-group">
              <label>Nom du climat</label>
              <input v-model="form.nomClimat" type="text" required placeholder="Ex: Ensoleillé" />
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

const climats = ref([])
const loading = ref(true)
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({
  nomClimat: '',
})
const editingId = ref(null)

const loadClimats = async () => {
  try {
    loading.value = true
    const response = await apiService.getClimats()
    climats.value = response.data
  } catch (error) {
    console.error('Erreur lors du chargement des climats:', error)
    alert('Erreur lors du chargement des climats')
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  form.value = {
    nomClimat: '',
  }
  showModal.value = true
}

const openEditModal = (climat) => {
  isEditing.value = true
  editingId.value = climat.idClimat
  form.value = {
    nomClimat: climat.nomClimat,
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  form.value = {
    nomClimat: '',
  }
  editingId.value = null
}

const saveClimat = async () => {
  try {
    if (isEditing.value) {
      await apiService.updateClimat(editingId.value, form.value)
    } else {
      await apiService.createClimat(form.value)
    }
    closeModal()
    loadClimats()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Erreur lors de la sauvegarde du climat')
  }
}

const deleteClimat = async (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce climat ?')) {
    try {
      await apiService.deleteClimat(id)
      loadClimats()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression du climat')
    }
  }
}

onMounted(() => {
  loadClimats()
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.climat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.climat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.climat-card h3 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.climat-id {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
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
  flex: 1;
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  flex: 1;
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
