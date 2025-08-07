/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class MythCraftItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["mythcraft", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/mythcraft/templates/item";
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    let actor = this.object?.parent ?? null;
    if (actor) {
      context.rollData = actor.getRollData();
    }

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Prepare type-specific data
    this._prepareItemData(context);

    return context;
  }

  /**
   * Prepare item type-specific data
   * @param {Object} context The context object to modify
   */
  _prepareItemData(context) {
    const itemData = context.item;
    
    if (itemData.type === 'weapon') {
      this._prepareWeaponData(context);
    } else if (itemData.type === 'armor') {
      this._prepareArmorData(context);
    } else if (itemData.type === 'spell') {
      this._prepareSpellData(context);
    } else if (itemData.type === 'talent') {
      this._prepareTalentData(context);
    }
  }

  /**
   * Prepare weapon-specific data
   */
  _prepareWeaponData(context) {
    const system = context.system;
    
    // Weapon type options
    context.weaponTypes = {
      "melee": "MYTHCRAFT.WeaponMelee",
      "ranged": "MYTHCRAFT.WeaponRanged",
      "thrown": "MYTHCRAFT.WeaponThrown"
    };
    
    // Damage type options
    context.damageTypes = {
      "bludgeoning": "MYTHCRAFT.DamageBludgeoning",
      "piercing": "MYTHCRAFT.DamagePiercing", 
      "slashing": "MYTHCRAFT.DamageSlashing",
      "fire": "MYTHCRAFT.DamageFire",
      "cold": "MYTHCRAFT.DamageCold",
      "lightning": "MYTHCRAFT.DamageLightning",
      "acid": "MYTHCRAFT.DamageAcid",
      "poison": "MYTHCRAFT.DamagePoison",
      "psychic": "MYTHCRAFT.DamagePsychic",
      "necrotic": "MYTHCRAFT.DamageNecrotic",
      "radiant": "MYTHCRAFT.DamageRadiant"
    };

    // Attribute options
    context.attributes = {
      "strength": "MYTHCRAFT.AbilityStr",
      "dexterity": "MYTHCRAFT.AbilityDex",
      "endurance": "MYTHCRAFT.AbilityEnd",
      "intelligence": "MYTHCRAFT.AbilityInt",
      "awareness": "MYTHCRAFT.AbilityAwr",
      "coordination": "MYTHCRAFT.AbilityCor",
      "willpower": "MYTHCRAFT.AbilityWil",
      "presence": "MYTHCRAFT.AbilityPre"
    };
  }

  /**
   * Prepare armor-specific data
   */
  _prepareArmorData(context) {
    // Armor type options
    context.armorTypes = {
      "light": "MYTHCRAFT.ArmorLight",
      "medium": "MYTHCRAFT.ArmorMedium", 
      "heavy": "MYTHCRAFT.ArmorHeavy",
      "shield": "MYTHCRAFT.ArmorShield"
    };
  }

  /**
   * Prepare spell-specific data
   */
  _prepareSpellData(context) {
    // Magic source options
    context.magicSources = {
      "arcane": "MYTHCRAFT.MagicArcane",
      "divine": "MYTHCRAFT.MagicDivine",
      "occult": "MYTHCRAFT.MagicOccult", 
      "primal": "MYTHCRAFT.MagicPrimal",
      "psionic": "MYTHCRAFT.MagicPsionic"
    };

    // Spell schools
    context.spellSchools = {
      "abjuration": "MYTHCRAFT.SchoolAbjuration",
      "conjuration": "MYTHCRAFT.SchoolConjuration",
      "divination": "MYTHCRAFT.SchoolDivination",
      "enchantment": "MYTHCRAFT.SchoolEnchantment",
      "evocation": "MYTHCRAFT.SchoolEvocation",
      "illusion": "MYTHCRAFT.SchoolIllusion",
      "necromancy": "MYTHCRAFT.SchoolNecromancy",
      "transmutation": "MYTHCRAFT.SchoolTransmutation"
    };

    // Target types
    context.targetTypes = {
      "self": "MYTHCRAFT.TargetSelf",
      "creature": "MYTHCRAFT.TargetCreature",
      "ally": "MYTHCRAFT.TargetAlly",
      "enemy": "MYTHCRAFT.TargetEnemy",
      "object": "MYTHCRAFT.TargetObject",
      "space": "MYTHCRAFT.TargetSpace",
      "radius": "MYTHCRAFT.TargetRadius",
      "sphere": "MYTHCRAFT.TargetSphere",
      "cylinder": "MYTHCRAFT.TargetCylinder",
      "cone": "MYTHCRAFT.TargetCone",
      "cube": "MYTHCRAFT.TargetCube",
      "line": "MYTHCRAFT.TargetLine",
      "wall": "MYTHCRAFT.TargetWall"
    };
  }

  /**
   * Prepare talent-specific data
   */
  _prepareTalentData(context) {
    // Talent type options
    context.talentTypes = {
      "general": "MYTHCRAFT.TalentGeneral",
      "combat": "MYTHCRAFT.TalentCombat",
      "magic": "MYTHCRAFT.TalentMagic",
      "skill": "MYTHCRAFT.TalentSkill",
      "lineage": "MYTHCRAFT.TalentLineage",
      "background": "MYTHCRAFT.TalentBackground"
    };
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Add/remove damage parts for weapons and spells
    html.find('.damage-control').click(this._onDamageControl.bind(this));

    // Add/remove talent benefits
    html.find('.benefit-control').click(this._onBenefitControl.bind(this));

    // Add/remove prerequisites
    html.find('.prerequisite-control').click(this._onPrerequisiteControl.bind(this));
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

    // Handle different roll types
    if (dataset.rollType) {
      switch (dataset.rollType) {
        case 'attack':
          return this.item.rollAttack();
        case 'damage':
          return this.item.rollDamage();
        case 'spell':
          return this.item.castSpell();
        case 'talent':
          return this.item.useTalent();
        default:
          return this.item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor?.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

  /**
   * Handle damage part controls for weapons and spells
   * @param {Event} event   The originating click event
   * @private
   */
  async _onDamageControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    const damageParts = this.item.system.damage?.parts || [];

    switch (action) {
      case 'add':
        const newPart = ["1d6", "bludgeoning"];
        damageParts.push(newPart);
        break;
      case 'delete':
        const index = parseInt(a.dataset.index);
        damageParts.splice(index, 1);
        break;
    }

    return this.item.update({"system.damage.parts": damageParts});
  }

  /**
   * Handle talent benefit controls
   * @param {Event} event   The originating click event
   * @private
   */
  async _onBenefitControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    const benefits = this.item.system.benefits || [];

    switch (action) {
      case 'add':
        benefits.push("New benefit");
        break;
      case 'delete':
        const index = parseInt(a.dataset.index);
        benefits.splice(index, 1);
        break;
    }

    return this.item.update({"system.benefits": benefits});
  }

  /**
   * Handle prerequisite controls
   * @param {Event} event   The originating click event
   * @private
   */
  async _onPrerequisiteControl(event) {
    event.preventDefault();
    const a = event.currentTarget;
    const action = a.dataset.action;
    const prerequisites = this.item.system.prerequisites || [];

    switch (action) {
      case 'add':
        prerequisites.push("New prerequisite");
        break;
      case 'delete':
        const index = parseInt(a.dataset.index);
        prerequisites.splice(index, 1);
        break;
    }

    return this.item.update({"system.prerequisites": prerequisites});
  }
}
      