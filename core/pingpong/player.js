const { PLAYER_TYPE } = require('./enum');

class Player {
  constructor(client, type) {
    this.id = client.id;
    this.client = client;
    this.name = 'Unknown player';
    this.isPlaying = false;

    this.gap = 2;
    this.width = 100;
    this.thickness = 10;
    this.x = (600 - this.width) / 2;
    this.y = type === PLAYER_TYPE.ENEMY ? this.gap : 700 - this.thickness - this.gap;
  }

  getId() {
    return this.id;
  }

  getClient() {
    return this.client;
  }

  getIsPlaying() {
    return this.isPlaying;
  }

  getName() {
    return this.name;
  }

  getX() {
    return this.x;
  }

  setX(x) {
    if (x < 0) {
      this.x = 0;
      return;
    }

    const rightBound = 600 - this.width;
    if (x > rightBound) {
      this.x = rightBound;
      return;
    }

    this.x = x;
  }

  setIsPlaying(isPlaying) {
    this.isPlaying = isPlaying;
  }

  setName(name) {
    this.name = name;
  }
}

module.exports = Player;
