/**
 * Active Effects helper functions for MythCraft RPG
 */

/**
 * Manage Active Effect instances through the Actor Panel via effect control buttons.
 * @param {MouseEvent} event      The left-click event on the effect control
 * @param {Actor|Item} owner      The owning entity which manages this effect
 */
export function onManageActiveEffect(event, owner) {
  event.preventDefault();
  const a = event.currentTarget;
  const li = a.closest("li");
  const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
  
  switch (a.dataset.action) {
    case "create":
      return owner.createEmbeddedDocuments("ActiveEffect", [{
        label: "New Effect",
        icon: "icons/svg/aura.svg",
        origin: owner.uuid,
        "duration.rounds": li.dataset.effectType === "temporary" ? 1 : undefined,
        disabled: li.dataset.effectType === "inactive"
      }]);
    case "edit":
      return effect.sheet.render(true);
    case "delete":
      return effect.delete();
    case "toggle":
      return effect.update({disabled: !effect.disabled});
  }
}

/**
 * Prepare the data structure for Active Effects which are currently applied to an Actor or Item.
 * @param {ActiveEffect[]} effects    The array of Active Effect instances to prepare sheet data for
 * @return {object}                   Data for rendering
 */
export function prepareActiveEffectCategories(effects) {
  // Define effect header categories
  const categories = {
    temporary: {
      type: "temporary",
      label: "MYTHCRAFT.Effect.Temporary",
      effects: []
    },
    passive: {
      type: "passive", 
      label: "MYTHCRAFT.Effect.Passive",
      effects: []
    },
    inactive: {
      type: "inactive",
      label: "MYTHCRAFT.Effect.Inactive", 
      effects: []
    }
  };

  // Iterate over active effects, classifying them into categories
  for (let e of effects) {
    e._getSourceName = () => {
      const source = e.sourceName;
      if (source) return source;
      return game.i18n.localize("MYTHCRAFT.Effect.Unknown");
    };
    if (e.disabled) categories.inactive.effects.push(e);
    else if (e.isTemporary) categories.temporary.effects.push(e);
    else categories.passive.effects.push(e);
  }
  return categories;
}

/**
 * Create a new Active Effect for applying conditions
 * @param {Actor} actor           The target actor
 * @param {string} conditionId    The condition identifier
 * @param {object} options        Additional options
 */
