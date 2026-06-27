import type { RouteRecordRaw } from 'vue-router'
import { RoutesNames } from '../contants'

import HomePage from '@/pages/HomePage.vue'
import BaseLayout from '@/layouts/base/BaseLayout.vue'

export const makeRoutes = (): readonly RouteRecordRaw[] => {
  return [
    {
      path: '/',
      component: BaseLayout,
      redirect: { name: RoutesNames.Home },
      children: [
        {
          path: '/',
          name: RoutesNames.Home,
          component: HomePage,
        },
      ],
    },
  ]
}
