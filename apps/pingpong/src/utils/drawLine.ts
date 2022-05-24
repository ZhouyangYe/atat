import { ICoordinate } from './interface';

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: ICoordinate,
  to: ICoordinate,
  thickness: number,
  isInit = true
): void => {
  if (isInit) ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineWidth = thickness;
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
};
