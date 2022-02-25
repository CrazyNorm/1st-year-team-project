function startGame() {
  // gets info about the map from the JSON
  let mapData = JSON.parse(mapJSON);

  // some DOM elements
  const canvas = document.getElementById("cnv");
  const ctx = canvas.getContext("2d");
  const map = document.getElementById("map");
  const player = document.getElementById("player");
  const controls = document.getElementById("controls");
  const sprint = document.getElementById("sprint");

  const tileSize = 80;// px per tile

  // scale the canvas to fit a whole no. of tiles
  let mapWidth = Math.floor(window.innerWidth / tileSize);
  if (mapWidth & 2 == 0) {
    mapWidth--;
  }
  let mapHeight = Math.floor(window.innerHeight / tileSize);
  if (mapHeight & 2 == 0) {
    mapHeight--;
  }
  canvas.width = mapWidth * tileSize;
  canvas.height = mapHeight * tileSize;

  // calculate offset from top-right to center (player sprite position)
  let offsetCoords = [0,0];
  offsetCoords[0] = Math.floor(mapWidth/2) * tileSize;
  offsetCoords[1] = Math.floor(mapHeight/2) * tileSize;

  // sets player starting position
  let playerCoords = [50,25];

  // draws the map and player for starting position
  ctx.drawImage(map,
    offsetCoords[0] - playerCoords[0] * tileSize,
    offsetCoords[1] - playerCoords[1] * tileSize,
    map.width * (tileSize / 16) /3,
    map.height * (tileSize / 16) /3);
  ctx.drawImage(player, offsetCoords[0], offsetCoords[1], tileSize, tileSize);


  // used to put a small 'buffer' between player movements
  let moveable = true;
  // duration of 'buffer' in ms
  let moveCooldown = 200;
  // holds an interval for repeating the move function while a button is held down
  let moveRepeater;
  let fullScreen = false;


  // event listeners
  // keyboard
  document.addEventListener('keypress', keyPressFunc);

  // touch
  document.addEventListener('touchstart', function(event) {
    // stops the previous move function repeating and starts repeating with the new event
    clearInterval(moveRepeater);// repeats the move function indefinitely
    moveRepeater = setInterval(function() {
      btnTouchFunc(event);
    }, 0);
  });
  document.addEventListener('touchmove', function(event) {
    // stops the previous move function repeating and starts repeating with the new event
    clearInterval(moveRepeater);
    moveRepeater = setInterval(function() {
      btnTouchFunc(event);
    }, 0);
  });
  document.addEventListener('touchend', function(event) {
    // stops the previous move function repeating and starts repeating with the new event
    clearInterval(moveRepeater);
    moveRepeater = setInterval(function() {
      btnTouchFunc(event);
    }, 0);
  });

  // sprint button
  sprint.addEventListener('touchstart', function(event) {
    // decreases cooldown when sprint is pressed
    moveCooldown = 50;
    if (!fullScreen) {
      document.getElementById('gameDiv').requestFullscreen();
      fullScreen = true;
      console.log(window.innerHeight);
    }
    else {
      document.exitFullscreen();
      fullScreen = false;
      console.log(window.innerHeight);
    }
  });
  sprint.addEventListener('onclick', function(event) {
    // decreases cooldown when sprint is pressed
    moveCooldown = 50;
    if (!fullScreen) {
      document.getElementById('gameDiv').requestFullscreen();
      fullScreen = true;
    }
    else {
      document.exitFullscreen();
      fullScreen = false;
    }
  });
  sprint.addEventListener('touchend', function(event) {
    // increases cooldown back to default when sprint is released
    moveCooldown = 200;
  });
  window.onscroll = function() {console.log("You cheeky bugger");};



  // keyboard controls handler
  function keyPressFunc(event) {
    if (moveable) {
      // stores the new player position
      let playerMove = playerCoords.slice();
      // gets the appropriate coords change
      switch (event.key) {
        case 'w':
        case 'W':
          playerMove[1] -= 1;
          break;
        case 'a':
        case 'A':
          playerMove[0] -= 1;
          break;
        case 's':
        case 'S':
          playerMove[1] += 1;
          break;
        case 'd':
        case 'D':
          playerMove[0] += 1;
          break;
      }

      // sets cooldown dependent on if shift is held down
      if (event.shiftKey) {
        moveCooldown = 50;
      }
      else {
        moveCooldown = 200;
      }
        
      // gets the warp info for the new position
      warping = warpCheck(playerMove);
      if (warping.warp) {
        // if the new position is a warp point, then set the player coords to the destination coords
        playerCoords = warping.coords;
      }
      else if (!collideCheck(playerMove)) {
        // if the new position is not a warp point and doesn't fall in a collision boundary, then sets the player coords to the new coords
        playerCoords = playerMove;
      }

      drawFrame();
    }
  }

  // button controls touch handler
  function btnTouchFunc(event) {
    // loops through all currently active touches
    for (touch of event.touches) {
      // gets the element the current touch is over
      let element = document.elementFromPoint(touch.clientX, touch.clientY);

      if (controls.contains(element) && moveable) {
        // only runs if the current touch is on the controls and the player is moveable

        let playerMove = playerCoords.slice();
        switch (element.id) {
          case 'up':
            playerMove[1] -= 1;
            break;
          case 'left':
            playerMove[0] -= 1;
            break;
          case 'down':
            playerMove[1] += 1;
            break;
          case 'right':
            playerMove[0] += 1;
            break;
        }

        // gets the warp info for the new position
        warping = warpCheck(playerMove);
        if (warping.warp) {
          // if the new position is a warp point, then set the player coords to the destination coords
          playerCoords = warping.coords;
        }
        else if (!collideCheck(playerMove)) {
          // if the new position is not a warp point and doesn't fall in a collision boundary, then sets the player coords to the new coords
          playerCoords = playerMove;
        }

        drawFrame();
      }
    }
  }


  // checks if the player is entering a warp point and if so, returns the destination
  function warpCheck(coords) {
    // stores destination info in an object
    let destination = {'warp':false, 'coords':[0,0]};

    // loops through all warp points from the JSON
    for (point of mapData[0].warp) {
      if (point[0] == coords[0] && point[1] == coords[1]) {
        // if the player is on the wap source coords, sets destination to return the destination coords
        destination.warp = true;
        destination.coords = [point[2], point[3]];
        break;
      }
    }

    return destination;
  }


  // checks if the location the player is trying to move to is within any of the collision bounds
  function collideCheck(coords) {
    let collision = false;
    // loops through all collision bounds from the JSON
    for (bounds of mapData[0].collision) {
      if (bounds[0] <= coords[0] && bounds[2] >= coords[0] && bounds[1] <= coords[1] && bounds[3] >= coords[1]) {
        collision = true;
        break;
      }
    }
    return collision;
  }


  // draws the next frame
  async function drawFrame() {
    // can't move again until frame is drawn and cooldown elapsed
    moveable = false;
    let cdPromise = new Promise(function(resolve, reject) {
      setTimeout(resolve, moveCooldown);
    });

    // redraws map and player
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.drawImage(map,
      offsetCoords[0] - playerCoords[0] * tileSize,
      offsetCoords[1] - playerCoords[1] * tileSize,
      map.width * (tileSize / 16) /3,
      map.height * (tileSize / 16) /3);
    ctx.drawImage(player, offsetCoords[0], offsetCoords[1], tileSize, tileSize);

    // player becomes moveable again after the cooldown promise has finished
    await cdPromise;
    moveable = true;
  }
}

// doesn't start the game script until the page has fully loaded
window.onload = startGame;
