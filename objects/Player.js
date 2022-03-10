class Player { //TEST THIS
	#id;
	#coords;
	#coordsPx;
	#elements;
	#currentElement;
	#stats;
	#speed;
	#currentQuests;
	#selectedQuest;
	#completedInteractions;
	#completedQuests;
	#questCounts;
	#timeOfDay;

	constructor (	id,
					coords,
					characterType,
					stats,
					currentQuests,
					selectedQuest,
					completedInteractions,
					completedQuests,
					questCounts,
					timeOfDay) {
		this.#id = id;
		this.#coords = coords;
		this.#characterType = characterType;  // Change this
		//this.#elements = elements; // elements["(N|E|S|W)_(Walk|Standing)_(Left|Right)"]
		this.#currentElement = "S_Standing";
		this.#stats = stats; // stats["stat name"]
		this.#speed = 2;
		this.#currentQuests = currentQuests;
		this.#selectedQuest = selectedQuest; //index of currentQuests
		this.#completedInteractions = completedInteractions;
		this.#completedQuests = completedQuests;
		this.#questCounts = questCounts;
		this.#timeOfDay = timeOfDay;
	}

	getId () {
		return this.#id;
	}

	getCoords() {
		return this.#coords;
	}
	setCoords(x,y) {
		this.#coords = {"x":x,"y":y};
	}
	move(x,y) {
		this.#coords.x += x;
		this.#coords.y += y;
	}

	getCoordsPx() {
		return this.#coordsPx;
	}
	setCoordsPx(x,y) {
		this.#coordsPx = {"x":x,"y":y};
	}
	movePx(x,y) {
		this.#coordsPx.x += x;
		this.#coordsPx.y += y;
	}

	getCharacterType() {
		return this.#characterType;
	}
	setCharacterType(characterType) {
		this.#characterType = characterType
	}

	getElements() {
		return this.#elements;
	}
	setElements(elements) {
		this.#elements = elements;
	}
	getElement(name) {
		return this.#elements[name];
	}

	getCurrentElement() {
		return this.#currentElement;
	}
	setCurrentElement(currentElement) {
		this.#currentElement = currentElement;
	}

	getStats() {
		return this.#stats;
	}
	setStats(stats) {
		this.#stats = stats;
	}
	updateStat(statid, statChange) {
		this.#stats[statid] += statChange;
	}

	getSpeed() {
		return this.#speed;
	}
	setSpeed(speed) {
		this.#speed = speed;
	}

	getCurrentQuests() {
		return this.#currentQuests;
	}
	setCurrentQuests(currentQuests) {
		this.#currentQuests = currentQuests;
	}
	addCurrentQuest(id) {
		this.#currentQuests.push(id);
		this.#questCounts[id] = 0;
	}
	getCurrentQuest(index) { // BY INDEX
		return this.#currentQuests[index];
	}


	getSelectedQuest() {
		//returns quest id of selected quest index
		return this.#currentQuests[this.#selectedQuest];
	}
	setSelectedQuest(selectedQuest) {
		this.#selectedQuest = selectedQuest;
	}

	getCompletedInteractions() {
		return this.#completedInteractions;
	}
	setCompletedInteractions(completedInteractions) {
		this.#completedInteractions = completedInteractions;
	}

	getCompletedQuests() {
		return this.#completedQuests;
	}
	setCompletedQuests(completedQuests) {
		this.#completedQuests = completedQuests;
	}

	getQuestCounts() {
		return this.#questCounts;
	}
	setQuestCounts(questCounts) {
		this.#questCounts = questCounts;
	}

	getQuestCount(id) {
		return this.#questCounts[id];
	}

	getTimeOfDay() {
		return this.#timeOfDay;
	}
	setTimeOfDay(timeOfDay) {
		this.#timeOfDay = timeOfDay;
	}

	incrementCurrentQuest(id, value){
		this.#questCounts[id] += value;
	}

	finishCurrentQuest(id) {
		this.#currentQuests.splice(this.#currentQuests.indexOf(id),1);
		delete this.#questCounts[id];
		this.#completedQuests.push(id)
	}

	finishInteractionQuest(id) {
		this.#completedInteractions.push(id);
	}

	incrementTime() { // Morning, Afternoon, Evening, Night, Early Morning
		this.#time += 1;
		if (this.#time > 4) {
			this.#time = 0;
		}
	}


	startAnimationWalk(direction) {
		let delay = 1 / (this.#speed * 4);
		this.#currentElement = direction + "_Walk_Right";
		setTimeout(function() {
			this.#currentElement = direction + "_Walk_Left";
			setTimeout(function() {
				this.#currentElement = direction + "_Walk_Right";
				setTimeout(function() {
					this.#currentElement = direction + "_Walk_Left";
					setTimeout(function() {
						this.#currentElement = direction + "_Standing";
					}, delay);
				}, delay);
			}, delay);
		}, delay);
	}


}