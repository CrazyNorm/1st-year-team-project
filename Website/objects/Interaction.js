class Interaction {
  // attribute declaration
  #id;
  #isDefault;
  #dialog;
  #audio;
  #statChanges;
  #actions;
  #questRequirements;
  #interactionRequirements;
  #questsToStart;
  #questsToUpdate;


  constructor(id,
        isDefault,
        dialog,
        audio,
        statChanges,
        actions,
        questRequirements,
        interactionRequirements) {
    this.#id = id;
    this.#isDefault = isDefault;
    this.#dialog = dialog;
    this.#audio = audio;
    this.#statChanges = statChanges;
    this.#actions = actions;
    this.#questRequirements = questRequirements;
    this.#interactionRequirements = interactionRequirements;
    this.#questsToStart = [];
    this.#questsToUpdate = [];
  }


  // getters and setters
  getId() {
    return this.#id;
  }
  setId(id) {
    this.#id = id;
  }

  getIsDefault() {
    return this.#isDefault;
  }
  setIsDefault(isDefault) {
    this.#isDefault = isDefault;
  }

  getDialog() {
    return this.#dialog;
  }
  setDialog(dialog) {
    this.#dialog = dialog;
  }

  getAudio() {
    return this.#audio;
  }
  setAudio(audio) {
    this.#audio = audio;
  }

  getStatChanges() {
    return this.#statChanges;
  }
  setStatChanges(statChanges) {
    this.#statChanges = statChanges;
  }

  getActions() {
    return this.#actions;
  }
  setActions(actions) {
    this.#actions = actions;
  }

  getQuestRequirements() {
    return this.#questRequirements;
  }
  setQuestRequirements(questRequirements) {
    this.#questRequirements = questRequirements;
  }

  getInteractionRequirements() {
    return this.#interactionRequirements;
  }
  setInteractionRequirements(interactionRequirements) {
    this.#interactionRequirements = interactionRequirements;
  }

  getQuestsToStart() {
    return this.#questsToStart;
  }
  setQuestsToStart(questsToStart) {
    this.#questsToStart = questsToStart;
  }

  getQuestsToUpdate() {
    return this.#questsToUpdate;
  }
  setQuestsToUpdate(questsToUpdate) {
    this.#questsToUpdate = questsToUpdate;
  }


  // returns true if all elements in the requirements lists are in the appropriate completed lists;
  checkRequirements() {
    let player = Game.getPlayer();


    if (!player.getCompletedInteractions().includes(this.#id)) {
      // quest requirements
      let qCompleted = player.getCompletedQuests();
      // checks if every element of the requirements list is in the completed list
      let qBool = this.#questRequirements.every(e => qCompleted.includes(e));

      // interaction requirements
      let iCompleted = player.getCompletedInteractions();
      // checks if every element of the requirements list is in the completed list
      let iBool = this.#interactionRequirements.every(e => iCompleted.includes(e));

      return qBool && iBool;
    }
  }


  runInteraction() {
    let player = Game.getPlayer();

    // updates stats
    for (let stat in this.#statChanges) {
      player.updateStat(stat, this.#statChanges[stat]);
    }

    // runs actions in Game
    for (let method of this.#actions) {
      eval(method);
    }

    // mark this interaction as complete (default interactions aren't "completeable")
    if (!this.#isDefault) {
      player.finishInteraction(this.#id);
    }

    // run the check requirements method for all quests which require this interation
    for (let questId of this.#questsToStart) {
      Game.getQuest(questId).checkRequirements();
    }

    // runs the update method for all quests which are updated by this interaction
    for (let questId of this.#questsToUpdate) {
      Game.getQuest(questId).update();
    }
    Game.updateStatDisplay();
    player.incrementTime();
  }
}