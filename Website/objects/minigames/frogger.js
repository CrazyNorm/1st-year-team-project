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
	#gameOver;
	#isPaused;

	#victoryStats;
	#lossStats;

	#background;
	#mapSize;
	#desiredHeight; // set number of lanes, no matter screen width
	#pxPerTile;
	#backgroundMusic;
	#player;
	#carSprites;
	#carList;
	#lanes;

	#canvas;
	#canvasContext;
	#eventListeners;

	setPaused(isPaused) {
		this.#isPaused = isPaused;
	}

	constructor(divId, isMobile, victory, loss) {
		// sets div, isMobile, victory/loss  and defaults for some other attributes
		this.#divId = divId;
		this.#isMobile = isMobile;
		this.#victoryStats = victory;
		this.#lossStats = loss;

		this.#importantKeys = ['KeyW','ArrowUp','KeyA','ArrowLeft','KeyS','ArrowDown','KeyD','ArrowRight'];
		this.#heldKeys = [];
		this.#touches = [];
		this.#carList = [];
		this.#desiredHeight = 18;
		this.#mapSize = {"x":0, "y":0};
		this.#lanes = ['2r','3l','4r','5r','6r','7l','10r','11r','12r','13l','14l','15r'];
		this.#deltaTime = 0;
		this.#isPaused = false;
		this.#eventListeners = [];
	}

	async startGame() {
		let minigameDiv = document.getElementById(this.#divId);

		// sets up loading screen
    let loadingDiv = document.createElement("div");
    loadingDiv.setAttribute('style', 'position:absolute; height:100%; width:100%; background:white; z-index:1; display:flex; justify-content:center;');
    minigameDiv.appendChild(loadingDiv);

    let logo = document.createElement("img");
    logo.setAttribute('src', 'resources/imgs/logo.png');
    logo.setAttribute('style', 'position:absolute; top:25%; width:80vmin;');
    loadingDiv.appendChild(logo);
    let loadingLabel = document.createElement('p');
    loadingLabel.appendChild(document.createTextNode("Loading..."));
    loadingLabel.setAttribute('style', 'position:absolute; top:45%; text-align:center; font-size:7vmin; color:#660099; font-family:"Press Start 2P", cursive;');
    loadingDiv.appendChild(loadingLabel);
    let emptyBar = document.createElement('div');
    emptyBar.setAttribute('style', 'position:absolute; bottom:15%; width:100%; height:10%; background:yellow;');
    loadingDiv.appendChild(emptyBar);
    let fillBar = document.createElement('span');
    fillBar.setAttribute('style', 'position:absolute; height:100%; background:#660099;')
    emptyBar.appendChild(fillBar);

		// keeps count of when everything has finished loading
		let maxLoad = 117;
    let toLoad = 0;
    let loaded = 0;
    function load() {
      loaded ++;
      fillBar.style.width = String(loaded / maxLoad * 100) + "%";
    }

    // tutorial screen
    let tutorialDiv = document.createElement('div');
		tutorialDiv.setAttribute('style', 'position:absolute; height:90%; width:90%; top:50%; left:50%; transform:translate(-50%,-50%); background:white; border: solid yellow 5px; z-index:1; display:flex; justify-content:center; text-align:center; display:none;');
		minigameDiv.appendChild(tutorialDiv);

		let titleLabel = document.createElement('h1');
		titleLabel.appendChild(document.createTextNode("Frogger"));
		titleLabel.setAttribute('style', 'width:100%; font-size:10vmin; color:#660099; font-family:"Press Start 2P", cursive; margin-bottom:5%;')
		tutorialDiv.appendChild(titleLabel);
		toLoad ++;
		let tutorialImg = document.createElement('img');
		tutorialImg.onload = load;
		if (this.#isMobile) {
			tutorialImg.setAttribute('src', 'resources/imgs/minigames/frogger/tutorialMobile.png');
		} else {
			tutorialImg.setAttribute('src', 'resources/imgs/minigames/frogger/tutorial.png');
		}
		tutorialImg.setAttribute('style', 'position:absolute; left:25%; top:50%; transform:translate(-50%,-50%); max-width:50%; max-height:60%;');
		tutorialDiv.appendChild(tutorialImg);
		let instructionDiv = document.createElement('div');
		instructionDiv.setAttribute('style', 'position:absolute; width:50%; height:60%; right:25%; top:50%; transform:translate(+50%,-50%); font-size:3vmin; color:#660099; font-family:"Press Start 2P", cursive; display:flex; justify-content:space-evenly; text-align:center; flex-direction:column;')
		tutorialDiv.appendChild(instructionDiv);
		let instructionLabel = document.createElement('p');
		instructionLabel.appendChild(document.createTextNode("Get to the other side of the road without getting hit by a car"));
		instructionDiv.appendChild(instructionLabel);
		let controlsLabel = document.createElement('p');
		if (this.#isMobile) {
			controlsLabel.appendChild(document.createTextNode("Tap the left or right section of the screen to move sideways, and the middle section to move forwards"));
		} else {
			controlsLabel.appendChild(document.createTextNode("Use A/D (or Left/Right) to move sideways, and W (or Up) to move forwards"));
		}
		instructionDiv.appendChild(controlsLabel);
		let startLabel = document.createElement('p');
		if (this.#isMobile) {
			startLabel.appendChild(document.createTextNode("Tap anywhere to start"));
		} else {
			startLabel.appendChild(document.createTextNode("Press any key to start"));
		}
		startLabel.setAttribute('style', 'position:absolute; bottom:0; width:100%; font-size:5vmin; color:#bb33ff; font-family:"Press Start 2P", cursive; text-align:center;')
		tutorialDiv.appendChild(startLabel);

		// create canvas
    minigameDiv.style.margin = "0";
    minigameDiv.style.overflow = 'hidden';
    let tempCanvas = document.createElement("canvas");
    // set id
    tempCanvas.setAttribute('id', 'mCanvas');
    // set styling
    tempCanvas.setAttribute('style', "background: blue; padding: 0; margin: auto; position: absolute; top: 0; left: 0; width: 100%; height: 100%; image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: optimize-contrast; -ms-interpolation-mode: nearest-neighbor;")
    minigameDiv.appendChild(tempCanvas);
    this.#canvas = document.getElementById("mCanvas");
    this.#canvasContext = this.#canvas.getContext("2d");

		// load images
		// background
		this.#background = new Image();
		toLoad ++;
		this.#background.onload = load;
		this.#background.src = "resources/imgs/minigames/frogger/background.png";
		
		// 4 player sprites
		let spriteTypes = ['E_Standing','E_Walk_Left','E_Walk_Right',
                       'W_Standing','W_Walk_Left','W_Walk_Right',
                       'N_Standing','N_Walk_Left','N_Walk_Right',
                       'S_Standing'];
		let tempDict = {};
		for (let type of spriteTypes) {
			tempDict[type] = new Image();
      toLoad ++;
      tempDict[type].onload = load;
      tempDict[type].src = "resources/imgs/characters/" + Game.getPlayer().getCharacterType() + "/" + type + ".png";
		}
		this.#player = new FroggerPlayer(tempDict);

		// >= 2 car sprites (l/r) - for now just one car type
		spriteTypes = ["L_Blue","R_Blue","L_Green","R_Green","L_Red","R_Red"];
		this.#carSprites = {};
		for (let type of spriteTypes) {
			this.#carSprites[type] = new Image();
      toLoad ++;
      this.#carSprites[type].onload = load;
      this.#carSprites[type].src = "resources/imgs/minigames/frogger/car_" + type + ".png";
		}

		// loading audio
    this.#backgroundMusic = new Audio();
    toLoad ++;
    this.#backgroundMusic.oncanplaythrough = load;
    this.#backgroundMusic.src = "resources/audio/minigames/frogger/background.mp3"; 
    this.#backgroundMusic.controls = false;
    this.#backgroundMusic.loop = true;

		// controls
		if (this.#isMobile)
		{
			let tempDiv = document.createElement("div");
			tempDiv.setAttribute('id','touchUp');
			tempDiv.setAttribute('style','position:absolute; top:-3px; left:25%; height:101%; width:50%; border:solid #660099 3px; opacity: 0.5;');
			minigameDiv.appendChild(tempDiv);
			tempDiv = document.createElement("div");
			tempDiv.setAttribute('id','touchLeft');
			tempDiv.setAttribute('style','position:absolute; top:0; left:0; height:100%; width:25%;');
			minigameDiv.appendChild(tempDiv);
			tempDiv = document.createElement("div");
			tempDiv.setAttribute('id','touchRight');
			tempDiv.setAttribute('style','position:absolute;top:0; left:75%; height:100%; width:25%;');
			minigameDiv.appendChild(tempDiv);
		}
		// wait for load
		while (loaded < toLoad) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }

		this.resizeHandler();

		this.#player.setCoords(Math.floor(this.#mapSize.x/2), this.#mapSize.y - 1);
		this.#player.setCoordsPx(this.#player.getCoords().x * this.#pxPerTile, this.#player.getCoords().y * this.#pxPerTile);
		// spawn new cars
		while (this.#carList.length < 5) {
			this.createCar();
		}

		this.draw();
		this.#gameOver = false;

		this.mainloop();

		// artificial extra loading time - waits for cars to spread out properly
		toLoad += 100;
		for (var i = 0; i < 100; i++) {
			let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 10);
      });
      await wait;
      load();
		}

		// starts the background music
    this.#backgroundMusic.play();

		loadingDiv.style.display = 'none';

		// tutorial screen
		this.#isPaused = true;
		tutorialDiv.style.display = 'block';
		let closeTutorial = () => {
			tutorialDiv.style.display="none";
			this.#isPaused=false;
			this.startInputListeners();
			document.removeEventListener('keydown', closeTutorial);
		}

		tutorialDiv.ontouchstart = closeTutorial;
		tutorialDiv.onmousedown = closeTutorial;
		document.addEventListener('keydown', closeTutorial);
	}


	async mainloop() {
		let moving = false;
		let direction;
    let totalMoved;
    let spriteDir = "N";

		while (!this.#gameOver) {
      let loopPromise = new Promise(function(resolve, reject) {
        setTimeout(resolve, 1000/30);
      });
      let preTime = new Date().getTime();

      if (!this.#isPaused) {
				// player movement
				if (!moving) {
					// touch controls
					let touchKeys = ['touchUp','touchLeft','touchRight'];
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
	        this.#player.setSpeed(this.#player.getSpeed() / speedModifier);
	        this.#player.setCurrentElement(spriteDir + "_Standing");

	        // check edge collisions and start moving
	        this.#player.move(direction.x, direction.y);
	        if (this.edgeCollision()) {
	          this.#player.move(-direction.x, -direction.y);
	        }
	        else if (direction.x != 0 || direction.y != 0){
	          moving = true;
	          totalMoved = 0;
            this.#player.startAnimationWalk(spriteDir);
	        }
				}

				else {
					// moves a fraction of a tile each frame for smooth movement
		      let pxPerFrame = Math.floor(this.#pxPerTile * this.#player.getSpeed() * this.#deltaTime);
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
					let pxPerFrame = Math.floor(this.#pxPerTile * car.getSpeed() * this.#deltaTime);
			    car.movePx(pxPerFrame);
			    if (car.getTotalMoved() >= this.#pxPerTile - pxPerFrame / 2) {
			      let coords = car.getCoords();
			      car.setCoordsPx(coords.x * this.#pxPerTile, coords.y * this.#pxPerTile);
			      car.move();
			    }
				}
				this.carDiscard();
				// max no. of cars proportional to width of screen
				if (this.#carList.length < this.#mapSize.x) {
					this.createCar();
				}

				// checks win and lose conditions
				if (!this.winCollision()){
					this.carCollision();
				}

				this.draw();
			}

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
		this.#canvasContext.drawImage(this.#background,
																	0, 0,
																	this.#background.naturalWidth / 16 * this.#pxPerTile,
																	this.#mapSize.y * this.#pxPerTile);

		// draw player
		this.#canvasContext.drawImage(this.#player.getCurrentElement(),
																	this.#player.getCoordsPx().x,
																	this.#player.getCoordsPx().y,
																	this.#pxPerTile, this.#pxPerTile);

		// draw cars
		for (let car of this.#carList) {
			this.#canvasContext.drawImage(car.getCurrentElement(),
																		car.getCoordsPx().x - this.#pxPerTile,
																		car.getCoordsPx().y - this.#pxPerTile,
																		this.#pxPerTile*3, this.#pxPerTile*2);
		}
	}


	createCar() {
		let tempCar;
		let tempCoords = {'x':-2, 'y':0};
		let direction = 1;
		// picks a lane at random
		let n = Math.floor(Math.random() * this.#lanes.length)
		let laneChoice = this.#lanes[n];
		// splits to lane no and direction
		let laneNo = parseInt(laneChoice.substring(0, laneChoice.length-1));
		let tempDirection = laneChoice.substring(laneChoice.length-1);
		// parse lane no and direction
		tempCoords.y = laneNo;
		if (tempDirection == 'l') {
			tempCoords.x = this.#mapSize.x + 1;
			direction = -1;
		}

		// checks if there is already another overlapping car
		let validCar = true;
		for (let car of this.#carList) {
			if ((car.getCoords().x - 2 > tempCoords.x && car.getCoords().x + 2 < tempCoords.x) && car.getCoords().y == tempCoords.y) {
				validCar = false;
			}
		}

		// creates the new car object
		if (validCar) {
			let colours = ["_Blue","_Green","_Red"];
			let chosenColour = colours[Math.floor(Math.random() * colours.length)];
			let sprite = this.#carSprites[tempDirection.toUpperCase() + chosenColour];

			let tempCoordsPx = {'x':tempCoords.x * this.#pxPerTile, 'y':tempCoords.y * this.#pxPerTile};
			let tempSpeed = Math.floor(Math.random() * 7) + 2; // randint from 2-8

			tempCar = new FroggerCar(tempCoords, tempCoordsPx, sprite, tempSpeed, direction);
			tempCar.move();
			this.#carList.push(tempCar);
		}
		return tempCar;
	}


	// returns true on collision with side of map (except top)
	edgeCollision() {
		return (this.#player.getCoords().x < 0 || 
			this.#player.getCoords().y >= this.#mapSize.y || 
			this.#player.getCoords().x >= this.#mapSize.x)
	}

	// runs the win method if the player is at the bottom of the screen
	winCollision() {
		if (this.#player.getCoordsPx().y <= 0) {
			this.win();
		}
	}

	// runs the lose method if the player is colliding with any of the cars
	carCollision() {
		for (let car of this.#carList) {
			if (this.#player.getCoords().x > car.getCoords().x - 2
					&& this.#player.getCoords().x < car.getCoords().x + 2
					&& this.#player.getCoords().y == car.getCoords().y) {
				this.lose(car);
				break;
			}
		}
	}

	// checks to remove cars that have left the screen
	carDiscard() {
		for (let car of this.#carList) {
			if ((car.getDirection() == -1 && car.getCoords().x < -2)
					|| (car.getDirection() == 1 && car.getCoords().x > this.#mapSize.x + 1)) {
	      let index = this.#carList.indexOf(car);
	      this.#carList.splice(index, 1);
			}
		}
	}

	// short loop to keep cars moving until the given car moves one extra tile (makes sure the player is "hit")
	async closeLoop(car) {
		let oldCoords = car.getCoords().x;

		while (oldCoords == car.getCoords().x) {
      let loopPromise = new Promise(function(resolve, reject) {
        setTimeout(resolve, 1000/30);
      });
      let preTime = new Date().getTime();

      // move cars
			for (let car of this.#carList) {
				let pxPerFrame = Math.floor(this.#pxPerTile * car.getSpeed() * this.#deltaTime);
		    car.movePx(pxPerFrame);
		    if (car.getTotalMoved() >= this.#pxPerTile - pxPerFrame / 2) {
		      let coords = car.getCoords();
		      car.setCoordsPx(coords.x * this.#pxPerTile, coords.y * this.#pxPerTile);
		      car.move();
		    }
			}
			this.draw();

			await loopPromise;
		  let postTime = new Date().getTime();
		  this.#deltaTime = (postTime - preTime) / 1000;
		}
	}

	async win() {
		this.#gameOver = true;
		// stops the minigame music
		this.#backgroundMusic.pause();
		// constructs the victory dialog
		let victoryDialog = "Well done! You made it across safely.";
		for (let stat in this.#victoryStats) {
			if (stat == 'socialLife') {
				victoryDialog += '<br>' + 'Social Life ';
			}
			else {
				victoryDialog += "<br>" + stat.charAt(0).toUpperCase() + stat.slice(1) + ' ';
			}
			if (this.#victoryStats[stat] >= 0) {
				victoryDialog += '+';
			}
			victoryDialog += this.#victoryStats[stat] + ".";
		}
		// creates a temporary interaction to interact with the dialog and stat systems of the main game
		let tempInteraction	= new Interaction(NaN,
																					1,
																					victoryDialog,
																					"",
																					this.#victoryStats,
																					[],
																					[],
																					[]);

		// keeps the cars moving for a brief period before the minigame closes
		this.#player.setCurrentElement("S_Standing");
		let newCar;
		// creates a brand new car as a counter for the close loop
		while (newCar == undefined) {
			newCar = this.createCar();
		}
		await this.closeLoop(newCar);

		// opens the loss dialog in the main game
		Game.setCurrentInteraction(tempInteraction);
		Game.displayDialog();

		// returns to the main game
		Game.endMinigame();
	}
	async lose(car) {
		this.#gameOver = true;
		// stops the minigame music
		this.#backgroundMusic.pause();
		// constructs the loss dialog
		let lossDialog = "Oh no! You were hit by a car.";
		for (let stat in this.#lossStats) {
			if (stat == 'socialLife') {
				lossDialog += '<br>' + 'Social Life ';
			}
			else {
				lossDialog += "<br>" + stat.charAt(0).toUpperCase() + stat.slice(1) + ' ';
			}
			if (this.#lossStats[stat] >= 0) {
				lossDialog += '+';
			}
			lossDialog += this.#lossStats[stat] + ".";
		}
		// creates a temporary interaction to interact with the dialog and stat systems of the main game
		let tempInteraction	= new Interaction(NaN,
																					1,
																					lossDialog,
																					"",
																					this.#lossStats,
																					[],
																					[],
																					[]);

		// keeps the cars moving for a brief period before the minigame closes
		await this.closeLoop(car);

		// opens the loss dialog in the main game
		Game.setCurrentInteraction(tempInteraction);
		Game.displayDialog();

		// returns to the main game
		Game.endMinigame();
	}


	async startInputListeners() {
		let wait = new Promise(function(resolve, reject) {
      setTimeout(resolve, 100);
    });
    await wait;
    // applies all the necessary input listeners to the relevant elements
    // some event listeners are stored in an array so they can be removed when the game ends
    let div = document.getElementById(this.#divId);
    this.#eventListeners[0] = [document, 'keydown', event => this.keyDownHandler(event)];
		document.addEventListener('keydown', this.#eventListeners[0][2]);
		this.#eventListeners[1] = [document, 'keyup', event => this.keyUpHandler(event)];
    document.addEventListener('keyup', this.#eventListeners[1][2]);
    div.addEventListener('touchstart', event => this.touchHandler(event));
    div.addEventListener('touchmove', event => this.touchHandler(event));
    div.addEventListener('touchend', event => this.touchHandler(event));
    div.addEventListener('touchcancel', event => this.touchHandler(event));
    this.#eventListeners[2] = [window, 'resize', event => this.resizeHandler()];
    window.addEventListener('resize', this.#eventListeners[2][2]);
	}
	removeInputListeners() {
		// removes listeners from anything not created by the minigame
		// stops listeners piling up on document and window
		for (let listener of this.#eventListeners) {
			listener[0].removeEventListener(listener[1], listener[2]);
		}
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
  touchHandler(event) {
    event.preventDefault();
    // stores the direction div being pressed if it isn't already stored
    this.#touches = [];
    for (let touch of event.touches) {
      let element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (!this.#touches.includes(element.id)) {
      	this.#touches.push(element.id);
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

    this.draw();
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
		this.#currentElement = this.#elements["N_Standing"];
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
	setCurrentElement(direction) {
		this.#currentElement = this.#elements[direction];
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


	startAnimationWalk(direction) {
		let delay = 1000 / (this.#speed * 2);
		this.setCurrentElement(direction + "_Walk_Right");
		setTimeout(() => {
			this.setCurrentElement(direction + "_Walk_Left");
		}, delay);
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


	constructor(coords, coordsPx, currentElement, speed, direction) {
		this.#coords = coords;
		this.#coordsPx = coordsPx;
		this.#currentElement = currentElement;
		this.#speed = speed;
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

	getDirection() {
		return this.#direction;
	}
	setDirection(direction) {
		this.#direction = direction;
	}

	getTotalMoved() {
		return this.#totalMoved;
	}
	setTotalMoved(totalMoved) {
		this.#totalMoved = totalMoved;
	}


	move() {	
		this.#totalMoved = 0;
		this.#coords.x += this.#direction;
	}

	movePx(px) {
		this.#coordsPx.x += this.#direction * px;
		this.#totalMoved += px;
	}
}