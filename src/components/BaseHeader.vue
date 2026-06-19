<script setup lang="ts">
import { RoutesNames } from '@/router';

import GridContainer from '@/components/Grid/GridContainer.vue';

const links = [
  {
    name: RoutesNames.Home,
    label: 'Главная',
  },
  {
    name: RoutesNames.About,
    label: 'Описание',
  },
  {
    name: RoutesNames.MazeGeneration,
    label: 'Генерация лабиринтов',
  },
]
</script>

<template>
  <header class="base-header">
    <GridContainer>
      <div class="base-header__inner">
        <template v-for="link in links" :key="link.name">
          <RouterLink :to="{ name: link.name }">
            {{ link.label }}
          </RouterLink>
        </template>
      </div>
    </GridContainer>
  </header>
</template>

<style lang="scss" scoped>
  .base-header {
    background-color: var(--bg-reverse-color);
    color: var(--text-reverse-color);
    padding: 20px 0;

    &__inner {
      display: flex;
      column-gap: 8px;
    }
  }
</style>
