const logger = require('@/utils/logger');
const Player = require('./player');
const Ball = require('./ball');

const ball = new Ball();

let players = [];
let spectators = [];
let timer;
let gameStarted = false;

const startGame = () => {
  // get a random player to serve
  const serveIndex = Math.floor(Math.random() * 2);

  players.forEach((player, index) => {
    const isMyServe = index === serveIndex;
    const enemy = players[1 - index];
    const client = player.getClient();
    client.removeAllListeners('bladeMove');
    client.emit('readyToServe', isMyServe);

    client.on('bladeMove', (x) => {
      player.setX(x);
      const enemyClient = enemy.getClient();
      if (isMyServe && !gameStarted) {
        ball.setPosition(player.getX() + player.getWidth() / 2, player.getBallY(ball.getRadius()));
        enemyClient.emit('enemyBladeUpdate', 600 - player.getWidth() - player.getX(), ball.getReversePosition());
        client.emit('myBladeUpdate', player.getX(), ball.getPosition());
        return;
      }
      enemyClient.emit('enemyBladeUpdate', 600 - player.getWidth() - player.getX());
      client.emit('myBladeUpdate', player.getX());
    });
  });

  const client = players[serveIndex].getClient();
  client.removeAllListeners('start');
  client.on('start', () => {
    gameStarted = true;
    clearInterval(timer);
    timer = setInterval(() => {
      // bouncing
      if (ball.isLeftCollide() || ball.isRightCollide()) {
        ball.setDirection(Math.PI - ball.getDirection());
      }
      if (ball.isTopCollide() || ball.isBottomCollide()) {
        ball.setDirection(-ball.getDirection());
      }
  
      ball.move();
      players.forEach((player, index) => {
        const isMyServe = index === serveIndex;
        const c = player.getClient();
        if (isMyServe) {
          c.emit('ballMove', ball.getPosition());
        } else {
          c.emit('ballMove', ball.getReversePosition());
        }
      });
    }, 16);
  });
};

const startPingPongServer = (io) => {
  io.on('connection', (client) => {
    logger.info(`${client.id} connected!`);

    // push to spectators queue when connected
    const player = new Player(client);
    spectators.push(player);

    if (players.length < 2) {
      client.emit('hasSlots', true);
    } else {
      client.emit('hasSlots', false);
    }

    // player is ready
    client.on('ready', (name) => {
      if (players.length < 2) {
        player.setIsPlaying(true);
        player.setName(name);
        players.push(player);
        spectators = spectators.filter(spectator => spectator.getId() !== client.id);
      }
      if (players.length === 1) {
        spectators.forEach((spectator) => {
          spectator.getClient().emit('enemyName', name);
        });
        client.emit('selfName', name);
      }
      if (players.length === 2) {
        spectators.forEach((spectator) => {
          spectator.getClient().emit('enemyName', name);
        });
        console.log(players[0].getId(), client.id);
        players[0].getClient().emit('enemyName', name);
        client.emit('selfName', name);
        startGame();
      }
    });

    // player or spectator left
    client.on('disconnect', () => {
      logger.info(`${client.id} disconnected!`);
      if (player.getIsPlaying()) {
        gameStarted = false;
        ball.resetPosition();
        clearInterval(timer);
        const remained = players.find(p => p.id !== client.id);
        if (remained) {
          const remainedClient = remained.getClient();
          remainedClient.emit('win');
          spectators.push(remained);
          remained.setIsPlaying(false);
        }
        players = [];
      } else {
        spectators.forEach((spectator) => {
          const sClient = spectator.getClient();
          sClient.emit('gameOver');
        });
        spectators = spectators.filter(spectator => spectator.getId() !== client.id);
      }
    });
  });
}

module.exports = startPingPongServer;
