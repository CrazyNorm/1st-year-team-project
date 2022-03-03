class NPC {
  // atrribute declaration
  #name;
  #coords;
  #elements;
  #interactions;


  constructor(name, coords, elements, interactions) {
    this.#name = name;
    this.#coords = coords;
    this.#elements = elements;
    this.#interactions = interactions;
  }


  // getters and setters
  getName() {
    return this.#name;
  }
  setName(name) {
    this.#name = name;
  }

  getCoords() {
    return this.#coords;
  }
  setCoords(coords) {
    this.#coords = coords;
  }

  getElements() {
    return this.#elements;
  }
  setElements(elements) {
    this.#elements = elements;
  }

  getInteractions() {
    return this.#interactions;
  }
  setInteractions(interactions) {
    this.#interactions = interactions;
  }


  // decides which interaction to run and runs it
  checkInteractions() {
    // loops through the npc's interactions in order of priority
    for (id of this.#interactions) {
      let interaction = Game.getInteraction(id);
      if (interaction.checkRequirements()) {
        // if all quest and interaction requirements are met for the current interaction,
        // calls the runInteraction method and stops looping
        interaction.runInteraction();
        break
      }
    }
  }
}