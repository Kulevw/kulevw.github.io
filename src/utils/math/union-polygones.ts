import type { Point } from '@/utils/math'
import { Clipper, PolyType, ClipType, PolyFillType, type IntPoint, type Paths } from 'clipper-lib'

const toIntPoint = ([X, Y]: Point): IntPoint => ({ X, Y })

const toPoint = ({ X, Y }: IntPoint): Point => [X, Y]

export const unionPolygones = (polygones: Point[][]): Point[][] => {
  const paths = polygones.map((path) => path.map(toIntPoint))

  if (!paths.length) {
    return []
  }

  const clipper = new Clipper()
  const solutionPaths: Paths = []

  console.log('paths', paths)

  const simplyPaths = Clipper.SimplifyPolygons(paths, PolyFillType.pftNonZero)

  console.log('simplyPaths', simplyPaths)

  clipper.AddPaths(simplyPaths, PolyType.ptSubject, true)

  clipper.Execute(ClipType.ctUnion, solutionPaths, PolyFillType.pftEvenOdd, PolyFillType.pftEvenOdd)

  const result = solutionPaths.map((path) => path.map(toPoint))

  return result
}
