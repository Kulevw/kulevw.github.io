<template>
  <div class="grid-container">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  .grid-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-width: 1200px;
    padding: 0 16px;
  }
</style>
