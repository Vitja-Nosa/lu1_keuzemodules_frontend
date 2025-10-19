import { createRouter, createWebHistory } from 'vue-router'
import ElectivesView from '../views/ElectivesView.vue'
import ElectiveDetailView from '../views/ElectiveDetailView.vue'

const routes = [
  { path: '/', redirect: '/electives' },
  { path: '/electives', name: 'Electives', component: ElectivesView },
  { path: '/electives/:elective', name: 'ElectiveDetail', component: ElectiveDetailView, props: true },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router