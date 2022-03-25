// tile based simple frogger game
// cars are spawned by rng
// getting hit is loss, reaching the other side is win

class FroggerGame {
	#divId;
	#isMobile;
	#importantKeys;
	#heldKeys;
	#touches;
	#deltaTime;

	#background;
	#mapSize;
	#desiredHeight; // set number of lanes, no matter screen width
	#pxPerTile;
	#player;
	#carSprites;
	#carList;
	#lanes;

	#canvas;
	#canvasContext;

	constructor(divId, isMobile) {
		// sets div, isMobile and defaults for some other attributes
		this.#divId = divId;
		this.#isMobile = isMobile;
		this.#importantKeys = ['KeyW','ArrowUp','KeyA','ArrowLeft','KeyS','ArrowDown','KeyD','ArrowRight'];
		this.#heldKeys = [];
		this.#touches = [];
		this.#carList = [];
		this.#desiredHeight = 15;
		this.#mapSize = {"x":0, "y":0};
		this.#lanes = ['1l','2r','3l','5r','6r','8l','9l','10r','12r','13l','14r'];
	}

	async startGame() {
		let minigameDiv = document.getElementById(this.#divId);

		// loading screen?
		// keeps count of when everything has finished loading
    let toLoad = 0;
    let loaded = 0;
    function load() {
      loaded ++;
    }

		// create canvas
    minigameDiv.style.margin = "0";
    minigameDiv.style.overflow = 'hidden';
    let tempCanvas = document.createElement("canvas");
    // set id
    tempCanvas.setAttribute('id', 'canvas');
    // set styling
    tempCanvas.setAttribute('style', "background: blue; padding: 0; margin: auto; position: absolute; top: 0; left: 0; width: 100%; height: 100%; image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: optimize-contrast; -ms-interpolation-mode: nearest-neighbor;")
    minigameDiv.appendChild(tempCanvas);
    this.#canvas = document.getElementById("canvas");
    this.#canvasContext = this.#canvas.getContext("2d");

		// load images
		// background
		this.#background = new Image();
		toLoad ++;
		this.#background.onload = load;
		this.#background.src = "resources/imgs/minigames/frogger/background.png";
		
		// 4 player sprites
		let spriteTypes = ["N","E","S","W"];
		let tempDict = {};
		for (let type of spriteTypes) {
			tempDict[type] = new Image();
      toLoad ++;
      tempDict[type].onload = load;
      tempDict[type].src = "resources/imgs/minigames/frogger/player_" + type + ".png";
		}
		this.#player = new FroggerPlayer(tempDict);

		// >= 2 car sprites (l/r) - for now just one car type
		spriteTypes = ["L","R"];
		this.#carSprites = {};
		for (let type of spriteTypes) {
			this.#carSprites[type] = new Image();
      toLoad ++;
      this.#carSprites[type].onload = load;
      this.#carSprites[type].src = "resources/imgs/minigames/frogger/car_" + type + ".png";
		}

		// audio?

		// controls
		let tempDiv = document.createElement("div");
		tempDiv.setAttribute('id','touchUp');
		tempDiv.setAttribute('style','position:absolute; top:0; left:0; height:25%; width:100%; border:solid 3px;');
		minigameDiv.appendChild(tempDiv);
		tempDiv = document.createElement("div");
		tempDiv.setAttribute('id','touchLeft');
		tempDiv.setAttribute('style','position:absolute; top:25%; left:0; height:50%; width:50%; border:solid 3px;');
		minigameDiv.appendChild(tempDiv);
		tempDiv = document.createElement("div");
		tempDiv.setAttribute('id','touchRight');
		tempDiv.setAttribute('style','position:absolute;top:25%; left:50%; height:50%; width:50%; border:solid 3px;');
		minigameDiv.appendChild(tempDiv);
		tempDiv = document.createElement("div");
		tempDiv.setAttribute('id','touchDown');
		tempDiv.setAttribute('style','position:absolute; top:75%; left:0; height:25%; width:100%; border:solid 3px;');
		minigameDiv.appendChild(tempDiv);

		// wait for load
		while (loaded < toLoad) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }

		// input listeners
		this.startInputListeners();
		this.resizeHandler();

		this.#player.setCoords(Math.floor(this.#mapSize.x/2), 0);
		this.#player.setCoordsPx(this.#player.getCoords().x * this.#pxPerTile, 0);

		this.draw();

		this.mainloop();
	}


