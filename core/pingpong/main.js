var players = [];
var serve = 0;
var lineup = [];
const base_velocity = 3;
var velocity = base_velocity;
var angle = Math.PI / 3;
var ball = {
  'top': 340,
  'left': 290
}
var gameStart = false;
var readyToServe = false;

function startPingPongServer(io) {
  io.on('connection', (client) => {
    console.log(`Player [${client.id}] connected!'`);
    if (players.length < 2) {
      players.push({
        'id': client.id,
        'left': 250,
        'ready': false,
        'client': client,
        'name': ''
      });
      if (players.length === 2) {
        if (players[0].name) {
          client.emit('opponame', players[0].name);
        }
      }
    } else if (lineup.length < 10) {
      lineup.push({
        'id': client.id,
        'left': 250,
        'ready': false,
        'client': client,
        'name': ''
      });
    } else {
      //the room is full
    }
    if (players[0] && players[0].id === client.id) {
      console.log(client.id + ' : ' + players[0].id);
      client.emit('checkin', 1);
    } else if (players[1] && players[1].id === client.id) {
      console.log(client.id + ' : ' + players[1].id);
      client.emit('checkin', 2);
    } else {
      client.emit('checkin', 3);
    }
    var timer = setInterval(function () {
      if (gameStart) {
        ballMove();
      }
      if (readyToServe) {
        if (players[0].id === client.id) {
          client.emit('rivalmove', {
            'playerLeft': 250,
            'rivalLeft': players[1] ? players[1].left : 250,
            'ballTop': ball.top,
            'ballLeft': ball.left
          });
        } else if (players[1].id === client.id) {
          client.emit('rivalmove', {
            'playerLeft': 250,
            'rivalLeft': players[0] ? players[0].left : 250,
            'ballTop': ball.top,
            'ballLeft': ball.left
          });
        } else {
          client.emit('rivalmove', {
            'playerLeft': players[0] ? players[0].left : 250,
            'rivalLeft': players[1] ? players[1].left : 250,
            'ballTop': ball.top,
            'ballLeft': ball.left
          });
        }
      }
    }, 20);

    client.on('playermove', function (position) {
      if (readyToServe) {
        if (players[0].id === client.id) {
          players[0].left = position;
        } else if (players[1].id === client.id) {
          players[1].left = position;
        }
      }
    });

    client.on('ballserveposition', function (ballLeft) {
      if (client.id === players[serve].id) {
        ball.left = ballLeft;
      }
    });

    client.on('disconnect', function (data) {
      if (players[0].id === client.id) {
        if (players[1]) {
          players[1].client.emit('oppoleft', players[0].name);
          if (readyToServe) {
            players[1].client.emit('oppoescape', players[0].name);
          }
        }
        gameOver();
        players.shift();
        if (lineup.length) {
          players.push(lineup.shift());
          players[0].client.emit('checkin', 1);
          players[1].client.emit('checkin', 2);
        }
      } else if (players[1].id === client.id) {
        if (players[0]) {
          players[0].client.emit('oppoleft', players[1].name);
          if (readyToServe) {
            players[0].client.emit('oppoescape', players[1].name);
          }
        }
        gameOver();
        players.pop();
        if (lineup.length) {
          players.push(lineup.shift());
          players[1].client.emit('checkin', 2);
        }
      }
      if (players.length === 1) {
        players[0].client.emit('checkin', 1);
      }
      clearInterval(timer);
      console.log(`Player [${client.id}] disconnected!'`);
    });

    client.on('playerready', function (name) {
      if (client.id === players[0].id) {
        players[0].ready = true;
        players[0].name = name;
        if (players[1]) {
          players[1].client.emit('opponame', players[0].name);
        }
      } else if (client.id === players[1].id) {
        players[1].ready = true;
        players[1].name = name;
        if (players[0]) {
          players[0].client.emit('opponame', players[1].name);
        }
      }

      //check if both players are ready
      if (players[0] && players[1] && players[0].ready && players[1].ready) {
        readyToServe = true;
        serve = Math.round(Math.random());
        ball.top = serve === 0 ? 656 : 18;
        players[serve].client.emit('shoot');
        io.emit('serve');
      }
    });

    client.on('gamestart', function () {
      if (client.id === players[serve].id) {
        gameStart = true;
        io.emit('gamestart');
      }
    });
  });

  function gameOver() {
    readyToServe = false;
    gameStart = false;
    if (players[0]) {
      players[0].ready = false;
    }
    if (players[1]) {
      players[1].ready = false;
    }
    io.emit('gameover');
  }

  function ballMove() {
    var top = ball.top + velocity * Math.sin(angle);
    var left = ball.left + velocity * Math.cos(angle);
    top = top < 0 ? 0 : (top > 674 ? 674 : top);
    left = left < 0 ? 0 : (left > 574 ? 574 : left);
    if (collide()) {
      angle = -angle;
    }
    if (left === 0 || left === 574) {
      angle = Math.PI - angle;
    }
    ball.top = top;
    ball.left = left;

    if (top === 0) {
      players[0].client.emit('win');
      players[1].client.emit('lose');
      gameOver();
    } else if (top === 674) {
      players[1].client.emit('win');
      players[0].client.emit('lose');
      gameOver();
    }

    function collide() {
      if (ball.top > 659 && ball.left < (players[0].left + 90) && ball.left > (players[0].left - 10)) {
        top = 659;
        return true;
      } else if (ball.top < 15 && ball.left < (590 - players[1].left) && ball.left > (490 - players[1].left)) {
        top = 15;
        return true;
      }
      return false;
    }
  }
}

module.exports = startPingPongServer;
