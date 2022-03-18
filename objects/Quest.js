class Quest {
  // attribute declaration
  #id;
  #title;
  #description;
  #targetCount;
  #rewardStatChanges;
  #rewardActions;
  #questRequirements;
  #interactionRequirements;
  #questsToStart; 
  #questsToUpdate;
  #updatedByQuests;
  #updatedByInteractions;


  constructor(id,
        title,
        description,
        targetCount,
        rewardStatChanges,
        rewardActions,
        questRequirements,
        interactionRequirements,
        updatedByQuests,
        updatedByInteractions) {
    this.#id = id;
    this.#title = title;
    this.#description = description;
    this.#targetCount = targetCount;
    this.#rewardStatChanges = rewardStatChanges;
    this.#rewardActions = rewardActions;
    this.#questRequirements = questRequirements;
    this.#interactionRequirements = interactionRequirements;
    this.#updatedByQuests = updatedByQuests;
    this.#updatedByInteractions = updatedByInteractions;
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

  getTitle() {
    return this.#title;
  }
  setTitle(title) {
    this.#title = title;
  }

  getDescription() {
    return this.#description;
  }
  setDescription(description) {
    this.#description = description;
  }

  getRewardStatChanges() {
    return this.#rewardStatChanges;
  }
  setRewardStatChanges(rewardStatChanges) {
    this.#rewardStatChanges = rewardStatChanges;
  }

  getRewardActions() {
    return this.#rewardActions;
  }
  setRewardActions(rewardActions) {
    this.#rewardActions = rewardActions;
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

  getUpdatedByQuests() {
    return this.#updatedByQuests;
  }
  setUpdatedByQuests(updatedByQuests) {
    this.#updatedByQuests = updatedByQuests;
  }

  getUpdatedByInteractions() {
    return this.#updatedByInteractions;
  }
  setUpdatedByInteractions(updatedByInteractions) {
    this.#updatedByInteractions = updatedByInteractions;
  }


  // returns true if all elements in the requirements lists are in the appropriate completed lists;
  checkRequirements() {
    let player = Game.getPlayer();

    // only checks requirements if the quest is not already active
    if (!player.getCurrentQuests().includes(this.#id)) {
  	  // quest requirements
  	  let qCompleted = player.getCompletedQuests();
  	  // checks if every element of the requirements list is in the completed list
  	  let qBool = this.#questRequirements.every(e => qCompleted.includes(e));
  	  // interaction requirements
  	  let iCompleted = player.getCompletedInteractions();
  	  // checks if every element of the requirements list is in the completed list
  	  let iBool = this.#interactionRequirements.every(e => iCompleted.includes(e));

  	  // if all requirements are met, adds to the list of active quests
  	  if (qBool && iBool) {
  	    player.addCurrentQuest(this.#id);
	  }
	}
  }


  update() {
  	let player = Game.player();

  	// only updates the quest count if this quest is active and not complete
  	let active = player.getCurrentQuests().contain(this.#id);
  	let complete = player.getCompletedQuests.includes(this.#id);
  	if (active && !complete) {
  	  // increment quest count by 1
  	  player.incrementCurrentQuest(this.#id, 1);

  	  // checks if the target count has been reached
  	  if (player.getQuestCount(this.#id) >= this.#targetCount) {
  	  	// quest rewards
	    for (stat in this.#rewardStatChanges) {
	      // stats
	      player.updateStat(stat, this.#rewardStatChanges[stat]);
	    }
	    for (method of this.#rewardActions) {
	      eval(method);
	    }

	    // run the check requirements method for all quests which require this quest
	    for (quest of this.#questsToStart) {
	      quest.checkRequirements();
	    }
	    // runs the update method for all quests which are updated by this quest
	    for (quest of this.#questsToUpdate) {
	      quest.update();
	    }

	    // mark this quest as complete
	    Player.finishCurrentQuest(this.#id);
  	  }
  	}
  }
}