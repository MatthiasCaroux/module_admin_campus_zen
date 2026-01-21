import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '../services/api'

export function useAuth() {
  const router = useRouter()
  const isAuthenticated = ref(localStorage.getItem('isAuthenticated') === 'true')
  const user = ref(null)

  /**
   * Vérifie si l'utilisateur est authentifié en testant le cookie
   * Utilisé au montage de l'app ou pour vérifier la session
   */
  const checkAuthStatus = async () => {
    try {
      const response = await apiService.checkAuth()
      isAuthenticated.value = true
      user.value = response.data
      localStorage.setItem('isAuthenticated', 'true')
      return true
    } catch (error) {
      isAuthenticated.value = false
      user.value = null
      localStorage.removeItem('isAuthenticated')
      return false
    }
  }

  /**
   * Déconnexion complète
   */
  const logout = async () => {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      isAuthenticated.value = false
      user.value = null
      router.push('/login')
    }
  }

  return {
    isAuthenticated,
    user,
    checkAuthStatus,
    logout
  }
}
