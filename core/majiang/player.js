class Player {
  constructor(client) {
    this.id = client.id;
    this.client = client;
    this.name = 'Unknown player';
    this.isPlaying = false;

    this.gap = 2;
    this.width = 100;
    this.thickness = 10;
    this.x = (600 - this.width) / 2;
    this.surface = 700 - this.thickness - this.gap;
    this.enemySurface = this.gap + this.thickness;
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

  getBallY(radius) {
    return this.surface - radius;
  }

  getEnemyBallY(radius) {
    return this.enemySurface + radius;
  }

  getWidth() {
    return this.width;
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
