class NPC {
  // atrribute declaration
  #id;
  #name;
  #coords;
  #character;
  #elements;
  #currentElement;
  #interactions;


  constructor(id, name, coords, character, interactions) {
    this.#id = id;
    this.#name = name;
    this.#coords = coords;
    this.#character = character;
    this.#currentElement = "S_Standing";
    this.#interactions = interactions;
  }


  // getters and setters
  getId() {
    return this.#id;
  }
  setid(id) {
    this.#id = id;
  }

  getName() {
    return this.#name;
  }
  setName(name) {
    this.#name = name;
  }

  getCoords() {
    return this.#coords;
  }
  setCoords(x, y) {
    this.#coords.x = x;
    this.#coords.y = y;
  }

  getCharacter() {
    return this.#character;
  }
  setCharacter(character) {
    this.#character = character;
  }

  getElements() {
    return this.#elements;
  }
  setElements(elements) {
    this.#elements = elements;
  }

  getCurrentElement() {
    return this.#currentElement;
  }
  setCurrentElement(currentElement) {
    this.#currentElement = currentElement;
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