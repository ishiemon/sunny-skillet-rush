// Sunny Skillet Rush — mouse and keyboard input, mapped through the same
// layout rectangles the renderer draws, so what you click is what you see.

import { INGREDIENTS } from './config.js';
import { binRect, serveRect, trashRect, startRect, plateCenter } from './render.js';
import { addToPlate, removeFromPlate, clearPlate, servePlate, startShift } from './state.js';
import { playChop, playServe, playWrong, playClick } from './audio.js';

function inside(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function canvasPoint(canvas, event) {
  const box = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - box.left) * (canvas.width / box.width),
    y: (event.clientY - box.top) * (canvas.height / box.height),
  };
}

export function attachInput(canvas, game, announce) {
  canvas.addEventListener('pointerdown', (event) => {
    const { x, y } = canvasPoint(canvas, event);
    if (game.phase !== 'playing') {
      if (inside(x, y, startRect()) || game.phase === 'title') { startShift(game); playClick(); announce('Shift started'); }
      return;
    }
    if (inside(x, y, serveRect())) {
      const result = servePlate(game);
      if (result === 'served') playServe(); else playWrong();
      announce(result === 'served' ? 'Dish served' : 'That plate matches no ticket');
      return;
    }
    if (inside(x, y, trashRect())) { clearPlate(game); playClick(); return; }
    const plate = plateCenter();
    if (Math.hypot(x - plate.x, y - plate.y) <= plate.r) {
      // Clicking a plated ingredient takes it back off the plate.
      const spots = [[-38, -22], [36, -26], [0, 30]];
      game.plate.forEach((id, i) => {
        if (Math.hypot(x - (plate.x + spots[i][0]), y - (plate.y + spots[i][1])) <= 34) removeFromPlate(game, id);
      });
      return;
    }
    INGREDIENTS.forEach((item, i) => {
      if (inside(x, y, binRect(i))) {
        if (addToPlate(game, item.id)) playChop();
        else if (game.plate.includes(item.id)) removeFromPlate(game, item.id);
      }
    });
  });

  window.addEventListener('keydown', (event) => {
    if (game.phase !== 'playing') {
      if (event.key === 'Enter' || event.key === ' ') { startShift(game); playClick(); }
      return;
    }
    const item = INGREDIENTS.find((entry) => entry.key === event.key);
    if (item) { if (addToPlate(game, item.id)) playChop(); return; }
    if (event.key === 'Enter') { servePlate(game) === 'served' ? playServe() : playWrong(); return; }
    if (event.key === 'Backspace') { event.preventDefault(); clearPlate(game); }
  });
}
