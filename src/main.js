import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import LayoutWrapper from '@/layouts/layoutWrapper.vue'
import router from './router'
import "@/assets/styles/styles.scss"

const app = createApp(LayoutWrapper)

app.use(router)
const pinia = createPinia()
pinia.use(piniaPluginPersistedState)
app.use(pinia)
app.mount('#app')

