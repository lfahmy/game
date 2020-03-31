import { updateDirection, updateMouse } from './networking';
import { getCanvas } from './render';

function onMouseInput(e) {
  const {x, y} = getCanvas();
  //console.log("x:", e.clientX, "-- y:", e.clientY);
  const diffX = e.clientX - x;
  const diffY = e.clientY - y;
  updateMouse(diffX, diffY);

  const dir = Math.atan2(-diffY, diffX);
  updateDirection(dir);
}

function onKey(e) {
  const key = e.keyCode;
  let x = 0;
  let y = 0;
  if(key == 38) y = 1;
  else if(key == 40) y = -1;
  else if(key == 39) x = 1;
  else if(key == 37) x = -1;

  //handleInput(x, y);
  const dir = Math.atan2(y, x);
  //updateDirection(dir);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  const dir = Math.atan2(x, y);
  //console.log(dir * 180 / Math.PI);
  updateDirection(dir);
}

export function startCapturingInput() {
  //window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('keydown', onKey);
  window.addEventListener('click', onMouseInput);
  window.addEventListener('touchstart', onTouchInput);
  window.addEventListener('touchmove', onTouchInput);
}

export function stopCapturingInput() {
  //window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('keydown', onKey);
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('touchstart', onTouchInput);
  window.removeEventListener('touchmove', onTouchInput);
}
