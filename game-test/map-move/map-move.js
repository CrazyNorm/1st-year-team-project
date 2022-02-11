window.onload = function() {
  // get map data
  let mapData = JSON.parse(mapJSON);

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
  playerX = 0;
  playerY = 0;

  // draws the map in the top-left corner
  ctx.drawImage(map,
    xOffset - playerX * tileSize,
    yOffset - playerY * tileSize,
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

  let moveTimer;


  // movement function for keyboard movement
  function keyPressFunc(event) {
    // moveable is used for a delay between each movement
    let tempX = 0;
    let tempY = 0;
    if (moveable) {
      switch(event.key) {
        case "w":
          tempY -= 1;
          break;
        case "a":
          tempX -= 1;
          break;
        case "s":
          tempY += 1;
          break;
        case "d":
          tempX += 1;
          break;
        case "r":
          moveCooldown = 250 - moveCooldown;
          break;
      }

      warping = warpCheck(playerX+tempX, playerY+tempY);
      if (warping.warp) {
        playerX = warping.x;
        playerY = warping.y;
      }
      else if (!collide(playerX+tempX, playerY+tempY)) {
        playerX += tempX;
        playerY += tempY;
      }

      drawFrame();
    }
  }

  // movement function for the control buttons
  function moveFunc(event) {
    // moveable is used for a delay between each movement
    // moving is used to identify if the button is being held down
    let tempX = 0;
    let tempY = 0;
    if (moveable && moving) {   
      switch(event.target.id) {
        case "up":
          tempY -= 1;
          break;
        case "left":
          tempX -= 1;
          break;
        case "down":
          tempY += 1;
          break;
        case "right":
          tempX += 1;
          break;
      }

      warping = warpCheck(playerX+tempX, playerY+tempY);
      if (warping.warp) {
        playerX = warping.x;
        playerY = warping.y;
      }
      else if (!collide(playerX+tempX, playerY+tempY)) {
        playerX += tempX;
        playerY += tempY;
      }

      drawFrame();

      // reruns this move function after a delay
      moveTimer = setTimeout(function() {moveFunc(event);}, moveCooldown);
    }
  }


  function warpCheck(x, y) {
    let destination = {"warp":false, x, y};
    for (bounds of mapData[0].warp) {
      if (bounds[0] == x && bounds[1] == y) {
        destination.warp = true;
        destination.x = bounds[2];
        destination.y = bounds[3];
        break;
      }
    }
    return destination;
  }

  function collide(x, y) {
    let collision = false;
    for (bounds of mapData[0].collision) {
      if (bounds[0] <= x && bounds[2] >= x && bounds[1] <= y && bounds[3] >= y) {
        collision = true;
        break;
      }
    }
    return collision;
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
}