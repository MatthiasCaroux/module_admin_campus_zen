<template>
  <nav class="navbar">
    <div class="nav-brand">
      <h1>Campus Zen Admin</h1>
    </div>
    <div class="nav-links">
      <router-link to="/" class="nav-link">Dashboard</router-link>
      <router-link to="/questionnaires" class="nav-link">Questionnaires</router-link>
      <router-link to="/questions" class="nav-link">Questions</router-link>
      <router-link to="/reponses" class="nav-link">Réponses</router-link>
      <router-link to="/ressources" class="nav-link">Ressources</router-link>
      <router-link to="/climats" class="nav-link">Climats</router-link>
      <router-link to="/personnes" class="nav-link">Personnes</router-link>
      <router-link to="/messages" class="nav-link">Messages</router-link>
    </div>
    <button @click="logout" class="btn-logout">Déconnexion</button>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  router.push('/login')
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
  gap: 1rem;
  flex: 1;
}

.nav-link {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #34495e;
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
