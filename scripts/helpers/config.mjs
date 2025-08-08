/**
 * MythCraft configuration constants
 */

export const MYTHCRAFT = {
  
  // System Information
  ASCII: `_____________________________
|  __  __       _   _      |
| |  \\/  |     | | | |     |
| | \\  / |_   _| |_| |__   |
| | |\\/| | | | | __| '_ \\  |
| | |  | | |_| | |_| | | | |
| |_|  |_|\\__, |\\__|_| |_| |
|          __/ |  _____     |
|         |___/  /  __ \\    |
|                | |  \\)    |
|                | |        |
|                | |        |
|             ___|_|____    |
|            |__________|   |
|             _____         |
|            | ____|        |
|            | |__ ____     |
|            |___ \\/  __|   |
|             ___) |  |     |
|            |____/|__|     |
|                           |
|      MythCraft RPG        |
|___________________________`,

  // Attributes
  attributes: {
    "strength": "MYTHCRAFT.AbilityStr",
    "dexterity": "MYTHCRAFT.AbilityDex", 
    "endurance": "MYTHCRAFT.AbilityEnd",
    "intelligence": "MYTHCRAFT.AbilityInt",
    "awareness": "MYTHCRAFT.AbilityAwr",
    "coordination": "MYTHCRAFT.AbilityCor",
    "willpower": "MYTHCRAFT.AbilityWil",
    "presence": "MYTHCRAFT.AbilityPre"
  },

  // Weapon Types
  weaponTypes: {
    "melee": "MYTHCRAFT.WeaponMelee",
    "ranged": "MYTHCRAFT.WeaponRanged",
    "thrown": "MYTHCRAFT.WeaponThrown"
  },

  // Armor Types  
  armorTypes: {
    "light": "MYTHCRAFT.ArmorLight",
    "medium": "MYTHCRAFT.ArmorMedium", 
    "heavy": "MYTHCRAFT.ArmorHeavy",
    "shield": "MYTHCRAFT.ArmorShield"
  },

  // Magic Sources
  magicSources: {
    "arcane": "MYTHCRAFT.MagicArcane",
    "divine": "MYTHCRAFT.MagicDivine",
    "occult": "MYTHCRAFT.MagicOccult", 
    "primal": "MYTHCRAFT.MagicPrimal",
    "psionic": "MYTHCRAFT.MagicPsionic"
  },

  // Spell Schools
  spellSchools: {
    "abjuration": "MYTHCRAFT.SchoolAbjuration",
    "conjuration": "MYTHCRAFT.SchoolConjuration",
    "divination": "MYTHCRAFT.SchoolDivination",
    "enchantment": "MYTHCRAFT.SchoolEnchantment",
    "evocation": "MYTHCRAFT.SchoolEvocation",
    "illusion": "MYTHCRAFT.SchoolIllusion",
    "necromancy": "MYTHCRAFT.SchoolNecromancy",
    "transmutation": "MYTHCRAFT.SchoolTransmutation"
  },

  // Talent Types
  talentTypes: {
    "general": "MYTHCRAFT.TalentGeneral",
    "combat": "MYTHCRAFT.TalentCombat",
    "magic": "MYTHCRAFT.TalentMagic",
    "skill": "MYTHCRAFT.TalentSkill",
    "lineage": "MYTHCRAFT.TalentLineage",
    "background": "MYTHCRAFT.TalentBackground"
  },

  // Damage Types
  damageTypes: {
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
  },

  // Target Types
  targetTypes: {
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
  },

  // Lineage Types
  lineageTypes: {
    "humanoid": "MYTHCRAFT.LineageHumanoid",
    "construct": "MYTHCRAFT.LineageConstruct",
    "elemental": "MYTHCRAFT.LineageElemental",
    "fey": "MYTHCRAFT.LineageFey",
    "fiend": "MYTHCRAFT.LineageFiend",
    "celestial": "MYTHCRAFT.LineageCelestial",
    "undead": "MYTHCRAFT.LineageUndead",
    "aberration": "MYTHCRAFT.LineageAberration"
  },

  // Character Classes
  characterClasses: {
    "artificer": "MYTHCRAFT.ClassArtificer",
    "barbarian": "MYTHCRAFT.ClassBarbarian",
    "bard": "MYTHCRAFT.ClassBard",
    "cleric": "MYTHCRAFT.ClassCleric",
    "druid": "MYTHCRAFT.ClassDruid",
    "fighter": "MYTHCRAFT.ClassFighter",
    "monk": "MYTHCRAFT.ClassMonk",
    "paladin": "MYTHCRAFT.ClassPaladin",
    "ranger": "MYTHCRAFT.ClassRanger",
    "rogue": "MYTHCRAFT.ClassRogue",
    "sorcerer": "MYTHCRAFT.ClassSorcerer",
    "warlock": "MYTHCRAFT.ClassWarlock",
    "wizard": "MYTHCRAFT.ClassWizard"
  },

  // Size Categories
  actorSizes: {
    "tiny": "MYTHCRAFT.SizeTiny",
    "small": "MYTHCRAFT.SizeSmall",
    "medium": "MYTHCRAFT.SizeMedium",
    "large": "MYTHCRAFT.SizeLarge",
    "huge": "MYTHCRAFT.SizeHuge",
    "gargantuan": "MYTHCRAFT.SizeGargantuan"
  },

  // Creature Types
  creatureTypes: {
    "humanoid": "MYTHCRAFT.CreatureHumanoid",
    "beast": "MYTHCRAFT.CreatureBeast",
    "monstrosity": "MYTHCRAFT.CreatureMonstrosity",
    "dragon": "MYTHCRAFT.CreatureDragon",
    "construct": "MYTHCRAFT.CreatureConstruct",
    "elemental": "MYTHCRAFT.CreatureElemental",
    "fey": "MYTHCRAFT.CreatureFey",
    "fiend": "MYTHCRAFT.CreatureFiend",
    "celestial": "MYTHCRAFT.CreatureCelestial",
    "undead": "MYTHCRAFT.CreatureUndead",
    "aberration": "MYTHCRAFT.CreatureAberration",
    "giant": "MYTHCRAFT.CreatureGiant",
    "ooze": "MYTHCRAFT.CreatureOoze",
    "plant": "MYTHCRAFT.CreaturePlant"
  },

  // Action Point Costs
  actionCosts: {
    "cantrip": 1,
    "melee": 2,
    "ranged": 2,
    "spell": 3,
    "move": 1,
    "dash": 2,
    "defend": 1,
    "ready": 1
  }
};

// Object to extend Foundry CONFIG with MythCraft-specific configurations
export function configureMythCraft() {
  // Add to Foundry CONFIG
  CONFIG.MYTHCRAFT = MYTHCRAFT;
  
  // Configure some Foundry settings
  CONFIG.time.roundTime = 6; // 6 seconds per round in MythCraft
  CONFIG.Combat.initiative.decimals = 2;
  
  // Set default token settings
  CONFIG.Token.objectClass.prototype._drawBar = function(number, bar, data) {
    // Custom token bar drawing for AP/HP
    if (data.attribute === "actionPoints") {
      // Custom rendering for Action Points
    }
    return this.constructor.prototype._drawBar.call(this, number, bar, data);
  };
}