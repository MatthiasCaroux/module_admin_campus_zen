<template>
  <nav class="navbar">
    <div class="nav-brand">
      <h1>CampusZen Admin</h1>
    </div>
    <div class="nav-links">
      <router-link to="/" class="nav-link">Dashboard</router-link>
      
      <!-- Menu déroulant Enquêtes -->
      <div class="dropdown" @mouseenter="openDropdown('enquetes')" @mouseleave="closeDropdown('enquetes')">
        <span class="nav-link dropdown-toggle">📋 Enquêtes</span>
        <div class="dropdown-menu" v-show="dropdowns.enquetes">
          <router-link to="/questionnaires" class="dropdown-item">Questionnaires</router-link>
          <router-link to="/questions" class="dropdown-item">Questions</router-link>
          <router-link to="/reponses" class="dropdown-item">Réponses</router-link>
        </div>
      </div>
      
      <!-- Menu déroulant Gestion -->
      <div class="dropdown" @mouseenter="openDropdown('gestion')" @mouseleave="closeDropdown('gestion')">
        <span class="nav-link dropdown-toggle">⚙️ Gestion</span>
        <div class="dropdown-menu" v-show="dropdowns.gestion">
          <router-link to="/ressources" class="dropdown-item">Ressources</router-link>
          <router-link to="/climats" class="dropdown-item">Climats</router-link>
          <router-link to="/personnes" class="dropdown-item">Personnes</router-link>
          <router-link to="/messages" class="dropdown-item">Messages</router-link>
        </div>
      </div>
      
      <router-link to="/statistiques" class="nav-link">📊 Statistiques</router-link>
    </div>
    <button @click="logout" class="btn-logout">Déconnexion</button>
  </nav>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '../services/api'

const router = useRouter()

const dropdowns = reactive({
  enquetes: false,
  gestion: false
})

const openDropdown = (name) => {
  dropdowns[name] = true
}

const closeDropdown = (name) => {
  dropdowns[name] = false
}

const logout = async () => {
  try {
    // Appel au backend pour supprimer les cookies HttpOnly
    await apiService.logout()
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  } finally {
    // Redirection vers la page de login
    router.push('/login')
  }
}
</script>

<style scoped>
.navbar {
  background: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  align-items: center;
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
  cursor: pointer;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #34495e;
}

/* Dropdown styles */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.dropdown-toggle::after {
  content: '▼';
  font-size: 0.6rem;
  margin-left: 0.3rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #34495e;
  border-radius: 4px;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 1000;
  padding: 0.5rem 0;
}

.dropdown-item {
  display: block;
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.6rem 1rem;
  transition: background 0.2s;
}

.dropdown-item:hover,
.dropdown-item.router-link-active {
  background: #4a6278;
}

.btn-logout {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c0392b;
}
</style>
