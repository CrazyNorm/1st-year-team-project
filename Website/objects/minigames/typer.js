// This is a guide/frame for creating more minigames
// Any instance of '<MINIGAME>' should be replaced with the title for the new minigame
//
// NOTE for running minigames (database):
// The string stored in the 'actions' array of the interaction should be of the form
// "Game.startMinigame('<MINIGAME>',\"{<VICTORY STAT CHANGES>}\",\"{<LOSS STAT CHANGES}\")"

// A div id is passed to the contructor. This is the only html element createdd by Game
// Anything else that the minigame needs should be created by the minigame as a child of this div


// The first letter of <MINIGAME> in the class name should be capitalised
class TyperGame {
	// Attribute declaration
	// Must include the following 4
	#divId;
	#isMobile;
	#victoryStats;
	#lossStats;
	// Also must include this - explained in the startInputListners method
	#eventListeners;
	// This is probably a requirement unless the minigame is silent
	#backgroundMusic;
	// Canvas attributes will probably be needed (depending on the game) - remove if not
	#canvas;
	#canvasContext;
	// Pausing is useful to pause anything time-based when the pause menu is open
	#isPaused;
	#gameOver;
	#deltaTime;

	#beneathSentence;
	#topSentence;
	#beneathElement;
	#topElement;
	#error;
	#errorTimeout;
	#underscoreInterval;
	#timerElement;
	#time;
	#lastChar;
	#pressEnterDisplay;
	#randomSentences;
	#particles;
	#particleInterval;
	#charsPerLine;
	#previousWidth;
	#currentChar;



	// Constructor must take exactly these 4 paramaters
	constructor(divId, isMobile, victory, loss) {
		// This section of the constructor should not be changed 
		this.#divId = divId;
		this.#isMobile = isMobile;
		this.#victoryStats = victory;
		this.#lossStats = loss;
		this.#eventListeners = [];
		this.#error = false;
		this.#deltaTime = 0;
		this.#lastChar = false;
		this.#particles = [];
		this.#charsPerLine = 0;
		this.#previousWidth = 0;
		this.#currentChar = 0;
		this.#randomSentences = [	"let fromx = tox - scaledX*Math.min(canvasHeight,canvasWidth)*0.1;",
														 	"while (true) {makeGame()}",
														 	"This isn't code!",
														 	"print('Hello World!')",
														 	"minigameDiv.style.overflow = 'hidden';",
														 	"for (player of players) {print('Hello '+player.name)}",
														 	"if pseudocode then hate",
														 	"Really stupidly long text that means it will eventually fall of the screen into the oblivion of hell and many many other places where long text belongs"];
		this.#randomSentences = ["Hello"]

