class Map {
	//attributes
	#mapSize = {"width" : 96, "height" : 64};
	#backgroundElement;
	#foregroundElement;
	#pxPerTile;
	#tempData;
	#collisionBounds;
	#warpPoints;
	#overlapBounds;

	constructor(backgroundElement, foregroundElement, pxPerTile) {
		this.#backgroundElement = backgroundElement;
		this.#foregroundElement = foregroundElement;
		this.#pxPerTile = pxPerTile;
		this.#tempData = JSON.parse(data); // data.json input in html
		this.#collisionBounds = data["collisionBounds"];
		this.#warpPoints = data["warpPoints"];
		this.#overlapBounds = data["overlapBounds"];
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