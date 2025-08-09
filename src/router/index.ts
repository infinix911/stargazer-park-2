import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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

export default router 