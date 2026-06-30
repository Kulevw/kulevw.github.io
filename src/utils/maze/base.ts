import type { GraphExtended, GraphNode, GraphNodeExtended } from '@/utils/graph/base'
import { keyOfLine, type Line } from '@/utils/math'
import { makeLineGraphics, type Drawable, type LineGraphics } from '@/utils/graphics'

export type MazeFieldRawSide<N = GraphNodeExtended> = [Line, N, N | null]

export type MazeFieldSide<N = GraphNodeExtended> = [LineGraphics, N, N | null]

export interface MazeField {
  sides: MazeFieldSide[]
  cells: Drawable[]
  getCell(key: string): Drawable | null
  getSide(from: GraphNode, to: GraphNode | null): LineGraphics | null
}

export const makeField = <
  C extends Drawable = Drawable,
  N extends GraphNodeExtended = GraphNodeExtended,
  G extends GraphExtended<N> = GraphExtended<N>,
>(
  graph: G,
  sideWeight: number,
  makeCell: (node: N) => C,
  makeCellSides: (cell: C, node: N) => MazeFieldRawSide<N>[],
): MazeField => {
  const cellsMap = new Map(graph.nodes.map((node) => [node.key, makeCell(node)]))

  const cells = Array.from(cellsMap.values())

  const keyOfPairNodes = (from: N, to: N | null) => [from.key, to?.key].sort().join('|')

  const makeSides = (): [MazeFieldSide<N>[], Map<string, MazeFieldSide<N>>] => {
    const sidesMap = new Map<string, MazeFieldSide<N>>()

    graph.nodes.forEach((node) => {
      makeCellSides(cellsMap.get(node.key) as C, node).forEach(([line, from, to]) => {
        const key = keyOfPairNodes(from, to)

        if (!sidesMap.has(key) && to) {
          sidesMap.set(key, [makeLineGraphics(...line, sideWeight), from, to])
        }
      })
    })

    const sides = Array.from(sidesMap.values())

    return [sides, sidesMap]
  }

  const [sides, sidesMap] = makeSides()

  const getCell = (key: string) => cellsMap.get(key) ?? null

  const getSide = (from: N, to: N | null) => sidesMap.get(keyOfPairNodes(from, to))?.[0] ?? null

  const field: MazeField = {
    sides,
    cells,
    getCell,
    getSide,
  }

  return field
}
