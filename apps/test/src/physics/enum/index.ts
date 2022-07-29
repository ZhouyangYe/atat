export interface Vector {
  x: number;
  y: number;
}

export enum SHAPE {
  POL = 'polygon',
  CIR = 'circle',
}

export enum COLOR {
  NORMAL = 'rgb(92, 64, 62)',
  COLLIDE = 'rgb(255, 17, 0)',
  OVERLAP = 'rgb(16, 255, 0)',
}
