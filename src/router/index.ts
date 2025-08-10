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
  /**
   *
   * Partner Layout
   *
   */
  {
    path: "/partner",
    name: "partner-layout",
    component: () => import("../layouts/PartnerLayout.vue"),
    children: [
      {
        path: "/partner/dashboard",
        name: "partner-dashboard",
        component: () => import("../views/partner/Dashboard.vue"),
      },
      {
        path: "/partner/members",
        name: "partner-members",
        component: () => import("../views/partner/Members.vue"),
      },
      {
        path: "/partner/members/online",
        name: "partner-members-online",
        component: () => import("../views/partner/MembersOnline.vue"),
      },
      {
        path: "/partner/shop-transactions",
        name: "partner-shop-transactions",
        component: () => import("../views/partner/ShopTransactions.vue"),
      },
      {
        path: "/partner/betting",
        name: "partner-betting",
        component: () => import("../views/partner/Betting.vue"),
      },
      {
        path: "/partner/transactions",
        name: "partner-transactions",
        component: () => import("../views/partner/Transactions.vue"),
      },
      {
        path: "/partner/statistics",
        name: "partner-statistics",
        component: () => import("../views/partner/Statistics.vue"),
      },
      {
        path: "/partner/settlement/request",
        name: "partner-settlement-request",
        component: () => import("../views/partner/SettlementRequest.vue"),
      },
      {
        path: "/partner/settlement/history",
        name: "partner-settlement-history",
        component: () => import("../views/partner/SettlementHistory.vue"),
      },
    ],
  },
  // Game Launch
  {
    path: "/game/:provider/:code",
    name: "casino-game",
    component: () => import("../views/game-launch/LiveGameLaunch.vue"),
  },
  {
    path: "/slot/:provider/:game/:game_id",
    name: "slot-game",
    component: () => import("../views/game-launch/SlotGameLaunch.vue"),
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
  const publicRoutes = ['login-page', 'register-page', 'Error404', 'main-page'];
  
  // Partner routes that need special authentication
  const partnerRoutes = ['partner-dashboard', 'partner-members', 'partner-transactions', 'partner-reports'];
  
  if (publicRoutes.includes(to.name as string)) {
    next();
    return;
  }

  // Handle partner routes
  if (partnerRoutes.includes(to.name as string)) {
    try {
      // Verify partner authentication
      const verify = await authStore.verifyAuth(true);
      if (verify) {
        next();
      } else {
        next({ name: "login-page" });
      }
    } catch (error) {
      console.error('Partner auth verification failed:', error);
      next({ name: "login-page" });
    }
    return;
  }

  switch (to.name) {
    // Connect to Socket
    case "main-page":
      try {
        // Allow access to home page without authentication
        next()
      } catch (error) {
        console.error('Error accessing main page:', error);
        next()
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