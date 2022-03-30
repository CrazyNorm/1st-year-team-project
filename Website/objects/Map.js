class Map {
	//attributes
	#mapSize;
	#backgroundElement;
	#foregroundElement;
	#pxPerTile;
	#collisionBounds;
	#warpPoints;
	#overlapBounds;
	#roomBounds;

	constructor(backgroundElement, foregroundElement, width, height) {
		this.#backgroundElement = backgroundElement;
		this.#foregroundElement = foregroundElement;
		this.#mapSize = {"width" : width, "height" : height};
		let tempData = JSON.parse(data)[0]; // data.json input in html
		this.#collisionBounds = tempData["collisionBounds"];
		this.#warpPoints = tempData["warpPoints"];
		this.#overlapBounds = tempData["overlapBounds"];
		this.#roomBounds = tempData["roomBounds"];
	}


	//GETTERS AND SETTERS
	getBackgroundElement() {
		return this.#backgroundElement;
	}

	getForegroundElement() {
		return this.#foregroundElement;
	}

	getMapSize() {
		return this.#mapSize;
	}
	getMapWidth() {
		return this.#mapSize.width;
	}
	getMapHeight() {
		return this.#mapSize.height;
	}

	getCollisionBounds() {
		return this.#collisionBounds;
	}

	getWarpPoints() {
		return this.#warpPoints;
	}
	setWarpPoints(warpPoints) {
		this.#warpPoints = warpPoints;
	}

	getOverlapPoints() {
		return this.#overlapBounds;
	}

	getPxPerTile() {
		return this.#pxPerTile;
	}
	setPxPerTile(pxPerTile) {
		this.#pxPerTile = pxPerTile;
	}

	getRoomBounds() {
		return this.#roomBounds;
	}



}