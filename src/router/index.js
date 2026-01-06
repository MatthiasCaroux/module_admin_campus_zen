import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import Questionnaires from '../views/Questionnaires.vue'
import Questions from '../views/Questions.vue'
import Reponses from '../views/Reponses.vue'
import Ressources from '../views/Ressources.vue'
import Climats from '../views/Climats.vue'
import Personnes from '../views/Personnes.vue'
import Messages from '../views/Messages.vue'
import Statistiques from '../views/Statistiques.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/questionnaires',
    name: 'Questionnaires',
    component: Questionnaires,
    meta: { requiresAuth: true },
  },
  {
    path: '/questions',
    name: 'Questions',
    component: Questions,
    meta: { requiresAuth: true },
  },
  {
    path: '/reponses',
    name: 'Reponses',
    component: Reponses,
    meta: { requiresAuth: true },
  },
  {
    path: '/ressources',
    name: 'Ressources',
    component: Ressources,
    meta: { requiresAuth: true },
  },
  {
    path: '/climats',
    name: 'Climats',
    component: Climats,
    meta: { requiresAuth: true },
  },
  {
    path: '/personnes',
    name: 'Personnes',
    component: Personnes,
    meta: { requiresAuth: true },
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages,
    meta: { requiresAuth: true },
  },
  {
    path: '/statistiques',
    name: 'Statistiques',
    component: Statistiques,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Simple auth guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
