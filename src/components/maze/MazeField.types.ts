import type { BaseGraph } from '@/utils/graph/base'
import type { MazeField } from '@/utils/maze/field'

export interface MazeFieldParams {
  graph: BaseGraph
  cellSize: number
  lineWeight: number
}

export interface MazeFieldProps {
  initParams: (width: number, height: number) => MazeFieldParams
}

export interface MazeFieldContext {
  params: MazeFieldParams
  cellsCtx: CanvasRenderingContext2D
  sidesCtx: CanvasRenderingContext2D
  rootElement: HTMLElement
  field: MazeField
}
