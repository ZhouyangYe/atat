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

const plusVector = (vec1: Vector, vec2: Vector): Vector => {
  return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

const getNormal = (vec: Vector): Vector => {
  return { x: vec.y, y: -vec.x };
}

const getP2LineDistance = (line: [Vector, Vector], point: Vector): number => {
  const
    lVec = minusVector(line[0], line[1]),
    p = minusVector(point, line[0]);
  if (lVec.x === 0) {
    return Math.abs(p.x);
  }
  if (p.x === 0) {
    return Math.abs(lVec.x);
  }
  const
    deg1 = Math.atan(lVec.y / lVec.x),
    deg2 = Math.atan(p.y / p.x),
    pl = getLength(p, { x: 0, y: 0 });

  return Math.abs(pl * Math.sin(deg1 - deg2));
}

const handleCircleCollision = (o1: Circle, o2: Circle): boolean => {
  const offset = o1.r + o2.r - getLength(o1.position, o2.position);

  if (offset < 0.00001) {
    return false;
  }

  const
    normVector = getNormalizedVector(minusVector(o1.position, o2.position)),
    offset2 = o1.mass * offset / (o1.mass + o2.mass),
    offset1 = offset - offset2;

  o1.setPos(plusVector(o1.position, multiplyVector(normVector, offset1)));
  o2.setPos(minusVector(o2.position, multiplyVector(normVector, offset2)));
  return true;
};

const getProjectionPoint = (line: Vector, point: Vector): Vector => {
  const deg = Math.atan(line.y / line.x);
  const tan = line.y / line.x;
  const vy = tan * point.x;
  const offset = (vy - point.y) * Math.cos(deg) * Math.cos(deg);
  const y = point.y + offset;
  return { x: y / tan, y };
}

const getProjection = (n: Vector, o: Polygon): [Vector, Vector] => {
  const range: [Vector, Vector] = [{ x: -1, y: -1 }, { x: -1, y: -1 }];

  for (let i = 0, l = o.d.length; i < l; i++) {
    const p = { x: o.d[i].x + o.position.x, y: o.d[i].y + o.position.y };
    let result: Vector;

    if (n.x === 0) {
      result = { x: 0, y: p.y };
    } else if (n.y === 0) {
      result = { x: p.x, y: 0 };

      if (range[0].x === -1 || result.x < range[0].x) {
        range[0] = result
      }

      if (range[1].x === -1 || result.x > range[1].x) {
        range[1] = result;
      }

      continue;
    } else {
      result = getProjectionPoint(n, p);
    }

    if (range[0].y === -1 || result.y < range[0].y) {
      range[0] = result
    }

    if (range[1].y === -1 || result.y > range[1].y) {
      range[1] = result;
    }
  }

  return range;
}

const handleProjection = (o1: Polygon, o2: Polygon): { collide: boolean, offset?: number, dir?: Vector, length?: number } => {
  let offset = -1, dir: Vector, line: [Vector, Vector], l = -1;

  for (let i = 0, length = o1.d.length; i < length; i++) {
    const dot1 = o1.d[i], dot2 = o1.d[i === length - 1 ? 0 : i + 1],
      norm = getNormal(minusVector(dot1, dot2));

    const
      proj1 = getProjection(norm, o1),
      proj2 = getProjection(norm, o2);

    if (norm.y === 0 && (proj1[0].x > proj2[1].x || proj1[1].x < proj2[0].x)) {
      return { collide: false };
    }

    if (proj1[0].y > proj2[1].y || proj1[1].y < proj2[0].y) {
      return { collide: false };
    }

    const
      offsetX = Math.min(Math.abs(proj1[0].x - proj2[1].x), Math.abs(proj1[1].x - proj2[0].x)),
      offsetY = Math.min(Math.abs(proj1[0].y - proj2[1].y), Math.abs(proj1[1].y - proj2[0].y)),
      o = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
    if (o < offset || offset === -1) {
      offset = o;
      dir = getNormalizedVector(norm);
      line = [plusVector(dot1, o1.position), plusVector(dot2, o1.position)];
    }
  }

  o2.d.forEach((dot) => {
    const distance = getP2LineDistance(line, plusVector(dot, o2.position));

    if (l === -1 || distance < l) {
      l = distance;
    }
  });

  return { collide: true, offset, dir, length: l };
}

const handlePolygonCollision = (o1: Polygon, o2: Polygon): boolean => {
  const
    p1 = handleProjection(o1, o2),
    p2 = handleProjection(o2, o1);

  if (!p1.collide || !p2.collide) {
    return false;
  }
  else if (p1.offset === p2.offset && p1.offset === 0) {
    return false;
  }
  else if (p1.offset < p2.offset || (p1.offset === p2.offset && p1.length < p2.length)) {
    const offset2 = p1.offset * o1.mass / (o1.mass + o2.mass);
    const offset1 = p1.offset - offset2;

    o1.setPos(plusVector(o1.position, multiplyVector(p1.dir, offset1)));
    o2.setPos(minusVector(o2.position, multiplyVector(p1.dir, offset2)));
  }
  else {
    const offset2 = p2.offset * o1.mass / (o1.mass + o2.mass);
    const offset1 = p2.offset - offset2;

    o1.setPos(minusVector(o1.position, multiplyVector(p2.dir, offset1)));
    o2.setPos(plusVector(o2.position, multiplyVector(p2.dir, offset2)));
  }

  return true;
}

const handleCirclePolygonCollision = (o1: Circle, o2: Polygon): boolean => {
  // TODO: circle polygon collision
  return false;
};

const handlers = {
  [`${SHAPE.CIR}-${SHAPE.CIR}`]: (obj1: Base, obj2: Base): boolean => { return handleCircleCollision(obj1 as Circle, obj2 as Circle) },
  [`${SHAPE.POL}-${SHAPE.POL}`]: (obj1: Base, obj2: Base): boolean => { return handlePolygonCollision(obj1 as Polygon, obj2 as Polygon) },
  [`${SHAPE.CIR}-${SHAPE.POL}`]: (obj1: Base, obj2: Base): boolean => { return handleCirclePolygonCollision(obj1 as Circle, obj2 as Polygon) },
  [`${SHAPE.POL}-${SHAPE.CIR}`]: (obj1: Base, obj2: Base): boolean => { return handleCirclePolygonCollision(obj2 as Circle, obj1 as Polygon) },
};

export const handler = {
  collide: (obj1: Base, obj2: Base): boolean => {
    return handlers[`${obj1.shape}-${obj2.shape}`](obj1, obj2);
  },
  boundary: (obj: Base, width: number, height: number): boolean => {
    let collide = false, x = obj.position.x, y = obj.position.y;

    switch (obj.shape) {
      case SHAPE.CIR: {
        const o = obj as Circle;
        const leftEdge = o.r, rightEdge = width - o.r, topEdge = o.r, bottomEdge = height - o.r;

        if (x < leftEdge) {
          x = leftEdge;
          collide = true;
        } else if (x > rightEdge) {
          x = rightEdge;
          collide = true;
        }

        if (y < topEdge) {
          y = topEdge;
          collide = true;
        } else if (y > bottomEdge) {
          y = bottomEdge;
          collide = true;
        }

        break;
      }
      case SHAPE.POL: {
        const o = obj as Polygon;
        const leftEdge = 0, rightEdge = width, topEdge = 0, bottomEdge = height;

        if (x + o.l < leftEdge) {
          x = leftEdge;
          collide = true;
        } else if (x + o.r > rightEdge) {
          x = rightEdge - o.r;
          collide = true;
        }

        if (y + o.t < topEdge) {
          y = topEdge;
          collide = true;
        } else if (y + o.b > bottomEdge) {
          y = bottomEdge - o.b;
          collide = true;
        }

        break;
      }
      default: {
        return collide;
      }
    }

    obj.setPos({ x, y });
    return collide;
  },
};
