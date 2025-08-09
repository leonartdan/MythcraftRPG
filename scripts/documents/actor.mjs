/**
 * Extend the base Actor document by defining a custom roll data structure.
 * @extends {Actor}
 */
export class MythCraftActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or active effects.
    const actorData = this;
    const systemData = actorData.system;

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
    if (actorData.type === 'npc') this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Calculate attribute modifiers
    for (let [key, attribute] of Object.entries(systemData.attributes)) {
      attribute.mod = attribute.value;
    }
  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Calculate attribute modifiers
    for (let [key, attribute] of Object.entries(systemData.attributes)) {
      attribute.mod = attribute.value;
    }
  }

  /** @override */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.mythcraft || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterDerivedData(actorData);
    if (actorData.type === 'npc') this._prepareNpcDerivedData(actorData);
  }

  /**
   * Prepare Character type derived data
   */
  _prepareCharacterDerivedData(actorData) {
    const systemData = actorData.system;

    // No defense calculations needed since defenses section was removed
  }

  /**
   * Prepare NPC type derived data
   */
  _prepareNpcDerivedData(actorData) {
    const systemData = actorData.system;

    // No defense calculations needed since defenses section was removed
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    const data = super.getRollData();

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the attribute scores to the top level, so that rolls can use
    // formulas like `@strength.value + 4`.
    if (data.attributes) {
      for (let [k, v] of Object.entries(data.attributes)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
  }

  /**
   * Roll an attribute check
   * @param {string} attributeId The attribute id (e.g. "strength")
   * @param {object} options Options which configure how ability tests are rolled
   * @returns {Promise<Roll>} The resulting roll
   */
  async rollAttribute(attributeId, options = {}) {
    const attribute = this.system.attributes[attributeId];
    if (!attribute) {
      ui.notifications.warn(`Invalid attribute: ${attributeId}`);
      return;
    }

    const rollData = this.getRollData();
    const formula = `1d20 + ${attribute.value}`;
    const roll = new Roll(formula, rollData);
    
    await roll.evaluate();
    
    const label = `${game.i18n.localize(`MYTHCRAFT.Attribute${attributeId.capitalize()}`)} Check`;
    
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: label,
      rollMode: game.settings.get('core', 'rollMode'),
    });

    return roll;
  }

  /**
   * Roll initiative for this actor
   * @param {object} options Options which configure how initiative is rolled
   * @returns {Promise<Roll>} The resulting roll
   */
  async rollInitiative(options = {}) {
    const awarenessValue = this.system.attributes.awareness?.value || 0;
    const rollData = this.getRollData();
    const formula = `1d20 + ${awarenessValue}`;
    const roll = new Roll(formula, rollData);
    
    await roll.evaluate();
    
    const label = game.i18n.localize("MYTHCRAFT.Initiative");
    
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: label,
      rollMode: game.settings.get('core', 'rollMode'),
    });

    return roll;
  }

  /**
   * Spend action points
   * @param {number} cost The cost in action points
   * @returns {Promise<Actor>} This actor after the update
   */
  async spendActionPoints(cost) {
    const currentAP = this.system.actionPoints.value;
    if (currentAP < cost) {
      ui.notifications.warn("Not enough Action Points!");
      return this;
    }

    return await this.update({
      "system.actionPoints.value": currentAP - cost
    });
  }

  /**
   * Rest to recover resources
   * @param {boolean} short Whether this is a short rest (true) or long rest (false)
   * @returns {Promise<Actor>} This actor after the update
   */
  async rest(short = true) {
    const updates = {};
    const system = this.system;

    if (short) {
      // Short rest - recover action points
      updates["system.actionPoints.value"] = system.actionPoints.max;
    } else {
      // Long rest - recover all resources
      updates["system.health.value"] = system.health.max;
      updates["system.actionPoints.value"] = system.actionPoints.max;
      updates["system.actionPoints.carried"] = 0;
    }

    await this.update(updates);
    
    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content: `${this.name} takes a ${short ? 'short' : 'long'} rest.`
    });
  }
}