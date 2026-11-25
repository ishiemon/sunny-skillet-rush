// Sunny Skillet Rush — all drawing: the kitchen, the order board, the plate
// mid-assembly, the ingredient counter and the title / game-over overlays.
// Food is drawn in code with simple shapes, so the game needs no image files.

import { INGREDIENTS, ingredientById } from './config.js';
import { plateMatchesOrder } from './state.js';

export const WIDTH = 1280;
export const HEIGHT = 720;

export function binRect(index) {
  return { x: 28 + index * 154, y: 544, w: 142, h: 128 };
}
export function serveRect() { return { x: 1002, y: 292, w: 238, h: 84 }; }
export function trashRect() { return { x: 1002, y: 390, w: 238, h: 56 }; }
export function startRect() { return { x: 490, y: 468, w: 300, h: 76 }; }
export function plateCenter() { return { x: 620, y: 338, r: 104 }; }

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function text(ctx, value, x, y, size, color, align = 'center', weight = 'bold') {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, 'Segoe UI', sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(value, x, y);
}

// One ingredient, drawn as food: used on tickets, in bins and on the plate.
export function drawFood(ctx, id, x, y, size) {
  const item = ingredientById(id);
  ctx.save();
  ctx.translate(x, y);
  const s = size / 40;
  ctx.scale(s, s);
  if (id === 'tomato') {
    ctx.fillStyle = item.color; ctx.beginPath(); ctx.arc(0, 2, 15, 0, 7); ctx.fill();
    ctx.fillStyle = item.dark; ctx.fillRect(-2, -16, 4, 7);
    ctx.fillStyle = '#58b368'; ctx.beginPath(); ctx.ellipse(-6, -11, 7, 3.5, -0.5, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(6, -11, 7, 3.5, 0.5, 0, 7); ctx.fill();
  } else if (id === 'greens') {
    ctx.fillStyle = item.dark;
    for (const dx of [-11, 0, 11]) { ctx.beginPath(); ctx.ellipse(dx, 4, 9, 14, dx * 0.03, 0, 7); ctx.fill(); }
    ctx.fillStyle = item.color;
    for (const dx of [-8, 3]) { ctx.beginPath(); ctx.ellipse(dx, 1, 7, 11, 0, 0, 7); ctx.fill(); }
  } else if (id === 'carrot') {
    ctx.fillStyle = item.color;
    ctx.beginPath(); ctx.moveTo(-13, -8); ctx.lineTo(13, -8); ctx.lineTo(0, 17); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = item.dark; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(-7, -1); ctx.lineTo(6, -1); ctx.moveTo(-4, 6); ctx.lineTo(4, 6); ctx.stroke();
    ctx.strokeStyle = '#357a44'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(-6, -17); ctx.moveTo(0, -8); ctx.lineTo(5, -18); ctx.stroke();
  } else if (id === 'cheese') {
    ctx.fillStyle = item.color;
    ctx.beginPath(); ctx.moveTo(-17, 10); ctx.lineTo(17, 10); ctx.lineTo(17, -4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = item.dark;
    for (const [hx, hy, hr] of [[6, 4, 3.4], [-6, 6, 2.6], [11, -1, 2.2]]) { ctx.beginPath(); ctx.arc(hx, hy, hr, 0, 7); ctx.fill(); }
  } else if (id === 'egg') {
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(0, 1, 17, 13, 0.3, 0, 7); ctx.fill();
    ctx.strokeStyle = '#e5d9bd'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = item.dark; ctx.beginPath(); ctx.arc(2, 0, 7.5, 0, 7); ctx.fill();
    ctx.fillStyle = '#ffcf5e'; ctx.beginPath(); ctx.arc(0, -2, 3.4, 0, 7); ctx.fill();
  } else if (id === 'noodles') {
    ctx.fillStyle = '#8a5a33'; ctx.beginPath(); ctx.ellipse(0, 6, 18, 10, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = item.color; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (const dy of [-6, -1, 4]) { ctx.beginPath(); ctx.moveTo(-13, dy); ctx.quadraticCurveTo(0, dy - 6, 13, dy); ctx.stroke(); }
    ctx.strokeStyle = item.dark; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(-10, -14); ctx.lineTo(12, 2); ctx.moveTo(12, -14); ctx.lineTo(-4, 4); ctx.stroke();
  } else if (id === 'mushroom') {
    ctx.fillStyle = item.dark; ctx.beginPath(); ctx.ellipse(0, -5, 18, 11, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#fff6e6';
    for (const [hx, hy] of [[-8, -9], [3, -13], [10, -7]]) { ctx.beginPath(); ctx.arc(hx, hy, 2.6, 0, 7); ctx.fill(); }
    ctx.fillStyle = item.color; ctx.fillRect(-6, -5, 12, 13);
  } else if (id === 'potato') {
    ctx.fillStyle = item.color; ctx.beginPath(); ctx.ellipse(0, 2, 16, 12, 0.4, 0, 7); ctx.fill();
    ctx.fillStyle = item.dark;
    for (const [hx, hy] of [[-7, -2], [5, 5], [8, -5], [-2, 8]]) { ctx.beginPath(); ctx.arc(hx, hy, 1.9, 0, 7); ctx.fill(); }
  }
  ctx.restore();
}

function drawKitchenBackdrop(ctx, game) {
  // Warm tiled wall, a window, a shelf of jars and hanging pans.
  ctx.fillStyle = '#f6d9a8'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = '#eec088';
  for (let x = 0; x < WIDTH; x += 64) for (let y = 200; y < 478; y += 46) ctx.fillRect(x + 2, y + 2, 60, 42);
  ctx.fillStyle = '#a8d4e6'; roundRect(ctx, 56, 222, 150, 118, 10); ctx.fill();
  ctx.strokeStyle = '#8a5a33'; ctx.lineWidth = 6; ctx.stroke();
  ctx.fillStyle = '#ffe9a8'; ctx.beginPath(); ctx.arc(158, 256, 21, 0, 7); ctx.fill();
  ctx.fillStyle = '#7ec850'; ctx.fillRect(56, 316, 150, 24);
  ctx.fillStyle = '#8a5a33'; ctx.fillRect(236, 232, 190, 10);
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = ['#e2483d', '#58b368', '#ffd23f', '#7fb2d9'][i];
    roundRect(ctx, 250 + i * 46, 246, 32, 42, 6); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(255 + i * 46, 252, 10, 30);
  }
  for (let i = 0; i < 3; i++) {
    const px = 872 + i * 52;
    ctx.strokeStyle = '#666'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px, 206); ctx.lineTo(px, 226); ctx.stroke();
    ctx.fillStyle = '#4a4a52'; ctx.beginPath(); ctx.arc(px, 244, 17, 0, 7); ctx.fill();
    ctx.fillStyle = '#77777f'; ctx.beginPath(); ctx.arc(px, 241, 12, 0, 7); ctx.fill();
  }
  // Stove with a sizzling pan, bottom-left of the work area.
  ctx.fillStyle = '#3c3f46'; roundRect(ctx, 52, 372, 210, 92, 10); ctx.fill();
  ctx.fillStyle = '#23252b'; ctx.beginPath(); ctx.ellipse(157, 402, 82, 26, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#565b66'; ctx.beginPath(); ctx.ellipse(157, 396, 76, 22, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#f2b33d'; ctx.beginPath(); ctx.ellipse(157, 394, 52, 14, 0, 0, 7); ctx.fill();
  drawFood(ctx, 'tomato', 132, 390, 30); drawFood(ctx, 'mushroom', 182, 392, 30);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  const wobble = Math.sin(game.elapsed * 3) * 3;
  for (const [sx, sy] of [[128, 356], [160, 348 + wobble], [190, 358]]) {
    ctx.beginPath(); ctx.ellipse(sx, sy, 5, 11, 0, 0, 7); ctx.fill();
  }
  text(ctx, 'ON THE STOVE', 157, 448, 15, '#ffffff');
}

function drawHud(ctx, game) {
  ctx.fillStyle = '#5b3421'; ctx.fillRect(0, 0, WIDTH, 58);
  text(ctx, 'SUNNY SKILLET RUSH', 24, 30, 25, '#ffd23f', 'left');
  const urgent = game.timeLeft <= 20 && game.phase === 'playing';
  text(ctx, `⏰ ${Math.ceil(game.timeLeft)}s`, 640, 30, 32, urgent ? '#ff7a6b' : '#ffffff');
  text(ctx, `★ ${game.score}`, 1010, 30, 26, '#ffffff', 'right');
  text(ctx, game.combo > 1 ? `COMBO ×${game.combo}` : `SERVED ${game.served}`, 1256, 30, 22, '#ffd23f', 'right');
}

function drawOrderBoard(ctx, game) {
  ctx.fillStyle = '#7a4a26'; roundRect(ctx, 18, 66, 1244, 138, 12); ctx.fill();
  ctx.fillStyle = '#8f5a30'; roundRect(ctx, 26, 74, 1228, 122, 9); ctx.fill();
  text(ctx, 'ORDER BOARD', 44, 88, 15, '#ffe1a8', 'left');
  game.orders.forEach((order, i) => {
    const x = 36 + i * 410, y = 96, w = 392, h = 96;
    ctx.fillStyle = '#fffaf0'; roundRect(ctx, x, y, w, h, 8); ctx.fill();
    ctx.strokeStyle = '#d9c9a8'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#e2483d'; ctx.beginPath(); ctx.arc(x + 20, y + 14, 7, 0, 7); ctx.fill();
    text(ctx, `Table ${order.table}`, x + 36, y + 15, 15, '#8a5a33', 'left');
    text(ctx, order.recipe.name, x + w - 10, y + 15, 16, '#5b3421', 'right');
    order.recipe.items.forEach((id, j) => {
      drawFood(ctx, id, x + 48 + j * 74, y + 52, 40);
      text(ctx, ingredientById(id).name, x + 48 + j * 74, y + 80, 13, '#5b3421');
    });
    text(ctx, `$${order.recipe.price}`, x + 322, y + 52, 24, '#357a44');
    const frac = Math.max(0, order.patience / order.patienceMax);
    ctx.fillStyle = '#e8dcc4'; roundRect(ctx, x + 268, y + 72, 112, 12, 6); ctx.fill();
    ctx.fillStyle = frac > 0.45 ? '#58b368' : frac > 0.22 ? '#f28c28' : '#e2483d';
    if (frac > 0.02) { roundRect(ctx, x + 268, y + 72, 112 * frac, 12, 6); ctx.fill(); }
  });
  if (game.orders.length === 0) text(ctx, 'No tickets — enjoy the quiet!', 640, 140, 24, '#fffaf0');
}

function drawPlateArea(ctx, game) {
  const { x, y, r } = plateCenter();
  const shakeX = game.shake > 0 ? Math.sin(game.elapsed * 60) * 5 * game.shake : 0;
  // Work counter.
  ctx.fillStyle = '#b07a45'; ctx.fillRect(0, 478, WIDTH, 34);
  ctx.fillStyle = '#96622f'; ctx.fillRect(0, 506, WIDTH, 6);
  // The plate being assembled.
  ctx.fillStyle = 'rgba(0,0,0,0.24)'; ctx.beginPath(); ctx.ellipse(x + shakeX, y + 12, r + 14, r * 0.94, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(x + shakeX, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = '#c9b184'; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = '#efe3cb'; ctx.beginPath(); ctx.arc(x + shakeX, y, r * 0.78, 0, 7); ctx.fill();
  const spots = [[-38, -22], [36, -26], [0, 30]];
  game.plate.forEach((id, i) => drawFood(ctx, id, x + shakeX + spots[i][0], y + spots[i][1], 62));
  if (game.plate.length === 0) text(ctx, 'empty plate', x, y, 20, '#b8a888');
  text(ctx, `YOUR PLATE — ${game.plate.length}/3`, x, y + r + 26, 19, '#5b3421');
  const ready = plateMatchesOrder(game);
  if (ready) {
    ctx.fillStyle = '#357a44'; roundRect(ctx, x - 150, 210, 300, 30, 15); ctx.fill();
    text(ctx, '✓ PLATE READY TO SERVE!', x, 226, 18, '#ffffff');
  } else if (game.plate.length === 3 && game.messageTime <= 0) {
    text(ctx, 'No ticket wants this mix — tap an item to remove it', 640, 224, 16, '#b02a22');
  }
  // Serve + trash buttons.
  const s = serveRect();
  ctx.fillStyle = ready ? '#58b368' : '#9db98a';
  roundRect(ctx, s.x, s.y, s.w, s.h, 14); ctx.fill();
  text(ctx, '🍽  SERVE', s.x + s.w / 2, s.y + 30, 30, '#ffffff');
  text(ctx, 'Enter', s.x + s.w / 2, s.y + 62, 15, 'rgba(255,255,255,0.85)');
  const t = trashRect();
  ctx.fillStyle = '#c9b896'; roundRect(ctx, t.x, t.y, t.w, t.h, 12); ctx.fill();
  text(ctx, '🗑  CLEAR PLATE', t.x + t.w / 2, t.y + t.h / 2, 19, '#5b3421');
  // Last-served receipt + hint panel, right of the stove.
  if (game.lastServed && game.serveFlash > 0) {
    text(ctx, `✓ Last served: ${game.lastServed.name}  +$${game.lastServed.earned}`, 640, 496, 16, '#ffffff');
  }
  if (game.messageTime > 0 && game.message) {
    text(ctx, game.message, 640, 224, 21, '#b02a22');
  }
}

function drawCounter(ctx, game) {
  ctx.fillStyle = '#6e4525'; ctx.fillRect(0, 512, WIDTH, 208);
  text(ctx, 'INGREDIENT COUNTER — click a bin (or press 1–8)', 640, 530, 14, '#ffe1a8');
  INGREDIENTS.forEach((item, i) => {
    const b = binRect(i);
    const onPlate = game.plate.includes(item.id);
    ctx.fillStyle = onPlate ? '#ffe9a8' : '#fffaf0';
    roundRect(ctx, b.x, b.y, b.w, b.h, 12); ctx.fill();
    ctx.strokeStyle = onPlate ? '#d9a416' : '#8a5a33'; ctx.lineWidth = onPlate ? 5 : 2; ctx.stroke();
    drawFood(ctx, item.id, b.x + b.w / 2, b.y + 44, 52);
    text(ctx, item.name, b.x + b.w / 2, b.y + 86, 19, '#5b3421');
    ctx.fillStyle = '#5b3421'; roundRect(ctx, b.x + b.w / 2 - 14, b.y + 100, 28, 22, 6); ctx.fill();
    text(ctx, item.key, b.x + b.w / 2, b.y + 112, 15, '#ffffff');
    if (onPlate) text(ctx, 'ON PLATE ✓', b.x + b.w / 2, b.y + 16, 13, '#96622f');
  });
}

function drawTitle(ctx, game) {
  ctx.fillStyle = 'rgba(43,26,18,0.72)'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  text(ctx, '☀️ SUNNY SKILLET RUSH ☀️', 640, 128, 54, '#ffd23f');
  text(ctx, 'The little kitchen where lunch is a race.', 640, 176, 24, '#ffffff');
  text(ctx, 'Read the order board, tap 3 ingredients onto your plate, and SERVE before patience runs out.', 640, 238, 21, '#ffe1a8');
  text(ctx, 'Exact recipe = price + patience bonus. Keep serving to build a COMBO!', 640, 272, 21, '#ffe1a8');
  text(ctx, 'Keys 1–8 add ingredients · Enter serves · Backspace clears · Click a plated item to remove it', 640, 306, 18, '#ffffff');
  const s = startRect();
  ctx.fillStyle = '#58b368'; roundRect(ctx, s.x, s.y, s.w, s.h, 16); ctx.fill();
  text(ctx, '▶  START SHIFT', s.x + s.w / 2, s.y + s.h / 2, 30, '#ffffff');
  text(ctx, 'A shift lasts 120 seconds. How many tables can you feed?', 640, 586, 19, '#ffe1a8');
}

function drawGameOver(ctx, game) {
  ctx.fillStyle = 'rgba(43,26,18,0.78)'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  text(ctx, 'SHIFT OVER!', 640, 150, 52, '#ffd23f');
  text(ctx, `Final score  ★ ${game.score}`, 640, 228, 34, '#ffffff');
  text(ctx, `Dishes served: ${game.served}      Customers lost: ${game.missed}`, 640, 292, 24, '#ffe1a8');
  text(ctx, `Best combo: ×${Math.max(1, game.bestCombo)}      Plates tried: ${game.attempts}`, 640, 336, 24, '#ffe1a8');
  const rating = game.served >= 12 ? '★★★  Head Chef!' : game.served >= 7 ? '★★  Line Cook!' : '★  Keep practicing, chef!';
  text(ctx, rating, 640, 396, 28, '#ffd23f');
  const s = startRect();
  ctx.fillStyle = '#58b368'; roundRect(ctx, s.x, s.y, s.w, s.h, 16); ctx.fill();
  text(ctx, '↻  PLAY AGAIN', s.x + s.w / 2, s.y + s.h / 2, 30, '#ffffff');
}

export function renderGame(ctx, game) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawKitchenBackdrop(ctx, game);
  drawOrderBoard(ctx, game);
  drawPlateArea(ctx, game);
  drawCounter(ctx, game);
  drawHud(ctx, game);
  if (game.phase === 'title') drawTitle(ctx, game);
  if (game.phase === 'over') drawGameOver(ctx, game);
}
