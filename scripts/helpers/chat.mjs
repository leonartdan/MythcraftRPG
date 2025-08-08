/**
 * Chat utility functions for MythCraft RPG
 */

/**
 * Create a chat message for an action roll
 * @param {Actor} actor - The actor performing the action
 * @param {string} rollFormula - The dice formula to roll
 * @param {string} label - Label for the roll
 * @param {Object} options - Additional options
 * @returns {Promise<ChatMessage>}
 */
export async function rollToChat(actor, rollFormula, label, options = {}) {
  const roll = new Roll(rollFormula, actor.getRollData());
  await roll.evaluate();
  
  const rollMode = options.rollMode || game.settings.get('core', 'rollMode');
  const speaker = ChatMessage.getSpeaker({ actor });
  
  return roll.toMessage({
    speaker,
    flavor: label,
    rollMode,
    ...options
  });
}

/**
 * Create a chat message for an attribute roll
 * @param {Actor} actor - The actor making the roll
 * @param {string} attribute - The attribute being rolled
 * @param {Object} options - Additional options
 * @returns {Promise<ChatMessage>}
 */
export async function rollAttribute(actor, attribute, options = {}) {
  const attr = actor.system.attributes[attribute];
  if (!attr) {
    ui.notifications.warn(`Invalid attribute: ${attribute}`);
    return;
  }
  
  const rollFormula = `1d20 + ${attr.value}`;
  const label = `${game.i18n.localize(`MYTHCRAFT.Attribute${attribute.capitalize()}`)} Check`;
  
  return rollToChat(actor, rollFormula, label, options);
}

/**
 * Create a chat message for initiative
 * @param {Actor} actor - The actor rolling initiative
 * @param {Object} options - Additional options
 * @returns {Promise<ChatMessage>}
 */
export async function rollInitiative(actor, options = {}) {
  const awarenessValue = actor.system.attributes.awareness?.value || 0;
  const rollFormula = `1d20 + ${awarenessValue}`;
  const label = game.i18n.localize("MYTHCRAFT.Initiative");
  
  return rollToChat(actor, rollFormula, label, options);
}

/**
 * Create a chat message for an attack roll
 * @param {Item} item - The weapon being used
 * @param {Object} options - Additional options
 * @returns {Promise<ChatMessage>}
 */
export async function rollAttack(item, options = {}) {
  const actor = item.actor;
  if (!actor) return;
  
  const attackAttribute = item.system.attributes?.attack || 'strength';
  const attributeValue = actor.system.attributes[attackAttribute]?.value || 0;
  const rollFormula = `1d20 + ${attributeValue}`;
  const label = `${item.name} Attack`;
  
  return rollToChat(actor, rollFormula, label, options);
}

/**
 * Create a chat message for a damage roll
 * @param {Item} item - The weapon being used
 * @param {Object} options - Additional options
 * @returns {Promise<ChatMessage>}
 */
export async function rollDamage(item, options = {}) {
  const actor = item.actor;
  if (!actor) return;
  
  const damageParts = item.system.damage?.parts || [];
  if (damageParts.length === 0) {
    ui.notifications.warn(`${item.name} has no damage formula configured.`);
    return;
  }
  
  const damageAttribute = item.system.attributes?.damage || 'strength';
  const attributeValue = actor.system.attributes[damageAttribute]?.value || 0;
  
  // Build damage formula from parts
  let damageFormula = damageParts.map(part => part[0]).join(' + ');
  if (attributeValue > 0) {
    damageFormula += ` + ${attributeValue}`;
  }
  
  const label = `${item.name} Damage`;
  
  return rollToChat(actor, damageFormula, label, options);
}

/**
 * Create a chat message for spell casting
 * @param {Item} spell - The spell being cast
 * @param {Object} options - Additional options
 * @returns {Promise<ChatMessage>}
 */
export async function castSpell(spell, options = {}) {
  const actor = spell.actor;
  if (!actor) return;
  
  const actionCost = spell.system.actionCost || 3;
  
  // Check if actor has enough action points
  if (actor.system.actionPoints.value < actionCost) {
    ui.notifications.warn("Not enough Action Points to cast this spell!");
    return;
  }
  
  // Spend action points
  await actor.update({
    "system.actionPoints.value": actor.system.actionPoints.value - actionCost
  });
  
  // Create chat message for spell casting
  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({ actor }),
    content: `
      <div class="mythcraft spell-cast">
        <header class="card-header flexrow">
          <img src="${spell.img}" title="${spell.name}" width="36" height="36"/>
          <h3 class="item-name">${spell.name}</h3>
        </header>
        <div class="card-content">
          <p><strong>Action Cost:</strong> ${actionCost} AP</p>
          <p><strong>Level:</strong> ${spell.system.level}</p>
          <p><strong>School:</strong> ${spell.system.school}</p>
          ${spell.system.description ? `<div class="description">${spell.system.description}</div>` : ''}
        </div>
      </div>
    `,
    flags: {
      mythcraft: {
        type: "spell",
        itemId: spell.id
      }
    }
  };
  
  return ChatMessage.create(chatData);
}