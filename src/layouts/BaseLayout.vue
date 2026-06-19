<script setup lang="ts">
import BaseHeader from '@/components/BaseHeader.vue';
</script>

<template>
  <div class="base-layout">
    <BaseHeader />
    <main class="base-layout__content">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
  .base-layout {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    &__content {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
  }
</style>
