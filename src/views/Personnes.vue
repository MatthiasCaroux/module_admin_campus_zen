<template>
  <div>
    <Navbar />
    <div class="container">
      <h1>Gestion des Personnes</h1>

      <div v-if="loading" class="loading">Chargement...</div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Informations</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="personne in personnes" :key="personne.id">
              <td>{{ personne.id }}</td>
              <td><pre>{{ JSON.stringify(personne, null, 2) }}</pre></td>
            </tr>
          </tbody>
        </table>
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

onMounted(() => {
  loadPersonnes()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
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

pre {
  margin: 0;
  font-size: 0.85rem;
  white-space: pre-wrap;
}
</style>
