<script lang="ts" setup>
import { makeRectGraph } from '@/utils/graph/rect-graph.ts'

import MazeField from '@/components/maze/MazeField.vue'
import { DPR } from '@/constants/index.ts'
import type { MazeFieldParams } from '@/components/maze/MazeField.types'

function initMazeFieldParams(width: number, height: number): MazeFieldParams {
  const lineWeight = 1 * DPR

  const cols = 20

  const cellSize = width / cols

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
