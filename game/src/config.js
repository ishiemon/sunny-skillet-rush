// Sunny Skillet Rush — menu data: ingredients, recipes and the shift clock.
// Everything the kitchen serves is built from three of the eight counter bins.

export const GAME_SECONDS = 120;
export const PLATE_SIZE = 3;

export const INGREDIENTS = [
  { id: 'tomato',   name: 'Tomato',   key: '1', color: '#e2483d', dark: '#b02a22' },
  { id: 'greens',   name: 'Greens',   key: '2', color: '#58b368', dark: '#357a44' },
  { id: 'carrot',   name: 'Carrot',   key: '3', color: '#f28c28', dark: '#c05f10' },
  { id: 'cheese',   name: 'Cheese',   key: '4', color: '#ffd23f', dark: '#d9a416' },
  { id: 'egg',      name: 'Egg',      key: '5', color: '#fff3d6', dark: '#f2b33d' },
  { id: 'noodles',  name: 'Noodles',  key: '6', color: '#f5d98b', dark: '#c9a44a' },
  { id: 'mushroom', name: 'Mushroom', key: '7', color: '#d9c7a7', dark: '#a3402f' },
  { id: 'potato',   name: 'Potato',   key: '8', color: '#c98d54', dark: '#96622f' },
];

export const RECIPES = [
  { name: 'Garden Crunch Salad', items: ['greens', 'tomato', 'carrot'], price: 120 },
  { name: 'Golden Noodle Melt',  items: ['noodles', 'cheese', 'egg'],  price: 150 },
  { name: 'Sunrise Skillet',     items: ['potato', 'egg', 'cheese'],   price: 140 },
  { name: 'Mushroom Noodle Bowl', items: ['noodles', 'mushroom', 'carrot'], price: 150 },
  { name: 'Garden Hash Plate',   items: ['potato', 'mushroom', 'tomato'], price: 140 },
  { name: 'Cheesy Garden Noodles', items: ['noodles', 'tomato', 'greens'], price: 130 },
];

export function ingredientById(id) {
  return INGREDIENTS.find((item) => item.id === id);
}

// Patience for a fresh ticket shrinks a little with every dish served,
// so the lunch rush keeps tightening without adding new chores.
export function patienceFor(servedCount) {
  return Math.max(24, 46 - servedCount * 1.6);
}
