<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="header">
        <h1>Statistiques et Export</h1>
        <button @click="exportToCSV" class="btn-export">📥 Exporter en CSV</button>
      </div>

      <div v-if="loading" class="loading">Chargement des données...</div>

      <div v-else>
        <!-- Résumé global -->
        <div class="stats-summary">
          <div class="stat-card">
            <h3>Total de personnes</h3>
            <p class="stat-number">{{ totalPersonnes }}</p>
          </div>
          <div class="stat-card">
            <h3>Total de réponses</h3>
            <p class="stat-number">{{ statuts.length }}</p>
          </div>
          <div class="stat-card">
            <h3>Période couverte</h3>
            <p class="stat-text">{{ periodeText }}</p>
          </div>
        </div>

        <!-- Filtres -->
        <div class="filters">
          <div class="filter-group">
            <label>Année</label>
            <select v-model="selectedYear" @change="filterData">
              <option value="">Toutes</option>
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Mois</label>
            <select v-model="selectedMonth" @change="filterData">
              <option value="">Tous</option>
              <option value="01">Janvier</option>
              <option value="02">Février</option>
              <option value="03">Mars</option>
              <option value="04">Avril</option>
              <option value="05">Mai</option>
              <option value="06">Juin</option>
              <option value="07">Juillet</option>
              <option value="08">Août</option>
              <option value="09">Septembre</option>
              <option value="10">Octobre</option>
              <option value="11">Novembre</option>
              <option value="12">Décembre</option>
            </select>
          </div>
        </div>

        <!-- Statistiques par climat -->
        <div class="climate-stats">
          <h2>Répartition par climat {{ filterPeriodText }}</h2>
          <div class="climate-grid">
            <div v-for="stat in climateStats" :key="stat.climatId" class="climate-card">
              <h3>{{ stat.climatName }}</h3>
              <div class="climate-data">
                <p class="climate-count">{{ stat.count }} personne(s)</p>
                <p class="climate-percentage">{{ stat.percentage }}%</p>
              </div>
              <div class="climate-bar">
                <div class="climate-bar-fill" :style="{ width: stat.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Évolution mensuelle -->
        <div class="monthly-evolution">
          <h2>Évolution mensuelle</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Période</th>
                  <th>Total</th>
                  <th v-for="climat in climats" :key="climat.idClimat">{{ climat.nomClimat }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="month in monthlyData" :key="month.period">
                  <td><strong>{{ month.periodLabel }}</strong></td>
                  <td>{{ month.total }}</td>
                  <td v-for="climat in climats" :key="climat.idClimat">
                    {{ month.climates[climat.idClimat] || 0 }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Détails complets -->
        <div class="details-section">
          <h2>Détails des réponses {{ filterPeriodText }}</h2>
          <p class="details-count">{{ filteredStatuts.length }} réponse(s)</p>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Personne</th>
                  <th>Climat</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="statut in filteredStatuts" :key="statut.id">
                  <td>{{ formatDate(statut.dateStatut) }}</td>
                  <td>{{ getPersonneEmail(statut.personne) }}</td>
                  <td><span class="badge-climat">{{ getClimatName(statut.climat) }}</span></td>
                  <td>{{ statut.scoreTotal }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import apiService from '../services/api'

const statuts = ref([])
const personnes = ref([])
const climats = ref([])
const loading = ref(true)
const selectedYear = ref('')
const selectedMonth = ref('')

const loadData = async () => {
  try {
    loading.value = true
    const [statutsRes, personnesRes, climatsRes] = await Promise.all([
      apiService.getStatuts(),
      apiService.getPersonnes(),
      apiService.getClimats()
    ])
    statuts.value = statutsRes.data.sort((a, b) => new Date(b.dateStatut) - new Date(a.dateStatut))
    personnes.value = personnesRes.data
    climats.value = climatsRes.data
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    alert('Erreur lors du chargement des données')
  } finally {
    loading.value = false
  }
}

const totalPersonnes = computed(() => {
  return new Set(statuts.value.map(s => s.personne)).size
})

const availableYears = computed(() => {
  const years = new Set()
  statuts.value.forEach(s => {
    const year = new Date(s.dateStatut).getFullYear()
    years.add(year)
  })
  return Array.from(years).sort((a, b) => b - a)
})

const periodeText = computed(() => {
  if (statuts.value.length === 0) return 'Aucune donnée'
  const dates = statuts.value.map(s => new Date(s.dateStatut))
  const minDate = new Date(Math.min(...dates))
  const maxDate = new Date(Math.max(...dates))
  return `${formatDate(minDate)} - ${formatDate(maxDate)}`
})

const filterPeriodText = computed(() => {
  if (!selectedYear.value && !selectedMonth.value) return ''
  if (selectedYear.value && selectedMonth.value) {
    const monthNames = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                       'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    return `(${monthNames[parseInt(selectedMonth.value)]} ${selectedYear.value})`
  }
  if (selectedYear.value) return `(${selectedYear.value})`
  return ''
})

const filteredStatuts = computed(() => {
  let filtered = statuts.value

  if (selectedYear.value) {
    filtered = filtered.filter(s => {
      const year = new Date(s.dateStatut).getFullYear()
      return year.toString() === selectedYear.value
    })
  }

  if (selectedMonth.value) {
    filtered = filtered.filter(s => {
      const month = String(new Date(s.dateStatut).getMonth() + 1).padStart(2, '0')
      return month === selectedMonth.value
    })
  }

  return filtered
})

const climateStats = computed(() => {
  const stats = {}
  const total = filteredStatuts.value.length

  filteredStatuts.value.forEach(s => {
    if (!stats[s.climat]) {
      stats[s.climat] = {
        climatId: s.climat,
        climatName: getClimatName(s.climat),
        count: 0
      }
    }
    stats[s.climat].count++
  })

  return Object.values(stats).map(stat => ({
    ...stat,
    percentage: total > 0 ? Math.round((stat.count / total) * 100) : 0
  })).sort((a, b) => b.count - a.count)
})

const monthlyData = computed(() => {
  const monthlyMap = {}

  statuts.value.forEach(s => {
    const date = new Date(s.dateStatut)
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    if (!monthlyMap[period]) {
      monthlyMap[period] = {
        period,
        total: 0,
        climates: {}
      }
    }

    monthlyMap[period].total++
    monthlyMap[period].climates[s.climat] = (monthlyMap[period].climates[s.climat] || 0) + 1
  })

  return Object.values(monthlyMap)
    .sort((a, b) => b.period.localeCompare(a.period))
    .map(m => ({
      ...m,
      periodLabel: formatPeriod(m.period)
    }))
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatPeriod = (period) => {
  const [year, month] = period.split('-')
  const monthNames = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                     'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
  return `${monthNames[parseInt(month)]} ${year}`
}

const getPersonneEmail = (id) => {
  const p = personnes.value.find(p => p.idPers === id)
  return p ? p.emailPers : `ID ${id}`
}

const getClimatName = (id) => {
  const c = climats.value.find(c => c.idClimat === id)
  return c ? c.nomClimat : 'N/A'
}

const filterData = () => {
  // Trigger computed properties recalculation
}

const exportToCSV = () => {
  // En-têtes du CSV
  const headers = ['Date', 'Année', 'Mois', 'Personne (Email)', 'Climat', 'Score Total']

  // Données filtrées
  const rows = filteredStatuts.value.map(statut => {
    const date = new Date(statut.dateStatut)
    return [
      formatDate(statut.dateStatut),
      date.getFullYear(),
      date.getMonth() + 1,
      getPersonneEmail(statut.personne),
      getClimatName(statut.climat),
      statut.scoreTotal
    ]
  })

  // Créer le contenu CSV
  let csvContent = headers.join(',') + '\n'
  rows.forEach(row => {
    csvContent += row.map(cell => `"${cell}"`).join(',') + '\n'
  })

  // Créer et télécharger le fichier
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  const filename = `statistiques_campus_zen_${selectedYear.value || 'all'}_${selectedMonth.value || 'all'}.csv`

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  loadData()
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

h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
}

.btn-export {
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.btn-export:hover {
  background: #229954;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin: 0;
}

.stat-text {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-group {
  flex: 1;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 500;
}

.filter-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.climate-stats,
.monthly-evolution,
.details-section {
  margin-bottom: 2rem;
}

.climate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.climate-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.climate-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.climate-data {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.climate-count {
  margin: 0;
  color: #2c3e50;
  font-weight: 500;
}

.climate-percentage {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.climate-bar {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.climate-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s;
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
  white-space: nowrap;
}

td {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.badge-climat {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 0.85rem;
}

.details-count {
  color: #7f8c8d;
  margin-bottom: 1rem;
}
</style>
