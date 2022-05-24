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
    // game logic
    timer = setInterval(() => {
      // bouncing
      if (ball.isLeftCollide() || ball.isRightCollide()) {
        ball.setDirection(Math.PI - ball.getDirection());
      }

      const playerA = players[serveIndex];
      const playerB = players[1 - serveIndex];
      const clientA = playerA.getClient();
      const clientB = playerB.getClient();

      const ballPos = ball.getPosition();
      const bladeAPos = playerA.getX();
      const bladeBPos = 600 - playerB.getWidth() - playerB.getX();
      const bladeACollideY = playerA.getBallY(ball.radius) - ball.radius;
      const bladeBCollideY = playerA.getEnemyBallY(ball.radius) + ball.radius;
      if (ballPos.x >= bladeAPos && ballPos.x <= bladeAPos + playerA.getWidth() && ballPos.y >= bladeACollideY) {
        ball.setY(bladeACollideY);
        ball.setDirection(-ball.getDirection());
      }
      if (ballPos.x >= bladeBPos && ballPos.x <= bladeBPos + playerB.getWidth() && ballPos.y <= bladeBCollideY) {
        ball.setY(bladeBCollideY);
        ball.setDirection(-ball.getDirection());
      }

      // player A won
      if (ball.isTopCollide()) {
        clientA.emit('win');
        clientB.emit('lose');
        spectators.forEach((spec) => {
          spec.getClient().emit('gameOver');
        });
        players = [playerA];
        spectators.push(playerB);
        clearInterval(timer);
      }

      // player B won
      if (ball.isBottomCollide()) {
        clientA.emit('lose');
        clientB.emit('win');
        spectators.forEach((spec) => {
          spec.getClient().emit('gameOver');
        });
        players = [playerB];
        spectators.push(playerA);
        clearInterval(timer);
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
      if (players.length === 2 && !gameStarted) {
        spectators.forEach((spectator) => {
          spectator.getClient().emit('enemyName', name);
        });
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
          players = [remained];
        } else {
          players = [];
        }
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
