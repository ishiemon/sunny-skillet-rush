// Sunny Skillet Rush — entry point: wires the canvas, the game loop,
// input and the screenshot scenes together.

import { createGame, updateGame } from './state.js';
import { renderGame } from './render.js';
import { attachInput } from './input.js';
import { sceneFromQuery } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

const game = sceneFromQuery(window.location.search) ?? createGame(1);
const isShot = Boolean(new URLSearchParams(window.location.search).get('shot'));

function announce(message) {
  if (status) status.textContent = message;
}

attachInput(canvas, game, announce);

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!isShot) updateGame(game, dt);
  else game.elapsed += dt * 0.15; // screenshot scenes stay alive but frozen in state
  renderGame(ctx, game);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
