class Player { //TEST THIS
	#id;
	#coords;
	#coordsPx;
	#elements;
	#currentElement;
	#characterType;
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
		this.#speed = 4;
		this.#currentQuests = currentQuests;
		this.#selectedQuest = selectedQuest; 
		this.#completedInteractions = completedInteractions;
		this.#completedQuests = completedQuests;
		this.#questCounts = questCounts;
		this.setTimeOfDay(timeOfDay);	
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
	getStat(stat) {
		return this.#stats[stat];
	}
	updateStat(statid, statChange) {
		this.#stats[statid] += statChange;
		if (statid == 'hunger' || statid == 'sleep') {
			if (this.#stats[statid] > 100) {
				this.#stats[statid] = 100;
			} else if (this.#stats[statid] < 0) {
				this.#stats[statid] = 0;
			}
		}
		Game.updateStatDisplay();
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
		//returns quest id
		return this.#selectedQuest;
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
		let tint = document.getElementById("tint");
		switch (this.#timeOfDay) {
			case 0:
				tint.style.color = "orange";
				tint.opacity = "10%";
				break;
			case 1:
				tint.style.color = "orange";
				tint.opacity = "0%";
				break;
			case 2:
				tint.style.color = "orange";
				tint.opacity = "10%";
				break;
			case 3:
				tint.style.color = "black";
				tint.opacity = "10%";
				break;
			case 4:
				tint.style.color = "black";
				tint.opacity = "20%";
				break;
		}
	}

	incrementCurrentQuest(id, value){
		this.#questCounts[id] += value;
	}

	finishCurrentQuest(id) {
		if (id == this.#selectedQuest) {
			this.#selectedQuest = -1;
		}
		this.#currentQuests.splice(this.#currentQuests.indexOf(id),1);
		delete this.#questCounts[id];
		this.#completedQuests.push(id)
		let quest = Game.getQuest(id);
		let questComplete = document.getElementById("questcomplete");
		questComplete.innerHTML = "QUEST COMPLETE!!!<br>" + quest.getTitle();
		for (let stat in quest.getRewardStatChanges()) {
			if (stat == 'socialLife') {
				questComplete.innerHTML += '<br>' + 'Social Life ';
			}
			else {
				questComplete.innerHTML += "<br>" + stat.charAt(0).toUpperCase() + stat.slice(1) + ' ';
			}
			if (quest.getRewardStatChanges()[stat] >= 0) {
				questComplete.innerHTML += '+';
			}
			questComplete.innerHTML += quest.getRewardStatChanges()[stat] + ".";
		}
		questComplete.style.display = "block";
		questComplete.style.opacity = 1;
		setTimeout(function () {
			let timer = setInterval(function() {
				let questComplete = document.getElementById("questcomplete");
				questComplete.style.opacity -= 0.01
				if (questComplete.style.opacity <= 0) {
					questComplete.style.display = 'none';
					clearInterval(timer);
				}},25);
		},2000);
		
	}

	finishInteraction(id) {
		this.#completedInteractions.push(id);
	}

	incrementTime() { // Morning, Afternoon, Evening, Night, Early Morning
		this.#timeOfDay += 1;
		this.updateStat("sleep",5);
		this.updateStat("hunger",5);
		if (this.#timeOfDay > 4) {
			this.#timeOfDay = 0;
		}
		let tint = document.getElementById("tint");
		switch (this.#timeOfDay) {
			case 0:
				tint.style.backgroundColor = "orange";
				tint.style.opacity = "10%";
				break;
			case 1:
				tint.style.backgroundColor = "orange";
				tint.style.opacity = "0%";
				break;
			case 2:
				tint.style.backgroundColor = "black";
				tint.style.opacity = "10%";
				break;
			case 3:
				tint.style.backgroundColor = "black";
				tint.style.opacity = "30%";
				break;
			case 4:
				tint.style.backgroundColor = "black";
				tint.style.opacity = "10%";
				break;
		}
	}




	startAnimationWalk(direction) {
		let slow = false;
		let delay = 1000 / (this.#speed * 2);
		if (delay >= 250) {
			delay /= 1.5;
			slow = true;
		}
		Game.getPlayer().setCurrentElement(direction + "_Walk_Right");
		setTimeout(function() {
			Game.getPlayer().setCurrentElement(direction + "_Walk_Left");
			if (slow) {
				setTimeout(function() {
					Game.getPlayer().setCurrentElement(direction + "_Walk_Right");
					setTimeout(function() {
						Game.getPlayer().setCurrentElement(direction + "_Walk_Left");
					}, delay);
				}, delay);
			}
		}, delay);
	}


}