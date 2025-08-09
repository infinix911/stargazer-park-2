import { createApp } from 'vue'
import { createPinia } from "pinia";
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import ApiService from "./services/ApiService";

const app = createApp(App)
app.use(createPinia());
app.use(router)
app.use(i18n)

ApiService.init(app);

app.mount('#app')
