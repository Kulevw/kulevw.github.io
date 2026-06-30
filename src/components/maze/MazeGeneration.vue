<script lang="ts" setup>
import { makeRectGraph } from '@/utils/graph/rect-graph.ts'

import MazeField from '@/components/maze/MazeField.vue'
import type { MazeFieldParams } from '@/components/maze/MazeField.types'

function initMazeFieldParams(width: number, height: number): MazeFieldParams {
  const lineWeight = 1

  const cellSize = 60

  const cols = Math.floor(width / cellSize)

  // const cols = 100

  // const cellSize = width / cols

  const rows = Math.floor(height / cellSize)

  const graph = makeRectGraph(rows, cols)

  return {
    graph,
    cellSize,
    lineWeight,
  }
}
</script>

<template>
  <div class="maze-generation">
    <MazeField :init-params="initMazeFieldParams" />
  </div>
</template>

<style lang="scss" scoped></style>
