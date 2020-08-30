import './index.less';

export interface IConfig {
  text?: string;
  backgroundUrl?: string;
  doorColor?: string;
  rimColor?: string;
  stoneColor?: string;
  stoneSurfaceColor?: string;
  signColor?: string;
  signBorderColor?: string;
  signMessageColor?: string;
  roadColor?: string;
}

export const createDoor = (config?: IConfig): HTMLElement => {
  const {
    text = 'Entry',
    backgroundUrl = '@resources/static/materials/path3.png',
    doorColor = '#d19c6d',
    rimColor = '#333',
    stoneColor = '#333',
    stoneSurfaceColor = '#555',
    signColor = 'rgb(80, 9, 94)',
    signBorderColor = '#000',
    signMessageColor = '#ddd',
    roadColor = 'rgb(20, 88, 24)',
  } = config || {};

  const door = document.createElement('a');
  door.id = 'door';
  door.href = '/home';
  door.style.background = `url(${backgroundUrl}) no-repeat`;
  door.style.backgroundSize = 'cover';

  // pivot
  for (let i = 0; i < 2; i++) {
    const pivot = document.createElement('div');
    pivot.className = 'pivot';
    door.appendChild(pivot);
  }

  // sign
  const sign = document.createElement('div');
  sign.innerHTML = text;
  sign.className = 'sign';
  sign.style.background = signColor;
  sign.style.borderColor = signBorderColor;
  sign.style.color = signMessageColor;
  door.appendChild(sign);

  // inner
  const inner = document.createElement('div');
  inner.className = 'inner';
  for (let i = 0; i < 4; i++) {
    const window = document.createElement('div');
    window.className = 'window';
    for (let j = 0; j < 4; j++) {
      const edge = document.createElement('div');
      edge.className = 'edge';
      edge.style.background = doorColor;
      window.appendChild(edge);
    }
    inner.appendChild(window);
  }

  // over
  const over = document.createElement('div');
  over.id = 'over';
  for (let j = 0; j < 6; j++) {
    const overlap = document.createElement('div');
    overlap.className = 'overlap';
    overlap.style.background = doorColor;
    over.appendChild(overlap);
  }
  inner.appendChild(over);

  // left edge
  const lEdge = document.createElement('div');
  lEdge.className = 'lEdge';
  lEdge.style.background = doorColor;
  inner.appendChild(lEdge);

  // top edge
  const tEdge = document.createElement('div');
  tEdge.className = 'tEdge';
  tEdge.style.background = doorColor;
  inner.appendChild(tEdge);

  // top edge
  const handler = document.createElement('div');
  handler.className = 'handler';
  inner.appendChild(handler);

  door.appendChild(inner);

  // cover
  const cover = document.createElement('div');
  cover.className = 'cover';
  cover.style.borderColor = rimColor;
  door.appendChild(cover);

  // cover
  const stone = document.createElement('div');
  stone.className = 'stone';
  stone.style.background = stoneColor;
  const div = document.createElement('div');
  div.style.background = stoneSurfaceColor;
  stone.appendChild(div);
  door.appendChild(stone);

  // roads
  const roads = document.createElement('div');
  roads.id = 'roads';
  for (let j = 0; j < 4; j++) {
    const road = document.createElement('div');
    road.className = 'road';
    road.style.background = roadColor;
    roads.appendChild(road);
  }
  door.appendChild(roads);

  return door;
};
