import { createRouter, createWebHistory, type RouteRecordRaw, } from 'vue-router'
import { useAuthStore } from "../stores/auth";
import { useAppStore } from "../stores/app";

const routes: Array<RouteRecordRaw> = [
  /**
   *
   * Main Layout
   *
   */
  {
    path: "/",
    name: "main-layout",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "main-page",
        component: () => import("../views/HomePage.vue"),
      },
      {
        path: "/casino",
        name: "casino-page",
        component: () => import("../views/CasinoPage.vue"),
      },
      {
        path: "/slot",
        name: "slot-page",
        component: () => import("../views/SlotPage.vue"),
      },
    ],
  },

  /**
   *
   * Page Layout
   *
   */
  {
    path: "/",
    name: "page-layout",
    component: () => import("../layouts/PageLayout.vue"),
    children: [
      {
        path: "/login",
        name: "login-page",
        component: () => import("../views/auth/LoginPage.vue"),
      },
      {
        path: "/register",
        name: "register-page",
        component: () => import("../views/auth/RegisterPage.vue"),
      },
      {
        path: "/transaction",
        name: "transaction-page",
        component: () => import("../views/transaction/TransactionPage.vue"),
      },
      {
        path: "/notifications",
        name: "notifications-page",
        component: () => import("../views/NotificationsPage.vue"),
      },
      {
        path: "/inquiries",
        name: "inquiries-page",
        component: () => import("../views/InquiriesPage.vue"),
      },
      {
        path: "/transaction-history",
        name: "transaction-history-page",
        component: () => import("../views/histories/TransactionHistory.vue"),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore: any = useAuthStore();
  const appStore: any = useAppStore();

  // Get Site Settings
  appStore.getSettings();

  // Public routes that don't need authentication
  const publicRoutes = ['login-page', 'register-page', 'Error404'];
  
  if (publicRoutes.includes(to.name as string)) {
    next();
    return;
  }

  switch (to.name) {
    // Connect to Socket
    case "main-page":
      try {
        // verify the auth allow if authenticated; otherwise return to login-page
        const verify = await authStore.verifyAuth(true);
        if (verify) next()
        else next({ name: "login-page" })
      } catch (error) {
        console.error('Auth verification failed in router:', error);
        next({ name: "login-page" })
      }
      break;
    case "Error404":
      next();
      break;
    default:
      try {
        await authStore.verifyAuth(true)
        next();
      } catch (error) {
        console.error('Auth verification failed in router:', error);
        next();
      }
      break;
  }
})

export default router