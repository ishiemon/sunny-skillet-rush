// Sunny Skillet Rush — deterministic screenshot scenes (?shot=start|play|rush|end).
// Each scene is a real state of the game itself, set up so the maker's
// screenshots show a complete kitchen: tickets, counter, a dish mid-assembly,
// the timer, and a plate ready to serve.

import { createGame, makeOrder } from './state.js';

export function sceneFromQuery(search) {
  const params = new URLSearchParams(search);
  const shot = params.get('shot');
  if (!shot) return null;
  const game = createGame(7);
  game.phase = 'playing';
  game.orders = [makeOrder(game), makeOrder(game), makeOrder(game)];
  // Fixed, readable tickets for every scene.
  game.orders[0].recipe = { name: 'Golden Noodle Melt', items: ['noodles', 'cheese', 'egg'], price: 150 };
  game.orders[0].table = 3; game.orders[0].patience = game.orders[0].patienceMax * 0.72;
  game.orders[1].recipe = { name: 'Garden Crunch Salad', items: ['greens', 'tomato', 'carrot'], price: 120 };
  game.orders[1].table = 5; game.orders[1].patience = game.orders[1].patienceMax * 0.5;
  game.orders[2].recipe = { name: 'Sunrise Skillet', items: ['potato', 'egg', 'cheese'], price: 140 };
  game.orders[2].table = 1; game.orders[2].patience = game.orders[2].patienceMax * 0.9;

  if (shot === 'start') {
    game.phase = 'title';
    game.plate = ['noodles', 'cheese'];
    game.timeLeft = 120;
  } else if (shot === 'play') {
    // Mid-assembly: two of three ingredients on the plate, stove busy.
    game.plate = ['noodles', 'cheese'];
    game.elapsed = 34; game.timeLeft = 86; game.score = 430; game.served = 3; game.combo = 2;
    game.message = 'One more ingredient — the egg!';
    game.messageTime = 99;
  } else if (shot === 'rush') {
    // The plate matches ticket one exactly: ready to serve, clock running down.
    game.plate = ['noodles', 'cheese', 'egg'];
    game.elapsed = 102; game.timeLeft = 18; game.score = 1240; game.served = 9; game.combo = 4;
    game.orders[1].patience = game.orders[1].patienceMax * 0.18;
    game.lastServed = { name: 'Mushroom Noodle Bowl', earned: 190 };
    game.serveFlash = 99;
  } else if (shot === 'end') {
    game.phase = 'over';
    game.elapsed = 120; game.timeLeft = 0; game.score = 1610; game.served = 11; game.missed = 2;
    game.attempts = 13; game.bestCombo = 5; game.combo = 0;
    game.plate = ['potato', 'egg'];
  }
  return game;
}
