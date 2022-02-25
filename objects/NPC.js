class NPC {
	// atrribute declaration
	#elements;
	#coords;
	#elements;
	#interactions;


	constructor(elements, coords, elements, interactions) {
		this.#elements = elements;
		this.#coords = coords;
		this.#elements = elements;
		this.#interactions = interactions;
	}


	// getters and setters
	getName() {
		return #name;
	}
	setName(name) {
		this.#name = name;
	}

	getCoords() {
		return #coords;
	}
	setCoords(coords) {
		this.#coords = coords;
	}

	getElements() {
		return #elements;
	}
	setElements(elements) {
		this.#elements = elements;
	}

	getInteractions() {
		return #interactions;
	}
	setInteractions(interactions) {
		this.#interactions = interactions;
	}


	// decides which interaction to run and runs it
	checkInteractions() {
		// loops through the npc's interactions in order of priority
		for (id of #interactions) {
			let interaction = Game.getInteraction(id);
			let player = Game.getPlayer();

			// quest requirements
			let qRequirements = interaction.getQuestRequirements();
			let qCompleted = player.getCompletedQuests();
			// checks if every element of the requirements list is in the completed list
			let qBool = qRequirements.every(e => qCompleted.includes(e));

			// interaction requirements
			let iRequirements = interaction.getInteractionRequirements();
			let iCompleted = player.getCompletedInteractions();
			// checks if every element of the requirements list is in the completed list
			let iBool = iRequirements.every(e => iCompleted.includes(e));

			if (qBool && iBool) {
				// if all quest and interaction requirements are met for the current interaction,
				// calls the runInteraction method and stops looping
				interaction.runInteraction();
				break
			}
		}
	}
}