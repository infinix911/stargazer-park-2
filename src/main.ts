import { createApp } from 'vue'
import { createPinia } from "pinia";
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import ApiService from "./services/ApiService";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(createPinia());
app.use(router)
app.use(i18n)
app.use(ElementPlus)

ApiService.init(app);

app.mount('#app')
