import type { Drawable } from '@/utils/graphics/base'
import type { Line, Point } from '@/utils/math'

export type RectGraphics = Drawable<[...Line, ...Line]>

export const makeRectGraphics = (
  x: number,
  y: number,
  width: number,
  height: number,
): RectGraphics => {
  const points: [Point, Point, Point, Point] = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ]

  const draw = (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.fillStyle = color
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.rect(x, y, width, height)
    ctx.fill()
    ctx.stroke()
  }

  const clear = (ctx: CanvasRenderingContext2D) => {
    ctx.globalCompositeOperation = 'destination-out'
    draw(ctx, 'black')
    ctx.globalCompositeOperation = 'source-over'
  }

  return {
    vertices: points,
    draw,
    clear,
  }
}
