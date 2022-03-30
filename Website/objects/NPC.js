class NPC {
  // atrribute declaration
  #id;
  #name;
  #coords;
  #characterType;
  #elements;
  #currentElement;
  #interactions;
  #defaultDirection;
  #room;
  


  constructor(id, name, coords, characterType, interactions, defaultDirection) {
    this.#id = id;
    this.#name = name;
    this.#coords = coords;
    this.#characterType = characterType;
    this.#defaultDirection = defaultDirection
    this.#currentElement = defaultDirection + "_Standing";
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

  getCharacterType() {
    return this.#characterType;
  }
  setCharacterType(characterType) {
    this.#characterType = characterType;
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

  getInteractions() {
    return this.#interactions;
  }
  setInteractions(interactions) {
    this.#interactions = interactions;
  }

  getDefaultDirection() {
    return this.#defaultDirection;
  }
  setDefaultDirection(defaultDirection) {
    this.#defaultDirection = defaultDirection
  }

  getRoom() {
    return this.#room;
  }
  setRoom(room) {
    this.#room = room;
  }


  // decides which interaction to run and runs it
  checkInteractions() {
    // loops through the npc's interactions in order of priority
    for (let id of this.#interactions) {
      let interaction = Game.getInteraction(id);
      if (interaction.checkRequirements()) {
        Game.setCurrentInteraction(interaction);
        // displays dialog in game
        Game.displayDialog();
        break
      }
    }
  }
}