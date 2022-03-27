class Game {
  // game-related attributes
  static #player_id;
  static #score;
  static #player;
  static #npcList;
  static #allQuests;
  static #allInteractions;
  static #map;
  static #carList;
  static #heldKeys;
  static #importantKeys;
  static #touchStarts;
  static #joystickTouch;
  static #interactTouch;
  static #currentInteraction;
  static #currentNPC;
  static #deltaTime;
  static #fps;
  static #isMobile;
  static #isPaused;
  static #isQuestLogOpen;
  static #isDialog;
  static #isStatWindow;
  static #isPauseMenu;
  static #currentMinigame; // undefined if not in minigame
  static #loadedMinigames; // minigame scripts aren't loaded until needed, but should only be loaded once

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

  static getQuest(questId) {
    return this.#allQuests[questId];
  }

  static getPlayerId() {
    return this.#player_id;
  } 

  static getScore() {
    return this.#score;
  }

  static setCurrentInteraction(currentInteraction) {
    this.#currentInteraction = currentInteraction;
  }

  // set up the game attributes, html elements, loads resources, etc.
  static async startGame() {
    this.#divId = 'gameDiv';
    this.#player_id = "0";
    let gameDiv = document.getElementById(this.#divId);

    // sets up loading screen
    let loadingDiv = document.createElement("div");
    loadingDiv.setAttribute('style', 'position:absolute; height:100%; width:100%; background:white; z-index:1; display:flex; justify-content:center;');
    gameDiv.appendChild(loadingDiv);

    let logo = document.createElement("img");
    logo.setAttribute('src', 'resources/imgs/logo.png');
    logo.setAttribute('style', 'position:absolute; top:25%; width:90vmin;');
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


    // create canvas
    gameDiv.style.margin = "0";
    gameDiv.style.overflow = 'hidden';
    let tempCanvas = document.createElement("canvas");
    // set id
    tempCanvas.setAttribute('id', 'canvas');
    // set styling
    tempCanvas.setAttribute('style', "background: yellow; padding: 0; margin: auto; position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; image-rendering: optimizeSpeed; image-rendering: -moz-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: -o-crisp-edges; image-rendering: optimize-contrast; -ms-interpolation-mode: nearest-neighbor;")
    gameDiv.appendChild(tempCanvas);
    this.#canvas = document.getElementById("canvas");
    this.#canvasContext = this.#canvas.getContext("2d");

    // fullscreen button
    let fullscrButton = document.createElement("button");
    fullscrButton.setAttribute('style', "z-index: 2; position:absolute; width:10vmin; height:10vmin; top:0; left:0; background:#660099;");
    function fullscreen(id) {
      let div = document.getElementById(id);
      if (document.fullscreen) {
        document.exitFullscreen();
      } else {
        try {
          // finds the relevant enter fullscreen method for the browser and runs it
          if (div.requestFullscreen) {div.requestFullscreen();}
          else if (div.webkitRequestFullscreen) {div.webkitRequestFullscreen();}
          else if (div.msRequestFullscreen) {div.msRequestFullscreen();}
          else if (div.mozRequestFullScreen) {div.mozRequestFullScreen();}
        } catch (e) {/* do nothing */}
      }
    }
    fullscrButton.onmousedown = () => fullscreen(this.#divId);
    fullscrButton.ontouchstart = () => fullscreen(this.#divId);
    fullscrButton.onmouseover = () => {fullscrButton.style.backgroundColor = "#bb33ff"}
    fullscrButton.onmouseout = () => {fullscrButton.style.backgroundColor = "#660099"}
    gameDiv.appendChild(fullscrButton);

    let tint = document.createElement("div");
    tint.setAttribute("id","tint");
    tint.setAttribute("style","position: absolute; width:100%; height: 100%; opacity:10%; background-color:orange;");
    gameDiv.appendChild(tint);

    //pause menu
    let pauseMenu = document.createElement("div");
    pauseMenu.setAttribute("id","pauseMenu");
    pauseMenu.setAttribute('style',"display: none; z-index: 2; position : relative; background-color : rgba(201,197,201,0.95); height: 80%; top:  50%; left:  50%; transform: translate(-50%,-50%); border-style: solid; border-width: 0.5em; border-color: #EEEEE; border-radius: 2em; overflow-y: auto;");
    gameDiv.appendChild(pauseMenu);
    pauseMenu.innerHTML = "<style>#menubutton {position: relative; display: block; background-color: #660099; color: yellow; width : 80%; border: solid; border-color: black; border-radius: 0.5em; margin-top: 2em; font-family: 'Press Start 2P', cursive; word-wrap: break-word; padding: 0.5em; text-align:center;} #menubutton:hover {background-color: #bb33ff}</style>";
    let pauseCentre = document.createElement("div");
    pauseCentre.setAttribute("style","display: flex; justify-content: center; align-items: center; flex-wrap: wrap; text-align: center; position: absolute; height:100%; width: 100%; top: 0; left: 0;");
    //align-items: center; justify-content: center; flex-direction: column
    pauseCentre.setAttribute("id","pauseCentre");
    pauseMenu.appendChild(pauseCentre);

    function makeButton(text, func) {
      let tempButton = document.createElement("button");
      tempButton.setAttribute("id", "menubutton");
      tempButton.innerHTML = text;
      tempButton.onclick = func;
      pauseCentre.appendChild(tempButton);
    }
    makeButton("Continue",Game.closePauseMenu);
    makeButton("Stats",function(){Game.closePauseMenu(); Game.openStatWindow();});
    makeButton("Quest Log",function(){Game.closePauseMenu(); Game.openQuestLog();});
    makeButton("Leaderboard",function(){
      //Game.savePlayer();
      window.open("leaderboard.php","name?").focus();});
    makeButton("Save",this.savePlayer);
    makeButton("Quit",function(){
      //Game.savePLayer();
      document.location.href = "homepage.html";
    });

    //quest log
    let questLog = document.createElement("div");
    questLog.setAttribute("id","questLog");
    questLog.setAttribute('style',"display: none; z-index: 2; position : relative; background-color : rgba(201,197,201,0.95); height: 80%; top:  50%; left:  50%; transform: translate(-50%,-50%); border-style: solid; border-width: 0.5em; border-color: #EEEEE; border-radius: 2em; overflow-x: hidden; overflow-y: auto;");
    questLog.innerHTML = "<style>#questLogButtons {position: relative; display: block; background-color: #660099; color: yellow; width : 70%; border: solid; border-color: black; border-radius: 0.5em; margin-top: 2em; margin-left: 50%; transform: translateX(-50%); font-family: 'Press Start 2P', cursive; word-wrap: break-word; padding: 0.5em;} #questLogButtons:hover {background-color: #bb33ff}</style>";
    
    gameDiv.appendChild(questLog);

    

    //stat window
    let statWindow = document.createElement("div");
    statWindow.setAttribute("id","statWindow");
    statWindow.setAttribute('style',"font-family: 'Press Start 2P', cursive; display: none; z-index: 2; position : relative; background-color : rgba(201,197,201,0.95); top:  50%; left:  50%; transform: translate(-50%,-50%); border-style: solid; border-width: 0.5em; border-color: #EEEEE; border-radius: 2em; overflow-x: hidden; overflow-y: auto; text-align: center; max-width: 70%; padding: 1em;");
    gameDiv.appendChild(statWindow);

    let sideDiv = document.createElement("div");
    sideDiv.setAttribute("id", "sideContainer");
    sideDiv.setAttribute("style", "display: none; z-index: 0; position: relative; top: 15%")
    gameDiv.appendChild(sideDiv);


    //selected quest display
    let selectedQuestDisplay = document.createElement("div");
    selectedQuestDisplay.setAttribute("id","selectedquest");
    selectedQuestDisplay.setAttribute("style","display:block; z-index: 0; width: 30%; font-family: 'Press Start 2P', cursive;  padding: 0.5em; color: yellow; text-shadow: 0.1em 0.1em #660099, -0.1em 0.1em #660099, 0.1em -0.1em #660099, -0.1em -0.1em #660099; text-align: left;");
    sideDiv.appendChild(selectedQuestDisplay);

    //stat display
    let statDisplay = document.createElement("div");
    statDisplay.setAttribute("id","statdisplay");
    statDisplay.setAttribute("style","display:block; z-index: 0; position: absolute; max-width: 8em; font-family: 'Press Start 2P', cursive; color: yellow; text-shadow: 0.1em 0.1em #660099, -0.1em 0.1em #660099, 0.1em -0.1em #660099, -0.1em -0.1em #660099; text-align: left; border: solid; border-color: black; border-width: 0.25em; margin-left: 0.25em; background-color: rgba(255,255,255,0.4); line-height: 1.3em;");
    sideDiv.appendChild(statDisplay);


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

    // dialog
    let dialogBox = document.createElement("div");
    dialogBox.setAttribute("id","dialogBox");
    if (this.#isMobile) {
      dialogBox.setAttribute("style", "display: none; background-color: #c9c5c9; position: absolute; z-index: 1; bottom: 3%; left: 50%; transform:translate(-50%,0); width: 80%; height: 30vh; border: solid 0.3em; border-radius: 0.3em; font-size: 1em; font-family: 'Press Start 2P', cursive; text-align: center; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 0.5em;");

      // button for pause meun
      let pauseButton = document.createElement("div");
      pauseButton.setAttribute('style', "position:absolute; width:10vmin; height:10vmin; top:0; right:0; background:#660099;");
      pauseButton.onmouseover = () => {fullscrButton.style.backgroundColor = "#bb33ff"}
      pauseButton.onmouseout = () => {fullscrButton.style.backgroundColor = "#660099"}
      pauseButton.setAttribute('id',"pauseButton");
      gameDiv.appendChild(pauseButton)
    } else {
      dialogBox.setAttribute("style", "display: none; background-color: #c9c5c9; position: absolute; z-index: 1; bottom: 3%; left: 10%; width: 80%; height: 30vh; border: solid 0.3em; border-radius: 0.3em; font-size: 3em; font-family: 'Press Start 2P', cursive; text-align: center; overflow-y: auto; padding: 0.5em;");

    }
    gameDiv.appendChild(dialogBox);


    // default values
    this.#allQuests = [];
    this.#allInteractions =[];
    this.#npcList = [];
    this.#heldKeys = [];
    this.#importantKeys = ['KeyW','ArrowUp','KeyA','ArrowLeft','KeyS','ArrowDown','KeyD','ArrowRight','ShiftLeft','ShiftRight','KeyE','Escape','KeyQ','KeyP','KeyK','KeyF'];
    this.#touchStarts = [];
    this.#deltaTime = 0;
    this.#fps = 30;
    this.#isPaused = false;
    this.#isQuestLogOpen = false;
    this.#isDialog = false;
    this.#isPauseMenu = false;
    this.#isStatWindow = false;
    this.#loadedMinigames = [];
    if (this.#isMobile) {
      this.#tilesDesired = 15;
    } else {
      this.#tilesDesired = 20;
    }
    // function scope lists used for loading
    let scripts = ['data.json','Interaction.js','Map.js','NPC.js','Player.js','Quest.js'];
    let characterTypes = ['Female_Gareth','Gareth','Stewart','Blank'];

    // keeps count of when everything has finished loading
    let maxLoad = 32; // doesn't need to be too accurate, just used for loading bar
    let toLoad = 0;
    let loaded = 0;
    function load() {
      loaded ++;
      fillBar.style.width = String(loaded / maxLoad * 100) + "%";
    }

  	// create scripts
  	for (let script of scripts) {
  	  let tempScript = document.createElement("script");
      toLoad ++;
      tempScript.onload = load;
  	  tempScript.setAttribute("type", "text/javascript");
  	  tempScript.setAttribute("src", "objects/" + script);
      gameDiv.appendChild(tempScript);
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


    //sets up quest and interaction to starts
    for (let qPos = 0; qPos < this.#allQuests.length; qPos++) {
      for (let quest2 of this.#allQuests) {
        if (quest2.getQuestRequirements().includes(this.#allQuests[qPos].getId())) {
          this.#allQuests[qPos].getQuestsToStart().push(quest2.getId())
        }
        if (quest2.getUpdatedByQuests().includes(this.#allQuests[qPos].getId())) {
          this.#allQuests[qPos].getQuestsToUpdate().push(quest2.getId());
        }
      }
    }

    for (let iPos = 0; iPos < this.#allInteractions.length; iPos++) {
      for (let quest of this.#allQuests) {
        if (quest.getInteractionRequirements().includes(this.#allInteractions[iPos].getId())) {
          this.#allInteractions[iPos].getQuestsToStart().push(quest.getId());
        }
        if (quest.getUpdatedByInteractions().includes(this.#allInteractions[iPos].getId())) {
          this.#allInteractions[iPos].getQuestsToUpdate().push(quest.getId());
        }
      }
    }

    this.setSelectedQuest(this.#player.getSelectedQuest());



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
        continue;
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


    // controls
    if (this.#isMobile) {
      let outerCircle = document.createElement("div");
      // set id
      outerCircle.setAttribute('id', 'controls');
      // set styling
      outerCircle.setAttribute('style',"width: 25vmax; height:25vmax; position: fixed; bottom: 1em; right: 1em; border: 5px solid; border-radius: 50%; user-select: none; ")
      gameDiv.appendChild(outerCircle);

      let innerCircle = document.createElement("span");
      // set id
      innerCircle.setAttribute('id', 'joystick');
      // set styling
      innerCircle.setAttribute('style', "position: absolute; height: 25%; width:  25%; padding: 0; margin: auto; left: 0; top: 0; right: 0; bottom: 0; background-color: gray; border: 3px solid; border-radius: 50%; display: inline-block;")
      outerCircle.appendChild(innerCircle);

      // interaction button
      let interactButton = document.createElement("div");
      interactButton.setAttribute("id","interactButton");
      interactButton.setAttribute("style", "width: 3em; height: 3em; position: absolute; left: 1em; bottom: 1em; border-radius: 50%; background-color: #660099; opacity: 0.6;");
      gameDiv.appendChild(interactButton);
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

    this.#map = new Map(tempBackground, tempForeground, Math.round(tempBackground.naturalWidth/16), Math.round(tempBackground.naturalHeight/16))

    // resize the canvas
    this.resizeHandler();

    // removes the loading screen
    loadingDiv.style.display = "none";
    sideDiv.style.display = "block";
    this.draw();

    // starts the main loop
    this.mainloop();
  }


  static async mainloop() {
    let moving = false;
    let direction;
    let totalMoved;
    let spriteDir = "S";
    let joystick = document.getElementById("joystick");
    let controls = document.getElementById("controls");
    // joystick coords relative to control circle
    let touchX;
    let touchY;

    this.draw();

    while (true) {
      let loopPromise = new Promise(function(resolve, reject) {
        setTimeout(resolve, 1000/Game.getFPS());
      });
      let preTime = new Date().getTime();

      if (!this.#isPaused) {

        // update joystick position
        if (this.#isMobile) {
          if (this.#joystickTouch != undefined) {
            let controlsCoords = controls.getBoundingClientRect();
            let joystickCoords = joystick.getBoundingClientRect();
            touchX = this.#joystickTouch.clientX - controlsCoords.left;
            touchY = this.#joystickTouch.clientY - controlsCoords.top;
            joystick.style.margin = "0";
            let halfWidth = controlsCoords.width/2;
            let diffX = halfWidth-touchX;
            let diffY = halfWidth-touchY;
            let magnitude = Math.sqrt((diffX)**2+(diffY)**2);
            // move joystick to stay within circle
            if (magnitude>halfWidth) {
              joystick.style.margin = "0";
              joystick.style.left = String(Math.floor(halfWidth*(1-diffX/magnitude) - joystickCoords.width / 2))+"px";
              joystick.style.top = String(Math.floor(halfWidth*(1-diffY/magnitude) - joystickCoords.height / 2))+"px"; 
            } else {
              joystick.style.left = String(Math.floor(touchX - joystickCoords.width / 2)) + "px";
              joystick.style.top = String(Math.floor(touchY - joystickCoords.height / 2)) + "px";
            }
            joystick.style.backgroundColor = "yellow";
          }
          else {
            joystick.style.margin = "auto";
            joystick.style.top = "0";
            joystick.style.left = "0";
            joystick.style.backgroundColor = "#660099";
          }
        }


        if (!moving) {
          // player movement
          // touch controls

          let touchKeys = ['touchUp','touchDown','touchLeft','touchRight','touchSprint'];
          // removes all touch keys from currently held keys
          this.#heldKeys = this.#heldKeys.filter(x => !touchKeys.includes(x));

          if (this.#joystickTouch != undefined) {
            // rather than applying the direction changes twice (keyboard and touch),
            // touch controls just simulate keyboard controls
            let controlsCoords = controls.getBoundingClientRect();
            let xDiff = touchX - (controlsCoords.width / 2);
            let yDiff = touchY - (controlsCoords.height / 2);
            // x direction
            if (Math.abs(xDiff) > controlsCoords.width / 10) {
              if (xDiff < 0) {
                this.#heldKeys.push('touchLeft');
              }
              else {
                this.#heldKeys.push('touchRight');
              }
            }
            // y direction
            if (Math.abs(yDiff) > controlsCoords.height / 10) {
              if (yDiff < 0) {
                this.#heldKeys.push('touchUp');
              }
              else {
                this.#heldKeys.push('touchDown');
              }
            }
            // sprint
            if (Math.sqrt(xDiff**2 + yDiff**2) > controlsCoords.width / 3) {
              this.#heldKeys.push('touchSprint');
            }
          }

          if (this.#interactTouch != undefined) {
            this.npcInteractionCollision();
          }

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
              case "KeyQ":
                // open quest 
                let index = this.#heldKeys.indexOf(code);
                this.#heldKeys.splice(index, 1);
                this.openQuestLog();
                break;
              case "KeyE":
                // interact
                this.npcInteractionCollision();
                break;
              case "Escape":
              case "KeyP":
                this.openPauseMenu();
                break;
              case "ShiftLeft":
              case "ShiftRight":
              case "touchSprint":
                this.#player.setSpeed(10);
                break;
              case "KeyK":
                console.log(this.#player.getCoords());
                break;
              case "KeyF":
                this.openStatWindow();
                break;
            }
          }

          // set standing sprite (may be overridden by animation)
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
          let temp = Math.sqrt(Math.abs(direction.x) + Math.abs(direction.y));
          this.#player.setSpeed(this.#player.getSpeed() / temp);
          this.#player.setCurrentElement(spriteDir + "_Standing");

          this.#player.move(direction.x, direction.y);
          this.warpCollision();
          if (this.buildingCollision() || this.npcCollision()) {
            this.#player.move(-direction.x, -direction.y);
          }
          else if (direction.x != 0 || direction.y != 0){
            moving = true;
            totalMoved = 0;
            this.#player.startAnimationWalk(spriteDir);
          }
        }

        else {
          let ppt = this.#map.getPxPerTile()
          let pxPerFrame = Math.floor(ppt * this.#player.getSpeed() * this.#deltaTime);
          this.#player.movePx(direction.x * pxPerFrame, direction.y * pxPerFrame);
          totalMoved += pxPerFrame;
          if (totalMoved >= ppt - pxPerFrame / 2) {
            let coords = this.#player.getCoords();
            this.#player.setCoordsPx(coords.x * ppt, coords.y * ppt);
            moving = false;
          }
        }

        this.draw();
    }

      await loopPromise;
      let postTime = new Date().getTime();
      this.#deltaTime = (postTime - preTime) / 1000;
      //console.log(1/this.#deltaTime);
    }
  }


  // clears the canvas and redraws the new frame
  static draw() {
    // clears the canvas
    this.#canvasContext.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

    let tileSize = this.#map.getPxPerTile();

    // map background
    let mapX = Math.floor(this.#canvas.width / 2 - this.#player.getCoordsPx().x);
    let mapY = Math.floor(this.#canvas.height / 2 - this.#player.getCoordsPx().y);

    this.#canvasContext.mozImageSmoothingEnabled = false;
    this.#canvasContext.webkitImageSmoothingEnabled = false;
    this.#canvasContext.msImageSmoothingEnabled = false;
    this.#canvasContext.imageSmoothingEnabled = false;

    let tempImg = this.#map.getBackgroundElement();

    this.#canvasContext.drawImage(tempImg,
                                  0,
                                  0,
                                  tempImg.naturalWidth,
                                  tempImg.naturalHeight,
                          			  mapX - tileSize / 2,
                          			  mapY - tileSize / 2,
                          			  this.#map.getMapWidth() * tileSize,
                        				  this.#map.getMapHeight() * tileSize);

    // player
    tempImg = this.#player.getElement(this.#player.getCurrentElement());
    this.#canvasContext.drawImage(tempImg,
                                  0,
                                  0,
                                  tempImg.naturalWidth,
                                  tempImg.naturalHeight,
                                  Math.floor((this.#canvas.width - tileSize) / 2),
                          			  Math.floor((this.#canvas.height - tileSize) / 2),
                          			  tileSize,
                          			  tileSize);

    // NPCs
    for (let npc of this.#npcList) {
      let tempX = Math.floor((npc.getCoords().x) * tileSize - this.#player.getCoordsPx().x + this.#canvas.width / 2);
      let tempY = Math.floor((npc.getCoords().y) * tileSize - this.#player.getCoordsPx().y + this.#canvas.height / 2);
      tempImg = npc.getElement(npc.getCurrentElement())
      this.#canvasContext.drawImage(tempImg,
                                    0,
                                    0,
                                    tempImg.naturalWidth,
                                    tempImg.naturalHeight,
                          			    tempX - tileSize / 2,
                            				tempY - tileSize / 2,
                            				tileSize,
                           				  tileSize);
    }

    // map foreground
    tempImg = this.#map.getForegroundElement();
    this.#canvasContext.drawImage(tempImg,
                                  0,
                                  0,
                                  tempImg.naturalWidth,
                                  tempImg.naturalHeight,
                          			  mapX - tileSize / 2,
                          			  mapY - tileSize / 2,
                          			  this.#map.getMapWidth() * tileSize,
                          			  this.#map.getMapHeight() * tileSize);
  }


  static npcInteractionCollision() {
    let direction = this.#player.getCurrentElement().substring(0,1);
    let dir;
    if (direction == "N") {
      dir = {"x":0,"y":-1};
    } else if (direction == "E") {
      dir = {"x":1,"y":0};
    } else if (direction == "S") {
      dir = {"x":0,"y":1};
    } else if (direction == "W") {
      dir = {"x":-1,"y":0};
    } 
    for (let npc of this.#npcList) {
      if (npc.getCoords().x == this.#player.getCoords().x+dir.x && npc.getCoords().y == this.#player.getCoords().y+dir.y) {
        switch (direction) {
          case 'N':
            npc.setCurrentElement('S_Standing');
            break;
          case 'E':
            npc.setCurrentElement('W_Standing');
            break;
          case 'W':
            npc.setCurrentElement('E_Standing');
            break;
          case 'S':
            npc.setCurrentElement('N_Standing');
            break;
        }
        npc.checkInteractions();
        this.#currentNPC = npc;
        return true;
      }
    }

    
    // for (let npc of this.#npcList) {
    //   let checkDirections = [ {"x":0,"y":1},
    //                           {"x":1,"y":0},
    //                           {"x":0,"y":-1},
    //                           {"x":-1,"y":0}]
      
    //   for (let dir of checkDirections) {
    //     let tempBounds = {'tlX':npc.getCoords().x+dir.x, 'tlY':npc.getCoords().y+dir.y,
    //                 'brX':npc.getCoords().x+dir.x, 'brY':npc.getCoords().y+dir.y};
    //     if (this.#playerCollision(tempBounds)) {
    //       return npc;
    //     }
    //   }
    // }
    // return false;
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
                          					string[1] === "1", // is_default
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
                      			  JSON.parse(string[9]).interactions); // updated_by_interactions
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
                              JSON.parse(string[4]).interactions, // interactions
                              string[5]); // direction
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
      let tempPlayer = new Player(Game.getPlayerId(),
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
    xhr.open("GET","objects/database-scripts/loadPlayer.php?player_id="+this.#player_id);// need to replace this with actual id
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
    // updates the score in the database
    Game.saveScore();
    // uses ajax to save the player's current progress to the database
    const xhr = new XMLHttpRequest();
    xhr.open("GET","objects/database-scripts/savePlayer.php?" +
    		 "player_id=" + Game.getPlayerId() + 
    		 "&coords=" + JSON.stringify(Game.getPlayer().getCoords()) + 
    		 "&character_type=" + Game.getPlayer().getCharacterType() + 
    		 "&stats=" + JSON.stringify(Game.getPlayer().getStats()) + 
    		 '&current_quests={"quests":' + JSON.stringify(Game.getPlayer().getCurrentQuests()) +
    		 "}&selected_quest=" + Game.getPlayer().getSelectedQuest().toString() +
    		 '&completed_interactions={"interactions":' + JSON.stringify(Game.getPlayer().getCompletedInteractions()) +
    		 '}&completed_quests={"quests":'+JSON.stringify(Game.getPlayer().getCompletedQuests()) +
    		 "}&quest_counts=" + JSON.stringify(Game.getPlayer().getQuestCounts()) +
    		 "&time_of_day=" + Game.getPlayer().getTimeOfDay().toString());
    xhr.send();
  }

  static saveScore() {
    this.#score = Math.floor((this.#player.getStat('money') + this.#player.getStat('grades') + this.#player.getStat('socialLife')) / 3);

    // uses ajax to save the player's current score to the database
    const xhr = new XMLHttpRequest();
    xhr.open("GET","objects/database-scripts/saveScore.php?" +
         "user_id=" + Game.getPlayerId() + 
         "&score=" + Game.getScore());
    xhr.send();
  }


  // listeners
  static startInputListeners() {
    // applies all the necessary input listeners to the relevant elements
    let div = document.getElementById(this.#divId);
    document.addEventListener('keydown', function() {Game.keyDownHandler(event)});
    document.addEventListener('keyup', function() {Game.keyUpHandler(event)});
    div.addEventListener('touchstart', function() {Game.touchStartHandler(event)});
    div.addEventListener('touchmove', function() {Game.touchMoveHandler(event)});
    div.addEventListener('touchend', function() {Game.touchEndHandler(event)});
    div.addEventListener('touchcancel', function() {Game.touchEndHandler(event)});
    window.addEventListener('resize', function() {Game.resizeHandler()});
    window.addEventListener('close', function() {window.open("leaderboard.php","nma?").open()
    //Game.savePlayer()});
  });
  }

  static keyDownHandler(event) {
    // adds the key to heldKeys if it is "important" and not already in heldKeys
    if (this.#importantKeys.includes(event.code) && !this.#heldKeys.includes(event.code)) {
      this.#heldKeys.push(event.code);
    }
    //closes dialog on button press
    if (this.#isDialog) {
      switch (event.code) {
        case "Space":
        case "Enter":
        case "KeyE":
          let index = this.#heldKeys.indexOf(event.code);
          this.#heldKeys.splice(index, 1);
          this.closeDialog();
          break;
        case "Escape":
        case "KeyP":
          this.closeDialog();
          break;
      }
    }
    if (this.#isStatWindow) {
      switch (event.code) {
        case "KeyF":
          let index = this.#heldKeys.indexOf(event.code);
          this.#heldKeys.splice(index, 1);
          this.closeStatWindow();
          break;
        case "Escape":
        case "KeyP":
          this.closeStatWindow();
          break;
      }
    }
    if (this.#isPauseMenu && this.#currentMinigame == undefined) {
      switch (event.code) {
        case "Escape":
        case "KeyP":
          let index = this.#heldKeys.indexOf(event.code);
          this.#heldKeys.splice(index, 1);
          this.closePauseMenu();
          break;
      }
    }
    if (this.#isQuestLogOpen && this.#currentMinigame == undefined) {
      switch (event.code) {
        case "KeyQ":
          let index = this.#heldKeys.indexOf(event.code);
          this.#heldKeys.splice(index, 1);
          this.closeQuestLog();
          break;
        case "Escape":
        case "KeyP":
          this.closeQuestLog();
          break;
      }
    }
    if (this.#currentMinigame != undefined) {
      switch (event.code) {
        case "Escape":
        case "KeyP":
          if (this.#isQuestLogOpen) {
            this.closeQuestLog();
          }
          if (!this.#isPauseMenu) {
            this.openPauseMenu();
          } else {
            this.closePauseMenu();
          }
          break;
      }
    }

  }

  static keyUpHandler(event) {
    // removes the key from heldKeys (if it was already there)
    if (this.#heldKeys.includes(event.code)) {
      let index = this.#heldKeys.indexOf(event.code);
      this.#heldKeys.splice(index, 1);
    }

  }

  static touchStartHandler(event) {
    let menuClosed = false
    if (!(this.#isDialog || this.#isQuestLogOpen ||this.#isPauseMenu)) {
      event.preventDefault();
    }
    // refreshes the list of current touches
    this.#touchStarts.push(event.target);

    // if there is no joystick touch and there is a new touch on the joystick, sets joystickTouch
    for (let touch of event.changedTouches) {
      let element = document.elementFromPoint(touch.clientX, touch.clientY);
      if (this.#isDialog && this.#currentMinigame == undefined) {
        // Closes the dialog if tapped outside of the dialog box
        if (element.id != "dialogBox") {
          this.closeDialog();
          menuClosed = true;
        }
      } else if (this.#isPauseMenu) {
        if (element.id != "pauseMenu" && element.id != "pauseCentre" && element.id != "menubutton") {
          this.closePauseMenu();
          menuClosed = true;

        }
      } else if (this.#isQuestLogOpen) {
        if (element.id != "questLog" && element.id != "questLogButtons" && element.id != "questLogExpanded" && element.id != "questSelect") {
          this.closeQuestLog();
          menuClosed = true;
        }
      } else if (this.#isStatWindow) {
        if (element.id != "statWindow")
          this.closeStatWindow();
          menuClosed = true;
      }
      if ((element.id == "controls" || element.id == "joystick") && this.#joystickTouch == undefined) {
        this.#joystickTouch = touch;
      } 
      if (!menuClosed) {
        if (element.id == "interactButton") {
          this.#interactTouch = touch;
        } else if (element.id == "pauseButton") {
          this.openPauseMenu();
        } else if (element.id == "selectedquest") {
          this.openQuestLog();
        }  else if (element.id == "statdisplay") {
          this.openStatWindow();
        }

      }
      
      
    }
  }

  static touchMoveHandler(event) {
    if (!(this.#isDialog || this.#isPauseMenu || this.#isQuestLogOpen)) {
      event.preventDefault();
    } else if (this.#isQuestLogOpen && this.#isMobile) {
      event.preventDefault();
    }
    // if the joystick touch has moved, update it
    if (this.#joystickTouch != undefined) {
      for (let touch of event.changedTouches) {
        if (touch.identifier == this.#joystickTouch.identifier) {
          this.#joystickTouch = touch;
        }
      }
    }
  }

  static touchEndHandler(event) {
    if (!(this.#isDialog || this.#isPauseMenu || this.#isQuestLogOpen)) {
      event.preventDefault();
    }
    // if the joystick touch has ended, remove it
    if (this.#joystickTouch != undefined) {
      for (let touch of event.changedTouches) {
        if (touch.identifier == this.#joystickTouch.identifier) {
          this.#joystickTouch = undefined;
        }
      }
    }
    if (this.#interactTouch != undefined) {
      for (let touch of event.changedTouches) {
        if (touch.identifier == this.#interactTouch.identifier) {
          this.#interactTouch = undefined;
        } 
      }
    }
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

    if (this.#isQuestLogOpen) {
      this.closeQuestLog();
      this.openQuestLog();
    }
    if (this.#isPauseMenu) {
      this.closePauseMenu();
      this.openPauseMenu();
    }

    this.draw();
  }


  // dialog & menus
  static displayDialog () {
    let dialogBox = document.getElementById("dialogBox");


    //adds text to dialog
    dialogBox.innerHTML = this.#currentInteraction.getDialog()+"<br><button id='dialogSubmit' onclick='Game.closeDialog()'>Press to Continue!</button>";
    let dialogSubmit = document.getElementById("dialogSubmit");
    // button to continue dialog
    dialogSubmit.style = "font-size: 1.5em; font-family: 'Press Start 2P', cursive; padding: 1vh; background-color: #660099; color: yellow; border: solid; border-radius: 1vh; margin: 0.5em;"
    dialogSubmit.onmouseover = function () {
      dialogSubmit.style.backgroundColor = "yellow";
      dialogSubmit.style.color = "#660099";
    }
    dialogSubmit.onmouseout = function () {
      dialogSubmit.style.backgroundColor = "#660099";
      dialogSubmit.style.color = "yellow";
    }
    dialogBox.style.display = "block";
    dialogBox.scrollTop = 0;
    this.#isDialog = true;
    this.#isPaused = true;
  }
  static closeDialog () {
    document.getElementById('dialogBox').style.display = 'none'; 
    this.#isPaused = false; 
    this.#isDialog = false;

    // complete the interaction
    this.#currentInteraction.runInteraction();
    this.#currentInteraction = undefined;

    // turn npc back to default position
    if (this.#currentNPC != undefined) {
      this.#currentNPC.setCurrentElement(this.#currentNPC.getDefaultDirection() + "_Standing");
      this.#currentNPC = undefined;
    }
  }

  static openPauseMenu () {
    let pauseMenu = document.getElementById("pauseMenu");
    if (this.#canvas.width < this.#canvas.height) {
      pauseMenu.style.width = "80%";
    } else {
      pauseMenu.style.width = "40%";
    }
    pauseMenu.style.display = "block";
    pauseMenu.scrollTop = 0;
    this.#isPaused = true;
    this.#isPauseMenu = true;
    if (this.#currentMinigame != undefined) {
      this.#currentMinigame.setPaused(true);
    }
  }
  static closePauseMenu() {
    let pauseMenu = document.getElementById("pauseMenu");
    pauseMenu.style.display = "none";
    Game.#isPaused = false; //called from button cannot access this
    Game.#isPauseMenu = false;
    if (Game.#currentMinigame != undefined) {
      Game.#isPaused = true;
      Game.#currentMinigame.setPaused(false);
    }
  }

  static openQuestLog() {
    let questLog = document.getElementById("questLog");
    questLog.innerHTML = "<style>#questLogButtons {position: relative; z-index: 1; display: block; background-color: #660099; color: yellow; width : 100%; border: none; margin-top: 1.5em; font-size: 5vmin; font-family: 'Press Start 2P', cursive; word-wrap: break-word; padding: 0.5em;} #questLogButtons:hover {background-color: #bb33ff} #questLogExpanded {position: relative; display: none; background-color: #3a0057; color: yellow; width : 100%; border: none; font-size: 1em; font-family: 'Press Start 2P', cursive; word-wrap: break-word; padding: 0.25em;} #questSelect {width: 40%; left: 80%; background-color: #660099; color: yellow; font-family: 'Press Start 2P', cursive; border: solid 0.1em;} #questSelect:hover {background-color: #bb33ff}</style>";
    let questLogTitle = document.createElement("h1")
    questLogTitle.setAttribute("style","position: relative; text-shadow: 0.1em 0.1em #660099, -0.1em 0.1em #660099, 0.1em -0.1em #660099, -0.1em -0.1em #660099; display: block;  color: yellow;  margin-top: 0.75em; font-size: 5vmin; font-family: 'Press Start 2P', cursive; word-wrap: break-word; text-align:center;" );
    questLogTitle.innerHTML = "Quest Log"
    questLog.appendChild(questLogTitle);
        
    this.#isQuestLogOpen = true;
    if (this.#currentMinigame != undefined) {
      this.#currentMinigame.setPaused(true);
    }

    if (this.#canvas.width < this.#canvas.height) {
      questLog.style.width = "80%";
    } else {
      questLog.style.width = "40%";
    }
    
    for (let questId of this.#player.getCurrentQuests()) {
      let quest = this.#allQuests[questId];
      let tempButton = document.createElement("button");
      tempButton.setAttribute("id", "questLogButtons");
      tempButton.innerHTML = quest.getTitle()+"<br>";
      let tempSelectButton = document.createElement("button");
      tempSelectButton.setAttribute("id", "questSelect");
      tempSelectButton.style.backgroundColor = ((this.#player.getSelectedQuest() == questId) ? "green" : "#660099")
      tempSelectButton.innerHTML = ((this.#player.getSelectedQuest() ==questId) ? "Selected" : "Not Selected")
      tempSelectButton.onclick = function () {
        if (Game.#player.getSelectedQuest() == questId) {
          tempSelectButton.innerHTML = "Not Selected"
          Game.setSelectedQuest(-1)
        } else {
          Game.setSelectedQuest(questId)
        }
        Game.closeQuestLog();
        Game.openQuestLog();
      }
      tempButton.appendChild(tempSelectButton);
      let expanded = document.createElement("div");
      expanded.setAttribute("id","questLogExpanded");
      if (quest.getTargetCount() > 0) {
        expanded.innerHTML = (quest.getDescription() + "<br>" + this.#player.getQuestCount(questId) + "/" + quest.getTargetCount());  
      } else {
        expanded.innerHTML = quest.getDescription();
      }
      

      tempButton.onclick = function () {if (expanded.style.display == "none") {
        expanded.style.display = "block";
      } else {
        expanded.style.display = "none";
      }
    };
      questLog.appendChild(tempButton);
      questLog.appendChild(expanded);
       
    } 
    questLog.style.display = "block";
    //this.#isPaused = true; //If we want to pause on quest log 
  }

  static closeQuestLog() {
    let questLog = document.getElementById("questLog");
    questLog.style.display = "none";
    this.#isQuestLogOpen = false;
    if (this.#currentMinigame != undefined) {
      this.#currentMinigame.setPaused(false);
    }
    //this.#isPaused = false;
  }

  static setSelectedQuest(questid) {
    this.#player.setSelectedQuest(questid);
    this.updateStatDisplay();
  }

  static updateSelectedQuestDisplay() {
    let questid = this.#player.getSelectedQuest();
    if (questid >= 0) {
      let tempQuest = this.#allQuests[questid];
      let selectedQuestDisplay = document.getElementById("selectedquest")
      selectedQuestDisplay.innerHTML = tempQuest.getTitle();
      if (tempQuest.getTargetCount() > 0) {
        selectedQuestDisplay.innerHTML += "<br>"+this.#player.getQuestCount(questid)+"/"+tempQuest.getTargetCount();
      }
      selectedQuestDisplay.style.display = "block";
    } else {
      let selectedQuestDisplay = document.getElementById("selectedquest")
      selectedQuestDisplay.style.display = "none";
    }
  }

  static updateStatDisplay() {
    let selectedQuestDisplay = document.getElementById("statdisplay")
    this.updateSelectedQuestDisplay()
    selectedQuestDisplay.innerHTML = "";
    selectedQuestDisplay.innerHTML += "Hunger: " + this.#player.getStat("hunger") +"%<br>";
    selectedQuestDisplay.innerHTML += "Fatigue: " + this.#player.getStat("sleep") +"%<br>";
    selectedQuestDisplay.innerHTML += "<br>€" + this.#player.getStat("money") +"<br>";

  }

  static openStatWindow() {
    this.saveScore();
    this.#isStatWindow = true;
    if (this.#currentMinigame != undefined) {
      this.#currentMinigame.setPaused(true);
    }
    let statWindow = document.getElementById("statWindow")
    statWindow.innerHTML = "<h1 style='font-size: 1.5em; color:yellow; text-shadow: 0.1em 0.1em #660099, -0.1em 0.1em #660099, 0.1em -0.1em #660099, -0.1em -0.1em #660099;'>STATS</h1>"
    statWindow.innerHTML += "Hunger: " + this.#player.getStat("hunger") +"%<br>";
    statWindow.innerHTML += "Fatigue: " + this.#player.getStat("sleep") +"%<br>";
    statWindow.innerHTML += "Grades: " + this.#player.getStat("grades") +"<br>";
    statWindow.innerHTML += "Social Life: " + this.#player.getStat("socialLife") +"<br>";
    statWindow.innerHTML += "<br>€" + this.#player.getStat("money") +"<br>";
    statWindow.innerHTML += "<br>Overall Scrore: " + this.#score +"<br>";
    statWindow.style.display = "block";
  }

  static closeStatWindow() {
    this.#isStatWindow = false;
    statWindow.style.display = "none";
    if (this.#currentMinigame != undefined) {
      this.#currentMinigame.setPaused(false);
    }
  }


  static async startMinigame(game, victory, loss) {
    this.#isPaused = true;
    // creates minigame div
    let minigameDiv = document.createElement("div");
    minigameDiv.setAttribute('id', 'minigame');
    minigameDiv.setAttribute('style',"position:absolute; width:90%; height:90%; top:50%; left:50%; transform:translate(-50%,-50%); border:solid #660099 5px; z-index:1;");
    document.getElementById(this.#divId).appendChild(minigameDiv);

    // loads the script, but only if it isn't already loaded
    if (!this.#loadedMinigames.includes(game)) {
      let loaded = false;
      let gameScript = document.createElement("script");
      gameScript.onload = () => loaded = true;
      gameScript.setAttribute('type', 'text/javascript');
      gameScript.setAttribute('src', 'objects/minigames/' + game + '.js');
      document.getElementById(this.#divId).appendChild(gameScript);
      this.#loadedMinigames.push(game);

      while (!loaded) {
        let wait = new Promise(function(resolve, reject) {
          setTimeout(resolve, 100);
        });
        await wait;
      }
    }

    // creates a new instance of the appropriate game class and starts the minigame
    let gameClass = game.charAt(0).toUpperCase() + game.slice(1) + "Game";
    this.#currentMinigame = eval('new ' + gameClass + '("minigame",'+this.#isMobile+","+victory+","+loss+')');
    this.#currentMinigame.startGame()
  }

  static endMinigame(game) {
    // removes the div and any leftover listeners
    let div = document.getElementById("minigame");
    div.parentNode.removeChild(div);
    this.#currentMinigame.removeInputListeners();

    // discards the minigame object (garbage collected)
    this.#currentMinigame = undefined;
    // game is resumed when the win/loss dialog is closed
  }


  

}
