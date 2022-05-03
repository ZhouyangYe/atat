import { Base, Circle, Polygon } from '../shapes';
import { SHAPE, Vector } from '../enum';

const getLength = (pos1: Vector, pos2: Vector): number => {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

const getNormalizedVector = (vec: Vector): Vector => {
  const magnitude = getLength(vec, { x: 0, y: 0 });
  return { x: vec.x / magnitude, y: vec.y / magnitude };
}

const minusVector = (pos1: Vector, pos2: Vector): Vector => {
  return { x: pos1.x - pos2.x, y: pos1.y - pos2.y };
}

const multiplyVector = (vec: Vector, num: number): Vector => {
  return { x: vec.x * num, y: vec.y * num };
}

const addVector = (vec1: Vector, vec2: Vector): Vector => {
  return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

const handleCircleCollision = (obj1: Base, obj2: Base): boolean => {
  const o1 = obj1 as Circle, o2 = obj2 as Circle,
    offset = o1.r + o2.r - getLength(o1.position, o2.position);
  if (offset < 0.00001) {
    return false;
  }

  const
    normVector = getNormalizedVector(minusVector(o1.position, o2.position)),
    offset2 = o1.mass * offset / (o1.mass + o2.mass),
    offset1 = offset - offset2;

  o1.setPos(addVector(o1.position, multiplyVector(normVector, offset1)));
  o2.setPos(minusVector(o2.position, multiplyVector(normVector, offset2)));
  return true;
};

const handlePolygonCollision = (obj1: Base, obj2: Base) => {
  const o1 = obj1 as Polygon, o2 = obj2 as Polygon;
  return false;
}

const handleCirclePolygonCollision = (obj1: Base, obj2: Base): boolean => {
  const o1 = obj1 as Circle, o2 = obj2 as Polygon;
  return false;
};

const handlers = {
  [`${SHAPE.CIR}-${SHAPE.CIR}`]: (obj1: Base, obj2: Base): boolean => { return handleCircleCollision(obj1, obj2) },
  [`${SHAPE.POL}-${SHAPE.POL}`]: (obj1: Base, obj2: Base): boolean => { return handlePolygonCollision(obj1, obj2) },
  [`${SHAPE.CIR}-${SHAPE.POL}`]: (obj1: Base, obj2: Base): boolean => { return handleCirclePolygonCollision(obj1, obj2) },
  [`${SHAPE.POL}-${SHAPE.CIR}`]: (obj1: Base, obj2: Base): boolean => { return handleCirclePolygonCollision(obj2, obj1) },
};

export const handler = {
  collide: (obj1: Base, obj2: Base): boolean => {
    return handlers[`${obj1.shape}-${obj2.shape}`](obj1, obj2);
  }
};
