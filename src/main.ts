import { createApp } from 'vue'
import { createPinia } from "pinia";
import './style.css'
import './assets/element-plus-dark-theme.css'
import './assets/common-dashboard.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import ApiService from "./services/ApiService";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import PartnerPageHeader from './components/partner/PartnerPageHeader.vue'

const app = createApp(App)
app.use(createPinia());
app.use(router)
app.use(i18n)
app.use(ElementPlus)

// Register global components
app.component('PartnerPageHeader', PartnerPageHeader)

ApiService.init(app);

app.mount('#app')
