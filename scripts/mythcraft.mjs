/**
 * MythCraft RPG System for Foundry VTT
 * A d20-based system with Action Points, complex character creation, and rich combat
 */

// Import document classes
import { MythCraftActor } from "./documents/actor.mjs";
import { MythCraftItem } from "./documents/item.mjs";

// Import sheet classes  
import { MythCraftActorSheet } from "./sheets/actor-sheet.mjs";
import { MythCraftItemSheet } from "./sheets/item-sheet.mjs";

// Import helper/utility classes
import * as chat from "./helpers/chat.mjs";
import * as dice from "./helpers/dice.mjs";

/* ------------------------------------ */
/* Initialize system					*/
/* ------------------------------------ */
Hooks.once('init', async function() {
  console.log('MythCraft | Initializing MythCraft RPG System');

  // Add utility classes to the global game object
  game.mythcraft = {
    MythCraftActor,
    MythCraftItem,
    rollItemMacro: rollItemMacro,
    chat,
    dice
  };

  // Add custom constants for configuration
  CONFIG.MYTHCRAFT = {};

  // Define custom Document classes
  CONFIG.Actor.documentClass = MythCraftActor;
  CONFIG.Item.documentClass = MythCraftItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("mythcraft", MythCraftActorSheet, { 
    types: ["character", "npc"], 
    makeDefault: true 
  });
  
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("mythcraft", MythCraftItemSheet, { 
    types: ["weapon", "armor", "equipment", "talent", "spell", "skill", "feature"], 
    makeDefault: true 
  });

  // Register system settings
  registerSystemSettings();

  // Register Handlebars helpers
  registerHandlebarsHelpers();

  // Preload Handlebars templates
  return preloadHandlebarsTemplates();
});

/* ------------------------------------ */
/* Setup system							*/
/* ------------------------------------ */
Hooks.once('setup', function() {
  // Localize configuration objects once the system is ready
  
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function() {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => createDocumentMacro(data, slot));

  // Determine whether a system migration is required and feasible
  if (!game.user.isGM) return;
  
  const currentVersion = game.settings.get("mythcraft", "systemMigrationVersion");
  const SYSTEM_VERSION = game.system.version;
  const MINIMUM_COMPATIBLE_VERSION = "1.0.0";
  
  // Initialize migration version for new worlds
  if (currentVersion === null || currentVersion === "") {
    game.settings.set("mythcraft", "systemMigrationVersion", SYSTEM_VERSION);
    console.log(`MythCraft | Setting initial migration version to ${SYSTEM_VERSION}`);
    return;
  }
  
  // Check if migration is needed
  if (isNewerVersion(SYSTEM_VERSION, currentVersion)) {
    performSystemMigration(currentVersion, SYSTEM_VERSION);
  }
  
  // Check compatibility 
  if (isNewerVersion(MINIMUM_COMPATIBLE_VERSION, currentVersion)) {
    ui.notifications.error(`Your MythCraft system data is from a version prior to ${MINIMUM_COMPATIBLE_VERSION} and is not compatible. Please start a new world.`, {permanent: true});
  }
});

/* ------------------------------------ */
/* System Migration						*/
/* ------------------------------------ */

/**
 * Perform system migration between versions
 * @param {string} currentVersion - Current system version
 * @param {string} targetVersion - Target system version
 */
async function performSystemMigration(currentVersion, targetVersion) {
  console.log(`MythCraft | Migrating system from version ${currentVersion} to ${targetVersion}`);
  
  try {
    // Perform any necessary data migrations here
    // For now, just update the version
    await game.settings.set("mythcraft", "systemMigrationVersion", targetVersion);
    
    ui.notifications.info(`MythCraft | System migration completed successfully from ${currentVersion} to ${targetVersion}`);
  } catch (error) {
    console.error("MythCraft | Migration failed:", error);
    ui.notifications.error("MythCraft | System migration failed. Please check the console for details.");
  }
}

/* ------------------------------------ */
/* System Settings						*/
/* ------------------------------------ */
function registerSystemSettings() {
  // System migration version
  game.settings.register("mythcraft", "systemMigrationVersion", {
    name: "System Migration Version",
    scope: "world",
    config: false,
    type: String,
    default: ""
  });

  // Optional rules
  game.settings.register("mythcraft", "useVariantEncumbrance", {
    name: "MYTHCRAFT.SettingVariantEncumbrance",
    hint: "MYTHCRAFT.SettingVariantEncumbranceHint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register("mythcraft", "actionPointCarryover", {
    name: "MYTHCRAFT.SettingActionPointCarryover",
    hint: "MYTHCRAFT.SettingActionPointCarryoverHint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
}

/* ------------------------------------ */
/* Handlebars Helpers					*/
/* ------------------------------------ */
function registerHandlebarsHelpers() {
  // titleCase helper - capitalizes the first letter of each word
  Handlebars.registerHelper('titleCase', function(str) {
    if (typeof str !== 'string') return str;
    return str.toLowerCase().split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  });

  // selected helper - returns "selected" if values match, empty string otherwise
  Handlebars.registerHelper('selected', function(option, value) {
    return option === value ? 'selected' : '';
  });

  // eq helper - returns true if values are equal
  Handlebars.registerHelper('eq', function(a, b) {
    return a === b;
  });
}

/* ------------------------------------ */
/* Handlebars Templates					*/
/* ------------------------------------ */
async function preloadHandlebarsTemplates() {
  return loadTemplates([
    // Actor partials
    "systems/mythcraft/templates/actor/parts/actor-attributes.hbs",
    "systems/mythcraft/templates/actor/parts/actor-defenses.hbs",
    "systems/mythcraft/templates/actor/parts/actor-skills.hbs",
    "systems/mythcraft/templates/actor/parts/actor-inventory.hbs",
    "systems/mythcraft/templates/actor/parts/actor-talents.hbs",
    "systems/mythcraft/templates/actor/parts/actor-spells.hbs",
    "systems/mythcraft/templates/actor/parts/actor-biography.hbs",
    
    // Item partials
    "systems/mythcraft/templates/item/parts/item-details.hbs",
    "systems/mythcraft/templates/item/parts/item-description.hbs",
    "systems/mythcraft/templates/item/parts/weapon-details.hbs",
    "systems/mythcraft/templates/item/parts/armor-details.hbs",
    "systems/mythcraft/templates/item/parts/spell-details.hbs",
    "systems/mythcraft/templates/item/parts/talent-details.hbs"
  ]);
}

/* ------------------------------------ */
/* Hotbar Macros						*/
/* ------------------------------------ */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createDocumentMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== "Item") return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn("You can only create macro buttons for owned Items");
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command
  const command = `game.mythcraft.rollItemMacro("${item.name}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "mythcraft.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemName
 * @return {Promise}
 */
function rollItemMacro(itemName) {
  const speaker = ChatMessage.getSpeaker();
  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  const item = actor ? actor.items.find(i => i.name === itemName) : null;
  if (!item) return ui.notifications.warn(`Your controlled Actor does not have an item named ${itemName}`);

  // Trigger the item roll
  return item.roll();
}