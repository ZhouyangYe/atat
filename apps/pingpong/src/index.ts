import io from 'socket.io-client';
import init from './main';

import './styles';

const socket = io(`${document.location.protocol}//${document.location.hostname}:8080`);

const table = document.querySelector<HTMLCanvasElement>('#table');
const oppoName = document.querySelector<HTMLElement>('#oppo-name');
const readyIcon = document.querySelector<HTMLElement>('#ready-icon');
const name = document.querySelector<HTMLInputElement>('#name');
const errorMessage = document.querySelector<HTMLElement>('#error-message');

init(table, {
  oppoName,
  readyIcon,
  name,
  errorMessage,
}, socket);