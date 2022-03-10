class Game {
  // game-related attributes
  static #player_id;
  static #player;
  static #npcList;
  static #allQuests;
  static #allInteractions;
  static #map;
  static #carList;
  static #heldKeys;
  static #importantKeys;
  static #touches;
  static #volume;
  static #deltaTime;
  static #fps;
  static #isMobile;
  static #isPaused;
  static #isQuestLogOpen;
  static #isDialog;

  // DOM-related attributes
  static #canvas;
  static #canvasContext;
  static #divId;
  static #tilesDesired;


  // getters and setters for the few attributes that need to be accessed from other classes
  static getPlayer() {
    return this.#player;
  }

  static setPlayer(player) {
    this.#player = player;
  }

  static getInteraction(id) {
    return this.#allInteractions.find(i => i.getId() == id);
  }

  static addInteraction(interaction) {
    this.#allInteractions.push(interaction);
  }

  static addQuest(quest) {
    this.#allQuests.push(quest);
  }

  static addNPC(npc) {
    this.#npcList.push(npc);
  }

  static getFPS() {
    return this.#fps;
  }


  // set up the game attributes, html elements, loads resources, etc.
  static async startGame() {
    // create canvas
    this.#divId = 'gameDiv';
    document.getElementById(this.#divId).style.margin = "0";
    document.getElementById(this.#divId).style.overflow = 'hidden';
    let tempCanvas = document.createElement("canvas");
    // set id
    tempCanvas.setAttribute('id', 'canvas');
    // set styling
    tempCanvas.setAttribute('style', "background: yellow; padding: 0; margin: auto; position: absolute; top: 0; left: 0; right: 0; bottom: 0; ")
    document.getElementById(this.#divId).appendChild(tempCanvas);
    this.#canvas = document.getElementById("canvas");
    this.#canvasContext = this.#canvas.getContext("2d");


    // mobile detection
    this.#isMobile = false;
    if ("maxTouchPoints" in navigator) {
      this.#isMobile = navigator.maxTouchPoints > 0;
    } else if ("msMaxTouchPoints" in navigator) {
      this.#isMobile = navigator.msMaxTouchPoints > 0;
    } else {
      let mQ = window.matchMedia && matchMedia("(pointer:coarse)");
      if (mQ && mQ.media === "(pointer:coarse)") {
        this.#isMobile = !!mQ.matches;
      } else if ('orientation' in window) {
        this.#isMobile = true; // deprecated, but good fallback
      } else {
        // Only as a last resort, fall back to user agent sniffing
        let UA = navigator.userAgent;
        this.#isMobile = (
          /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
          /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
        );
      }
    }


    // default values
    this.#allQuests = [];
    this.#allInteractions =[];
    this.#npcList = [];
    this.#heldKeys = [];
    this.#importantKeys = ['KeyW','ArrowUp','KeyA','ArrowLeft','KeyS','ArrowDown','KeyD','ArrowRight'];
    this.#touches = [];
    this.#volume = 100;
    this.#deltaTime = 0;
    this.#fps = 30;
    this.#isPaused = false;
    this.#isQuestLogOpen = false;
    this.#isDialog = false;
    if (this.#isMobile) {
      this.#tilesDesired = 15;
    } else {
      this.#tilesDesired = 20;
    }
    // function scope lists used for loading
    let scripts = ['data.json','Interaction.js','Map.js','NPC.js','Player.js','Quest.js'];
    let characterTypes = ['playerMale','playerFemale','Gareth','Stewart'];

    // keeps count of when everything has finished loading
    let toLoad = 0;
    let loaded = 0;
    function load() {
      loaded ++;
    }

  	// create scripts
  	for (let script of scripts) {
  	  let tempScript = document.createElement("script");
      toLoad ++;
      tempScript.onload = load;
  	  tempScript.setAttribute("type", "text/javascript");
  	  tempScript.setAttribute("src", "objects/" + script);
      document.getElementById(this.#divId).appendChild(tempScript);
   	}

    while (loaded < toLoad) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }

    // load from database
    toLoad += 4;
    this.loadPlayer().then(value => {load()});
    this.loadQuests().then(value => {load()});
    this.loadInteractions().then(value => {load()})
    this.loadNPCs().then(value => {load()});

    while (loaded < toLoad) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }

   	// loading images
    for (let characterType of characterTypes) {
      // player
      if (this.#player.getCharacterType() == characterType) {
        let tempDict = {};
        let spriteTypes = ['S_Standing','S_Walk_Left','S_Walk_Right',
                           'E_Standing','E_Walk_Left','E_Walk_Right',
                           'W_Standing','W_Walk_Left','W_Walk_Right',
                           'N_Standing','N_Walk_Left','N_Walk_Right'];
        for (let type of spriteTypes) {
          tempDict[type] = new Image();
          toLoad ++;
          tempDict[type].onload = load;
          tempDict[type].src = "resources/imgs/characters/" + characterType + "/" + type + ".png";
        }
        this.#player.setElements(tempDict);
        // continue;
      }

      // npcs
      for (let npc of this.#npcList) {
        if (npc.getCharacterType() == characterType) {
          let tempDict = {};
          let spriteTypes = ['S_Standing','E_Standing','W_Standing','N_Standing'];
          for (let type of spriteTypes) {
            tempDict[type] = new Image();
            toLoad ++;
            tempDict[type].onload = load;
            tempDict[type].src = "resources/imgs/characters/" + characterType + "/" + type + ".png";
          }
          npc.setElements(tempDict);
        }
      }
    }

    // map
    let tempBackground = new Image();
    toLoad ++;
    tempBackground.onload = load;
    tempBackground.src = "resources/imgs/maps/background.png";
    let tempForeground = new Image();
    toLoad ++;
    tempForeground.onload = load;
    tempForeground.src = "resources/imgs/maps/foreground.png";
    this.#map = new Map(tempBackground, tempForeground, 96, 64);  


    // controls
    if (this.#isMobile) {
      let outerCircle = document.createElement("div");
      // set id
      outerCircle.setAttribute('id', 'controls');
      // set styling
      outerCircle.setAttribute('style',"width: 25%; padding-bottom: 25%; position: fixed; bottom: 0; right: 0; border: 5px solid; border-radius: 50%; user-select: none; ")
      document.getElementById(this.#divId).appendChild(outerCircle);

      let innerCircle = document.createElement("span");
      // set id
      innerCircle.setAttribute('id', 'joystick');
      // set styling
      innerCircle.setAttribute('style', "position: absolute; height: 25%; width:  25%; padding: 0; margin: auto; left: 0; top: 0; right: 0; bottom: 0; background-color: gray; border: 3px solid; border-radius: 50%; display: inline-block; ")
      document.getElementById("controls").appendChild(innerCircle);
    }

    // sets up input listeners on the relevant elements
    this.startInputListeners();

    // wait for everything to load
    while (loaded < toLoad) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }

    // resize the canvas
    this.resizeHandler();

    // starts the main loop
    this.mainloop();
  }


  static async mainloop() {
    let moving = false;
    let direction;
    let totalMoved;

    this.draw();

    while (true) {
      let loopPromise = new Promise(function(resolve, reject) {
        setTimeout(resolve, 1000/Game.getFPS());
      });
      let preTime = new Date().getTime();

      if (!moving) {
        // player movement
        direction = {"x":0, "y":0};
        console.log(this.#heldKeys);
        for (let code of this.#heldKeys) {
          switch(code) {
            case "KeyW":
            case "ArrowUp":
              direction.y -= 1;
              break;
            case "KeyA":
            case "ArrowLeft":
              direction.x -= 1;
              break;
            case "KeyS":
            case "ArrowDown":
              direction.y += 1;
              break;
            case "KeyD":
            case "ArrowRight":
              direction.x += 1;
              break;
            case "KeyQ":
              // open quest log
              break;
            case "KeyE":
              // interact
              break;
            case "ShiftLeft":
            case "ShiftRight":
              // shift
              break;
          }
        }
        this.#player.move(direction.x, direction.y);
        this.warpCollision();
        if (this.buildingCollision() || this.npcCollision()) {
          this.#player.move(-direction.x, -direction.y);
        }
        else if (direction.x != 0 || direction.y != 0){
          moving = true;
          totalMoved = 0;
          if (direction.x == -1) {
            this.#player.startAnimationWalk("W");
          }
          else if (direction.x == 1) {
            this.#player.startAnimationWalk("E");
          }
          else if (direction.y == -1) {
            this.#player.startAnimationWalk("N");
          }
          else if (direction.y == 1) {
            this.#player.startAnimationWalk("S");
          }
        }
      }

      else {
        let ppt = this.#map.getPxPerTile()
        let pxPerFrame = ppt * this.#player.getSpeed() * this.#deltaTime;
        this.#player.movePx(direction.x * pxPerFrame, direction.y * pxPerFrame);
        totalMoved += pxPerFrame;
        console.log(totalMoved);
        if (totalMoved > ppt) {
          let coords = this.#player.getCoords();
          this.#player.setCoordsPx(coords.x * ppt, coords.y * ppt);
          moving = false;
        }
      }

      this.draw();

      await loopPromise;
      let postTime = new Date().getTime();
      this.#deltaTime = (postTime - preTime) / 1000;
    }
  }


  // clears the canvas and redraws the new frame
  static draw() {
    // clears the canvas
    this.#canvasContext.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    let tileSize = this.#map.getPxPerTile();

    // map background
    let mapX = Math.floor(this.#player.getCoordsPx().x + this.#canvas.width / 2);
    let mapY = Math.floor(this.#player.getCoordsPx().y + this.#canvas.height / 2);

    this.#canvasContext.drawImage(this.#map.getBackgroundElement(),
                          			  0,
                          			  0,
                          			  this.#map.getMapWidth() * tileSize,
                        				  this.#map.getMapHeight() * tileSize);

    // player
    this.#canvasContext.drawImage(this.#player.getElement(this.#player.getCurrentElement()),
                          			  Math.floor((this.#canvas.width - tileSize) / 2),
                          			  Math.floor((this.#canvas.height - tileSize) / 2),
                          			  tileSize,
                          			  tileSize);

    // NPCs
    for (let npc of this.#npcList) {
      let tempX = Math.floor((npc.getCoords().x) * tileSize - this.#player.getCoordsPx().x + this.#canvas.width / 2);
      let tempY = Math.floor((npc.getCoords().y) * tileSize - this.#player.getCoordsPx().y + this.#canvas.height / 2);
      this.#canvasContext.drawImage(npc.getElement(npc.getCurrentElement()),
                          			    tempX,
                            				tempY,
                            				tileSize,
                           				  tileSize);
    }

    // map foreground
    this.#canvasContext.drawImage(this.#map.getForegroundElement(),
                          			  mapX,
                          			  mapY,
                          			  this.#map.getMapWidth() * tileSize,
                          			  this.#map.getMapHeight() * tileSize);
  }


  // collision checking
  static #playerCollision(bounds) {
    // utility function - returns true if the player overlaps the bounds in the parameter
    let xBool = bounds.tlX <= this.#player.getCoords().x && this.#player.getCoords().x <= bounds.brX;
    let yBool = bounds.tlY <= this.#player.getCoords().y && this.#player.getCoords().y <= bounds.brY;

    return xBool && yBool;
  }

  static warpCollision() {
    // checks the player's position against all the warp points and moves the player to destination
    for (let point of this.#map.getWarpPoints()) {
      let tempBounds = {'tlX':point.sX, 'tlY':point.sY, 'brX':point.sX, 'brY':point.sY};
      if (this.#playerCollision(tempBounds)) {
        this.#player.setCoords(point.dX, point.dY);
        break;
      }
    }
  }

  static buildingCollision() {
    // checks the player's position against all the bounds for buildings
    for (let bound of this.#map.getCollisionBounds()) {
      if (this.#playerCollision(bound)) {
        return true;
      }
    }
    return false;
  }

  static npcCollision() {
    // checks the player's position against all the NPCs
    for (let npc of this.#npcList) {
      let tempBounds = {'tlX':npc.getCoords().x, 'tlY':npc.getCoords().y,
                		'brX':npc.getCoords().x, 'brY':npc.getCoords().y}
      if (this.#playerCollision(tempBounds)) {
        return true;
      }
    }
    return false;
  }


  // database
  static async loadInteractions() {
    // uses ajax to get all the interaction records from the database and creates an Interaction object from each one
    const xhr = new XMLHttpRequest();
    let loaded = false;
    xhr.onload = function() {
      let records = xhr.responseText.split("\n");
      for (let string of records) {
        if (string == ""){
          break;
        }
        string = string.split("|");
        let tempInteraction = new Interaction(string[0], // id
                          					string[1] === "true", // is_default
                       						  string[2], // dialog
                        					  string[3], // audio
                        					  JSON.parse(string[4]), // stat_changes
                        					  JSON.parse(string[5]).actions, // actions
                        					  JSON.parse(string[6]).requirements, // quest_requirements
                        					  JSON.parse(string[7]).requirements); // interaction_requirements
        Game.addInteraction(tempInteraction);
        loaded = true;
      }
    };
    xhr.open("GET","objects/database-scripts/loadInteractions.php");
    xhr.send();
    // function doesn't return until the xhr has finished
    while (!loaded) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }
  }

  static async loadQuests() {
    // uses ajax to get all the quest records from the database and creates a Quest object from each one
    const xhr = new XMLHttpRequest();
    let loaded = false;
    xhr.onload = function() {
      let records = xhr.responseText.split("\n");
      for (let string of records) {
        if (string == ""){
          break;
        }
        string = string.split("|");
        let tempQuest = new Quest(string[0], // id
                      			  string[1], // title
                     			    string[2], // description
                      			  parseInt(string[3]), // target_cunt
                      			  JSON.parse(string[4]), // reward_stat_changes
                      			  JSON.parse(string[5]).actions, // reward_actions
                      			  JSON.parse(string[6]).requirements, // quest_requirements
                      			  JSON.parse(string[7]).requirements, // interaction_requirements
                      			  JSON.parse(string[8]).quests, // updated_by_quests
                      			  JSON.parse(string[9]).interractions); // updated_by_interactions
        Game.addQuest(tempQuest);
        loaded = true
      }
    };
    xhr.open("GET","objects/database-scripts/loadQuests.php");
    xhr.send();
    // function doesn't return until the xhr has finished
    while (!loaded) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }
  }

  static async loadNPCs() {
    // uses ajax to get all the npc records from the database and creates an NPC object from each one
    const xhr = new XMLHttpRequest();
    let loaded = false;
    xhr.onload = function() {
      let records = xhr.responseText.split("\n");
      for (let string of records) {
        if (string == ""){
          break;
        }
        string = string.split("|");
        let tempNPC = new NPC(string[0], // id
                              string[1], // name
                              JSON.parse(string[2]), // coords
                              string[3], // character_type
                              JSON.parse(string[4]).interactions); // interactions
        Game.addNPC(tempNPC);
        loaded = true;
      }
    };
    xhr.open("GET","objects/database-scripts/loadNPCs.php");
    xhr.send();
    // function doesn't return until the xhr has finished
    while (!loaded) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }
  }

  static async loadPlayer() {
    // uses ajax to get the correct player record from the database
    // then uses the record to construct the player object
    const xhr = new XMLHttpRequest();
    let loaded = false;
    xhr.onload = function() {
      let records = xhr.responseText;
      let string = records.split("|");
      let tempPlayer = new Player("0",
          							          JSON.parse(string[0]), // coords
                        			    string[1], // character_type
                       			      JSON.parse(string[2]), // stats
                        			    JSON.parse(string[3]).quests, // current_quests
                        			    string[4], // selected_quest
                        			    JSON.parse(string[5]).interactions, // completed_interactions
                        			    JSON.parse(string[6]).quests, // completed_quests
                        			    JSON.parse(string[7]), // quest_counts
                        			    parseInt(string[8])); // time_of_day
      Game.setPlayer(tempPlayer);
      loaded = true;
    };
    xhr.open("GET","objects/database-scripts/loadPlayer.php?player_id=0");// need to replace this with actual id
    xhr.send();
    // function doesn't return until the xhr has finished
    while (!loaded) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }
  }

  static savePlayer() {
    // uses ajax to save the player's current progress to the database
    const xhr = new XMLHttpRequest();
    xhr.open("GET","objects/database-scripts/savePlayer.php?" +
    		 "player_id=" + this.#player_id +
    		 "coords=" + JSON.stringify(this.#player.getCoords()) + 
    		 "character_type=" + this.#player.getCharacterType() + 
    		 "stats=" + JSON.stringify(this.#player.getStats()) + 
    		 "current_quest=" + JSON.stringify(this.#player.getCurrentQuests()) +
    		 "selected_quest=" + this.#player.getSelectedQuest().toString() +
    		 "completed_interactions=" + JSON.stringify(this.#player.getCompletedInteractions()) +
    		 "completed_quests=" + JSON.stringify(this.#player.getCompletedQuests()) +
    		 "quest_counts=" + JSON.strigify(this.#player.getQuestCounts()) +
    		 "time_of_day=" + this.#player.getTimeOfDay().toString());
    xhr.send();
  }


  // listeners
  static startInputListeners() {
    // applies all the necessary input listeners to the relevant elements
    let div = document.getElementById(this.#divId);
    document.addEventListener('keydown', function() {Game.keyDownHandler(event)});
    document.addEventListener('keyup', function() {Game.keyUpHandler(event)});
    document.addEventListener('touchstart', function() {Game.touchHandler(event)});
    document.addEventListener('touchmove', function() {Game.touchHandler(event)});
    document.addEventListener('touchend', function() {Game.touchHandler(event)});
    document.addEventListener('touchcancel', function() {Game.touchHandler(event)});
    window.addEventListener('resize', function() {Game.resizeHandler()});
  }

  static keyDownHandler(event) {
    // adds the key to heldKeys if it is "important" and not already in heldKeys
    console.log(event.code);
    if (this.#importantKeys.includes(event.code) && !this.#heldKeys.includes(event.code)) {
      this.#heldKeys.push(event.code);
    }
  }

  static keyUpHandler(event) {
    // removes the key from heldKeys (if it was already there)
    if (this.#heldKeys.includes(event.code)) {
      let index = this.#heldKeys.indexOf(event.code);
      this.#heldKeys.splice(index, 1);
    }
  }

  static touchHandler(event) {
    // refreshes the list of current touches
    this.#touches = event.targetTouches;
  }

  static resizeHandler() {
    // resizes the game to fit the specified no. of tiles across the longest edge of the screen
  	let div = document.getElementById(this.#divId);
  	let width = Math.floor(div.clientWidth / this.#tilesDesired);
  	let height = Math.floor(div.clientHeight / this.#tilesDesired);

    let ppx = Math.max(width,height)
  	this.#map.setPxPerTile(ppx);
    let coords = this.#player.getCoords();
    this.#player.setCoordsPx(coords.x * ppx, coords.y * ppx)

  	this.#canvas.width = div.clientWidth;
  	this.#canvas.height = div.clientHeight;
  }


  // dialog & menus
  static displayDialog() {
    // !this is a reminder!
  }
}