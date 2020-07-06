import io from 'socket.io-client';

import './styles';

var socket = io('http://localhost:8080');

var table = document.querySelector('.table') as any;
var player = document.querySelector('.player') as any;
var rival = document.querySelector('.rival') as any;
var ball = document.querySelector('.ball') as any;
var startbutton = document.querySelector('.ready') as any;
var nameField = document.querySelector('#name') as any;
var errorMessage = document.querySelector('.errorMessage') as any;
var oppoName = document.querySelector('.oppoName') as any;
var announcement = document.querySelector('.announce') as any;

ball.style.display = 'none';
startbutton.style.display = 'none';

var playerType = 0;
var playerLeft = 0;
var tableLeft = 0;
var tableRight = table.offsetWidth - player.offsetWidth - 6;
var readyToServe = false;
var isSpectator = false;
var isMyServe = false;
var ballServePosition = 0;
var gameStart = false;

table.onmousemove = function (e: any) {
  if (readyToServe) {
    e.stopPropagation();
    playerLeft = e.pageX - table.offsetLeft - player.offsetWidth / 2;
    if (playerLeft < tableLeft) {
      playerLeft = tableLeft;
    } else if (playerLeft > tableRight) {
      playerLeft = tableRight;
    }
    if (isMyServe && !gameStart) {
      var left = player.offsetLeft + player.offsetWidth / 2 - ball.offsetWidth / 2;
      ballServePosition = playerType === 1 ? left : (table.offsetWidth - left - ball.offsetWidth);
      socket.emit('ballserveposition', ballServePosition);
    }
    socket.emit('playermove', playerLeft);
    player.style.left = playerLeft + 'px';
  }
};

socket.on('rivalmove', function (data: any) {
  console.log(data.ballLeft);
  rival.style.right = data.rivalLeft + 'px';
  if (playerType === 1) {
    ball.style.top = data.ballTop + 'px';
    ball.style.left = data.ballLeft + 'px';
  } else if (playerType === 2) {
    ball.style.bottom = data.ballTop + 'px';
    ball.style.right = data.ballLeft + 'px';
  }
});

socket.on('checkin', function (type: any) {
  startbutton.style.display = 'block';
  playerType = type;
});

socket.on('gamestart', function () {
  gameStart = true;
});

socket.on('gameover', function () {
  gameStart = false;
  isMyServe = false;
  readyToServe = false;
  startbutton.style.display = 'block';
  ball.style.display = 'none';
  player.style.left = (table.offsetWidth - player.offsetWidth) / 2 + 'px';
  rival.style.right = (table.offsetWidth - rival.offsetWidth) / 2 + 'px';
});

socket.on('serve', function () {
  readyToServe = true;
  ball.style.display = 'block';
  if (playerType === 1) {
    ball.style.top = '350px';
    ball.style.left = '300px';
  } else if (playerType === 2) {
    ball.style.bottom = '350px';
    ball.style.right = '350px';
  }
});

socket.on('shoot', function () {
  isMyServe = true;
});

socket.on('opponame', function (name: any) {
  oppoName.innerHTML = name;
});

var announceTimer = null as any;
socket.on('oppoescape', function (oppo: any) {
  announcement.innerHTML = oppo + '<br/> Escaped!';
  clearTimeout(announceTimer);
  announceTimer = setTimeout(function () {
    announcement.innerHTML = '';
  }, 1000);
});

var oppoNameTimer = null as any;
socket.on('oppoleft', function (oppo: any) {
  var name = oppo ? oppo : 'Unknown Player';
  oppoName.innerHTML = '<b>\'' + name + '\'</b>' + ' left . . .';
  clearTimeout(oppoNameTimer);
  oppoNameTimer = setTimeout(function () {
    oppoName.innerHTML = 'Waiting for player . . .';
  }, 2000);
});

socket.on('win', function () {
  announcement.innerHTML = 'You win!!!';
  clearTimeout(announceTimer);
  announceTimer = setTimeout(function () {
    announcement.innerHTML = '';
  }, 2000);
});

socket.on('lose', function () {
  announcement.innerHTML = 'You lose! :(';
  clearTimeout(announceTimer);
  announceTimer = setTimeout(function () {
    announcement.innerHTML = '';
  }, 2000);
});

document.onkeydown = function (e) {
  if (readyToServe) {
    if (e.code.toUpperCase() === 'SPACE') {
      e.preventDefault();
      socket.emit('gamestart');
    }
  }
}

var messageTimer = null as any;
startbutton.onclick = function () {
  if (nameField.value) {
    socket.emit('playerready', nameField.value);
    this.style.display = 'none';
  } else {
    errorMessage.innerHTML = 'Please enter your name!'
    clearTimeout(messageTimer);
    messageTimer = setTimeout(function () {
      errorMessage.innerHTML = '';
    }, 1000);
  }
};
