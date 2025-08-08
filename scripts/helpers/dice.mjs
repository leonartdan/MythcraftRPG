/**
 * Dice rolling helper functions for MythCraft RPG System
 */

/**
 * Roll a d20 with advantage, disadvantage, or normal
 * @param {string} mode - "advantage", "disadvantage", or "normal"
 * @param {number} modifier - Modifier to add to the roll
 * @returns {Roll} The Roll object
 */
export function rollD20({mode = "normal", modifier = 0} = {}) {
  let formula;
  
  switch (mode) {
    case "advantage":
      formula = "2d20kh1";
      break;
    case "disadvantage":
      formula = "2d20kl1";
      break;
    default:
      formula = "1d20";
  }
  
  if (modifier !== 0) {
    const sign = modifier >= 0 ? "+" : "";
    formula += `${sign}${modifier}`;
  }
  
  return new Roll(formula);
}

/**
 * Roll damage dice
 * @param {Array} damageParts - Array of [formula, type] damage parts
 * @param {Object} rollData - Actor roll data for substitutions
 * @returns {Roll} The Roll object
 */
export function rollDamage(damageParts, rollData = {}) {
  const parts = damageParts.map(part => part[0]).filter(p => p);
  if (parts.length === 0) return null;
  
  const formula = parts.join(" + ");
  return new Roll(formula, rollData);
}

/**
 * Roll an attribute check
 * @param {Object} attribute - The attribute object with value and mod
 * @param {Object} options - Roll options (advantage, disadvantage, etc.)
 * @returns {Roll} The Roll object
 */
export function rollAttribute(attribute, options = {}) {
  const mod = attribute.mod || 0;
  return rollD20({
    mode: options.mode || "normal",
    modifier: mod + (options.bonus || 0)
  });
}

/**
 * Roll a skill check
 * @param {Object} skill - The skill object
 * @param {Object} attribute - The governing attribute
 * @param {Object} options - Roll options
 * @returns {Roll} The Roll object
 */
export function rollSkill(skill, attribute, options = {}) {
  let modifier = attribute.mod || 0;
  modifier += skill.ranks || 0;
  modifier += skill.bonus || 0;
  
  // Add proficiency bonus if proficient
  if (skill.proficient) {
    modifier += options.proficiencyBonus || 0;
  }
  
  return rollD20({
    mode: options.mode || "normal",
    modifier: modifier + (options.bonus || 0)
  });
}

/**
 * Roll an attack roll
 * @param {Object} weapon - The weapon object
 * @param {Object} actor - The actor making the attack
 * @param {Object} options - Roll options
 * @returns {Roll} The Roll object
 */
export function rollAttack(weapon, actor, options = {}) {
  const attribute = actor.system.attributes[weapon.system.attributes?.attack || "strength"];
  let modifier = attribute?.mod || 0;
  
  // Add proficiency bonus if proficient
  if (weapon.system.proficient) {
    modifier += options.proficiencyBonus || 0;
  }
  
  return rollD20({
    mode: options.mode || "normal",
    modifier: modifier + (options.bonus || 0)
  });
}

/**
 * Roll initiative
 * @param {Object} actor - The actor rolling initiative
 * @param {Object} options - Roll options
 * @returns {Roll} The Roll object
 */
export function rollInitiative(actor, options = {}) {
  const dex = actor.system.attributes.dexterity;
  const awr = actor.system.attributes.awareness;
  const modifier = (dex?.mod || 0) + (awr?.mod || 0);
  
  return rollD20({
    mode: options.mode || "normal",
    modifier: modifier + (options.bonus || 0)
  });
}

/**
 * Roll a saving throw
 * @param {string} defense - The defense type ("physical", "mental", "social")
 * @param {Object} actor - The actor making the save
 * @param {Object} options - Roll options
 * @returns {Roll} The Roll object
 */
export function rollSave(defense, actor, options = {}) {
  const defenseValue = actor.system.defenses[defense]?.value || 10;
  const modifier = defenseValue - 10; // Convert defense value to modifier
  
  return rollD20({
    mode: options.mode || "normal",
    modifier: modifier + (options.bonus || 0)
  });
}

/**
 * Calculate critical hit damage
 * @param {Roll} damageRoll - The original damage roll
 * @param {number} criticalMultiplier - Multiplier for critical hits (default 2)
 * @returns {Roll} The critical damage roll
 */
export function rollCriticalDamage(damageRoll, criticalMultiplier = 2) {
  const formula = damageRoll.formula;
  const critFormula = `(${formula}) * ${criticalMultiplier}`;
  return new Roll(critFormula, damageRoll.data);
}