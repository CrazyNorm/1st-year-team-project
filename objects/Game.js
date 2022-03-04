class Game {
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
  static #isMobile;
  static #isPaused;
  static #isQuestLogOpen;
  static #isDialog;

  static #canvas;
  static #canvasContext;
  static #divId;
  static #tilesDesired;

  static #scripts;
  static #characters;


  static async startGame() {
    // create canvas
    this.#divId = 'gameDiv';
    document.getElementById(this.#divId).style.margin = 0;
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
    this.#importantKeys = [];
    this.#touches = [];
    this.#volume = 100;
    this.#deltaTime = 0;
    this.#isPaused = false;
    this.#isQuestLogOpen = false;
    this.#isDialog = false;
    if (this.#isMobile) {
      this.#tilesDesired = 15;
    } else {
      this.#tilesDesired = 20;
    }
    this.#scripts = ['data.json','Interaction.js','Map.js','NPC.js','Player.js','Quest.js'];
    this.#characters = ['playerMale','playerFemale','Gareth','Stewart'];

    let toLoad = 0;
    let loaded = 0;
    function load() {
      loaded ++;
    }

  	// create scripts
  	for (script of this.#scripts) {
  	  let tempScript = document.createElement("script");
      toLoad ++;
      tempScript.onload = load;
  	  tempScript.setAttribute("type", "text/javascript");
  	  tempScript.setAttribute("src", script);
      document.getElementById(this.#divId).appendChild(tempScript);
   	}

    // load from database
    toLoad += 4;
    this.loadPlayer().then(value => {load();});
    this.loadQuests().then(value => {load();});
    this.loadInteractions().then(value => {load();});
    this.loadNPCs().then(value => {load();});

   	// loading images
    for (character of characters) {
      // player
      if (this.#player.getCharacter() == character) {
        let tempDict = {};
        let spriteTypes = ['S_Standing','S_Walk_Left','S_Walk_Right',
                           'E_Standing','E_Walk_Left','E_Walk_Right',
                           'W_Standing','W_Walk_Left','W_Walk_Right',
                           'N_Standing','N_Walk_Left','N_Walk_Right'];
        for (type of spriteTypes) {
          tempDict[type] = new Image();
          toLoad ++;
          tempDict[type].onload = load;
          tempDict[type].src = "resources/imgs/characters/" + character + "/" + type + ".png";
        }
        this.#player.setElements(tempDict);
        continue;
      }

      // npcs
      for (npc of npcList) {
        if (npc.getCharacter() == character) {
          let tempDict = {};
          let spriteTypes = ['S_Standing','E_Standing','W_Standing','N_Standing'];
          for (type of spriteTypes) {
            tempDict[type] = new Image();
            toLoad ++;
            tempDict[type].onload = load;
            tempDict[type].src = "resources/imgs/characters/" + character + "/" + type + ".png";
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


  static mainloop() {}


  static draw() {
    let tileSize = this.#map.getPxPerTile();

    // map background
    let mapX = Math.floor(this.#player.getCoords().x * tileSize + this.#canvas.width / 2);
    let mapY = Math.floor(this.#player.getCoords().y * tileSize + this.#canvas.height / 2);
    this.#canvasContext.drawImage(this.#map.getBackgroundElement(),
                    			  mapX,
                    			  mapY,
                    			  this.#map.getWidth() * tileSize,
                  				  this.#map.getHeight() * tileSize);

    // player
    this.#canvasContext.drawImage(this.#player.getCurrentElement(),
                    			  Math.floor((this.#canvas.width - tileSize) / 2),
                    			  Math.floor((this.#canvas.height - tileSize) / 2),
                    			  tileSize,
                    			  tileSize);

    // NPCs
    for (npc of npcList) {
      let tempX = Math.floor((npc.getCoords().x - this.#player.getCoords().x) * tileSize + this.#canvas.width / 2);
      let tempY = Math.floor((npc.getCoords().y - this.#player.getCoords().y) * tileSize + this.#canvas.height / 2);
      this.#canvasContext.drawImage(npc.getCurrentElement(),
                      			    tempX,
                      				tempY,
                      				tileSize,
                     				tileSize);
    }

    // map foreground
    this.#canvasContext.drawImage(this.#map.getForegroundElement(),
                    			  mapX,
                    			  mapY,
                    			  this.#map.getWidth() * tileSize,
                    			  this.#map.getHeight() * tileSize);
  }


  // collision checking
  static playerCollision(bounds) {
    let xBool = bounds.tlX <= this.#player.getCoords().x && this.player.getCoords().x <= bounds.brX;
    let yBool = bounds.tlY <= this.#player.getCoords().y && this.player.getCoords().y <= bounds.brY;

    return xBool && yBool;
  }

  static warpCollision() {
    for (point of this.#map.getWarpPoints()) {
      let tempBounds = {'tlX':point.sX, 'tlY':point.sY, 'brX':point.sX, 'brY':point.sY};
      if (playerCollision(tempBounds)) {
        this.#player.setCoords(point.dX, point.dY);
        break;
      }
    }
  }

  static buildingCollision() {
    for (bound of this.#map.getCollisionBounds()) {
      if (playerCollision(bound)) {
        return true;
      }
    }
    return false;
  }

  static npcCollision() {
    for (npc of this.#npcList) {
      let tempBounds = {'tlX':npc.getCoords().x, 'tlY':npc.getCoords().y,
                		'brX':npc.getCoords().x, 'brY':npc.getCoords().y}
      if (playerCollision(tempBounds)) {
        return true;
      }
    }
    return false;
  }


  // database
  static async loadInteractions() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      let records = xhr.responseText.split("\n");
      for (string of records) {
        string = string.split("|");
        let tempInteraction = new Interaction(string[0], // id
                          					  string[1] === "true", // is_default
                       						  string[2], // dialog
                        					  string[3], // audio
                        					  JSON.parse(string[4]), // stat_changes
                        					  JSON.parse(string[5]), // actions
                        					  JSON.parse(string[6]), // quest_requirements
                        					  JSON.parse(string[7])); // interaction_requirements
        this.#allInteractions.push(tempInteraction);
      }
    };
    xhr.open("GET","database-scripts/loadInteractions.php");
    xhr.send();
  }

  static async loadQuests() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      let records = xhr.responseText.split("\n");
      for (string of records) {
        string = string.split("|");
        let tempQuest = new Quest(string[0], // id
                      			  string[1], // title
                     			    string[2], // description
                      			  parseInt(string[3]), // target_cunt
                      			  JSON.parse(string[4]), // reward_stat_changes
                      			  JSON.parse(string[5]), // reward_actions
                      			  JSON.parse(string[6]), // quest_requirements
                      			  JSON.parse(string[7]), // interaction_requirements
                      			  JSON.parse(string[8]), // updated_by_quests
                      			  JSON.parse(string[9])); // updated_by_interactions
        this.#allQuests.push(tempQuest);
      }
    };
    xhr.open("GET","database-scripts/loadQuests.php");
    xhr.send();
  }

  static async loadNPCs() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      let records = xhr.responseText.split("\n");
      for (string of records) {
        string = string.split("|");
        let tempNPC = new NPC(string[0], // id
                              string[1], // name
                              JSON.parse(string[2]), // coords
                              string[3], // character
                              JSON.parse(string[4])); // interactions
        this.#npcList.push(tempNPC);
      }
    };
    xhr.open("GET","database-scripts/loadNPCs.php");
    xhr.send();
  }

  static async loadPlayer() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      let records = xhr.responseText.split("\n");
      for (string of records) {
        string = string.split("|");
        let tempPlayer = new Player(this.#player_id,
        							JSON.parse(string[0]), // coords
                      			    string[1], // character
                     			    JSON.parse(string[2]), // stats
                      			    JSON.parse(string[3]), // current_quests
                      			    string[4], // selected_quest
                      			    JSON.parse(string[5]), // completed_interactions
                      			    JSON.parse(string[6]), // completed_quests
                      			    JSON.parse(string[7]), // quest_counts
                      			    parseInt(string[8])); // time_of_day
        this.#player = tempPlayer;
      }
    };
    xhr.open("GET","database-scripts/loadPlayer.php?player_id=" + this.#player_id);
    xhr.send();
  }

  static savePlayer() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET","database-scripts/savePlayer.php?" +
    		 "player_id=" + this.#player_id +
    		 "coords=" + JSON.stringify(this.#player.getCoords()) + 
    		 "character=" + this.#player.getCharacter() + 
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
    let div = document.getElementById(this.#divId);
    div.addEventListener('keydown', keyDownHandler);
    div.addEventListener('keyup', keyUpHandler);
    div.addEventListener('touchstart', touchHandler);
    div.addEventListener('touchmove', touchHandler);
    div.addEventListener('touchend', touchHandler);
    div.addEventListener('touchcancel', touchHandler);
    window.addEventListener('resize', resizeHandler);
  }

  static keyDownHandler(event) {
    if (this.#importantKeys.contains(event.code) && !this.#heldKeys.contains(event.code)) {
      this.#heldKeys.push(event.code);
    }
  }

  static keyUpHandler(event) {
    if (this.#heldKeys.contains(event.code)) {
      let index = this.#heldKeys.indexOf(event.code);
      this.#heldKeys.splice(index, 1);
    }
  }

  static touchHandler(event) {
    this.#touches = event.targetTouches;
  }

  static resizeHandler(event=undefined) {
  	let div = document.getElementById(this.#divId);
  	let width = Math.floor(div.clientWidth / this.#tilesDesired);
  	let heigth = Math.floor(div.clientHeight / this.#tilesDesired);

  	this.#map.setPxPerTile(Math.max(width,height));

  	this.#canvas.width(div.clientWidth);
  	this.#canvas.height(div.clientHeight);
  }
}