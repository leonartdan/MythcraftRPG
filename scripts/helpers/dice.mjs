/**
 * Dice utility functions for MythCraft RPG
 */

/**
 * Parse a damage formula and return formatted parts
 * @param {string} formula - The damage formula
 * @returns {Array} Array of parsed damage parts
 */
export function parseDamageFormula(formula) {
  if (!formula) return [];
  
  const parts = formula.split('+').map(part => part.trim());
  return parts.map(part => {
    const match = part.match(/^(\d*d\d+)(?:\s*(.+))?$/);
    if (match) {
      return [match[1], match[2] || 'bludgeoning'];
    }
    return [part, 'bludgeoning'];
  });
}

/**
 * Create a modified roll with advantage/disadvantage
 * @param {string} formula - Base roll formula
 * @param {string} mode - 'advantage', 'disadvantage', or 'normal'
 * @returns {string} Modified formula
 */
export function createAdvantageRoll(formula, mode = 'normal') {
  if (mode === 'advantage') {
    return formula.replace(/1d20/g, '2d20kh1');
  } else if (mode === 'disadvantage') {
    return formula.replace(/1d20/g, '2d20kl1');
  }
  return formula;
}

/**
 * Calculate critical hit damage
 * @param {Array} damageParts - Array of damage parts
 * @param {Object} options - Options for critical calculation
 * @returns {string} Critical damage formula
 */
export function calculateCriticalDamage(damageParts, options = {}) {
  const multiplier = options.multiplier || 2;
  
  return damageParts.map(part => {
    const [dice, type] = part;
    
    // For critical hits, typically double the dice
    if (dice.includes('d')) {
      const [count, sides] = dice.split('d');
      const critCount = parseInt(count) * multiplier;
      return [`${critCount}d${sides}`, type];
    }
    
    return part;
  });
}

/**
 * Roll a skill check
 * @param {Actor} actor - The actor making the roll
 * @param {string} skill - The skill being rolled
 * @param {Object} options - Additional options
 * @returns {Promise<Roll>}
 */
export async function rollSkillCheck(actor, skill, options = {}) {
  const skillItem = actor.items.find(i => i.type === 'skill' && i.name.toLowerCase() === skill.toLowerCase());
  
  let bonus = 0;
  let ability = 'intelligence';
  
  if (skillItem) {
    bonus = skillItem.system.ranks + skillItem.system.bonus;
    ability = skillItem.system.ability || 'intelligence';
  }
  
  const abilityValue = actor.system.attributes[ability]?.value || 0;
  const rollFormula = createAdvantageRoll(`1d20 + ${abilityValue} + ${bonus}`, options.mode);
  
  const roll = new Roll(rollFormula, actor.getRollData());
  await roll.evaluate();
  
  return roll;
}

/**
 * Roll a saving throw
 * @param {Actor} actor - The actor making the save
 * @param {string} defense - The defense type (physical, mental, social)
 * @param {Object} options - Additional options
 * @returns {Promise<Roll>}
 */
export async function rollSavingThrow(actor, defense, options = {}) {
  const defenseValue = actor.system.defenses[defense]?.value || 10;
  const rollFormula = createAdvantageRoll(`1d20`, options.mode);
  
  const roll = new Roll(rollFormula, actor.getRollData());
  await roll.evaluate();
  
  // Add the result comparison
  const success = roll.total >= defenseValue;
  roll.mythcraft = {
    defense,
    defenseValue,
    success
  };
  
  return roll;
}

/**
 * Roll with action point spending
 * @param {Actor} actor - The actor making the roll
 * @param {string} rollFormula - The base roll formula
 * @param {number} apSpent - Action points to spend for bonus
 * @returns {Promise<Roll>}
 */
export async function rollWithActionPoints(actor, rollFormula, apSpent = 0) {
  if (apSpent > 0) {
    const currentAP = actor.system.actionPoints.value;
    if (currentAP < apSpent) {
      ui.notifications.warn("Not enough Action Points!");
      apSpent = 0;
    } else {
      // Spend the action points
      await actor.update({
        "system.actionPoints.value": currentAP - apSpent
      });
      
      // Add bonus to roll (typically +2 per AP spent)
      const bonus = apSpent * 2;
      rollFormula += ` + ${bonus}`;
    }
  }
  
  const roll = new Roll(rollFormula, actor.getRollData());
  await roll.evaluate();
  
  if (apSpent > 0) {
    roll.mythcraft = {
      actionPointsSpent: apSpent,
      actionPointBonus: apSpent * 2
    };
  }
  
  return roll;
}

/**
 * Calculate damage reduction
 * @param {number} damage - The incoming damage
 * @param {string} damageType - The type of damage
 * @param {Actor} target - The target actor
 * @returns {number} Reduced damage amount
 */
export function calculateDamageReduction(damage, damageType, target) {
  // Basic damage reduction based on armor and resistances
  let reduction = 0;
  
  // Check for armor
  const armor = target.items.find(i => i.type === 'armor' && i.system.equipped);
  if (armor) {
    // Physical damage types get reduced by armor
    if (['bludgeoning', 'piercing', 'slashing'].includes(damageType)) {
      reduction += armor.system.defense?.value || 0;
    }
  }
  
  // Apply any resistances or immunities
  // This would be expanded based on active effects or talents
  
  return Math.max(0, damage - reduction);
}

/**
 * Generate random ability scores using MythCraft method
 * @param {Object} options - Generation options
 * @returns {Object} Generated ability scores
 */
export async function generateAbilityScores(options = {}) {
  const method = options.method || 'pointBuy';
  const abilities = ['strength', 'dexterity', 'endurance', 'intelligence', 'awareness', 'coordination', 'willpower', 'presence'];
  const scores = {};
  
  if (method === 'roll') {
    // Roll 4d6, drop lowest for each ability
    for (const ability of abilities) {
      const rolls = [];
      for (let i = 0; i < 4; i++) {
        const roll = new Roll('1d6');
        await roll.evaluate();
        rolls.push(roll.total);
      }
      rolls.sort((a, b) => b - a);
      scores[ability] = rolls.slice(0, 3).reduce((sum, val) => sum + val, 0);
    }
  } else if (method === 'pointBuy') {
    // Point buy system - start with base scores
    for (const ability of abilities) {
      scores[ability] = 0; // Base score in MythCraft
    }
  } else if (method === 'array') {
    // Standard array
    const standardArray = [3, 2, 1, 0, -1, -2, -2, -3];
    for (let i = 0; i < abilities.length; i++) {
      scores[abilities[i]] = standardArray[i];
    }
  }
  
  return scores;
}