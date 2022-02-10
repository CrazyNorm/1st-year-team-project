// some constant DOM elements
const canvas = document.getElementById("cnv");
const ctx = canvas.getContext("2d");
const map = document.getElementById("map");
const player = document.getElementById("player");

const tileSize = 80; // no. of pixels per tile

let playerX;
let playerY;

// find how many tiles fit on screen (always odd for an easy center)
let mapWidth = Math.floor(window.innerWidth / tileSize);
if (mapWidth % 2 == 0){
  mapWidth--;
}
canvas.width = (mapWidth * tileSize);
let mapHeight = Math.floor(window.innerHeight / tileSize);
if (mapHeight % 2 == 0){
  mapHeight --;
}
canvas.height = (mapHeight * tileSize);

console.log(window.innerHeight, mapHeight);

// calculates pixel offset from top-right to center
let xOffset = Math.floor(mapWidth / 2) * tileSize;
let yOffset = Math.floor(mapHeight / 2) * tileSize;
// sets the player's starting position
playerX = xOffset / tileSize;
playerY = yOffset / tileSize;

// draws the map in the top-left corner
ctx.drawImage(map,
 playerX * tileSize - xOffset,
 playerY * tileSize - yOffset,
 map.width * (tileSize / 16),
 map.height * (tileSize / 16));

// draws player character in cente of screen
ctx.drawImage(player, xOffset, yOffset, tileSize, tileSize);


// used to disable movement for a short period after the player has moved
let moveable = true;
// no. of ms between each movement when button is held down
let moveCooldown = 200;
// true when button held down, false otherwise
let moving = false;


// movement function for keyboard movement
function keyPressFunc(event) {
  // moveable is used for a delay between each movement
  if (moveable) {
    switch(event.key) {
      case "w":
        playerY -= 1;
        break;
      case "a":
        playerX -= 1;
        break;
      case "s":
        playerY += 1;
        break;
      case "d":
        playerX += 1;
        break;
    }

    drawFrame();
  }
}

// movement function for the control buttons
function moveFunc(event) {
  // moveable is used for a delay between each movement
  // moving is used to identify if the button is being held down
  if (moveable && moving) {   
    switch(event.target.id) {
      case "up":
        playerY -= 1;
        break;
      case "left":
        playerX -= 1;
        break;
      case "down":
        playerY += 1;
        break;
      case "right":
        playerX += 1;
        break;
    }

    drawFrame();

    // reruns this move function after a delay
    setTimeout(function() {moveFunc(event);}, moveCooldown);
  }
}


// refresh frame and sets cooldown to move again
function drawFrame() {
  // clears the whole canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draws the map in its current location
  ctx.drawImage(map,
    xOffset - playerX * tileSize,
    yOffset - playerY * tileSize,
    map.width * (tileSize / 16),
    map.height * (tileSize / 16));
  // draws player character in cente of screen
  ctx.drawImage(player, xOffset, yOffset, tileSize, tileSize);
  // sets moveable to false until the cooldown has elapsed
  moveable = false;
  setTimeout(function() {moveable = true;}, moveCooldown);
}



// add event listeners for the control buttons and keypress
let arrows = document.getElementsByClassName("arrow");
for (element of arrows) {
  element.addEventListener('touchstart', function(event) {
    // starts moving
    moving = true;
    moveFunc(event);
  });
  element.addEventListener('touchend', function(event) {
    // stops moving
    moving = false;
  });
  element.addEventListener('mousedown', function(event) {
    // starts moving
    moving = true;
    moveFunc(event);
  });
  element.addEventListener('mouseup', function(event) {
    // stops moving
    moving = false;
  });
}
document.addEventListener('keypress', keyPressFunc);