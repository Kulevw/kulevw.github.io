<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { DPR } from '@/constants'
import { type MazeField } from '@/utils/maze/base'

import { angleOfLine, type Point } from '@/utils/math'

import { useIsDarkTheme } from '@/composition/use-theme'
import { unionPolygones } from '@/utils/math/geometry/union-polygones'
import { unionLines } from '@/utils/math/geometry/union-lines'
import { RECT_GRAPH_TYPE, type RectGraph } from '@/utils/graph/rect-graph'
import type {
  MazeFieldProps,
  MazeFieldContext,
  MazeFieldParams,
  MazeFieldPalitra,
} from '@/components/maze/MazeField.types'
import { getRandomItem, groupBy } from '@/utils/array'
import { useRunningState } from '@/composition/use-running-state'
import { fillPolygones, onFrame, syncCanvasTo } from '@/utils/graphics'
import { makeRectField } from '@/utils/maze/rect-maze'
import { GraphNodeState } from '@/utils/graph'

const props = defineProps<MazeFieldProps>()

const isDarkTheme = useIsDarkTheme()

const [isInitProcessing, withInitProcessing] = useRunningState()

const SCALE = DPR
const SCALE_REVERSE = 1 / SCALE
const pxDPR = `${Math.round(SCALE)}px`

const refRootContainer = ref<HTMLElement>()
const refCellsCanvas = ref<HTMLCanvasElement>()
const refSidesCanvas = ref<HTMLCanvasElement>()

const cache = {
  unionSides: null as Point[][] | null,
  unionCells: null as Point[][] | null,
}

const MazePalitra: MazeFieldPalitra = {
  Sides: {
    Default: '#202020',
  },
  Cells: {
    Default: '#dadada',
    Selected: 'cyan',
    Visited: 'yellow',
  },
}

let onThemeChangeHandler: (() => void) | null = null

watch(isDarkTheme, () => {
  onThemeChangeHandler?.()
})

onMounted(init)

function makeField({ graph, cellSize, lineWeight }: MazeFieldParams): MazeField | null {
  switch (graph.type) {
    case RECT_GRAPH_TYPE:
      return makeRectField(graph as RectGraph, lineWeight * 2, cellSize, cellSize)
    default:
      return null
  }
}

function makeContext(): MazeFieldContext | null {
  if (!refCellsCanvas.value || !refSidesCanvas.value || !refRootContainer.value) {
    return null
  }

  const params = props.initParams(
    refRootContainer.value.clientWidth,
    refRootContainer.value.clientHeight,
  )

  const field = makeField(params)

  if (!field) {
    return null
  }

  return {
    field,
    params,
    rootElement: refRootContainer.value,
    cellsCtx: getPreparedCanvasCtx(refCellsCanvas.value, refRootContainer.value, SCALE),
    sidesCtx: getPreparedCanvasCtx(refSidesCanvas.value, refRootContainer.value, SCALE),
  }
}

