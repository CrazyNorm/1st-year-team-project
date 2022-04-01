// bartender game - matching under a time limit
// drag drinks to correct customers
// 15 correct is win, 3 incorrect or timed out is loss

class BartenderGame {
	// Attribute declaration
	#divId;
	#isMobile;
	#victoryStats;
	#lossStats;
	#eventListeners;
	#backgroundMusic;
	#isPaused;

	#customers;
	#dummyDrinks;
	#complaintMarkers;
	#complaints;
	#servedCounter;
	#served;
	#currentDrink;
	#onlyTouch; // only registers one touch at a time


	constructor(divId, isMobile, victory, loss) {
		this.#divId = divId;
		this.#isMobile = isMobile;
		this.#victoryStats = victory;
		this.#lossStats = loss;
		this.#eventListeners = [];
		this.#complaints = 0;
		this.#served = 0;
	}


	setPaused(isPaused) {
		this.#isPaused = isPaused;
		if (!this.#isPaused) {
			for (let customer of this.#customers) {
				if (customer.getStatus() == 'active') {
					customer.startTimer();
				}
				customer.setCanSpawn(true);
			}
		}
		else {
			for (let customer of this.#customers) {
				if (customer.getStatus() == 'active') {
					customer.stopTimer();
				}
				customer.setCanSpawn(false);
			}
		}
	}



