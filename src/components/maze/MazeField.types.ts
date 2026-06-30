import type { Graph, GraphNodeState } from '@/utils/graph/base'
import type { MazeField } from '@/utils/maze/base'

export interface MazeFieldParams {
  graph: Graph
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

export interface MazeFieldPalitra {
  Sides: { Default: string }
  Cells: Record<GraphNodeState, string>
}
