/**
 * Chat helper functions for MythCraft RPG System
 */

/**
 * Create a chat message for dice rolls
 * @param {Object} messageData - Message data object
 * @param {Roll} roll - The roll object
 * @param {Object} options - Additional options
 */
export async function createRollMessage(messageData, roll, options = {}) {
  const template = "systems/mythcraft/templates/chat/roll-card.hbs";
  const templateData = {
    ...messageData,
    roll: roll,
    rollTotal: roll.total,
    rollFormula: roll.formula,
    rollTooltip: await roll.getTooltip(),
    ...options
  };

  const content = await renderTemplate(template, templateData);
  
  const chatData = foundry.utils.mergeObject({
    user: game.user.id,
    speaker: ChatMessage.getSpeaker(),
    content: content,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    roll: roll,
    rollMode: game.settings.get("core", "rollMode")
  }, messageData);

  return ChatMessage.create(chatData);
}

/**
 * Create a chat message for item usage
 * @param {Object} item - The item being used
 * @param {Object} options - Additional options
 */
export async function createItemMessage(item, options = {}) {
  const actor = item.parent;
  const template = "systems/mythcraft/templates/chat/item-card.hbs";
  const templateData = {
    actor: actor,
    item: item,
    system: item.system,
    ...options
  };

  const content = await renderTemplate(template, templateData);
  
  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({actor: actor}),
    content: content,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER
  };

  return ChatMessage.create(chatData);
}

/**
 * Create a chat message for spell casting
 * @param {Object} spell - The spell being cast
 * @param {Object} options - Additional options
 */
export async function createSpellMessage(spell, options = {}) {
  const actor = spell.parent;
  const template = "systems/mythcraft/templates/chat/spell-card.hbs";
  const templateData = {
    actor: actor,
    spell: spell,
    system: spell.system,
    ...options
  };

  const content = await renderTemplate(template, templateData);
  
  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({actor: actor}),
    content: content,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER
  };

  return ChatMessage.create(chatData);
}

/**
 * Create a chat message for talent usage
 * @param {Object} talent - The talent being used
 * @param {Object} options - Additional options
 */
export async function createTalentMessage(talent, options = {}) {
  const actor = talent.parent;
  const template = "systems/mythcraft/templates/chat/talent-card.hbs";
  const templateData = {
    actor: actor,
    talent: talent,
    system: talent.system,
    ...options
  };

  const content = await renderTemplate(template, templateData);
  
  const chatData = {
    user: game.user.id,
    speaker: ChatMessage.getSpeaker({actor: actor}),
    content: content,
    type: CONST.CHAT_MESSAGE_TYPES.OTHER
  };

  return ChatMessage.create(chatData);
}