<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Campus Zen Admin</h1>
      <p class="subtitle">Connexion</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Nom d'utilisateur</label>
          <input
            type="text"
            id="username"
            v-model="username"
            placeholder="Adresse e-mail"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Mot de passe"
            required
          />
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <button type="submit" class="btn-login">Se connecter</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '../services/api'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  apiService.login({ emailPers: username.value, password: password.value })
    .then(response => {
      console.log('Login response:', response)
      console.log('Set-Cookie headers:', response.headers)
      console.log('Cookies après login:', document.cookie)
      console.log('Response data:', response.data)
      
      if (response.status === 200 && response.data.role === 'admin') {
        // Les tokens sont maintenant stockés dans les cookies HttpOnly
        // On stocke uniquement le flag d'authentification
        localStorage.setItem('isAuthenticated', 'true')
        
        router.push('/')
      } else {
        error.value = 'Accès refusé. Vous n\'êtes pas administrateur.'
      }
    })
    .catch((error_) => {
      console.error('Login error:', error_.response?.data)
      if (error_.response && (error_.response.status === 401 || error_.response.status === 400)) {
        error.value = 'Identifiants incorrects'
      } else {
        error.value = 'Une erreur est survenue. Veuillez réessayer.'
      }
    }) 
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 2rem;
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

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-login:hover {
  background: #5568d3;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
