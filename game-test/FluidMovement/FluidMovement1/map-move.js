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
var moveTimer;


// window.onload = function() {
//   setInterval(nextFrame, nextDelay);
// };

// function nextFrame()
// {
//   if !(moving)
//   {
//     clearInterval()
//   }

// }



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
  if (moving) {
    var offsets = canvas.getBoundingClientRect();
    var top = offsets.top;
    var left = offsets.left;
    var mouseX = event.clientX+left;
    var mouseY = event.clientY-top;
    var xdiff = xOffset+tileSize/2 - mouseX;
    var ydiff = yOffset+tileSize/2 - mouseY;
    var magnitude = Math.sqrt(xdiff*xdiff + ydiff*ydiff);
    var speedx = -Math.round(xdiff/magnitude);
    var speedy = -Math.round(ydiff/magnitude);
    moveNowpls(speedx,speedy);

  }
}

function moveNowpls(speedx,speedy)
{
  moveTimer = setTimeout(function() {moveNowpls(speedx,speedy);}, moveCooldown);
  // reruns this move function after a delay
  if (moveable) {
    playerX += speedx
    playerY += speedy
    drawFrame()
    console.log(moveable)
    
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
  document.getElementById("cnv").addEventListener('mousedown', function(event) {
    // starts moving
    moving = true;
    moveFunc(event);
  });
  document.getElementById("cnv").addEventListener('mouseup', function(event) {
    // stops moving
    clearTimeout(moveTimer)
    moving = false;
  });
  document.onmousemove = function(event) {
    clearTimeout(moveTimer);
    moveFunc(event);
  };
}
document.addEventListener('keypress', keyPressFunc);