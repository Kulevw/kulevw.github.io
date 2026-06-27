import type { Line, Point } from '@/utils/math'
import { unionPolygones } from '@/utils/math/union-polygones'
import { type IntPoint, type Paths, ClipperOffset, JoinType, EndType } from 'clipper-lib'

const toIntPoint = ([X, Y]: Point): IntPoint => ({ X, Y })

const toPoint = ({ X, Y }: IntPoint): Point => [X, Y]

export const unionLines = (lines: Line[], weight: number): Point[][] => {
  if (lines.length === 0) return []

  const scaledLines = lines.map((line) => line.map(toIntPoint))

  // 1. Создаем офсеттер
  const co = new ClipperOffset()

  // Добавляем линии как ОТКРЫТЫЕ (false).
  // jtRound/etOpenRound сделает красивые скругленные стыки и концы
  co.AddPaths(scaledLines, JoinType.jtRound, EndType.etOpenRound)

  const inflatedPolygons: Paths = []
  // Превращаем линии в полноценные полигоны с толщиной
  co.Execute(inflatedPolygons, weight)

  return unionPolygones(inflatedPolygons.map((path) => path.map(toPoint)))
  // if (lines.length === 0) return []

  // const clipper = new Clipper()

  // const polyTree = new PolyTree()

  // const scaledLines = JS.Lighten(lines.map((line) => line.map(toIntPoint)), 1)

  // clipper.AddPaths(scaledLines, PolyType.ptSubject, false)

  // clipper.Execute(ClipType.ctUnion, polyTree, PolyFillType.pftNonZero, PolyFillType.pftNonZero)

  // console.log(polyTree)

  // const solutionPaths = Clipper.PolyTreeToPaths(polyTree)

  // return solutionPaths.map((path) => path.map(toPoint))
  // const paths = lines.map((path) => path.map(toIntPoint))

  // if (!lines.length) {
  //   return []
  // }

  // const clipper = new Clipper()
  // const solutionTree = new PolyTree()

  // console.log('paths', paths)

  // const cleanedPaths = paths

  // console.log(cleanedPaths)

  // clipper.AddPaths(cleanedPaths, PolyType.ptSubject, true)

  // clipper.Execute(ClipType.ctUnion, solutionTree, PolyFillType.pftNonZero, PolyFillType.pftNonZero)

  // const result = Clipper.PolyTreeToPaths(solutionTree).map((path) => path.map(toPoint))

  // return result
}
