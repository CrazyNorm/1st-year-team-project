class Map {
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
		this.#tempData = JSON.parse(data.replace(/(?:\r\n|\r|\n)/g)); // data.json input in html
		this.#collisionBounds = data["collisionBounds"];
		this.#warpPoints = data["warpPoints"];
		this.#overlapBounds = data["overlapBounds"];
	}

	getBackgroundElement() {
		return this.#backgroundElement;
	}

	getForegroundElement() {
		return this.#foregroundElement;
	}
}