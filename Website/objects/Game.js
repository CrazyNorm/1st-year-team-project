class Game {
  // game-related attributes
  static #player_id;
  static #score;
  static #player;
  static #npcList;
  static #allQuests;
  static #allInteractions;
  static #map;
  static #backgroundMusic;
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
  static #tutorialPages;
  static #tutorialIndex;
  static #tutorialIndicators;
  static #isMobile;
  static #isPaused;
  static #isTutorial;
  static #isQuestLogOpen;
  static #isDialog;
  static #isStatWindow;
  static #isPauseMenu;
  static #currentMinigame; // undefined if not in minigame
  static #loadedMinigames; // minigame scripts aren't loaded until needed, but should only be loaded once
  static #flashingStats;

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
    let playButton = document.getElementById("playButton");
    playButton.parentNode.removeChild(playButton);

    // keeps count of when everything has finished loading
    let maxLoad = 34; // doesn't need to be too accurate, just used for loading bar
    let toLoad = 0;
    let loaded = 0;
    function load() {
      loaded ++;
      fillBar.style.width = String(loaded / maxLoad * 100) + "%";
    }


    this.#divId = 'gameDiv';
    this.#player_id = userid;
    let gameDiv = document.getElementById(this.#divId);

    // sets up loading screen
    let loadingDiv = document.createElement("div");
    loadingDiv.setAttribute('style', 'position:absolute; height:100%; width:100%; background:white; z-index:2; display:flex; justify-content:center;');
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


    // tutorial screen
    this.#tutorialIndex = 0;
    this.#tutorialPages = [];
    let tutorialDiv = document.createElement('div');
    tutorialDiv.setAttribute('id','tutorial');
    tutorialDiv.setAttribute('style', 'position:absolute; height:90%; width:90%; top:50%; left:50%; transform:translate(-50%,-50%); background:white; border: solid yellow 5px; z-index:2; display:none;');
    gameDiv.appendChild(tutorialDiv);
    // forward/backward + start game buttons
    let backwardButton = document.createElement('button');
    backwardButton.setAttribute('id','backwardButton');
    backwardButton.innerHTML = "Prev.";
    backwardButton.setAttribute('style','position:absolute; z-index:1; bottom:10%; left:1%; transform:translate(0,50%); width:20%; height:10%; background:#660099; font-size:3vw; font-family:"Press Start 2P", cursive; color:yellow;');
    let backwardFunc = () => {
      if (this.#tutorialIndex == this.#tutorialPages.length - 1) {
        startGameButton.style.display = 'none';
        forwardButton.style.display = 'block';
      } 
      this.#tutorialPages[this.#tutorialIndex].style.display = 'none';
      this.#tutorialIndicators[this.#tutorialIndex].style.background = '#660099';
      this.#tutorialIndex --;
      if (this.#tutorialIndex == 0) {
        backwardButton.style.display = 'none';
      }
      this.#tutorialPages[this.#tutorialIndex].style.display = 'flex';
      this.#tutorialIndicators[this.#tutorialIndex].style.background = '#bb33ff';
    }
    backwardButton.onclick = backwardFunc;
    backwardButton.ontouchstart = backwardFunc;
    backwardButton.onmouseover = () => {backwardButton.style.backgroundColor = "#bb33ff"}
    backwardButton.onmouseout = () => {backwardButton.style.backgroundColor = "#660099"}
    tutorialDiv.appendChild(backwardButton);
    let forwardButton = document.createElement('button');
    forwardButton.innerHTML = "Next";
    forwardButton.setAttribute('style','position:absolute; z-index:1; bottom:10%; right:1%; transform:translate(0,50%); width:20%; height:10%; background:#660099; font-size:3vw; font-family:"Press Start 2P", cursive; color:yellow;');
    let forwardFunc = () => {
      if (this.#tutorialIndex == 0) {
        backwardButton.style.display = 'block';
      } 
      this.#tutorialPages[this.#tutorialIndex].style.display = 'none';
      this.#tutorialIndicators[this.#tutorialIndex].style.background = '#660099';
      this.#tutorialIndex ++;
      if (this.#tutorialIndex == this.#tutorialPages.length - 1) {
        forwardButton.style.display = 'none';
        startGameButton.style.display = 'block';
      }
      this.#tutorialPages[this.#tutorialIndex].style.display = 'flex';
      this.#tutorialIndicators[this.#tutorialIndex].style.background = '#bb33ff';
    }
    forwardButton.onclick = forwardFunc;
    forwardButton.ontouchstart = forwardFunc;
    forwardButton.onmouseover = () => {forwardButton.style.cursor = "pointer"; forwardButton.style.backgroundColor = "#bb33ff"}
    forwardButton.onmouseout = () => {forwardButton.style.cursor = "default"; forwardButton.style.backgroundColor = "#660099"}
    tutorialDiv.appendChild(forwardButton);
    let startGameButton = document.createElement('button');
    startGameButton.innerHTML = "Start";
    startGameButton.setAttribute('style','position:absolute; z-index:1; bottom:10%; right:1%; transform:translate(0,50%); width:20%; height:10%; background:#660099; font-size:3vw; font-family:"Press Start 2P", cursive; color:yellow;');
    let startFunc = () => {
      this.closeTutorial();
    }
    startGameButton.onclick = startFunc;
    startGameButton.ontouchstart = startFunc;
    startGameButton.onmouseover = () => {startGameButton.style.cursor = "pointer"; startGameButton.style.backgroundColor = "#bb33ff"}
    startGameButton.onmouseout = () => {startGameButton.style.cursor = "default"; startGameButton.style.backgroundColor = "#660099"}
    tutorialDiv.appendChild(startGameButton);
    // tutorial pages
    let newPage = () => {
      let tempPage = document.createElement('div');
      tempPage.setAttribute('style', 'position:absolute; height:100%; width:100%; top:0; left:0; display:none; justify-content:center; text-align:center; flex-direction:column;');
      tutorialDiv.appendChild(tempPage);
      this.#tutorialPages.push(tempPage);
    }
    newPage();
    let exampleText1 = document.createElement('p');
    let tutorialImg1 = document.createElement("img");
    tutorialImg1.src = "resources/imgs/tutorial/tutorialpage1.png"
    tutorialImg1.onload = load;
    toLoad++;
    this.#tutorialPages[0].appendChild(tutorialImg1);
    newPage();
    let exampleText2 = document.createElement('p');
    let tutorialImg2 = document.createElement("img");
    tutorialImg2.src = "resources/imgs/tutorial/tutorialpage2.png"
    tutorialImg2.onload = load;
    toLoad++;
    this.#tutorialPages[1].appendChild(tutorialImg2);
    // page indicators
    let indicatorsDiv = document.createElement('div');
    indicatorsDiv.setAttribute('style','position:absolute; z-index:1; bottom:10%; left:50%; transform:translate(-50%,50%); width:50%; height:10%; display:flex; justify-content:space-evenly; align-items:center;');
    tutorialDiv.appendChild(indicatorsDiv);
    this.#tutorialIndicators = [];
    for (let page of this.#tutorialPages) {
      let tempIndicator = document.createElement('span');
      tempIndicator.setAttribute('style','height:5vmin; width:5vmin; background:#660099;');
      indicatorsDiv.appendChild(tempIndicator);
      this.#tutorialIndicators.push(tempIndicator);
    }




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
    fullscrButton.setAttribute('style', "z-index: 1; position:absolute; width:10vmin; height:10vmin; top:0; left:0; background:#660099;");
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
    fullscrButton.onmouseover = () => {fullscrButton.style.cursor = "pointer";fullscrButton.style.backgroundColor = "#bb33ff"}
    fullscrButton.onmouseout = () => {fullscrButton.style.cursor = "default"; fullscrButton.style.backgroundColor = "#660099"}
    gameDiv.appendChild(fullscrButton);

    let tint = document.createElement("div");
    tint.setAttribute("id","tint");
    tint.setAttribute("style","position: absolute; width:100%; height: 100%; opacity:10%; background-color:orange;");
    gameDiv.appendChild(tint);

    let saveDisplay = document.createElement("div");
    saveDisplay.setAttribute("id","savedisplay");
    saveDisplay.setAttribute("style","padding: 0.5em; display: none; position: absolute; font-weight:bold; font-size: 2em; z-index:2; display:block; text-align:right; bottom:0%; right:0%;");
    gameDiv.appendChild(saveDisplay);

    //pause menu
    let pauseMenu = document.createElement("div");
    pauseMenu.setAttribute("id","pauseMenu");
    pauseMenu.setAttribute('style',"display: none; z-index: 2; position : relative; background-color : rgba(201,197,201,0.95); height: 80%; top:  50%; left:  50%; transform: translate(-50%,-50%); border-style: solid; border-width: 0.5em; border-color: #EEEEE; border-radius: 2em; overflow-y: auto;");
    gameDiv.appendChild(pauseMenu);
    pauseMenu.innerHTML = "<style>.menubutton {position: relative; display: block; background-color: #660099; color: yellow; width : 80%; border: solid; border-color: black; border-radius: 0.5em; margin-top: 2em; font-family: 'Press Start 2P', cursive; word-wrap: break-word; padding: 0.5em; text-align:center;} .menubutton:hover {background-color: #bb33ff; cursor: pointer;} a{color:orange}</style>";
    let pauseCentre = document.createElement("div");
    pauseCentre.setAttribute("style","display: flex; justify-content: center; align-items: center; flex-wrap: wrap; text-align: center; position: absolute; height:100%; width: 100%; top: 0; left: 0;");
    //align-items: center; justify-content: center; flex-direction: column
    pauseCentre.setAttribute("id","pauseCentre");
    pauseMenu.appendChild(pauseCentre);

    function makeButton(text, func) {
      let tempButton = document.createElement("button");
      tempButton.setAttribute("class", "menubutton");
      tempButton.innerHTML = text;
      tempButton.onclick = func;
      pauseCentre.appendChild(tempButton);
    }
    makeButton("Continue",Game.closePauseMenu);
    //mobile toggle button
    let toggleMobileButton = document.createElement("button");
    toggleMobileButton.setAttribute("class", "menubutton");
    toggleMobileButton.setAttribute("id","togglemobile");
    toggleMobileButton.innerHTML = "Mobile";
    toggleMobileButton.onclick = function() {Game.toggleMobile();};
    pauseCentre.appendChild(toggleMobileButton);

    makeButton("Stats",function(){Game.closePauseMenu(); Game.openStatWindow();});
    makeButton("Quest Log",function(){Game.closePauseMenu(); Game.openQuestLog();});
    makeButton("Leaderboard",function(){
      Game.savePlayer();
      window.open("leaderboard.php","name?").focus();});
    makeButton("Tutorial", function() {Game.closePauseMenu(); Game.openTutorial();});
    makeButton("Save",function() {Game.savePlayer(); Game.closePauseMenu();});
    makeButton("Quit",function(){
      Game.savePlayer();
      document.location.href = "homepage.html";
    });
    let credits = document.createElement("p");
    credits.setAttribute("id","credits");
    credits.setAttribute("style","position: relative; display: block; background-color: #660099; color: yellow; width : 80%; border: solid; border-color: black; border-radius: 0.5em; margin-top: 2em; font-family: 'Press Start 2P', cursive; word-wrap: break-word; padding: 0.5em; text-align:center;");
    credits.innerHTML = "Credits:<br>"
    credits.innerHTML += 'Main Game Music: Music by <a class="credit" href="/users/vic_b-6314823/?tab=audio&amp;utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=audio&amp;utm_content=7203">Vic_B</a> from <a class= "credit" href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=7203">Pixabay</a><br>';
    credits.innerHTML += 'Frogger music: Music by <a class="credit"href="/users/lemonmusicstudio-14942887/?tab=audio&amp;utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=audio&amp;utm_content=15299">lemonmusicstudio</a> from <a class="credit"href="https://pixabay.com/music/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=15299">Pixabay</a><br>';
    credits.innerHTML += 'NPC voice: <a class="credit" href="https://freesound.org/people/TheSubber13/sounds/239901/">This</a><br>';
    credits.innerHTML += 'Typer Music: <a class="credit" href="https://pixabay.com/music/id-21275/">Rock It</a><br>';
    credits.innerHTML += 'Typer Sounds Effect: <a class="credit" href="https://freesound.org/s/264388/">Button</a><br>';
    credits.innerHTML += 'Bartender Music: Music by <a class="credit" href="/users/lemonmusicstudio-14942887/?tab=audio&amp;utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=audio&amp;utm_content=15190">lemonmusicstudio</a> from <a class="credit" href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=music&amp;utm_content=15190">Pixabay</a>'


    //To add more copy and paste or ensure any html objects have a class of credit
    pauseCentre.appendChild(credits)

    //quest log
    let questLog = document.createElement("div");
    questLog.setAttribute("id","questLog");
    questLog.setAttribute('style',"display: none; z-index: 2; position : relative; background-color : rgba(201,197,201,0.95); height: 80%; top:  50%; left:  50%; transform: translate(-50%,-50%); border-style: solid; border-width: 0.5em; border-color: #EEEEE; border-radius: 2em; overflow-x: hidden; overflow-y: auto;");
    questLog.innerHTML = "<style>#questLogButtons {position: relative; display: block; background-color: #660099; color: yellow; width : 70%; border: solid; border-color: black; border-radius: 0.5em; margin-top: 2em; margin-left: 50%; transform: translateX(-50%); font-family: 'Press Start 2P', cursive; word-wrap: break-word; padding: 0.5em;} #questLogButtons:hover {background-color: #bb33ff}</style>";
    
    gameDiv.appendChild(questLog);

    //quest complete window
    let questComplete = document.createElement("div");
    questComplete.setAttribute("id","questcomplete");
    questComplete.setAttribute("style","z-index: 2; display:none; border-style: solid; border-radius: 2em; border-color: yellow; background-color: #660099; position: absolute; left: 50%; top: 5%; transform: translate(-50%,0%); padding: 0.5em; font-size: 1em; font-family: 'Press Start 2P', cursive; color: yellow; text-align: center;");
    gameDiv.appendChild(questComplete);

    

    //stat window
    let statWindow = document.createElement("div");
    statWindow.setAttribute("id","statWindow");
    statWindow.setAttribute('style',"font-family: 'Press Start 2P', cursive; display: none; z-index: 2; position : relative; background-color : rgba(201,197,201,0.95); top:  50%; left:  50%; transform: translate(-50%,-50%); border-style: solid; border-width: 0.5em; border-color: #EEEEE; border-radius: 2em; overflow-x: hidden; overflow-y: auto; text-align: center; max-width: 70%; padding: 1em;");
    gameDiv.appendChild(statWindow);

    let sideDiv = document.createElement("div");
    sideDiv.setAttribute("id", "sideContainer");
    sideDiv.setAttribute("style", "z-index: 0; position: relative; top: 15%")
    gameDiv.appendChild(sideDiv);


    //selected quest display
    let selectedQuestDisplay = document.createElement("div");
    selectedQuestDisplay.setAttribute("id","selectedquest");
    selectedQuestDisplay.setAttribute("style","display:block; z-index: 0; width: 30%; font-family: 'Press Start 2P', cursive;  padding: 0.5em; color: yellow; text-shadow: 0.1em 0.1em #660099, -0.1em 0.1em #660099, 0.1em -0.1em #660099, -0.1em -0.1em #660099; text-align: left; cursor: pointer;");
    sideDiv.appendChild(selectedQuestDisplay);

    //stat display
    let statDisplay = document.createElement("div");
    statDisplay.setAttribute("id","statdisplay");
    statDisplay.setAttribute("style","display:block; z-index: 0; position: absolute; max-width: 8em; font-family: 'Press Start 2P', cursive; color: yellow; text-shadow: 0.1em 0.1em #660099, -0.1em 0.1em #660099, 0.1em -0.1em #660099, -0.1em -0.1em #660099; text-align: left; border: solid; border-color: black; border-width: 0.25em; margin-left: 0.25em; background-color: rgba(255,255,255,0.4); line-height: 1.3em; cursor: pointer;");
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
    this.#isMobile = !this.#isMobile;

    // dialog
    let dialogBox = document.createElement("div");
    dialogBox.setAttribute("id","dialogBox");

    let pauseButton = document.createElement("div");
    pauseButton.setAttribute('style', "position:absolute; width:10vmin; height:10vmin; top:0; right:0; background:#660099;");
    pauseButton.onmouseover = () => {pauseButton.style.cursor = "pointer"; pauseButton.style.backgroundColor = "#bb33ff"}
    pauseButton.onmouseout = () => {pauseButton.style.cursor = "default"; pauseButton.style.backgroundColor = "#660099"}
    pauseButton.setAttribute('id',"pauseButton");
    gameDiv.appendChild(pauseButton);

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
    this.#isTutorial = false;
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
    let characterTypes = ['Female_Gareth','Gareth','Stewart','Blank','Player_Brown_Hair','Uli','KK','Angel_Gareth','Devil_Gareth'];

    
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
      for (let nPos = 0; nPos < this.#npcList.length; nPos++) {
        for (let interaction of this.#allQuests[qPos].getUpdatedByInteractions()) {
          if (this.#npcList[nPos].getInteractions().includes(interaction)) {
            this.#allQuests[qPos].addTargetNPC(nPos);
          }
        }
      }
      // if the quest has no requirements and is not active, activate it
      if (this.#allQuests[qPos].getInteractionRequirements().length == 0
          && this.#allQuests[qPos].getQuestRequirements().length == 0
          && !this.#player.getCurrentQuests().includes(this.#allQuests[qPos].getId())
          && !this.#player.getCompletedQuests().includes(this.#allQuests[qPos].getId())) {
        this.#player.addCurrentQuest(this.#allQuests[qPos].getId());
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

    for (let quest of this.#allQuests) {}

    this.setSelectedQuest(this.#player.getSelectedQuest());



   	// loading images
    for (let i in characterTypes) {
      // player
      if (this.#player.getCharacterType() == characterTypes[i]) {
        let tempDict = {};
        let spriteTypes = ['S_Standing','S_Walk_Left','S_Walk_Right',
                           'E_Standing','E_Walk_Left','E_Walk_Right',
                           'W_Standing','W_Walk_Left','W_Walk_Right',
                           'N_Standing','N_Walk_Left','N_Walk_Right'];
        for (let type of spriteTypes) {
          tempDict[type] = new Image();
          toLoad ++;
          tempDict[type].onload = load;
          tempDict[type].src = "resources/imgs/characters/" + characterTypes[i] + "/" + type + ".png";
        }
        this.#player.setElements(tempDict);
      }

      // npcs
      for (let npc of this.#npcList) {
        if (npc.getCharacterType() == characterTypes[i]) {
          let tempDict = {};
          let spriteTypes = ['S_Standing','E_Standing','W_Standing','N_Standing'];
          for (let type of spriteTypes) {
            tempDict[type] = new Image();
            toLoad ++;
            tempDict[type].onload = load;
            tempDict[type].src = "resources/imgs/characters/" + characterTypes[i] + "/" + type + ".png";
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


    // loading audio
    // interaction audio clips
    for (let interaction of this.#allInteractions) {
      if (interaction.getAudio() != "") {
        let tempAudio = new Audio();
        toLoad ++;
        tempAudio.oncanplaythrough = load;
        tempAudio.src = interaction.getAudio();
        tempAudio.controls = false;
        interaction.setAudio(tempAudio);
      }
    }

    // background music
    this.#backgroundMusic = new Audio();
    toLoad ++;
    this.#backgroundMusic.oncanplaythrough = load;
    this.#backgroundMusic.src = "resources/audio/background/background.mp3"; 
    this.#backgroundMusic.controls = false;
    this.#backgroundMusic.loop = true;


    // controls
    let outerCircle = document.createElement("div");
    // set id
    outerCircle.setAttribute('id', 'controls');
    // set styling
    outerCircle.setAttribute('style',"width: 25vmax; height:25vmax; position: absolute; bottom: 1em; right: 1em; border: 5px solid; border-radius: 50%; user-select: none; ")
    gameDiv.appendChild(outerCircle);

    let innerCircle = document.createElement("span");
    // set id
    innerCircle.setAttribute('id', 'joystick');
    // set styling
    innerCircle.setAttribute('style', "position: absolute; height: 25%; width:  25%; padding: 0; margin: auto; left: 0; top: 0; right: 0; bottom: 0; background-color: #660099; border: 3px solid; border-radius: 50%; display: inline-block;")
    outerCircle.appendChild(innerCircle);

    // interaction button
    let interactButton = document.createElement("div");
    interactButton.setAttribute("id","interactButton");
    interactButton.setAttribute("style", "width: 3em; height: 3em; position: absolute; left: 1em; bottom: 1em; border-radius: 50%; background-color: #660099; opacity: 0.6;");
    gameDiv.appendChild(interactButton);

    // sets the input listeners
    this.startInputListeners();

    // wait for everything to load
    while (loaded < toLoad) {
      let wait = new Promise(function(resolve, reject) {
        setTimeout(resolve, 100);
      });
      await wait;
    }

    this.#map = new Map(tempBackground, tempForeground, Math.round(tempBackground.naturalWidth/16), Math.round(tempBackground.naturalHeight/16))

    //allocate rooms to npcs and warps
    let roomBounds = this.#map.getRoomBounds();
    let warps = this.#map.getWarpPoints();
    for (let pos=0; pos<roomBounds.length; pos++) {
      for (let npc of this.#npcList) {
        if (this.#collisionDetector(npc.getCoords(),roomBounds[pos])) {
          npc.setRoom(pos);
        }
      }
      for (let warpIndex=0; warpIndex < warps.length; warpIndex++) {
        if (this.#collisionDetector({"x":warps[warpIndex].sX,"y":warps[warpIndex].sY},roomBounds[pos])) {
          warps[warpIndex]["sRoom"] = pos;
        }
        if (this.#collisionDetector({"x":warps[warpIndex].dX,"y":warps[warpIndex].dY},roomBounds[pos])) {
          warps[warpIndex]["dRoom"] = pos;
        }
      }
    }
    this.#map.setWarpPoints(warps);


    // resize the canvas
    this.resizeHandler();
    this.toggleMobile();

    this.draw();

    // starts the background music
    // NOTE - THIS is the ONLY reason we need a play button on the game page
    this.#backgroundMusic.play();

    // starts the main loop
    this.mainloop();

    // removes the loading screen
    loadingDiv.style.display = "none";
    // opens tutorial screen
    if (this.#player.getCompletedQuests().length == 0) {
      this.openTutorial();
    }
  }


  static async mainloop() {
    let moving = false;
    let direction;
    let totalMoved;
    let spriteDir = "S";
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
          let joystick = document.getElementById("joystick");
          let controls = document.getElementById("controls");
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
            let joystick = document.getElementById("joystick");
            let controls = document.getElementById("controls");
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
                this.#player.updateStat('hunger',-10);
                this.updateStatDisplay();
                console.log(this.#player.getCoords());
                break;
              case "KeyF":
                this.openStatWindow();
                break;
            }
          }

          if (this.checkSleepHunger()) {
            direction = {'x':0, 'y':0};
            spriteDir = 'S';
          };

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

    if (this.#player.getSelectedQuest() != -1) {
      this.drawArrow();
    }
    
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
    return this.#collisionDetector(this.#player.getCoords(),bounds)
  }
  static #collisionDetector(coords,bounds) {
    // utility function - returns true if the player overlaps the bounds in the parameter
    let xBool = bounds.tlX <= coords.x && coords.x <= bounds.brX;
    let yBool = bounds.tlY <= coords.y && coords.y <= bounds.brY;

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
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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
    xhr.open("GET","objects/database-scripts/loadPlayer.php?player_id="+this.#player_id);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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
    let saveDisplay = document.getElementById("savedisplay");
    saveDisplay.style.display = "block";
    saveDisplay.innerHTML = "Saving...";
    xhr.onload = function (e) {
      let saveDisplay = document.getElementById("savedisplay");
      saveDisplay.innerHTML = "Saved!";
      setTimeout(function () {document.getElementById("savedisplay").style.display = "none";}, 5000);
    }
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
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();

  }

  static saveScore() {
    this.#score = Math.floor((this.#player.getStat('money') + this.#player.getStat('grades') + this.#player.getStat('socialLife')) / 3);

    // uses ajax to save the player's current score to the database
    const xhr = new XMLHttpRequest();
    xhr.open("GET","objects/database-scripts/saveScore.php?" +
         "user_id=" + Game.getPlayerId() + 
         "&score=" + Game.getScore());
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
  }


  // listeners
  static async startInputListeners() {
    let wait = new Promise(function(resolve, reject) {
      setTimeout(resolve, 100);
    });
    await wait;
    // applies all the necessary input listeners to the relevant elements
    let div = document.getElementById(this.#divId);
    document.addEventListener('keydown', function() {Game.keyDownHandler(event)});
    document.addEventListener('keyup', function() {Game.keyUpHandler(event)});
    div.addEventListener('touchstart', function() {Game.touchStartHandler(event)});
    div.addEventListener('touchmove', function() {Game.touchMoveHandler(event)});
    div.addEventListener('touchend', function() {Game.touchEndHandler(event)});
    div.addEventListener('touchcancel', function() {Game.touchEndHandler(event)});
    div.addEventListener('mousedown', function() {Game.mouseDownHandler(event)});
    div.addEventListener('mouseup', function() {Game.mouseUpHandler(event)});
    div.addEventListener('mousemove', function() {Game.mouseMoveHandler(event)});
    window.addEventListener('resize', function() {Game.resizeHandler()});
    document.addEventListener('close', function() {window.open("leaderboard.php","nma?").open()
    Game.savePlayer()});
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
        case "ArrowDown":
          document.getElementById("dialogBox").scrollTop += 10;
          break;
        case "ArrowUp":
          document.getElementById("dialogBox").scrollTop -= 10;
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



  static mouseDownHandler(event) {
    let menuClosed = false
    if (!(this.#isDialog || this.#isQuestLogOpen ||this.#isPauseMenu)) {
      event.preventDefault();
    }
    if (event.button == 0) {
      this.#touchStarts.push({"clientX":event.clientX, "clientY": event.clientY, "identifier":"mouseDown"});
      let element = document.elementFromPoint(event.clientX, event.clientY);
      if (this.#isDialog && this.#currentMinigame == undefined) {
        // Closes the dialog if tapped outside of the dialog box
        if (element.id != "dialogBox") {
          this.closeDialog();
          menuClosed = true;
        }
      } else if (this.#isPauseMenu) {
        if (element.id != "pauseMenu" && element.id != "pauseCentre" && element.className != "menubutton" && element.id != "credits" && element.className != "credit") {
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
        this.#joystickTouch = {"clientX":event.clientX, "clientY": event.clientY, "identifier":"mouseDown"};
      } 
      if (!menuClosed && !this.#isTutorial) {
        if (element.id == "interactButton") {
          this.#interactTouch = {"clientX":event.clientX, "clientY": event.clientY, "identifier":"mouseDown"};
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

  static mouseMoveHandler(event) {
    if (!(this.#isDialog || this.#isPauseMenu || this.#isQuestLogOpen)) {
      event.preventDefault();
    } else if (this.#isQuestLogOpen && this.#isMobile) {
      event.preventDefault();
    }
    // if the joystick touch has moved, update it
    if (this.#joystickTouch != undefined) {
      if ("mouseDown" == this.#joystickTouch.identifier) {
        this.#joystickTouch = {"clientX":event.clientX, "clientY": event.clientY, "identifier":"mouseDown"};
      }
    }
  }

  static mouseUpHandler(event) {
    if (!(this.#isDialog || this.#isPauseMenu || this.#isQuestLogOpen)) {
      event.preventDefault();
    }
    // if the joystick touch has ended, remove it
    if (this.#joystickTouch != undefined) {
      if ("mouseDown" == this.#joystickTouch.identifier) {
        this.#joystickTouch = undefined;
      }
    }
    if (this.#interactTouch != undefined) {
      if ("mouseDown" == this.#interactTouch.identifier) {
        this.#interactTouch = undefined;
      } 
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
        if (element.id != "pauseMenu" && element.id != "pauseCentre" && element.className != "menubutton" && element.id != "credits" && element.class != "credit") {
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
      if (!menuClosed && !this.#isTutorial) {
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

    this.updateStatDisplay();

    this.draw();
  }


  // dialog & menus
  static async displayDialog () {
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

    // plays interaction audio if it exists
    let interactionAudio = this.#currentInteraction.getAudio();
    if (interactionAudio != "") {
      this.#backgroundMusic.volume = 0.3;
      interactionAudio.play();
      while (!interactionAudio.ended) {
        let waitPromise = new Promise(function(resolve, reject) {
          setTimeout(resolve, 100);
        });
        await waitPromise;
      }
      this.#backgroundMusic.volume = 1;
    }
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

  static openTutorial() {
    let div = document.getElementById('tutorial');
    div.style.display = 'block';
    this.#isPaused = true;
    this.#isTutorial = true;
    // resets to the first page
    let button = document.getElementById('backwardButton');
    this.#tutorialIndex = this.#tutorialPages.length-1;
    while (this.#tutorialIndex > 0) {
      button.click();
    }
  }

  static async closeTutorial() {
    let div = document.getElementById('tutorial');
    div.style.display = 'none';
    let waitPromise = new Promise(function(resolve, reject) {
      setTimeout(resolve,500);
    });
    await waitPromise;
    this.#isPaused = false;
    this.#isTutorial = false;
  }

  static openPauseMenu () {
    document.getElementById("statdisplay").style.display="none";
    document.getElementById("selectedquest").style.display="none";
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
    document.getElementById("statdisplay").style.display="block";
    document.getElementById("selectedquest").style.display="block";
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
    document.getElementById("statdisplay").style.display="none";
    document.getElementById("selectedquest").style.display="none";
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
    document.getElementById("statdisplay").style.display="block";
    document.getElementById("selectedquest").style.display="block";
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
    selectedQuestDisplay.style.maxWidth = (this.#canvas.width < this.#canvas.height ? "8em" : "14em"); 
    selectedQuestDisplay.innerHTML = "";
    selectedQuestDisplay.innerHTML += "Hunger: " + this.#player.getStat("hunger") + "%<br>";;
    selectedQuestDisplay.innerHTML += "Fatigue: " + this.#player.getStat("sleep") + "%<br>";
    selectedQuestDisplay.innerHTML += "<br>€" + this.#player.getStat("money") +"<br>";

  }

  static openStatWindow() {
    document.getElementById("statdisplay").style.display="none";
    document.getElementById("selectedquest").style.display="none";
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
    document.getElementById("statdisplay").style.display="block";
    document.getElementById("selectedquest").style.display="block";
    this.#isStatWindow = false;
    statWindow.style.display = "none";
    if (this.#currentMinigame != undefined) {
      this.#currentMinigame.setPaused(false);
    }
  }


  static async startMinigame(game, victory, loss) {
    this.#isPaused = true;
    // pauses the background music
    this.#backgroundMusic.pause();
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

    // resumes the background music
    this.#backgroundMusic.play();
    // discards the minigame object (garbage collected)
    this.#currentMinigame = undefined;
    // game is resumed when the win/loss dialog is closed
  }

  static toggleMobile() {
    let toggleMobileButton = document.getElementById("togglemobile")
    if (this.#isMobile) {
      toggleMobileButton.style.backgroundColor = "red";
      this.#isMobile = false;
      document.getElementById("dialogBox").setAttribute("style", "display: none; background-color: #c9c5c9; position: absolute; z-index: 1; bottom: 3%; left: 50%; transform:translate(-50%,0); width: 80%; height: 30vh; border: solid 0.3em; border-radius: 0.3em; font-size: 3em; font-family: 'Press Start 2P', cursive; text-align: center; overflow-y: auto; padding: 0.5em;");
      
      this.#tilesDesired = 20;

      document.getElementById("controls").style.display = "none";
      document.getElementById("joystick").style.display = "none";
      document.getElementById("interactButton").style.display = "none";

    } else { // Mobile version
      toggleMobileButton.style.backgroundColor = "green";
      this.#isMobile = true;

      document.getElementById("dialogBox").setAttribute("style", "display: none; background-color: #c9c5c9; position: absolute; z-index: 1; bottom: 3%; left: 50%; transform:translate(-50%,0); width: 80%; height: 30vh; border: solid 0.3em; border-radius: 0.3em; font-size: 1em; font-family: 'Press Start 2P', cursive; text-align: center; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 0.5em;");
      document.getElementById("pauseButton").style.display = "block"

      this.#tilesDesired = 15;

      document.getElementById("controls").style.display = "block";
      document.getElementById("joystick").style.display = "inline-block";
      document.getElementById("interactButton").style.display = "block";
    }
    this.updateSelectedQuestDisplay();
    this.resizeHandler();
  }

  static drawArrow(){
    this.#canvasContext.save();
    let arrowWidth = 10; // 

    let selectedQuest = this.#allQuests[this.#player.getSelectedQuest()];

    let headlen = 10;
    
    for (let npcid of selectedQuest.getTargetNPCs()) {
      if (this.#npcList[npcid].getName().charAt(0) == "-") {
        continue;
      }
      let playerRoom;
      let roomIndex = 0;
      let roomBounds = this.#map.getRoomBounds();
      let targetRoom = this.#npcList[npcid].getRoom();
      while (playerRoom == undefined) {
        if (roomIndex == roomBounds.length) {
          playerRoom = targetRoom;
        } else if (this.#playerCollision(roomBounds[roomIndex])) {
          playerRoom = roomIndex;
        }
        roomIndex++;
      } 

      let coords;
      let warps = this.#map.getWarpPoints();
      if (playerRoom == targetRoom) {
        coords = this.#npcList[npcid].getCoords();
      } else {
        let targets = [];
        for (let warpIndex = 0; warpIndex<warps.length; warpIndex++) {
          if (warps[warpIndex].dRoom == targetRoom) {
            targets.push(warpIndex);
          }
        }

        //finds the warp with source of player room and returns it if is in the array
        function findPlayerRoom(targets) {
          for (let target of targets) {
            if (warps[target].sRoom == playerRoom) {
              return target;
            }
          }
          return -1;
        }
        let target;
        while (findPlayerRoom(targets) < 0) {
          let tempTargets = [];
          for (let target of targets) {
            targetRoom = warps[target].sRoom;
            for (let warpIndex=0; warpIndex<warps.length; warpIndex++) {
              if (warps[warpIndex].dRoom == targetRoom) {
                tempTargets.push(warpIndex);
              }
            }
          }
          targets = tempTargets;
        }
        target = findPlayerRoom(targets);
        coords = {"x":warps[target].sX,"y":warps[target].sY};
      } 
      
      let canvasWidth = this.#canvas.width;
      let canvasHeight = this.#canvas.height;

      //console.log("Coords:",coords);
      let tempX = (coords.x) * this.#map.getPxPerTile() - this.#player.getCoordsPx().x;
      let tempY = (coords.y) * this.#map.getPxPerTile() - this.#player.getCoordsPx().y;

      let magnitude = Math.sqrt(tempX**2 + tempY**2);
      let scaledX = tempX/magnitude;
      let scaledY = tempY/magnitude;

      let tox;
      let toy;

      tox = (tempX > 0) ? Math.min(canvasWidth/2+scaledX*(canvasWidth/2),canvasWidth,canvasWidth/2+tempX) : Math.max(canvasWidth/2+scaledX*(canvasWidth/2),0,canvasWidth/2+tempX);
      toy = (tempY > 0) ? Math.min(canvasHeight/2+scaledY*(canvasHeight/2),canvasHeight,canvasHeight/2+tempY) : Math.max(canvasHeight/2+scaledY*(canvasHeight/2),0,canvasHeight/2+tempY);

      let fromx = tox - scaledX*Math.min(canvasHeight,canvasWidth)*0.1;
      let fromy = toy - scaledY*Math.min(canvasHeight,canvasWidth)*0.1;

      let angle = Math.atan2(toy-fromy,tox-fromx);
      this.#canvasContext.strokeStyle = "#660099";
   
      //starting path of the arrow from the start square to the end square
      //and drawing the stroke
      // console.log(fromx,fromy, tox, toy)
      this.#canvasContext.beginPath();
      this.#canvasContext.moveTo(fromx, fromy);
      this.#canvasContext.lineTo(tox, toy);
      this.#canvasContext.lineWidth = arrowWidth;
      this.#canvasContext.stroke();
   
      //starting a new path from the head of the arrow to one of the sides of
      //the point
      this.#canvasContext.beginPath();
      this.#canvasContext.moveTo(tox, toy);
      this.#canvasContext.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                 toy-headlen*Math.sin(angle-Math.PI/7));
   
      //path from the side point of the arrow, to the other side point
      this.#canvasContext.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
                 toy-headlen*Math.sin(angle+Math.PI/7));
   
      //path from the side point back to the tip of the arrow, and then
      //again to the opposite side point
      this.#canvasContext.lineTo(tox, toy);
      this.#canvasContext.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
                 toy-headlen*Math.sin(angle-Math.PI/7));
   
      //draws the paths created above
      this.#canvasContext.stroke();
      this.#canvasContext.restore();
    }
  }


  static checkSleepHunger() {
    // sets sleep/hunger speed penalty
    if (this.#player.getStat('sleep') >= 100 || this.#player.getStat('hunger') >= 100) {
      this.#player.setSpeed(1);
      if (this.#flashingStats == undefined) {
        this.#flashingStats = setInterval(() => {
          let statDisplay = document.getElementById("statdisplay");
          if (this.#player.getStat('sleep') >= 100 || this.#player.getStat('hunger') >= 100) {
            if (statDisplay.style.color == "yellow") {
              statDisplay.style.color = "red";
            } else {
              statDisplay.style.color = "yellow";
            }
          } else {
            statDisplay.style.color = "yellow";
            clearTimeout(this.#flashingStats);
            this.#flashingStats = undefined;
          }
        },500)
      }
      
    }

    if (this.#player.getStat('sleep') >= 100 && this.#player.getStat('hunger') >= 100) {
      this.#isPaused = true;
      // turns the screen black
      let blackOut = document.createElement('div');
      blackOut.setAttribute('style','position:absolute; top:0; left:0; width:100%; height:100%; background-color:black; opacity:0;');
      document.getElementById(this.#divId).appendChild(blackOut);

      let consequences = () => {
        // moves back to starting position
        this.#player.setTimeOfDay(0);
        this.#player.setCoords(37,69);
        this.#player.setCoordsPx(this.#player.getCoords().x * this.#map.getPxPerTile(),
                                 this.#player.getCoords().y * this.#map.getPxPerTile());
        this.draw();

        // display dialog and decrease stats
        this.#currentInteraction = new Interaction(
          NaN,1,"You passed out from fatigue and hunger. <br>Money -100.","",{'money':-100, 'hunger':-100, 'sleep':-100},[],[],[]);
        this.displayDialog();
      }

      // fades out and back in
      let opacity = 0;
      let fade = setInterval(() => {
        opacity ++;
        blackOut.style.opacity = opacity / 100;
        if (opacity >= 100) {
          clearInterval(fade);
          setTimeout(() => {
            consequences();
            fade = setInterval(() => {
              opacity --;
              blackOut.style.opacity = opacity / 100;
              if (opacity <= 0) {
                clearInterval(fade);
                blackOut.parentNode.removeChild(blackOut);
              }
            }, 10);
          }, 500);
        }
      }, 10);

      return true; // used to stop the player moving when the black out ends
    }
  }
  

}