	async mainloop() {
		let moving = false;
		let direction;
    let totalMoved;
    let spriteDir = "S";

		while (true) {
      let loopPromise = new Promise(function(resolve, reject) {
        setTimeout(resolve, 1000/30);
      });
      let preTime = new Date().getTime();

			// player movement
			if (!moving) {
				// touch controls
				let touchKeys = ['touchUp','touchDown','touchLeft','touchRight'];
        // removes all touch keys from currently held keys
        this.#heldKeys = this.#heldKeys.filter(x => !touchKeys.includes(x));
        // adds the current touches to held keys
        this.#heldKeys = this.#heldKeys.concat(this.#touches);

				// keyboard controls
        direction = {"x":0, "y":0};
        this.#player.setSpeed(4);
        for (let code of this.#heldKeys) {
          switch(code) {
            case "KeyW":
            case "ArrowUp":
            case "touchUp":
              direction.y -= 1;
              break;
            case "KeyA":
            case "ArrowLeft":
            case "touchLeft":
              direction.x -= 1;
              break;
            case "KeyS":
            case "ArrowDown":
            case "touchDown":
              direction.y += 1;
              break;
            case "KeyD":
            case "ArrowRight":
            case "touchRight":
              direction.x += 1;
              break;
          }
        }

        // sets sprite
        if (direction.y <= -1) {
          direction.y = -1;
          spriteDir = "N";
        }
        else if (direction.y >= 1) {
          direction.y = 1;
          spriteDir = "S";
        }
        if (direction.x <= -1) {
          direction.x = -1;
          spriteDir = "W";
        }
        else if (direction.x >= 1) {
          direction.x = 1;
          spriteDir = "E";
        }
        // regulate speed when moving diagonally
        let speedModifier = Math.sqrt(Math.abs(direction.x) + Math.abs(direction.y));
        this.#player.setSpeed(this.#player.getSpeed() * speedModifier);

        // check player collisions and start moving
        this.#player.move(direction.x, direction.y);
        if (this.collision()) {
          this.#player.move(-direction.x, -direction.y);
        }
        else if (direction.x != 0 || direction.y != 0){
          moving = true;
          totalMoved = 0;
        }
			}

			else {
	      let pxPerFrame = this.#pxPerTile * this.#player.getSpeed() * this.#deltaTime;
	      this.#player.movePx(direction.x * pxPerFrame, direction.y * pxPerFrame);
	      totalMoved += pxPerFrame;
	      if (totalMoved >= this.#pxPerTile - pxPerFrame / 2) {
	        let coords = this.#player.getCoords();
	        this.#player.setCoordsPx(coords.x * this.#pxPerTile, coords.y * this.#pxPerTile);
	        moving = false;
	      }
	    }

			// move cars
			for (let car of this.#carList) {
				let pxPerFrame = this.#pxPerTile * car.getSpeed() * this.#deltaTime;
		    car.movePx(pxPerFrame);
		    if (car.getTotalMoved() >= this.#pxPerTile - pxPerFrame / 2) {
		      let coords = car.getCoords();
		      car.setCoordsPx(coords.x * this.#pxPerTile, coords.y * this.#pxPerTile);
		      car.move();
		      console.log(car.getCoords());
		    }
			}
			this.carDiscard();
			// spawn new cars
			while (this.#carList.length < 2) {
				this.createCar();
			}
			this.collision();

			this.draw();

			await loopPromise;
		  let postTime = new Date().getTime();
		  this.#deltaTime = (postTime - preTime) / 1000;
		  // console.log(1/this.#deltaTime);
		}
	}


	draw() {
    // clears the canvas
    this.#canvasContext.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

		// draw background
		this.#canvasContext.drawImage(this.#background, 0, 0, this.#canvas.width, this.#canvas.height);

		// draw player
		this.#canvasContext.drawImage(this.#player.getCurrentElement(),
																	this.#player.getCoordsPx().x,
																	this.#player.getCoordsPx().y,
																	this.#pxPerTile, this.#pxPerTile);

		// draw cars
		for (let car of this.#carList) {
			this.#canvasContext.drawImage(car.getCurrentElement(),
																		car.getCoordsPx().x,
																		car.getCoordsPx().y,
																		this.#pxPerTile, this.#pxPerTile);
		}
	}


	createCar() {
		// generates a random valid position for a new car
		let validCar = false
		let tempCoords;
		let direction; // l=1, r=-1
		let sprite;

		while (!validCar) {
			validCar = true;
			tempCoords = {'x':0, 'y':0};
			direction = 1;
			// picks a lane at random
			let laneChoice = this.#lanes[Math.floor(Math.random() * this.#lanes.length)];

			// splits to lane no and direction
			let laneNo = laneChoice.substring(0, laneChoice.length-1);
			let tempDirection = laneChoice.substring(laneChoice.length-1);
			console.log(tempDirection);
			tempCoords.y = laneNo;
			if (tempDirection == 'r') {
				tempCoords.x = this.#mapSize.x;
				direction = -1;
			}

			// checks if this will overlap another car
			for (let car of this.#carList) {
				if (car.getCoords() == tempCoords) {
					validCar = false;
				}
			}
			sprite = this.#carSprites[tempDirection.toUpperCase()];
		}

		let tempCoordsPx = {'x':tempCoords.x * this.#pxPerTile, 'y':tempCoords.y * this.#pxPerTile};

		let tempCar = new FroggerCar(tempCoords, tempCoordsPx, sprite, direction);
		this.#carList.push(tempCar);
	}


	// returns true on collision (side or car) and runs win or lose method as appropriate
	collision() {
		// win boundary
		if (this.#player.getCoords().y >= this.#mapSize.y) {
			this.win();
		}
		// sides of canvas
		if (this.#player.getCoords().x < 0
				|| this.#player.getCoords().y < 0
				|| this.#player.getCoords().x >= this.#mapSize.x) {
			return true;
		}
		// loop through cars
		for (let car of this.#carList) {
			if (this.#player.getCoords() == car.getCoords()) {
				this.lose();
				return true;
			}
		}
		return false;
	}

	// checks to remove cars that have left the screen
	carDiscard() {
		for (let car of this.#carList) {
			if (car.getCoords().x < 0 || car.getCoords().x >= this.#mapSize.x) {
	      let index = this.#carList.indexOf(car);
	      this.#carList.splice(index, 1);
			}
		}
	}


	win() {
		console.log("yay");
		// show victory message
		// return victory to Game
	}
	lose() {
		// show loss message
		// return loss to Game
	}


	startInputListeners() {
    // applies all the necessary input listeners to the relevant elements
    let div = document.getElementById(this.#divId);
		document.addEventListener('keydown', event => this.keyDownHandler(event));
    document.addEventListener('keyup', event => this.keyUpHandler(event));
    div.addEventListener('touchstart', event => this.touchStartHandler(event));
    div.addEventListener('touchmove', event => this.touchStartHandler(event));
    div.addEventListener('touchend', event => this.touchEndHandler(event));
    div.addEventListener('touchcancel', event => this.touchEndHandler(event));
    window.addEventListener('resize', event => this.resizeHandler());
	}

	keyDownHandler(event) {
    // adds the key to heldKeys if it is "important" and not already in heldKeys
    if (this.#importantKeys.includes(event.code) && !this.#heldKeys.includes(event.code)) {
      this.#heldKeys.push(event.code);
    }
  }
  keyUpHandler(event) {
    // removes the key from heldKeys (if it was already there)
    if (this.#heldKeys.includes(event.code)) {
      let index = this.#heldKeys.indexOf(event.code);
      this.#heldKeys.splice(index, 1);
    }
  }
  touchStartHandler(event) {
    event.preventDefault();
    // stores the direction div being pressed if it isn't already stored
    for (let touch of event.touches) {
      let element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!this.#touches.includes(element.id)) {
      	this.#touches.push(element.id);
      }
    }
  }
  touchEndHandler(event) {
    event.preventDefault();
    // removes the direction div that is no longer being touched from the array
    for (let touch of event.changedTouches) {
      let element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (this.#touches.includes(element.id)) {
	      let index = this.#touches.indexOf(event.code);
	      this.#touches.splice(index, 1);
      }
    }
  }
  resizeHandler() {
  	// resizes the game to fit the specified no. of tiles across the y axis of the screen
  	let div = document.getElementById(this.#divId);
  	this.#pxPerTile = Math.floor(div.clientHeight / this.#desiredHeight);

  	this.#mapSize = {"x":Math.floor(div.clientWidth / this.#pxPerTile),
  									 "y":this.#desiredHeight};
  	
  	this.#canvas.width = this.#mapSize.x * this.#pxPerTile;
  	this.#canvas.height = this.#mapSize.y * this.#pxPerTile;

    let coords = this.#player.getCoords();
    this.#player.setCoordsPx(coords.x * this.#pxPerTile, coords.y * this.#pxPerTile);
  }
}




class FroggerPlayer {
	// attribute declaration
	#coords;
	#coordsPx;
	#elements;
	#currentElement;
	#speed;


	constructor(elements) {
		this.#coords = {"x":0, "y":0};
		this.#coordsPx = {"x":0, "y":0};
		this.#elements = elements;
		// no animation (for now) - elements are just different direction (standing) - i.e [N,E,S,W]
		this.#currentElement = this.#elements["S"];
		this.#speed = 4;
	}


	// getters and setters
	getCoords() {
		return this.#coords;
	}
	setCoords(x,y) {
		this.#coords = {"x":x, "y":y};
	}

	getCoordsPx() {
		return this.#coordsPx;
	}
	setCoordsPx(x,y) {
		this.#coordsPx = {"x":x,"y":y};
	}

	getElements() {
		return this.#elements;
	}
	setElements(elements) {
		this.#elements = elements;
	}

	getCurrentElement() {
		return this.#currentElement;
	}
	setCurrentElement(currentElement) {
		this.#currentElement = currentElement;
	}

	getSpeed() {
		return this.#speed;
	}
	setSpeed(speed) {
		this.#speed = speed;
	}


	move(x,y) {
		this.#coords.x += x;
		this.#coords.y += y;		
	}

	movePx(x,y) {
		this.#coordsPx.x += x;
		this.#coordsPx.y += y;
	}
}




class FroggerCar {
	// attribute declaration
	#coords;
	#coordsPx;
	#currentElement;
	#speed; // random?
	#direction; // left: -1, right: 1
	#totalMoved;


	constructor(coords, coordsPx, currentElement, direction) {
		this.#coords = coords;
		this.#coordsPx = coordsPx;
		this.#currentElement = currentElement;
		this.#speed = 4;
		this.#direction = direction;
		this.#totalMoved = 0;
	}


	// getters and setters
	getCoords() {
		return this.#coords;
	}
	setCoords(x,y) {
		this.#coords = {"x":x, "y":y};
	}

	getCoordsPx() {
		return this.#coordsPx;
	}
	setCoordsPx(x,y) {
		this.#coordsPx = {"x":x,"y":y};
	}

	getCurrentElement() {
		return this.#currentElement;
	}
	setCurrentElement(currentElement) {
		this.#currentElement = currentElement;
	}

	getSpeed() {
		return this.#speed;
	}
	setSpeed(speed) {
		this.#speed = speed;
	}

	getTotalMoved() {
		return this.#totalMoved;
	}
	setTotalMoved(totalMoved) {
		this.#totalMoved = totalMoved;
	}


	move() {	
		this.#coords.x += this.#direction;
	}

	movePx(px) {
		this.#coordsPx.x += this.#direction * px;
		this.#totalMoved += px;
	}
}