export async function createConditionEffect(actor, conditionId, options = {}) {
  const conditions = {
    blinded: {
      label: "Blinded",
      icon: "icons/svg/blind.svg",
      changes: [
        { key: "system.defenses.physical.bonus", mode: 2, value: -2 },
        { key: "system.attributes.awareness.mod", mode: 2, value: -4 }
      ]
    },
    charmed: {
      label: "Charmed", 
      icon: "icons/svg/daze.svg",
      changes: []
    },
    deafened: {
      label: "Deafened",
      icon: "icons/svg/deaf.svg", 
      changes: [
        { key: "system.attributes.awareness.mod", mode: 2, value: -2 }
      ]
    },
    frightened: {
      label: "Frightened",
      icon: "icons/svg/terror.svg",
      changes: [
        { key: "system.attributes.willpower.mod", mode: 2, value: -2 },
        { key: "system.defenses.mental.bonus", mode: 2, value: -2 }
      ]
    },
    grappled: {
      label: "Grappled",
      icon: "icons/svg/net.svg",
      changes: [
        { key: "system.speed.value", mode: 5, value: 0 }
      ]
    },
    incapacitated: {
      label: "Incapacitated", 
      icon: "icons/svg/unconscious.svg",
      changes: [
        { key: "system.actionPoints.max", mode: 5, value: 0 }
      ]
    },
    invisible: {
      label: "Invisible",
      icon: "icons/svg/invisible.svg", 
      changes: [
        { key: "system.defenses.physical.bonus", mode: 2, value: 2 }
      ]
    },
    paralyzed: {
      label: "Paralyzed",
      icon: "icons/svg/paralysis.svg",
      changes: [
        { key: "system.actionPoints.max", mode: 5, value: 0 },
        { key: "system.defenses.physical.value", mode: 5, value: 10 }
      ]
    },
    poisoned: {
      label: "Poisoned",
      icon: "icons/svg/poison.svg",
      changes: [
        { key: "system.attributes.endurance.mod", mode: 2, value: -2 }
      ]
    },
    prone: {
      label: "Prone", 
      icon: "icons/svg/falling.svg",
      changes: [
        { key: "system.defenses.physical.bonus", mode: 2, value: -2 }
      ]
    },
    restrained: {
      label: "Restrained",
      icon: "icons/svg/trap.svg",
      changes: [
        { key: "system.speed.value", mode: 5, value: 0 },
        { key: "system.defenses.physical.bonus", mode: 2, value: -2 }
      ]
    },
    stunned: {
      label: "Stunned",
      icon: "icons/svg/stoned.svg", 
      changes: [
        { key: "system.actionPoints.max", mode: 5, value: 0 }
      ]
    },
    unconscious: {
      label: "Unconscious",
      icon: "icons/svg/sleep.svg",
      changes: [
        { key: "system.actionPoints.max", mode: 5, value: 0 },
        { key: "system.defenses.physical.value", mode: 5, value: 10 }
      ]
    }
  };

  const condition = conditions[conditionId];
  if (!condition) {
    console.warn(`Unknown condition: ${conditionId}`);
    return null;
  }

  const effectData = {
    label: condition.label,
    icon: condition.icon,
    origin: options.origin || null,
    changes: condition.changes,
    disabled: false,
    duration: options.duration || {},
    flags: {
      mythcraft: {
        condition: conditionId
      }
    }
  };

  return await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
}

/**
 * Remove a condition from an actor
 * @param {Actor} actor           The target actor
 * @param {string} conditionId    The condition identifier
 */
export async function removeCondition(actor, conditionId) {
  const effects = actor.effects.filter(e => 
    e.flags.mythcraft?.condition === conditionId
  );
  
  if (effects.length > 0) {
    const effectIds = effects.map(e => e.id);
    return await actor.deleteEmbeddedDocuments("ActiveEffect", effectIds);
  }
  
  return null;
}

/**
 * Check if an actor has a specific condition
 * @param {Actor} actor           The actor to check
 * @param {string} conditionId    The condition identifier
 * @returns {boolean}             Whether the actor has the condition
 */
export function hasCondition(actor, conditionId) {
  return actor.effects.some(e => 
    e.flags.mythcraft?.condition === conditionId && !e.disabled
  );
}

/**
 * Toggle a condition on an actor
 * @param {Actor} actor           The target actor  
 * @param {string} conditionId    The condition identifier
 * @param {object} options        Additional options
 */
export async function toggleCondition(actor, conditionId, options = {}) {
  if (hasCondition(actor, conditionId)) {
    return await removeCondition(actor, conditionId);
  } else {
    return await createConditionEffect(actor, conditionId, options);
  }
}

/**
 * Create spell effect from spell item
 * @param {Actor} actor     The caster
 * @param {Item} spell      The spell item
 * @param {object} options  Additional options
 */
export async function createSpellEffect(actor, spell, options = {}) {
  const duration = options.duration || {
    rounds: spell.system.duration?.value || null,
    seconds: null,
    turns: null
  };

  const effectData = {
    label: spell.name,
    icon: spell.img,
    origin: spell.uuid,
    changes: [],
    disabled: false,
    duration: duration,
    flags: {
      mythcraft: {
        spellLevel: spell.system.level,
        magicSource: spell.system.magicSource
      }
    }
  };

  // Add any spell-specific changes
  if (spell.system.effects) {
    effectData.changes = spell.system.effects;
  }

  return await actor.createEmbeddedDocuments("ActiveEffect", [effectData]);
}