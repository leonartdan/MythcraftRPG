/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class MythCraftActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["mythcraft", "sheet", "actor"],
      template: "systems/mythcraft/templates/actor/actor-sheet.hbs",
      width: 720,
      height: 680,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "features" }]
    });
  }

  /** @override */
  get template() {
    return `systems/mythcraft/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not the sheet is
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.actor.toObject(false);

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Add roll data for TinyMCE editors.
    context.rollData = context.actor.getRollData();

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(this.actor.effects);

    return context;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterData(context) {
    // Handle attribute scores.
    for (let [k, v] of Object.entries(context.system.attributes)) {
      v.label = game.i18n.localize(CONFIG.MYTHCRAFT?.attributes?.[k] ?? k);
    }
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} context The context object to modify
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const weapons = [];
    const armor = [];
    const talents = [];
    const features = [];
    const spells = {
      arcane: [],
      divine: [],
      occult: [],
      primal: [],
      psionic: []
    };
    const skills = [];

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || "icons/svg/item-bag.svg";
      
      // Calculate total modifier for skills
      if (i.type === 'skill') {
        const ability = i.system.governingAttribute || i.system.ability || 'intelligence';
        const abilityValue = context.system.attributes[ability]?.value || 0;
        const ranks = i.system.ranks || 0;
        const bonus = i.system.bonus || 0;
        i.system.totalModifier = abilityValue + ranks + bonus;
      }
      
      // Append to gear.
      if (i.type === 'equipment') {
        gear.push(i);
      }
      // Append to weapons.
      else if (i.type === 'weapon') {
        weapons.push(i);
      }
      // Append to armor.
      else if (i.type === 'armor') {
        armor.push(i);
      }
      // Append to talents.
      else if (i.type === 'talent') {
        talents.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        const source = i.system.magicSource || 'arcane';
        if (spells[source]) {
          spells[source].push(i);
        }
      }
      // Append to skills.
      else if (i.type === 'skill') {
        skills.push(i);
      }
    }

    // Assign and return
    context.gear = gear;
    context.weapons = weapons;
    context.armor = armor;
    context.talents = talents;
    context.features = features;
    context.spells = spells;
    context.skills = skills;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.find(".effect-control").click(ev => onManageActiveEffect(ev, this.actor));

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Attribute rolls
    html.find('.attribute-roll').click(this._onAttributeRoll.bind(this));

    // Initiative roll
    html.find('.initiative-roll').click(this._onInitiativeRoll.bind(this));

    // Action Point management
    html.find('.ap-spend').click(this._onSpendAP.bind(this));

    // Item rolls
    html.find('.item-roll').click(this._onItemRoll.bind(this));

    // Skill inline editing
    html.find('.skill-ranks-input').change(this._onSkillRanksChange.bind(this));
    html.find('.skill-attribute-select').change(this._onSkillAttributeChange.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

  /**
   * Handle attribute rolls
   * @param {Event} event   The originating click event
   * @private
   */
  _onAttributeRoll(event) {
    event.preventDefault();
    const attribute = event.currentTarget.dataset.attribute;
    this.actor.rollAttribute(attribute);
  }

  /**
   * Handle initiative rolls
   * @param {Event} event   The originating click event
   * @private
   */
  _onInitiativeRoll(event) {
    event.preventDefault();
    this.actor.rollInitiative();
  }

  /**
   * Handle spending Action Points
   * @param {Event} event   The originating click event
   * @private
   */
  async _onSpendAP(event) {
    event.preventDefault();
    const cost = parseInt(event.currentTarget.dataset.cost) || 1;
    await this.actor.spendActionPoints(cost);
  }

  /**
   * Handle item rolls
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemRoll(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    const rollType = event.currentTarget.dataset.rollType;

    if (!item) return;

    switch (rollType) {
      case 'attack':
        return item.rollAttack();
      case 'damage':
        return item.rollDamage();
      case 'spell':
        return item.castSpell();
      case 'talent':
        return item.useTalent();
      case 'skill':
        return item.rollSkill();
      default:
        return item.roll();
    }
  }

  /**
   * Handle skill ranks changes
   * @param {Event} event   The originating change event
   * @private
   */
  async _onSkillRanksChange(event) {
    event.preventDefault();
    const itemId = event.currentTarget.dataset.itemId;
    const item = this.actor.items.get(itemId);
    const newRanks = parseInt(event.currentTarget.value) || 0;
    
    if (item) {
      await item.update({"system.ranks": newRanks});
    }
  }

  /**
   * Handle skill governing attribute changes
   * @param {Event} event   The originating change event
   * @private
   */
  async _onSkillAttributeChange(event) {
    event.preventDefault();
    const itemId = event.currentTarget.dataset.itemId;
    const item = this.actor.items.get(itemId);
    const newAttribute = event.currentTarget.value;
    
    if (item) {
      await item.update({
        "system.governingAttribute": newAttribute,
        "system.ability": newAttribute
      });
    }
  }
}

/**
 * Manage Active Effect instances through the Actor Panel via effect control buttons.
 * @param {MouseEvent} event      The left-click event on the effect control
 * @param {Actor|Item} owner      The owning entity which manages this effect
 */
function onManageActiveEffect(event, owner) {
  event.preventDefault();
  const a = event.currentTarget;
  const li = a.closest("li");
  const effect = li.dataset.effectId ? owner.effects.get(li.dataset.effectId) : null;
  switch ( a.dataset.action ) {
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
function prepareActiveEffectCategories(effects) {
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
  for ( let e of effects ) {
    e._getSourceName = () => {
      const source = e.sourceName;
      if ( source ) return source;
      return game.i18n.localize("MYTHCRAFT.Effect.Unknown");
    };
    if ( e.disabled ) categories.inactive.effects.push(e);
    else if ( e.isTemporary ) categories.temporary.effects.push(e);
    else categories.passive.effects.push(e);
  }
  return categories;
}