async function init(): Promise<void> {
  const ctx = makeContext()

  if (!ctx) {
    return
  }

  const [virtualCellsCtx, virtualSidesCtx] = [
    getPreparedCanvasCtx(document.createElement('canvas'), ctx.rootElement, SCALE),
    getPreparedCanvasCtx(document.createElement('canvas'), ctx.rootElement, SCALE),
  ] as Pair<CanvasRenderingContext2D>

  ctx.params.graph.nodes.forEach((node) => {
    const edge = getRandomItem(node.edges)

    node.setState(GraphNodeState.Selected)
    edge?.setState(GraphNodeState.Selected)

    edge?.setWeightToEdge(node, 1)
  })

  ctx.params.graph.on('node-state-updated', (node) => {
    onFrame(() => {
      ctx.field.getCell(node.key)?.draw(ctx.cellsCtx, MazePalitra.Cells[node.state])
    })
  })

  ctx.params.graph.on('relation-updated', (from, to) => {
    console.log('relation-updated')

    const isAvailable = to?.isAvailableEdge(from)

    const side = ctx.field.getSide(from, to)

    onFrame(() => {
      if (isAvailable) {
        side?.clear(ctx.sidesCtx)
      } else {
        side?.draw(ctx.sidesCtx, MazePalitra.Sides.Default)
      }
    })
  })

  const pupa = (count = 0) => {
    if (count >= 100) {
      return
    }

    setTimeout(() => {
      const node = getRandomItem(ctx.params.graph.nodes)

      if (node) {
        const edge = getRandomItem(node.edges)

        if (edge) {
          node.setWeightToEdge(edge, node.isAvailableEdge(edge) ? 0 : 1)
        }
      }

      pupa(count + 1)
    }, 10)
  }

  pupa()

  onThemeChangeHandler = () => {
    updateMazePalitra(ctx.rootElement)

    onFrame(() => {
      drawField(ctx)
    })
  }

  onThemeChangeHandler()

  await withInitProcessing(
    new Promise<void>((resolve) => {
      drawField(ctx, [virtualCellsCtx, virtualSidesCtx])

      onFrame(() => {
        syncCanvasTo(virtualCellsCtx, ctx.cellsCtx, SCALE_REVERSE)
        syncCanvasTo(virtualSidesCtx, ctx.sidesCtx, SCALE_REVERSE)

        resolve()
      })
    }),
  )
}

function drawField(
  ctx: MazeFieldContext,
  [virtualCellsCtx, virtualSidesCtx]: CanvasRenderingContext2D[] = [],
) {
  fillPolygones(
    virtualCellsCtx ?? ctx.cellsCtx,
    getCellsCache(ctx),
    MazePalitra.Cells.Default,
    'evenodd',
  )
  fillPolygones(virtualSidesCtx ?? ctx.sidesCtx, getSidesCache(ctx), MazePalitra.Sides.Default)
}

function getPreparedCanvasCtx(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
  scale = 1,
): CanvasRenderingContext2D {
  const { width, height } = container.getBoundingClientRect()

  canvas.width = width * scale
  canvas.height = height * scale

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  ctx.scale(scale, scale)

  return ctx
}

function updateMazePalitra(rootContainer: HTMLElement) {
  const style = getComputedStyle(rootContainer)

  MazePalitra.Sides.Default = style.getPropertyValue('--side-color')

  MazePalitra.Cells.Default = style.getPropertyValue('--cell-color')
}

function getCellsCache({ field }: MazeFieldContext) {
  if (!cache.unionCells) {
    const polygones = field.cells.map((cell) => cell.vertices)

    cache.unionCells = unionPolygones(polygones)
  }

  return cache.unionCells
}

function getSidesCache({ field, params }: MazeFieldContext) {
  if (!cache.unionSides) {
    const lines = field.sides
      .filter(([, from, to]) => !to?.isAvailableEdge(from))
      .map(([line]) => line.vertices)

    console.log(lines.length, field.sides.length)

    const groupedByAngle = groupBy(lines, (line) => angleOfLine(line))

    const result = Object.values(groupedByAngle).flatMap((group) =>
      unionLines(group, params.lineWeight),
    )

    cache.unionSides = result
  }

  return cache.unionSides
}
</script>

<template>
  <div ref="refRootContainer" class="maze-field">
    <canvas ref="refCellsCanvas" class="maze-field__canvas" width="100%" height="100%" />
    <canvas ref="refSidesCanvas" class="maze-field__canvas" width="100%" height="100%" />
    <div v-if="isInitProcessing" class="maze-field__loader">Loading...</div>
  </div>
</template>

<style lang="scss" scoped>
.maze-field {
  --cell-color: var(--bg-color);
  --side-color: var(--text-color);

  position: relative;
  height: 600px;
  outline: v-bind(pxDPR) solid var(--side-color);
  background-color: var(--primary-color);

  &__canvas {
    position: absolute;
    display: block;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  &__loader {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-lg);
    z-index: 1;
  }
}
</style>
