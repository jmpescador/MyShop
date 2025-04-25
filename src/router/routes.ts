import type { RouteRecordRaw } from 'vue-router';
// import { useAuthStore } from 'src/stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MaintLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'admin', component: () => import('pages/admin/AdminPage.vue'), meta: { requiresAdmin: true }},
      { path: 'register', component: () => import('pages/auth/RegisterPage.vue') },
      { path: 'login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'cart', component: () => import('pages/user/CartUser.vue') },
      { path: 'perfil', component: () => import('pages/user/PerfilUser.vue') },

    ]
  },

];

export default routes;