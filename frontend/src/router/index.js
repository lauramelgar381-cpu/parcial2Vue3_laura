import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth.store.js';

import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import ContactView from '../views/ContactView.vue';
import DoctorsView from '../views/DoctorsView.vue';
import AppointmentsView from '../views/AppointmentsView.vue';
import PatientsView from '../views/PatientsView.vue';
import DashboardView from '../views/DashboardView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/contact', name: 'contact', component: ContactView },
  { path: '/doctors', name: 'doctors', component: DoctorsView, meta: { requiresAuth: true } },
  { path: '/appointments', name: 'appointments', component: AppointmentsView, meta: { requiresAuth: true } },
  { path: '/patients', name: 'patients', component: PatientsView, meta: { requiresAuth: true } },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;