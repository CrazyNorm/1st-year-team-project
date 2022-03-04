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

  static #scripts = ['data.json','Interaction.js','Map.js','NPC.js','Player.js','Quest.js'];
  static #characters = ['playerMale','playerFemale','Gareth','Stewart'];


  static startGame() {
  	// create scripts
  	for (script of this.#scripts) {
  	  let tempScript = document.createElement("script");
  	  tempScript.setAttribute("type", "text/javascript");
  	  tempScript.setAttribute("src", script);
   	}

    // load from database
    this.loadPlayer();
    this.loadQuests();
    this.loadInteractions();
    // this.loadNPCs();

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
            tempDict[type].src = "resources/imgs/characters/" + character + "/" + type + ".png";
          }
          npc.setElements(tempDict);
        }
      }
    }
  }


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
  static loadInteractions() {
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

  static loadQuests() {
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

  // TODO - loadNPCs()

  static loadPlayer() {
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

  }

  static closeInputListeners() {

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