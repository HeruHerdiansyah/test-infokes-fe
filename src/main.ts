import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import ExplorerView from './views/ExplorerView.vue'

// Buat pinia store
const pinia = createPinia()

// Buat router dengan rute
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'explorer',
      component: ExplorerView
    }
  ]
})

// Buat dan mount aplikasi
createApp(App)
  .use(pinia)
  .use(router)
  .mount('#app')
