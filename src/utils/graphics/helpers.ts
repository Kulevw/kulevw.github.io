import type { Point } from '@/utils/math'

export const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`

export const syncCanvasTo = (
  fromCtx: CanvasRenderingContext2D,
  toCtx: CanvasRenderingContext2D,
  scale = 1,
) => {
  toCtx.drawImage(fromCtx.canvas, 0, 0, fromCtx.canvas.width * scale, fromCtx.canvas.height * scale)
}

export const fillPolygones = (
  ctx: CanvasRenderingContext2D,
  polygones: Point[][],
  color: string,
  fillRule: CanvasFillRule = 'nonzero',
) => {
  ctx.beginPath()

  polygones.forEach(([start, ...path]: Point[]) => {
    if (!start) {
      return
    }

    ctx.moveTo(...start)
    path.forEach((point) => ctx.lineTo(...point))
    ctx.closePath()
  })

  ctx.fillStyle = color
  ctx.fill(fillRule)
}

export const onFrame = (cb: () => void) => {
  window.requestAnimationFrame(cb)
}
