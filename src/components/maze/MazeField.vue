<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { DPR } from '@/constants'
import { getRandomItem } from '@/utils/array'
import { makeRectField, type MazeField } from '@/utils/maze/field'

import { type Point } from '@/utils/math'

import { useIsDarkTheme } from '@/utils/compostions/theme'
import { randomColor } from '@/utils/graphics'
import { unionPolygones } from '@/utils/math/union-polygones'
import { unionLines } from '@/utils/math/union-lines'
import { RECT_GRAPH_TYPE, type RectGraph } from '@/utils/graph/rect-graph'
import type {
  MazeFieldProps,
  MazeFieldContext,
  MazeFieldParams,
} from '@/components/maze/MazeField.types'

const props = defineProps<MazeFieldProps>()

const isDarkTheme = useIsDarkTheme()

const refRoot = ref<HTMLElement>()
const refCellsCanvas = ref<HTMLCanvasElement>()
const refSidesCanvas = ref<HTMLCanvasElement>()

const MazePalitra = {
  Cell: '#dadada',
  Edge: '#202020',
  Transparent: 'trasparent',
}

onMounted(() => {
  if (!refCellsCanvas.value || !refSidesCanvas.value || !refRoot.value) {
    console.warn('MazeField not inited.')
    return
  }

  ;[refCellsCanvas.value, refSidesCanvas.value].forEach(prepareCanvas)

  const params = props.initParams(refRoot.value.clientWidth, refRoot.value.clientHeight)

  const field = makeField(params)

  if (!field) {
    return
  }

  const ctx: MazeFieldContext = {
    field,
    params: props.initParams(refRoot.value.clientWidth, refRoot.value.clientHeight),
    cellsCtx: refCellsCanvas.value.getContext('2d') as CanvasRenderingContext2D,
    sidesCtx: refSidesCanvas.value.getContext('2d') as CanvasRenderingContext2D,
    rootElement: refRoot.value,
  }

  if (!field) {
    return
  }

  return onInit(ctx)
})

function onInit(ctx: MazeFieldContext): () => void {
  const stoppers: (() => void)[] = []

  ctx.field.nodeToCellPairsMap.forEach(([node]) => {
    getRandomItem(node.edges)?.setWeightToEdge(node, 1)
  })

  stoppers.push(watch(isDarkTheme, () => updateMazePalitra(ctx.rootElement), { immediate: true }))

  refreshField(ctx)

  return () => stoppers.forEach((stop) => stop())
}

function makeField({ graph }: MazeFieldParams): MazeField | null {
  switch (graph.type) {
    case RECT_GRAPH_TYPE:
      return makeRectField(graph as RectGraph, 100, 100)
    default:
      console.warn('No match graph type')
      return null
  }
}

function drawPolygoneWithContext(ctx: CanvasRenderingContext2D): (points: Point[]) => void {
  return ([start, ...path]: Point[]) => {
    if (!start) {
      return
    }

    ctx.moveTo(...start)
    path.forEach((point) => ctx.lineTo(...point))
    ctx.closePath()
  }
}

function prepareCanvas(canvas: HTMLCanvasElement) {
  canvas.width = canvas.clientWidth * DPR
  canvas.height = canvas.clientHeight * DPR
}

function updateMazePalitra(root: HTMLElement) {
  const style = getComputedStyle(root)

  MazePalitra.Cell = style.getPropertyValue('--cell-color')
  MazePalitra.Edge = style.getPropertyValue('--edge-color')
}

function refreshField(ctx: MazeFieldContext) {
  redrawEdges(ctx)
  redrawCells(ctx)
}

function redrawEdges({ field, sidesCtx, params }: MazeFieldContext) {
  const lines = [...field.sidesMap.values()]
    .filter(([, from, to]) => !to?.isAvailableEdge(from))
    .map(([line]) => line.vertices)

  const union = unionLines(lines, params.lineWeight)

  sidesCtx.beginPath()
  union.forEach(drawPolygoneWithContext(sidesCtx))
  sidesCtx.fillStyle = randomColor()
  sidesCtx.fill()
}

function redrawCells({ field, cellsCtx }: MazeFieldContext) {
  const polygones = Array.from(field.nodeToCellPairsMap.values())
    .filter(
      ([node]) =>
        ![
          39, 45, 81, 110, 190, 256, 305, 358, 415, 476, 541, 610, 602, 673, 748, 829, 914, 831,
          752, 675,
        ].includes(node.key),
    )
    .map(([, cell]) => cell.vertices) as AtLeastOne<Point[]>

  const union = unionPolygones(polygones)

  cellsCtx.beginPath()
  union.forEach(drawPolygoneWithContext(cellsCtx))
  cellsCtx.fillStyle = randomColor()
  cellsCtx.fill('evenodd')
}
</script>

<template>
  <div ref="refRoot" class="maze-canvas">
    <canvas ref="refCellsCanvas" class="maze-canvas__canvas" width="100%" height="100%" />
    <canvas ref="refSidesCanvas" class="maze-canvas__canvas" width="100%" height="100%" />
  </div>
</template>

<style lang="scss" scoped>
.maze-canvas {
  --cell-color: var(--bg-color);
  --edge-color: var(--text-color);

  position: relative;
  width: 100%;
  height: 400px;
  background-color: var(--bg-reverse-color);

  &__canvas {
    position: absolute;
    display: block;
    inset: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
