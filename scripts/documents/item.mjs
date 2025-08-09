/**
 * Extend the base Item document by defining a custom roll data structure.
 * @extends {Item}
 */
export class MythCraftItem extends Item {

  /**
   * Augment the basic Item data model with additional dynamic data.
   */
  prepareData() {
    // As with the actor class, items are documents that can have their data
    // preparation methods overridden (such as prepareBaseData()).
    super.prepareData();
  }

  /**
   * Prepare a data object which is passed to any Roll formulas which are created related to this Item
   * @private
   */
   getRollData() {
    // If present, return the actor's roll data.
    if ( !this.actor ) return null;
    const rollData = this.actor.getRollData();
    // Grab the item's system data as well.
    rollData.item = foundry.utils.deepClone(this.system);

    return rollData;
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {
    const item = this;

    // Initialize chat data.
    const speaker = ChatMessage.getSpeaker({ actor: this.actor });
    const rollMode = game.settings.get('core', 'rollMode');
    const label = `[${item.type}] ${item.name}`;

    // If there's no roll data, send a chat message.
    if (!this.system.formula) {
      ChatMessage.create({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
        content: item.system.description ?? ''
      });
    }
    // Otherwise, create a roll and send a chat message from it.
    else {
      // Retrieve roll data.
      const rollData = this.getRollData();

      // Invoke the roll and submit it to chat.
      const roll = new Roll(rollData.item.formula, rollData);
      // If you need to store the value first, uncomment the next line.
      // let result = await roll.roll({async: true});
      roll.toMessage({
        speaker: speaker,
        rollMode: rollMode,
        flavor: label,
      });
      return roll;
    }
  }

  /**
   * Roll an attack with this weapon
   */
  async rollAttack(options = {}) {
    if (this.type !== 'weapon') return;
    
    const actor = this.actor;
    if (!actor) return;

    // Check if actor has enough AP
    const apCost = this.system.actionCost || 2;
    if (actor.system.actionPoints.value < apCost) {
      ui.notifications.warn(`Not enough Action Points! Need ${apCost}, have ${actor.system.actionPoints.value}`);
      return;
    }

    const rollData = this.getRollData();
    const attackAttribute = this.system.attributes.attack || 'strength';
    const attributeMod = actor.system.attributes[attackAttribute]?.value || 0;
    
    const formula = `1d20 + ${attributeMod}`;
    const roll = new Roll(formula, rollData);
    
    const flavor = `${this.name} - Attack Roll`;
    
    // Spend the AP
    if (!options.preview) {
      await actor.spendActionPoints(apCost);
    }
    
    return roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: flavor,
      rollMode: game.settings.get('core', 'rollMode'),
    });
  }

  /**
   * Roll damage with this weapon
   */
  async rollDamage(options = {}) {
    if (this.type !== 'weapon') return;
    
    const actor = this.actor;
    if (!actor) return;

    const rollData = this.getRollData();
    const damageAttribute = this.system.attributes.damage || 'strength';
    const attributeMod = actor.system.attributes[damageAttribute]?.value || 0;
    
    // Get damage parts from weapon
    const damageParts = this.system.damage.parts || [["1d6", "bludgeoning"]];
    
    const flavor = `${this.name} - Damage Roll`;
    
    // Create individual damage roll messages
    for (let [formula, type] of damageParts) {
      const modifiedFormula = `${formula} + ${attributeMod}`;
      const roll = new Roll(modifiedFormula, rollData);
      
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `${flavor} (${type})`,
        rollMode: game.settings.get('core', 'rollMode'),
      });
    }
  }

  /**
   * Cast a spell
   */
  async castSpell(options = {}) {
    if (this.type !== 'spell') return;
    
    const actor = this.actor;
    if (!actor) return;

    // Check if actor has the required magic source
    const magicSource = this.system.magicSource;
    if (!actor.system.magicSources[magicSource]) {
      ui.notifications.warn(`${actor.name} does not have access to ${magicSource.capitalize()} magic!`);
      return;
    }

    // Check if actor has enough AP
    const apCost = this.system.actionCost || 3;
    if (actor.system.actionPoints.value < apCost) {
      ui.notifications.warn(`Not enough Action Points! Need ${apCost}, have ${actor.system.actionPoints.value}`);
      return;
    }

    // Check if actor has enough SP
    const spCost = this.system.spellPointCost || 1;
    if (actor.system.spellPoints && actor.system.spellPoints.value < spCost) {
      ui.notifications.warn(`Not enough Spell Points! Need ${spCost}, have ${actor.system.spellPoints.value}`);
      return;
    }

    const rollData = this.getRollData();
    
    // Create spell cast message
    const content = `
      <div class="mythcraft spell-cast">
        <h3>${this.name}</h3>
        <p><strong>Source:</strong> ${magicSource.capitalize()}</p>
        <p><strong>Level:</strong> ${this.system.level}</p>
        <p><strong>AP Cost:</strong> ${apCost}</p>
        <p><strong>SP Cost:</strong> ${spCost}</p>
        <div class="spell-description">
          ${this.system.description}
        </div>
      </div>
    `;

    // Spend the AP and SP
    if (!options.preview) {
      await actor.spendActionPoints(apCost);
      if (actor.system.spellPoints) {
        await actor.update({"system.spellPoints.value": actor.system.spellPoints.value - spCost});
      }
    }

    // Handle spell attacks or damage if configured
    if (this.system.actionType === 'attack') {
      // Make spell attack roll
      const spellAttackBonus = this.system.attackBonus || 0;
      const formula = `1d20 + ${spellAttackBonus}`;
      const roll = new Roll(formula, rollData);
      
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `${this.name} - Spell Attack`,
        rollMode: game.settings.get('core', 'rollMode'),
      });
    }

    if (this.system.damage.parts && this.system.damage.parts.length > 0) {
      // Roll spell damage
      for (let [formula, type] of this.system.damage.parts) {
        const roll = new Roll(formula, rollData);
        await roll.toMessage({
          speaker: ChatMessage.getSpeaker({ actor: this.actor }),
          flavor: `${this.name} - Damage (${type})`,
          rollMode: game.settings.get('core', 'rollMode'),
        });
      }
    }

    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode'),
    });
  }

  /**
   * Use a talent
   */
  async useTalent(options = {}) {
    if (this.type !== 'talent') return;
    
    const actor = this.actor;
    if (!actor) return;

    const content = `
      <div class="mythcraft talent-use">
        <h3>${this.name}</h3>
        <p><strong>Type:</strong> ${this.system.talentType.capitalize()}</p>
        <div class="talent-description">
          ${this.system.description}
        </div>
        ${this.system.benefits.length > 0 ? `
          <div class="talent-benefits">
            <strong>Benefits:</strong>
            <ul>
              ${this.system.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;

    return ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      content: content,
      rollMode: game.settings.get('core', 'rollMode'),
    });
  }

  /**
   * Roll a skill check
   */
  async rollSkill(options = {}) {
    if (this.type !== 'skill') return;
    
    const actor = this.actor;
    if (!actor) return;

    const rollData = this.getRollData();
    
    // Calculate total modifier: ability modifier + ranks + bonus
    const ability = this.system.governingAttribute || this.system.ability || 'intelligence';
    const abilityValue = actor.system.attributes[ability]?.value || 0;
    const ranks = this.system.ranks || 0;
    const bonus = this.system.bonus || 0;
    const totalModifier = abilityValue + ranks + bonus;

    const formula = `1d20 + ${totalModifier}`;
    const roll = new Roll(formula, rollData);
    
    const flavor = `${this.name} Skill Check`;
    
    return roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: flavor,
      rollMode: game.settings.get('core', 'rollMode'),
    });
  }
}