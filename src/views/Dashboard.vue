<template>
  <div>
    <Navbar />
    <div class="container">
      <h1>Tableau de bord</h1>
      <p class="welcome">Bienvenue sur le module d'administration de Campus Zen</p>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Questionnaires</h3>
          <p class="stat-number">{{ stats.questionnaires }}</p>
        </div>
        <div class="stat-card">
          <h3>Questions</h3>
          <p class="stat-number">{{ stats.questions }}</p>
        </div>
        <div class="stat-card">
          <h3>Réponses</h3>
          <p class="stat-number">{{ stats.reponses }}</p>
        </div>
        <div class="stat-card">
          <h3>Ressources</h3>
          <p class="stat-number">{{ stats.ressources }}</p>
        </div>
        <div class="stat-card">
          <h3>Climats</h3>
          <p class="stat-number">{{ stats.climats }}</p>
        </div>
        <div class="stat-card">
          <h3>Personnes</h3>
          <p class="stat-number">{{ stats.personnes }}</p>
        </div>
      </div>

      <div class="quick-links">
        <h2>Accès rapide</h2>
        <div class="links-grid">
          <router-link to="/statistiques" class="quick-link highlight">
            <span class="icon">📊</span>
            <span>Statistiques et Export</span>
          </router-link>
          <router-link to="/questionnaires" class="quick-link">
            <span class="icon">📋</span>
            <span>Gérer les Questionnaires</span>
          </router-link>
          <router-link to="/questions" class="quick-link">
            <span class="icon">❓</span>
            <span>Gérer les Questions</span>
          </router-link>
          <router-link to="/reponses" class="quick-link">
            <span class="icon">💬</span>
            <span>Gérer les Réponses</span>
          </router-link>
          <router-link to="/ressources" class="quick-link">
            <span class="icon">📚</span>
            <span>Gérer les Ressources</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import apiService from '../services/api'

const stats = ref({
  questionnaires: 0,
  questions: 0,
  reponses: 0,
  ressources: 0,
  climats: 0,
  personnes: 0,
})

const loadStats = async () => {
  try {
    const [questionnaires, questions, reponses, ressources, climats, personnes] = await Promise.all([
      apiService.getQuestionnaires(),
      apiService.getQuestions(),
      apiService.getReponses(),
      apiService.getRessources(),
      apiService.getClimats(),
      apiService.getPersonnes(),
    ])

    stats.value = {
      questionnaires: questionnaires.data.length,
      questions: questions.data.length,
      reponses: reponses.data.length,
      ressources: ressources.data.length,
      climats: climats.data.length,
      personnes: personnes.data.length,
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

onMounted(() => {
  loadStats()
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
  margin-bottom: 0.5rem;
}

.welcome {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
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
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin: 0;
}

.quick-links h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-decoration: none;
  color: #2c3e50;
  transition: transform 0.3s, box-shadow 0.3s;
}

.quick-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.quick-link .icon {
  font-size: 2rem;
}

.quick-link span:last-child {
  font-weight: 500;
}

.quick-link.highlight {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.quick-link.highlight .icon {
  font-size: 2.5rem;
}
</style>
