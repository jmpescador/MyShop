import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history'
        ? createWebHistory
        : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // 🔐 Guard para proteger rutas admin
  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const user = authStore.user;

    // Si la ruta requiere admin y el usuario no es admin o no está logueado
    if (to.meta.requiresAdmin) {
      if (!user || user.role !== 'admin') {
        alert('No tienes permiso para ingresar a esta seccion')
        return next('/login');
      }
    }

    next();
  });

  return Router;
});
