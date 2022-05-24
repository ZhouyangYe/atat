import io from 'socket.io-client';
import { init } from './core';

import './styles';

const socket = io(`${document.location.protocol}//${document.location.hostname}:39666`);

const tableWrap = document.querySelector<HTMLElement>('#wrap')!;
const table = document.querySelector<HTMLCanvasElement>('#table')!;
const oppoName = document.querySelector<HTMLElement>('#oppo-name')!;
const readyIcon = document.querySelector<HTMLElement>('#ready-icon')!;
const name = document.querySelector<HTMLInputElement>('#name')!;
const errorMessage = document.querySelector<HTMLElement>('#error-message')!;
const announcement = document.querySelector<HTMLElement>('#announcement')!;

init(table, {
  tableWrap,
  table,
  oppoName,
  readyIcon,
  name,
  errorMessage,
  announcement,
}, socket);