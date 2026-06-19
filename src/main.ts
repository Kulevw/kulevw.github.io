import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'

import { routes } from '@/router';
import App from './App.vue'

export const createApp = ViteSSG(App, { routes }, ({ app }) => {
  app.use(createPinia());
})
