import type { RectGraph, RectGraphNode } from '@/utils/graph'
import { makeRectGraphics, type RectGraphics } from '@/utils/graphics'
import { makeField, type MazeField, type MazeFieldRawSide } from '@/utils/maze/base'

export type RectMazeField = MazeField

export const makeRectField = (
  graph: RectGraph,
  sideWeight: number,
  cellWidth: number,
  cellHeight: number = cellWidth,
): RectMazeField => {
  const makeCell = (node: RectGraphNode) =>
    makeRectGraphics(node.x * cellWidth, node.y * cellHeight, cellWidth, cellHeight)

  const makeSides = (
    cell: RectGraphics,
    node: RectGraphNode,
  ): MazeFieldRawSide<RectGraphNode>[] => {
    const [luv, ruv, rdv, ldv] = cell.vertices

    const pointsToEdgePairs: MazeFieldRawSide<RectGraphNode>[] = [
      [[luv, ruv], node, node.getEdgeByPosition('top')],
      [[ruv, rdv], node, node.getEdgeByPosition('right')],
      [[rdv, ldv], node, node.getEdgeByPosition('bottom')],
      [[ldv, luv], node, node.getEdgeByPosition('left')],
    ]

    return pointsToEdgePairs
  }

  const field = makeField(graph, sideWeight, makeCell, makeSides)

  return field
}