	async startGame() {
		let minigameDiv = document.getElementById(this.#divId);
    minigameDiv.style.margin = "0";
    minigameDiv.style.overflow = 'hidden';
    minigameDiv.style.backgroundColor = 'black';


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


		let maxLoad = 11;
    let toLoad = 0;
    let loaded = 0;
    function load() {
      loaded ++;
      fillBar.style.width = String(loaded / maxLoad * 100) + "%";
    }


   
    let tutorialDiv = document.createElement('div');
		tutorialDiv.setAttribute('style', 'position:absolute; height:90%; width:90%; top:50%; left:50%; transform:translate(-50%,-50%); background:white; border: solid yellow 5px; z-index:1; display:flex; justify-content:center; text-align:center; display:none;');
		minigameDiv.appendChild(tutorialDiv);
		let titleLabel = document.createElement('h1');
		titleLabel.appendChild(document.createTextNode("Bartender"));
		titleLabel.setAttribute('style', 'width:100%; font-size:10vmin; color:#660099; font-family:"Press Start 2P", cursive; margin-bottom:5%;')
		tutorialDiv.appendChild(titleLabel);
		toLoad ++;
		let tutorialImg = document.createElement('img');
		tutorialImg.onload = load;
		if (!this.#isMobile) {
			tutorialImg.setAttribute('src', 'resources/imgs/minigames/bartender/tutorial.png');
		} else {
			tutorialImg.setAttribute('src', 'resources/imgs/minigames/bartender/tutorialMobile.png');
		}
		tutorialImg.setAttribute('style', 'position:absolute; left:25%; top:50%; transform:translate(-50%,-50%); max-width:50%; max-height:60%;');
		tutorialDiv.appendChild(tutorialImg);
		let instructionDiv = document.createElement('div');
		instructionDiv.setAttribute('style', 'position:absolute; width:50%; height:60%; right:25%; top:50%; transform:translate(+50%,-50%); font-size:3vmin; color:#660099; font-family:"Press Start 2P", cursive; display:flex; justify-content:space-evenly; text-align:center; flex-direction:column;')
		tutorialDiv.appendChild(instructionDiv);
		let instructionLabel1 = document.createElement('p');
		if (this.#isMobile) {
			instructionLabel1.appendChild(document.createTextNode("Drag the right drink to each customer before their timer runs out."));
		} else {
			instructionLabel1.appendChild(document.createTextNode("Click and drag the right drink to each customer before their timer runs out."));
		}
		instructionDiv.appendChild(instructionLabel1);
		let instructionLabel2 = document.createElement('p');
		instructionLabel2.appendChild(document.createTextNode("Serve 15 customers to finish your shift, but don't get too many complaints!"));
		instructionDiv.appendChild(instructionLabel2);
		let startLabel = document.createElement('p');
		if (this.#isMobile) {
			startLabel.appendChild(document.createTextNode("Tap anywhere to start"));
		} else {
			startLabel.appendChild(document.createTextNode("Press any key to start"));
		}
		startLabel.setAttribute('style', 'position:absolute; bottom:0; width:100%; font-size:5vmin; color:#bb33ff; font-family:"Press Start 2P", cursive; text-align:center;')
		tutorialDiv.appendChild(startLabel);


		// Loads images to be used in the minigame
		let background = new Image();
		toLoad ++;
		background.onload = load;
		background.src = "resources/imgs/minigames/bartender/background.png";
		// loading sprites from an array - assumes all sprites are in the minigame's img folder
		let spritesToLoad = ['drink1','drink2','drink3','drink4','drink5'];
		let drinkSprites = {};
		for (let type of spritesToLoad) {
			drinkSprites[type] = new Image();
      toLoad ++;
      drinkSprites[type].onload = load;
      drinkSprites[type].src = "resources/imgs/minigames/bartender/" + type + ".png";
		}
		let customerSprite = new Image();
    toLoad ++;
    customerSprite.onload = load;
    customerSprite.src = "resources/imgs/minigames/bartender/silhouette.png";
    let complaintSprite = new Image();
    toLoad ++;
    complaintSprite.onload = load;
    complaintSprite.src = "resources/imgs/minigames/bartender/complaint.png";
    let servedSprite = new Image();
    toLoad ++;
    servedSprite.onload = load;
    servedSprite.src = "resources/imgs/minigames/bartender/served.png";


		// Loading audio - background music
		this.#backgroundMusic = new Audio();
    toLoad ++;
    this.#backgroundMusic.oncanplaythrough = load;
    this.#backgroundMusic.src = "resources/audio/minigames/bartender/background.mp3"; 
    this.#backgroundMusic.controls = false;
    this.#backgroundMusic.loop = true;


		// Create html elements
		let frameDiv = document.createElement('div');
		frameDiv.setAttribute('id','frame');
		frameDiv.setAttribute('style','position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:88vmin; height:88vmin;');
		minigameDiv.appendChild(frameDiv);
		// background
		background.setAttribute('style','position:absolute; z-index:0; top:0; left:0; width:100%; height:100%;');
		// note - 88vmin because the image is 11x11 tiles - 1vmin = 1px on image
		frameDiv.appendChild(background);
		this.#customers = [];
		// first customer
		let cust1 = new Image();
		cust1.src = customerSprite.src;
		cust1.setAttribute('style','position:absolute; z-index:0; left:0; top:24vmin; width:24vmin; height:24vmin');
		frameDiv.appendChild(cust1);
		let timer1 = document.createElement('div');
		timer1.setAttribute('style','position:absolute; z-index:1; width:10.5vmin; height:10.5vmin; top:25vmin; left:7vmin; border-radius:50%;');
		frameDiv.appendChild(timer1);
		let targetDrinks1 = {};
		for (let drink in drinkSprites) {
			let tempSprite = new Image();
			tempSprite.src = drinkSprites[drink].src;
			tempSprite.setAttribute('style','position:absolute; z-index:1; top:40vmin; left:8vmin; width:8vmin; height:8vmin; display:none;');
			frameDiv.appendChild(tempSprite);
			targetDrinks1[drink] = tempSprite;
		}
		let hitbox1 = document.createElement('div');
		hitbox1.setAttribute('id','hit1');
		hitbox1.setAttribute('style','position:absolute; z-index:3; left:0; top:24vmin; width:24vmin; height:24vmin');
		frameDiv.appendChild(hitbox1);
		this.#customers[0] = new BartenderCustomer(cust1, timer1, targetDrinks1, hitbox1);
		// second customer
		let cust2 = new Image();
		cust2.src = customerSprite.src;
		cust2.setAttribute('style','position:absolute; z-index:0; left:32vmin; top:24vmin; width:24vmin; height:24vmin');
		frameDiv.appendChild(cust2);
		let timer2 = document.createElement('div');
		timer2.setAttribute('style','position:absolute; z-index:1; width:10.5vmin; height:10.5vmin; top:25vmin; left:39vmin; border-radius:50%;');
		frameDiv.appendChild(timer2);
		let targetDrinks2 = {};
		for (let drink in drinkSprites) {
			let tempSprite = new Image();
			tempSprite.src = drinkSprites[drink].src;
			tempSprite.setAttribute('style','position:absolute; z-index:1; top:40vmin; left:40vmin; width:8vmin; height:8vmin; display:none;');
			frameDiv.appendChild(tempSprite);
			targetDrinks2[drink] = tempSprite;
		}
		let hitbox2 = document.createElement('div');
		hitbox2.setAttribute('id','hit2');
		hitbox2.setAttribute('style','position:absolute; z-index:3; left:32vmin; top:24vmin; width:24vmin; height:24vmin');
		frameDiv.appendChild(hitbox2);		
		this.#customers[1] = new BartenderCustomer(cust2, timer2, targetDrinks2, hitbox2);
		// third customer
		let cust3 = new Image();
		cust3.src = customerSprite.src;
		cust3.setAttribute('style','position:absolute; z-index:0; left:64vmin; top:24vmin; width:24vmin; height:24vmin');
		frameDiv.appendChild(cust3);
		let timer3 = document.createElement('div');
		timer3.setAttribute('style','position:absolute; z-index:1; width:10.5vmin; height:10.5vmin; top:25vmin; left:71vmin; border-radius:50%;');
		frameDiv.appendChild(timer3);
		let targetDrinks3 = {};
		for (let drink in drinkSprites) {
			let tempSprite = new Image();
			tempSprite.src = drinkSprites[drink].src;
			tempSprite.setAttribute('style','position:absolute; z-index:1; top:40vmin; left:72vmin; width:8vmin; height:8vmin; display:none;');
			frameDiv.appendChild(tempSprite);
			targetDrinks3[drink] = tempSprite;
		}
		let hitbox3 = document.createElement('div');
		hitbox3.setAttribute('id','hit3');
		hitbox3.setAttribute('style','position:absolute; z-index:3; left:64vmin; top:24vmin; width:24vmin; height:24vmin');
		frameDiv.appendChild(hitbox3);
		this.#customers[2] = new BartenderCustomer(cust3, timer3, targetDrinks3, hitbox3);
		// drinks
		this.#dummyDrinks = {};
		for (let drink in drinkSprites) {
			let tempSprite = new Image();
			tempSprite.setAttribute('id', drink);
			tempSprite.className = 'drinks';
			tempSprite.src = drinkSprites[drink].src;
			let drinkNo = parseInt(drink.substring(drink.length-1));
			tempSprite.setAttribute('style','position:absolute; z-index:1; left:'+(16*drinkNo-8)+'vmin; bottom:16vmin; width:8vmin; height:8vmin;');
			frameDiv.appendChild(tempSprite);
			let tempSprite2 = new Image();
			tempSprite2.src = drinkSprites[drink].src;
			tempSprite2.setAttribute('style','position:absolute; z-index:2; width:8vmin; height:8vmin; top:-10%; left:-10%; transform:translate(-50%,-50%); display:none;');
			this.#dummyDrinks[drink] = tempSprite2;
			frameDiv.appendChild(tempSprite2);
		}
		// complaints markers
		this.#complaintMarkers = [];
		this.#complaintMarkers[0] = new Image();
		this.#complaintMarkers[0].src = complaintSprite.src;
		this.#complaintMarkers[0].setAttribute('style','position:absolute; width:8vmin; height:8vmin; top:8vmin; left:8vmin; display:none;');
		frameDiv.appendChild(this.#complaintMarkers[0]);
		this.#complaintMarkers[1] = new Image();
		this.#complaintMarkers[1].src = complaintSprite.src;
		this.#complaintMarkers[1].setAttribute('style','position:absolute; width:8vmin; height:8vmin; top:8vmin; left:16vmin; display:none;');
		frameDiv.appendChild(this.#complaintMarkers[1]);
		this.#complaintMarkers[2] = new Image();
		this.#complaintMarkers[2].src = complaintSprite.src;
		this.#complaintMarkers[2].setAttribute('style','position:absolute; width:8vmin; height:8vmin; top:8vmin; left:24vmin; display:none;');
		frameDiv.appendChild(this.#complaintMarkers[2]);
		// served counter
		servedSprite.setAttribute('style','position:absolute; width:8vmin; height:8vmin; top:8vmin; right:16vmin;');
		frameDiv.appendChild(servedSprite);
		this.#servedCounter = document.createElement('p');
		this.#servedCounter.innerHTML = this.#served;
		this.#servedCounter.setAttribute('style','position:absolute; width:8vmin; height:8vmin; top:8vmin; right:8vmin; line-height:8vmin; margin:0; font-size:5vmin; color:green; font-family:"Press Start 2P", cursive; text-align:center;');
		frameDiv.appendChild(this.#servedCounter);


		// Waits for resources to load
		while (loaded < toLoad) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }


		// Starts the background music
		this.#backgroundMusic.play();


		// Removes the loading screen
		loadingDiv.style.display = 'none';


		// starts checking the customer statuses
		this.customerPolling();


		// Opens the tutorial screen and sets up listeners to close the tutorial screen
		// on any key press or a touch/click on the tutorial screen
		this.setPaused(true);
		tutorialDiv.style.display = 'block';
		let closeTutorial = () => {
			tutorialDiv.style.display="none";
			this.setPaused(false);
			this.startInputListeners();
			document.removeEventListener('keydown', closeTutorial);
		}

		tutorialDiv.ontouchstart = closeTutorial;
		tutorialDiv.onmousedown = closeTutorial;
		document.addEventListener('keydown', closeTutorial);
	}



	// checks the status of each customer on a delay
	customerPolling() {
		let checkStatus = () => {
			for (let customer of this.#customers) {
				// updates the served counter and checks win conditions
				if (customer.getStatus() == 'success') {
					this.#served ++;
					this.#servedCounter.innerHTML = this.#served;
					if (this.#served >= 15) {
						this.setPaused(true);
						this.win();
						clearInterval(polling);
						break;
					}
					else {
						customer.deactivate();
					}
				}
				// updates the complait markers and checks lose conditions
				else if (customer.getStatus() == 'failure') {
					this.#complaints ++;
					console.log(this.#complaints);
					for (let i = 0; i < this.#complaints; i ++) {
						this.#complaintMarkers[i].style.display = 'block';
					}
					if (this.#complaints >= 3) {
						this.setPaused(true);
						this.lose();
						clearInterval(polling);
						break;
					}
					else {
						customer.deactivate();
					}
				}
			}
		}

		let polling = setInterval(checkStatus, 100);
	}



	// This should be called when the win conditions are met
	async win() {
		for (let customer of this.#customers) {
			customer.deactivate();
		}
		let wait = new Promise(function(resolve, reject) {
      setTimeout(resolve, 500);
    });
    await wait;
		this.#backgroundMusic.pause();
		let victoryDialog = "Your shift went well!";
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
		let tempInteraction	= new Interaction(NaN,
																					1,
																					victoryDialog,
																					"",
																					this.#victoryStats,
																					[],
																					[],
																					[]);

		Game.setCurrentInteraction(tempInteraction);
		Game.displayDialog();
		Game.endMinigame();
	}



	// This should be called when the losing conditions are met
	async lose() {
		for (let customer of this.#customers) {
			customer.deactivate();
		}
		let wait = new Promise(function(resolve, reject) {
      setTimeout(resolve, 500);
    });
    await wait;
		this.#backgroundMusic.pause();
		let lossDialog = "You got too many complaints!";
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
		let tempInteraction	= new Interaction(NaN,
																					1,
																					lossDialog,
																					"",
																					this.#lossStats,
																					[],
																					[],
																					[]);

		Game.setCurrentInteraction(tempInteraction);
		Game.displayDialog();
		Game.endMinigame();
	}



	async startInputListeners() {
		// Slight delay (1 tenth of a second) to avoid conflicts when closing tutorial screen
		let wait = new Promise(function(resolve, reject) {
      setTimeout(resolve, 100);
    });
    await wait;

    let div = document.getElementById(this.#divId);
    div.addEventListener('mousedown', event => this.mousedownHandler(event));
    div.addEventListener('mousemove', event => this.mousemoveHandler(event));
    div.addEventListener('mouseup', event => this.mouseupHandler(event));
    div.addEventListener('touchstart', event => this.touchstartHandler(event));
    div.addEventListener('touchmove', event => this.touchmoveHandler(event));
    div.addEventListener('touchend', event => this.touchendHandler(event));
    div.addEventListener('touchcancel', event => this.touchendHandler(event));
	}



	// This method must stay
	// If no event listeners are used (or none on document/window), this method can just be left empty
	removeInputListeners() {}

	

	// Event handler functions
	mousedownHandler(event) {
		if (!this.#isPaused) {
			event.preventDefault();
			let elem = document.elementFromPoint(event.clientX, event.clientY);
			// does nothing if the click wasn't on a drink
			if (elem.className == 'drinks') {
				// hide the clicked drink and move the appropriate dummy drink to the pointer
				this.#currentDrink = elem.id;
				elem.style.display = 'none';
				this.#dummyDrinks[this.#currentDrink].style.display = 'block';

				let offset = document.getElementById('frame').getBoundingClientRect();
				this.#dummyDrinks[this.#currentDrink].style.top = Math.floor(event.clientY - offset.top) + 'px';
				this.#dummyDrinks[this.#currentDrink].style.left = Math.floor(event.clientX - offset.left) + 'px';
			}
		}
	}
	mousemoveHandler(event) {
		if (!this.#isPaused) {
			event.preventDefault();
			// if there is a held drink, moves the dummy drink to stay at the mouse pointer
			if (this.#currentDrink != undefined) {
				let offset = document.getElementById('frame').getBoundingClientRect();
				this.#dummyDrinks[this.#currentDrink].style.top = Math.floor(event.clientY - offset.top) + 'px';
				this.#dummyDrinks[this.#currentDrink].style.left = Math.floor(event.clientX - offset.left) + 'px';
			}
		}
	}
	mouseupHandler(event) {
		if (!this.#isPaused) {
			if (this.#currentDrink != undefined) {
				// hide the dummy drink and re-show the drink in the original position
				this.#dummyDrinks[this.#currentDrink].style.display = 'none';
				this.#dummyDrinks[this.#currentDrink].style.top = '-10%';
				this.#dummyDrinks[this.#currentDrink].style.left = -'10%';
				document.getElementById(this.#currentDrink).style.display = 'block';

				// checks if the drink was dropped on a customer
				let target = document.elementFromPoint(event.clientX, event.clientY);
				if (target.id.substring(0,target.id.length-1) == 'hit') {
					let customer = this.#customers[target.id.substring(target.id.length-1)-1];

					// if the drink matches the customer's target, run succeed, else run fail
					if (customer.getTargetDrink() == this.#currentDrink && customer.getStatus() == 'active') {
						customer.succeed();
					}
					else if (customer.getStatus() == 'active') {
						customer.fail();
					}
				}
				this.#currentDrink = undefined;
			}
		}

	}
	touchstartHandler(event) {
		if (!this.#isPaused) {
			event.preventDefault();
			if (this.#onlyTouch == undefined) {
				this.#onlyTouch = event.targetTouches[0];
				let elem = document.elementFromPoint(this.#onlyTouch.clientX, this.#onlyTouch.clientY);
				// does nothing if the click wasn't on a drink
				if (elem.className == 'drinks') {
					// hide the clicked drink and move the appropriate dummy drink to the pointer
					this.#currentDrink = elem.id;
					elem.style.display = 'none';
					this.#dummyDrinks[this.#currentDrink].style.display = 'block';

					let offset = document.getElementById('frame').getBoundingClientRect();
					this.#dummyDrinks[this.#currentDrink].style.top = Math.floor(this.#onlyTouch.clientY - offset.top) + 'px';
					this.#dummyDrinks[this.#currentDrink].style.left = Math.floor(this.#onlyTouch.clientX - offset.left) + 'px';
				}
			}
		}
	}
	touchmoveHandler(event) {
		if (!this.#isPaused) {
			event.preventDefault();
			for (let touch of event.changedTouches) {
				// if there is a held drink, moves the dummy drink to stay at the mouse pointer
				if (this.#currentDrink != undefined && touch.id == this.#onlyTouch.id) {
					this.#onlyTouch = touch;
					let offset = document.getElementById('frame').getBoundingClientRect();
					this.#dummyDrinks[this.#currentDrink].style.top = Math.floor(this.#onlyTouch.clientY - offset.top) + 'px';
					this.#dummyDrinks[this.#currentDrink].style.left = Math.floor(this.#onlyTouch.clientX - offset.left) + 'px';
				}
			}
		}
	}
	touchendHandler(event) {
		if (!this.#isPaused) {
			for (let touch of event.changedTouches) {
				if (touch.id == this.#onlyTouch.id) {
					if (this.#currentDrink != undefined) {
						// hide the dummy drink and re-show the drink in the original position
						this.#dummyDrinks[this.#currentDrink].style.display = 'none';
						this.#dummyDrinks[this.#currentDrink].style.top = '-10%';
						this.#dummyDrinks[this.#currentDrink].style.left = -'10%';
						document.getElementById(this.#currentDrink).style.display = 'block';

						// checks if the drink was dropped on a customer
						let target = document.elementFromPoint(this.#onlyTouch.clientX, this.#onlyTouch.clientY);
						if (target.id.substring(0,target.id.length-1) == 'hit') {
							let customer = this.#customers[target.id.substring(target.id.length-1)-1];

							// if the drink matches the customer's target, run succeed, else run fail
							if (customer.getTargetDrink() == this.#currentDrink && customer.getStatus() == 'active') {
								customer.succeed();
							}
							else if (customer.getStatus() == 'active') {
								customer.fail();
							}
						}
						this.#currentDrink = undefined;
					}
					this.#onlyTouch = undefined;
				}
			}
		}
	}
}




class BartenderCustomer {
	#customerElement;
	#timerElement;
	#drinkElements;
	#hitbox;
	#targetDrink;
	#timer;
	#timerColour;
	#timeLimit;
	#angle;
	#status; // 'success', 'failure' ,'active', 'inactive'
	#canSpawn; // stops new customers while paused


	constructor(customerElement, timerElement, drinkElements, hitbox) {
		this.#customerElement = customerElement;
		this.#timerElement = timerElement;
		this.#drinkElements = drinkElements;
		this.#hitbox = hitbox;
		this.#timeLimit = 10;
		this.#canSpawn = true;;
		this.newCustomer();
	}


	getTargetDrink() {
		return this.#targetDrink;
	}
	getStatus() {
		return this.#status;
	}
	setCanSpawn(canSpawn) {
		this.#canSpawn = canSpawn;
	}


	newCustomer() {
		// if paused, tries again in 100ms
		if (!this.#canSpawn) {
			setTimeout(() => this.newCustomer(), 100);
		}
		else {
			this.#angle = 0;
			this.#status = 'active';
			this.#timerColour = 'rgba(201,197,201,0.95)';

			// pick a random drink
			let drinks = Object.keys(this.#drinkElements);
			this.#targetDrink = drinks[Math.floor(Math.random() * drinks.length)];

			// show the customer
			this.#drinkElements[this.#targetDrink].style.display = 'block';
			this.#customerElement.style.display = 'block';
			this.#timerElement.style.display = 'block';

			this.startTimer();
		}
	}


	// sets the status to 'inactive' then creates a new customer after a delay
	deactivate() {
		this.#status = 'inactive';
		// fades the customer out
		let opacity = 100;
		let fade = setInterval(() => {
			opacity -= 1
			this.#drinkElements[this.#targetDrink].style.opacity = opacity / 100;
			this.#customerElement.style.opacity = opacity / 100;
			this.#timerElement.style.opacity = opacity / 100;

			if (opacity <= 0) {
				this.#drinkElements[this.#targetDrink].style.opacity = 1;
				this.#customerElement.style.opacity = 1;
				this.#timerElement.style.opacity = 1;
				this.#drinkElements[this.#targetDrink].style.display = 'none';
				this.#customerElement.style.display = 'none';
				this.#timerElement.style.display = 'none';

				clearInterval(fade);
				setTimeout(() => this.newCustomer(), 1000);
			}
		}, 5);
	}


	// redraws the timer
	updateTimer() {
			let circleColour;
			let gradientColour;
			let degModifier;
			let gradientDeg;
			if (this.#angle < 180) {
				circleColour = this.#timerColour;
				gradientColour = 'white'
				degModifier = "-";
				gradientDeg = this.#angle + 90;
			}
			else {
				circleColour = 'white';
				gradientColour = this.#timerColour;
				degModifier = "";
				gradientDeg = this.#angle - 90;
			}

			this.#timerElement.style.backgroundColor = circleColour;
			this.#timerElement.style.backgroundImage = 'linear-gradient(' + degModifier + '90deg, transparent 50%, ' + gradientColour + ' 50%), linear-gradient(' + gradientDeg + 'deg, transparent 50%, ' + gradientColour + ' 50%)';
		}


	// starts the timer from the last position
	startTimer() {
		let delay = this.#timeLimit / 360 * 1000;
		let intervalFunc = () => {
			this.updateTimer();
			this.#angle++;
			if (this.#angle > 360) {
				this.fail();
			}
		}	
		this.#timer = setInterval(intervalFunc, delay);
	}


	// pauses the timer
	stopTimer() {
		clearInterval(this.#timer);
	}


	startNewTimer() {

	}


	// runs when the timer runs out
	fail() {
		this.stopTimer();
		this.#status = 'failure';
		this.#timerColour = 'red';
		this.updateTimer();
	}


	// runs when customer is delivered the correct drink
	succeed() {
		this.stopTimer();
		this.#status = 'success';
		this.#timerColour = 'green';
		this.updateTimer();
	}
}