		// Any default values for attributes go here
	}



	// There must be a setPaused method (called when pause menu opens)
	// If there is nothing that needs pausing (i.e. nothing time based), just leave the method empty
	// Alternatively, the setPaused method could be used to remove event listeners
	// to disable input to the minigame while paused
	setPaused(isPaused) {
		this.#isPaused = isPaused;
	}



	// There must be a startGame method with no paramaters whic starts the minigame when called
	// startGame should load any resources (scripts, images, audio),
	// and create any html elements used by the minigame
	// This method must be async for the waiting stuff to work
	async startGame() {
		let minigameDiv = document.getElementById(this.#divId);
    minigameDiv.style.margin = "0";
    minigameDiv.style.overflow = 'hidden';


		// This is the standard loading screen as used by the main game
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


		// This is the load script used to check resources have loaded. Also drives the loading bar
		let maxLoad = 0; // This should be changed to the number of *things* being loaded
    let toLoad = 0;
    let loaded = 0;
    function load() {
      loaded ++;
      fillBar.style.width = String(loaded / maxLoad * 100) + "%";
    }


    // Sample tutorial screen - shows as a pop up before the game starts
    // NOTE - in the minigame's img folder, there must be a tutorial.png and tutorialMobile.png
    // or edit the following code to remove the images
    let tutorialDiv = document.createElement('div');
		tutorialDiv.setAttribute('style', 'position:absolute; height:90%; width:90%; top:50%; left:50%; transform:translate(-50%,-50%); background:white; border: solid yellow 5px; z-index:1; display:flex; justify-content:center; text-align:center; display:none;');
		minigameDiv.appendChild(tutorialDiv);
		// label for the title of the minigame
		let titleLabel = document.createElement('h1');
		titleLabel.appendChild(document.createTextNode("TYPER"));
		titleLabel.setAttribute('style', 'width:100%; font-size:10vmin; color:#660099; font-family:"Press Start 2P", cursive; margin-bottom:5%;')
		tutorialDiv.appendChild(titleLabel);
		// image to demonstrate how to play - possibly different image for mobile
		toLoad ++;
		let tutorialImg = document.createElement('img');
		tutorialImg.onload = load;
		if (this.#isMobile) {
			tutorialImg.setAttribute('src', '<PATH TO MOBILE TUTORIAL IMAGE>');
		} else {
			tutorialImg.setAttribute('src', '<PATH TO TUTORIAL IMAGE>');
		}
		tutorialImg.setAttribute('style', 'position:absolute; left:25%; top:50%; transform:translate(-50%,-50%); max-width:50%; max-height:60%;');
		tutorialDiv.appendChild(tutorialImg);
		// text instructions to display next to the image
		let instructionDiv = document.createElement('div');
		instructionDiv.setAttribute('style', 'position:absolute; width:50%; height:60%; right:25%; top:50%; transform:translate(+50%,-50%); font-size:3vmin; color:#660099; font-family:"Press Start 2P", cursive; display:flex; justify-content:space-evenly; text-align:center; flex-direction:column;')
		tutorialDiv.appendChild(instructionDiv);
		let instructionLabel1 = document.createElement('p');
		// any number of "instructionLabel"s can be created and added by copying this section
		instructionLabel1.appendChild(document.createTextNode("<INSTRUCTIONS GO HERE>"));
		instructionDiv.appendChild(instructionLabel1);
		let instructionLabel2 = document.createElement('p');
		if (this.#isMobile) {
			instructionLabel2.appendChild(document.createTextNode("<MOBILE INSTRUCTIONS GO HERE>"));
		} else {
			instructionLabel2.appendChild(document.createTextNode("<INSTRUCTIONS GO HERE>"));
		}
		instructionDiv.appendChild(instructionLabel2);
		// instructions on how to exit the tutorial - this text probably doesn't need changing
		let startLabel = document.createElement('p');
		if (this.#isMobile) {
			startLabel.appendChild(document.createTextNode("Tap anywhere to start"));
		} else {
			startLabel.appendChild(document.createTextNode("Press any key to start"));
		}
		startLabel.setAttribute('style', 'position:absolute; bottom:0; width:100%; font-size:5vmin; color:#bb33ff; font-family:"Press Start 2P", cursive; text-align:center;')
		tutorialDiv.appendChild(startLabel);


		// Creates the canvas - remove this if creating a minigame that doesn't use a canvas
    // let tempCanvas = document.createElement("canvas");
    // tempCanvas.setAttribute('id', 'mCanvas');
    // tempCanvas.setAttribute('style', "background: blue; padding: 0; margin: auto; position: absolute; top: 0; left: 0; width: 100%; height: 100%; image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: optimize-contrast; -ms-interpolation-mode: nearest-neighbor;")
    // minigameDiv.appendChild(tempCanvas);
    // this.#canvas = document.getElementById("mCanvas");
    // this.#canvasContext = this.#canvas.getContext("2d");


    // An example of loading scripts can be found in Game
    // NOTE - you will need to wait for all the scripts to load before continuing


		// Loads images to be used in the minigame
		// background - assumes the image is in the minigame's img folder and called background.png
		// this.#background = new Image();
		// toLoad ++;
		// this.#background.onload = load;
		// this.#background.src = "resources/imgs/minigames/<MINIGAME>/background.png";
		
		// loading sprites from an array - assumes all sprites are in the minigame's img folder
		// let spritesToLoad = ['<ARRAY>','<OF>','<SPRITE>','<NAMES>','</>','<PATHS>'];
		// let tempDict = {};
		// for (let type of spriteTypes) {
		// 	tempDict[type] = new Image();
  //     toLoad ++;
  //     tempDict[type].onload = load;
  //     tempDict[type].src = "resources/imgs/minigames/<MINIGAME>/" + type + ".png";
		// }
		// Could replace tempDict with an attribute or pass it to be stored in another object


		// Loading audio - background music
		// assumes the background music is in the minigame's audio folder and called background.mp3
		// this.#backgroundMusic = new Audio();
  //   toLoad ++;
  //   this.#backgroundMusic.oncanplaythrough = load;
  //   this.#backgroundMusic.src = "resources/audio/minigames/typer/background.mp3"; 
  //   this.#backgroundMusic.controls = false;
  //   this.#backgroundMusic.loop = true;
    // For other audio clips, omit loop=true and call .play() on them when you want them to trigger
    // (probably call .pause() or set .volume on background music first)
    // Example of non-background audio can be found in Game


		minigameDiv.style.backgroundColor = "black"


		this.#beneathSentence = this.#randomSentences[Math.floor(Math.random()*this.#randomSentences.length)];
		this.#topSentence = "";
		if (this.#isMobile) {
			this.#time = this.#beneathSentence.length * 60000/70; //Based upon characters per second
		} else {
			this.#time = this.#beneathSentence.length * 60000/150; //Based upon characters per second
		}
		

		// Create any other html elements needed by the minigame - as children of the minigame div#
		let containerBig = document.createElement("div");
		containerBig.setAttribute("style","display:flex; width:100%; height:100%; justify-content:center; align-items:center;")
		let container = document.createElement("div");
		container.setAttribute("id","container");
		container.setAttribute("style","display:flex;");
		this.#beneathElement = document.createElement("div");
		this.#beneathElement.setAttribute("id","beneathelement");
		this.#beneathElement.setAttribute("style","z-index: 4; opacity:0.6; color:gainsboro; float: left; top:50%; font-family: 'Press Start 2P'");
		this.#beneathElement.innerHTML = this.#beneathSentence;
		container.appendChild(this.#beneathElement);
		this.#topElement = document.createElement("div");
		this.#topElement.setAttribute("id","topelement");
		this.#topElement.setAttribute("style","z-index: 4; float: left; position:fixed; color:#2fdb75; font-family: 'Press Start 2P'");
		container.appendChild(this.#topElement);

		minigameDiv.appendChild(containerBig);
		containerBig.appendChild(container);

		this.#underscoreInterval = setInterval(function () {
			let topElement = document.getElementById("topelement");
			if (topElement.innerHTML.charAt(topElement.innerHTML.length-1) == "_") {
				topElement.innerHTML = topElement.innerHTML.slice(0,topElement.innerHTML.length-1)
			} else {
				topElement.innerHTML += "_"
			}
		},500)

		this.#timerElement = document.createElement("div");
		this.#timerElement.setAttribute("style","font-family: 'Press Start 2P'; color: #2fdb75; left: 0%; top: 0%; padding:1em; position:absolute; font-size:2em;")
		this.#timerElement.setAttribute("id","timerelement");
		minigameDiv.appendChild(this.#timerElement);

		this.#pressEnterDisplay = document.createElement("div");
		this.#pressEnterDisplay.setAttribute("id","pressenterdisplay");
		this.#pressEnterDisplay.setAttribute("style","display:none; font-family: 'Press Start 2P'; color:gainsboro; left: 50%; top:50%; position:absolute; transform:translateX(-50%); padding:1em; font-size:2em;")
		this.#pressEnterDisplay.innerHTML = "PRESS ENTER";
		minigameDiv.appendChild(this.#pressEnterDisplay);

		if (this.#isMobile) {
			let button;
			button = document.createElement("button");
			button.setAttribute("style","color:yellow; display:block; font-size:2em; font-family: 'Press Start 2P'; background-color: #660099; left:0%; bottom:0%; width:25%; padding:0.5em; position:absolute;");
			button.setAttribute("id","button1");
			button.setAttribute("class","typerButton");
			button.innerHTML = "1";
			containerBig.appendChild(button);
			button = document.createElement("button");
			button.setAttribute("id","button2");
			button.setAttribute("class","typerButton");
			button.setAttribute("style","color:yellow; display:block; font-size:2em; font-family: 'Press Start 2P'; background-color: #660099; left:25%; bottom:0%; width:25%; padding:0.5em; position:absolute;");
			button.innerHTML = "2";
			containerBig.appendChild(button)
			button = document.createElement("button");
			button.setAttribute("id","button3");
			button.setAttribute("class","typerButton");
			button.setAttribute("style","color:yellow; display:block; font-size:2em; font-family: 'Press Start 2P'; background-color: #660099; left:50%; bottom:0%; width:25%; padding:0.5em; position:absolute;");
			button.innerHTML = "3";
			containerBig.appendChild(button)
			button = document.createElement("button");
			button.setAttribute("id","button4");
			button.setAttribute("class","typerButton");
			button.setAttribute("style","color:yellow; display:block; font-size:2em; font-family: 'Press Start 2P'; background-color: #660099; left:75%; bottom:0%; width:25%; padding:0.5em; position:absolute;");
			button.innerHTML = "4";
			containerBig.appendChild(button)

			this.makeRandomButtons();
		}

		this.#particleInterval = setInterval(this.updateParticles(), 500);





		// Waits for resources to load
		// while (loaded < toLoad) {
  //     let wait = new Promise(function(resolve, reject) {
  //       setTimeout(resolve, 100);
  //     });
  //     await wait;
  //   }


    // Resizes before the game starts
		// this.resizeHandler();


		// Any other thing that need to be done before the game starts
		// e.g. set starting position, random generation
		// NOTE - example js randint (0-10):
		// let startPos = 0;
		// let endPos = 10;
		// let randint = Math.floor(Math.random() * endPos) + startPos;


		// Draws the first frame before mainloop starts (if the game uses mainloop)
		// this.draw();


		// A mainloop-based game probably needs a boolean to terminate the loop on game end
		this.#gameOver = false;


		// Starts the background music
		// Move to before the waiting loop if you want music to play on the loading screen
		// However, it is probably better here for consistency with other minigames/the main game
		// this.#backgroundMusic.play();

		loadingDiv.style.display = 'none';
		


		// Optional artificial loading time
		// Only needed if you need mainloop to run in the background for a bit before the game starts
		// toLoad += 100;
		// for (var i = 0; i < 100; i++) {
		// 	let wait = new Promise(function(resolve, reject) {
  //       setTimeout(resolve, 10);
  //     });
  //     await wait;
  //     load();
		// }


		// Removes the loading screen
		


		// Opens the loading screen and sets up listeners to close the loading screen
		// on any key press or a touch/click on the loading screen
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
		// Starts main loop (a non-mainloop game might only need a loop to check win/loss conditions)
		this.mainloop();
	}



	// Empty mainloop (if needed)
	// Specific examples of a full mainloop in Game.js and frogger.js
	// This method must be async for the waiting stuff to work
	async mainloop() {
		while (!this.#gameOver) {
      let loopPromise = new Promise(function(resolve, reject) {
        setTimeout(resolve, 1000/30);
      });
      let preTime = new Date().getTime();

      if (!this.#isPaused) {
      	this.updateParticles();
				if (this.#topSentence.length == this.#beneathSentence.length) {
					if (this.#isMobile) {
						this.#pressEnterDisplay.innerHTML = "PRESS ANYWHERE!"
					}
					this.#lastChar = true;
					this.#pressEnterDisplay.style.display = "block";
				}
				if (this.#time < 0) {
					this.lose();
				} else {
					this.#timerElement.innerHTML = Math.floor(this.#time/1000);
					this.#time -= this.#deltaTime;
				}
			}
			

			await loopPromise;
		  let postTime = new Date().getTime();
		  this.#deltaTime = (postTime - preTime);
		  // console.log(1/this.#deltaTime);
		}
	}



	// If the game uses a html canvas, movement will need a loop and a draw method
	draw() {
    // clears the canvas
    this.#canvasContext.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

		// draw whatever need drawing. E.g.:
		this.#canvasContext.drawImage("<IMAGE>","<TOP LEFT X>","<TOP LEFT Y>","<WIDTH>","<HEIGHT>");
	}



	// Add to these 2 methods anything else you want to happen before the minigame closes
	// e.g. frogger has a short loop to move the cars a bit further
	// This should be called when the win conditions are met
	win() {
		// Only needed if there is a mainloop to terminate
		this.#gameOver = true;
		// this.#backgroundMusic.pause();
		let victoryDialog = "WOW! You really can program!";
		for (let stat in this.#victoryStats) {
			victoryDialog += "<br>" + stat.charAt(0).toUpperCase() + stat.slice(1);
			if (this.#victoryStats[stat] >= 0) {
				victoryDialog += ' +';
			}
			victoryDialog += this.#victoryStats[stat] + ".";
		}
		let tempInteraction	= new Interaction(NaN,
																					1,
																					victoryDialog,
																					"",
																					this.#victoryStats,
																					[],
																					[],
																					[]);

		// Other stuff before the game closes
		clearInterval(this.#underscoreInterval);
		Game.setCurrentInteraction(tempInteraction);
		Game.displayDialog();
		Game.endMinigame();
	}



	// Same as win, but for losing - duh
	// This should be called when the losing conditions are met
	lose(car) {
		// Only needed if there is a mainloop to terminate
		this.#gameOver = true;
		// this.#backgroundMusic.pause();
		let lossDialog = "YOU LOSE!!<br> Timer Hit 0!";
		for (let stat in this.#lossStats) {
			lossDialog += "<br>" + stat.charAt(0).toUpperCase() + stat.slice(1);
			if (this.#lossStats[stat] >= 0) {
				lossDialog += ' +';
			}
			lossDialog += this.#lossStats[stat] + ".";
		}
		let tempInteraction	= new Interaction(NaN,
																					1,
																					lossDialog,
																					"",
																					this.#lossStats,
																					[],
																					[],
																					[]);

		// Other stuff before the game closes
		clearInterval(this.#underscoreInterval);
		Game.setCurrentInteraction(tempInteraction);
		Game.displayDialog();
		Game.endMinigame();
	}

	makeParticles(character) {
		let rect = this.#topElement.getBoundingClientRect();
		let position;
		let particle;
		let fontsize
		let x;
		let container = document.getElementById(this.#divId);
		let containerRect = container.getBoundingClientRect();
		if (this.#previousWidth == rect.width) {
			x = this.#currentChar*(rect.width/this.#charsPerLine);
			this.#currentChar++;
			if (this.#currentChar == this.#charsPerLine) {
				this.#currentChar = 0;
			}
		} else {
			x = rect.right-containerRect.x
			this.#charsPerLine++;
			this.#previousWidth = rect.width;
		}
		for (let i=0; i<10; i++) {
			position = {"x": x, "y": rect.top + Math.floor(Math.random()*rect.height) - containerRect.y};
			fontsize = String(1);

			particle = document.createElement("div");
			particle.setAttribute("class","particle")
			particle.setAttribute("style","color:lightgray; position:absolute; font-size:"+fontsize+"em; left:"+String(position.x)+"px; top:"+String(position.y)+"px; font-family: 'Press Start 2P'; opacity:"+String(Math.random())+";")
			particle.innerHTML = character;
			let speed = 1+Math.random()*4
			let angle = -Math.random()*6*Math.PI/8 - Math.PI/8
			this.#particles.push({"element": particle, "position":position, "direction": {"x":Math.sin(angle)*speed,"y":(Math.cos(angle)*speed)}})
			container.appendChild(particle);
		}
	}

	updateParticles() {
		for (let particleIndex=0; particleIndex<this.#particles.length; particleIndex++) {
			this.#particles[particleIndex].position.x = this.#particles[particleIndex].position.x+this.#particles[particleIndex].direction.x;
			this.#particles[particleIndex].position.y = this.#particles[particleIndex].position.y+this.#particles[particleIndex].direction.y;
			this.#particles[particleIndex].element.style.left = String(Math.floor(this.#particles[particleIndex].position.x)) +"px";
			this.#particles[particleIndex].element.style.top = String(Math.floor(this.#particles[particleIndex].position.y)) +"px";
			this.#particles[particleIndex].element.style.opacity = this.#particles[particleIndex].element.style.opacity - 0.025; 
			if (this.#particles[particleIndex].element.style.opacity < 0) {
				this.#particles[particleIndex].element.remove()
				this.#particles.splice(particleIndex,1);
				particleIndex--;
			}
		}
	}



	// If you can make a game without a single input listener then feel free to remove this method
	// This method must be async for the waiting stuff to work
	async startInputListeners() {
		// Slight delay (1 tenth of a second) to avoid conflicts when closing tutorial screen
		let wait = new Promise(function(resolve, reject) {
      setTimeout(resolve, 100);
    });
    await wait;

    let div = document.getElementById(this.#divId);

    // All input listeners go here
    // NOTE - if any listeners are assigned outside the minigame div (i.e. document or window),
    // then they need to be added to this.#eventListeners so they can be removed when the minigame ends
    // this.#eventListeners is a 2D array with the format [element, event, function]
    // e.g.:
    this.#eventListeners[0] = [document, 'keydown', event => this.keyDownHandler(event)];
		document.addEventListener('keydown', this.#eventListeners[0][2]);

		// If the event listener is added to the minigame div or a child node of the div,
		// then it doesn't need to be stored as the div is just discarded when the minigame ends
    div.addEventListener('touchstart', event => this.touchHandler(event));

    // Event listeners you'll probably want:
    // keydown, keyup, touchstart, touchmove, touchend, touchcancel (can use same handler as touch end)
    // Event listeners you might want:
    // mousedown, mousemove, mouseup
    // Event listeners you'll probably NEED:
    // resize (might not need it if not using a canvas)
    // this.#eventListeners[1] = [window, 'resize', event => this.resizeHandler()];
    // window.addEventListener('resize', this.#eventListeners[1][2]);
	}



	// This method must stay
	// If no event listeners are used (or none on document/window), this method can just be left empty
	removeInputListeners() {
		for (let listener of this.#eventListeners) {
			listener[0].removeEventListener(listener[1], listener[2]);
		}
	}


	keyDownHandler (event) {
		if (event.key == "Shift" || event.key == "Alt" || event.key == "Control") {
			return false;
		}
		if (event.code == "Space") {
			event.preventDefault();
		}
		if (this.#lastChar && event.code=="Enter") {
				this.win()
				return
			}
		if (event.key == this.#beneathSentence.charAt(this.#topSentence.length)) {
			this.#topSentence += event.key;
			this.#topElement.innerHTML = this.#topSentence + "_";
			if (this.#isMobile) {
				this.makeRandomButtons();
			}
			if (event.code == "Space") {
				this.makeParticles("|")
			} else {
				this.makeParticles(event.key)
			}
			if (this.#error) {
				this.#beneathElement.style.color = "gainsboro";
				clearInterval(this.#errorTimeout)
			}
		} else {
			
			this.#beneathElement.style.color = "red";
			if (!this.#error) {
				this.#error = true;
				this.#errorTimeout = setTimeout(function () {
					document.getElementById("beneathelement").style.color = "gainsboro";
				},750);
			} else {
				clearInterval(this.#errorTimeout)
					this.#errorTimeout = setTimeout(function () {
					document.getElementById("beneathelement").style.color = "gainsboro";
				},750);


			}
			
		}
	}

 	touchHandler(event) {
    for (let touch of event.touches) {
    	let element = document.elementFromPoint(touch.clientX, touch.clientY);
    	if (this.#lastChar) {
    		this.win();
    	}
    	if (element.className == "typerButton") {
    		if (element.innerHTML == "_") {
    			this.keyDownHandler({"key": " ", "code": " "})
    		} else{
    			this.keyDownHandler({"key": element.innerHTML, "code": element.innerHTML})
    		}
    	}
    }
  }

  makeRandomButtons() {
  	let buttonList = [document.getElementById("button1"),document.getElementById("button2"),document.getElementById("button3"),document.getElementById("button4")];

  	let randomIndex = Math.floor(Math.random()*4)
  	buttonList[randomIndex].innerHTML = (this.#beneathSentence.charAt(this.#topSentence.length)==" ") ? "_" : this.#beneathSentence.charAt(this.#topSentence.length);
  	buttonList.splice(randomIndex,1);
  	for (let button of buttonList) {
  		randomIndex = Math.floor(this.#beneathSentence.length * Math.random());
  		button.innerHTML = (this.#beneathSentence.slice(randomIndex-1,randomIndex)==" ") ? "_" : this.#beneathSentence.slice(randomIndex-1,randomIndex);
  	}
  }

	

	// Event handler functions
	// E.g.:
  resizeHandler() {
  	// Examples of tile based resizing can be found in Game and frogger
  }
}




// If the game needs any other classes, they can either go here or in seperate files
// If they are in seperate files, they will need loading in startGame()
// No matter where they are, make sure there are no conflicts with the class names already used
// in both the main game and other minigames
// Probably a good idea to put <MINIGAME> before the name of each class



// Slightly unrelated, but for any game with a timer / time limit,
// take a look at Website/timerTest.html for an asynchronous analogue timer