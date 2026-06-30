<script setup lang="ts">
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import PortfolioLogo from '@/components/PortfolioLogo.vue'
</script>

<template>
  <header class="base-header" data-theme="reverse">
    <div class="grid-container">
      <div class="base-header__inner">
        <h1 class="base-header__title">Портфолио</h1>
        <PortfolioLogo />

        <ThemeSwitch class="base-header__theme-switch" />
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@use '@/styles/grid/mixins' as *;

.base-header {
  background-color: var(--bg-color);
  color: var(--text-color);

  &__inner {
    grid-area: content;
    display: flex;
    align-items: center;
    column-gap: 12px;
    padding: 20px 16px;
  }

  &__title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: var(--font-weight-semibold);
  }

  &__theme-switch {
    margin-left: auto;
  }
}
</style>
