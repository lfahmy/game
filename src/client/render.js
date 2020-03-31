import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_MAX_HP, COIN_RADIUS, MAP_HEIGHT, MAP_WIDTH } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
  const { me, others, coins, balconies } = getCurrentState();
  if (!me) {
    return;
  }

  // Draw background
  renderBackground(me.x, me.y);

  // Draw boundaries
  context.strokeStyle = 'red';
  context.lineWidth = 1;
  context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_WIDTH, MAP_HEIGHT);

  // Draw all players
  renderPlayer(me, me);
  others.forEach(renderPlayer.bind(null, me));

  // Draw the balconies
  balconies.forEach(renderBalcony.bind(null, me));

  // Draw all coins
  //console.log(coins);
  coins.forEach(renderCoin.bind(null, me));
}

function renderBackground(x, y) {
  /*const backgroundX = MAP_WIDTH / 2 - x + canvas.width / 2;
  const backgroundY = MAP_HEIGHT / 2 - y + canvas.height / 2;
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_WIDTH / 10,
    backgroundX,
    backgroundY,
    MAP_WIDTH / 2,
  );
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1, 'gray');
  context.fillStyle = backgroundGradient;*/
  context.fillRect(0, 0, canvas.width, canvas.height);

  //console.log((MAP_WIDTH - getAsset('balcony.png').width));
  //console.log(getAsset('balcony.png').width);
  const backg = getAsset('skyline.gif');
  //context.drawImage(coin, 0 - (x - canvas.width/2), (y-125)*(8500/9750) - (y - canvas.height/2)/*(y > canvas.height/2? y*.1 : 0)+ canvas.height/2 - y*/, 1000, 1500);
  context.drawImage(backg, 0 - (x - canvas.width/2), Math.max(0, Math.min(8500, (8500/(10000-canvas.height))*(y-canvas.height/2))) - (y-canvas.height/2), 1000, 1500);
  /*context.drawImage(no_balc, (MAP_WIDTH - no_balc.width) - (x - canvas.width/2), balc.height + canvas.height/2 - y);
  context.drawImage(balc, (MAP_WIDTH - balc.width) - (x - canvas.width/2), balc.height*2 + canvas.height/2 - y);
  context.drawImage(no_balc, (MAP_WIDTH - no_balc.width) - (x - canvas.width/2), balc.height*3 + canvas.height/2 - y);*/
  /*const pattern = context.createPattern(getAsset('background.jpg'), "repeat");
  context.fillStyle = pattern;
  context.fillRect(0, 0, canvas.width, canvas.height);*/
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction } = player;
  //console.log("Me:", me.id, "--- Other:", player.id);
  //console.log("dir: " + direction*180/Math.PI);
  //console.log("x:", canvas.width/2, "-- y:", canvas.height/2);
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  //context.rotate(direction);
  context.drawImage(
    getAsset('carpet.png'),
    -PLAYER_WIDTH/2,
    -PLAYER_HEIGHT/2,
    PLAYER_WIDTH,
    PLAYER_HEIGHT,
  );
  context.restore();

  // Draw health bar
  /*context.fillStyle = 'white';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  );
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
    2,
  );*/
}

function renderCoin(me, coin) {
  const { x, y } = coin;
  //console.log(x, y);
  context.drawImage(
    getAsset('coin.png'),
    canvas.width / 2 + x - me.x - COIN_RADIUS,
    canvas.height / 2 + y - me.y - COIN_RADIUS,
    COIN_RADIUS * 2,
    COIN_RADIUS * 2,
  );
}

function renderBalcony(me, balcony) {
  const { x, y , occupied} = balcony;
  if(occupied) context.drawImage(getAsset('balcony2.png'), x - (me.x - canvas.width/2), y - (me.y - canvas.height/2));
  else context.drawImage(getAsset('no_balcony.jpg'), x - (me.x - canvas.width/2), y - (me.y - canvas.height/2));
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_WIDTH / 2 + 800 * Math.cos(t);
  const y = MAP_HEIGHT / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(renderMainMenu, 1000 / 60);
}

export function getCanvas() {
  return {x: canvas.width/2, y: canvas.height/2};
}