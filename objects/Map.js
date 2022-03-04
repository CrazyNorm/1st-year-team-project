class Map {
	//attributes
	#mapSize;
	#backgroundElement;
	#foregroundElement;
	#pxPerTile;
	#collisionBounds;
	#warpPoints;
	#overlapBounds;

	constructor(backgroundElement, foregroundElement, width, height) {
		this.#backgroundElement = backgroundElement;
		this.#foregroundElement = foregroundElement;
		this.#mapSize = {"width" : width, "height" : height};
		let tempData = JSON.parse(data); // data.json input in html
		this.#collisionBounds = tempData["collisionBounds"];
		this.#warpPoints = tempData["warpPoints"];
		this.#overlapBounds = tempData["overlapBounds"];
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

	getOverlapPoints() {
		return this.#overlapBounds;
	}

	getPxPerTile() {
		return this.#pxPerTile;
	}
	setPxPerTile() {
		return this.#pxPerTile;
	}



}