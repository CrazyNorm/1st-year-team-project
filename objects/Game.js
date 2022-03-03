class Game {
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
}