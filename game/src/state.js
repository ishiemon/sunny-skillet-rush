// Sunny Skillet Rush — game state: order tickets, the plate being built,
// scoring, combo and the shift timer. Pure logic, no drawing in here.

import { GAME_SECONDS, PLATE_SIZE, RECIPES, patienceFor } from './config.js';
import { makeRandom } from './random.js';

export function createGame(seed = 1) {
  return {
    phase: 'title', // title | playing | over
    timeLeft: GAME_SECONDS,
    elapsed: 0,
    score: 0,
    coins: 0,
    served: 0,
    missed: 0,
    attempts: 0,
    combo: 0,
    bestCombo: 0,
    plate: [],
    orders: [],
    lastServed: null,
    serveFlash: 0,
    shake: 0,
    message: '',
    messageTime: 0,
    random: makeRandom(seed),
    nextRecipe: 0,
  };
}

export function makeOrder(game) {
  // Cycle recipes in a shuffled order so tickets feel varied but fair.
  const recipe = RECIPES[game.nextRecipe % RECIPES.length];
  game.nextRecipe += 1 + Math.floor(game.random() * 2);
  const patience = patienceFor(game.served);
  return { recipe, patience, patienceMax: patience, table: 1 + Math.floor(game.random() * 6) };
}

export function startShift(game) {
  const seed = 1000 + Math.floor(Math.random() * 9000);
  const fresh = createGame(seed);
  Object.assign(game, fresh, { phase: 'playing' });
  game.orders = [makeOrder(game), makeOrder(game), makeOrder(game)];
  game.message = 'First tickets are up — good luck, chef!';
  game.messageTime = 2.5;
}

export function addToPlate(game, ingredientId) {
  if (game.phase !== 'playing') return false;
  if (game.plate.length >= PLATE_SIZE) return false;
  if (game.plate.includes(ingredientId)) return false;
  game.plate.push(ingredientId);
  return true;
}

export function removeFromPlate(game, ingredientId) {
  const at = game.plate.indexOf(ingredientId);
  if (at !== -1) game.plate.splice(at, 1);
}

export function clearPlate(game) {
  game.plate = [];
}

function sameDish(a, b) {
  return a.length === b.length && a.every((item) => b.includes(item));
}

// Serve the plate: an exact recipe match earns its price plus a patience
// bonus; a wrong plate breaks the combo. Returns 'served' | 'wrong' | 'empty'.
export function servePlate(game) {
  if (game.phase !== 'playing' || game.plate.length < PLATE_SIZE) return 'empty';
  game.attempts += 1;
  const at = game.orders.findIndex((order) => sameDish(game.plate, order.recipe.items));
  if (at === -1) {
    game.combo = 0;
    game.shake = 0.35;
    game.message = 'No ticket matches that plate — check the order board!';
    game.messageTime = 2;
    return 'wrong';
  }
  const order = game.orders[at];
  const patienceBonus = Math.round(40 * (order.patience / order.patienceMax));
  game.combo += 1;
  game.bestCombo = Math.max(game.bestCombo, game.combo);
  const comboBonus = (game.combo - 1) * 10;
  const earned = order.recipe.price + patienceBonus + comboBonus;
  game.score += earned;
  game.coins += earned;
  game.served += 1;
  game.lastServed = { name: order.recipe.name, earned };
  game.serveFlash = 1.2;
  game.message = `Served ${order.recipe.name}! +${earned}`;
  game.messageTime = 2;
  game.orders.splice(at, 1);
  game.orders.push(makeOrder(game));
  game.plate = [];
  return 'served';
}

export function plateMatchesOrder(game) {
  return game.orders.some((order) => sameDish(game.plate, order.recipe.items));
}

export function updateGame(game, dt) {
  if (game.messageTime > 0) game.messageTime = Math.max(0, game.messageTime - dt);
  if (game.serveFlash > 0) game.serveFlash = Math.max(0, game.serveFlash - dt);
  if (game.shake > 0) game.shake = Math.max(0, game.shake - dt);
  if (game.phase !== 'playing') return;
  game.elapsed += dt;
  game.timeLeft = Math.max(0, game.timeLeft - dt);
  for (const order of game.orders) order.patience -= dt;
  const expired = game.orders.filter((order) => order.patience <= 0);
  if (expired.length > 0) {
    game.missed += expired.length;
    game.combo = 0;
    game.message = 'A customer walked out — ticket expired!';
    game.messageTime = 2;
    game.orders = game.orders.filter((order) => order.patience > 0);
    while (game.orders.length < 3) game.orders.push(makeOrder(game));
  }
  if (game.timeLeft <= 0) game.phase = 'over';
}
