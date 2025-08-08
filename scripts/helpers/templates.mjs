/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export async function preloadHandlebarsTemplates() {
  return loadTemplates([
    // Actor partials
    "systems/mythcraft/templates/actor/parts/actor-features.hbs",
    "systems/mythcraft/templates/actor/parts/actor-items.hbs", 
    "systems/mythcraft/templates/actor/parts/actor-spells.hbs",
    "systems/mythcraft/templates/actor/parts/actor-effects.hbs",
    "systems/mythcraft/templates/actor/parts/actor-attributes.hbs",
    "systems/mythcraft/templates/actor/parts/actor-defenses.hbs",
    "systems/mythcraft/templates/actor/parts/actor-skills.hbs",
    "systems/mythcraft/templates/actor/parts/actor-inventory.hbs",
    "systems/mythcraft/templates/actor/parts/actor-talents.hbs",
    "systems/mythcraft/templates/actor/parts/actor-biography.hbs",
    
    // Item partials
    "systems/mythcraft/templates/item/parts/item-details.hbs",
    "systems/mythcraft/templates/item/parts/item-description.hbs",
    "systems/mythcraft/templates/item/parts/weapon-details.hbs",
    "systems/mythcraft/templates/item/parts/armor-details.hbs",
    "systems/mythcraft/templates/item/parts/spell-details.hbs",
    "systems/mythcraft/templates/item/parts/talent-details.hbs",
    "systems/mythcraft/templates/item/parts/ancestry-details.hbs",
    "systems/mythcraft/templates/item/parts/class-details.hbs",
    "systems/mythcraft/templates/item/parts/background-details.hbs",
    
    // Chat templates
    "systems/mythcraft/templates/chat/attack-card.hbs",
    "systems/mythcraft/templates/chat/damage-card.hbs",
    "systems/mythcraft/templates/chat/spell-card.hbs",
    "systems/mythcraft/templates/chat/talent-card.hbs"
  ]);
}

/**
 * Register custom Handlebars helpers for MythCraft
 */
export function registerHandlebarsHelpers() {
  
  // Capitalize first letter
  Handlebars.registerHelper('capitalize', function(str) {
    if (typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  // Format numbers with sign
  Handlebars.registerHelper('numberFormat', function(number, options) {
    const hash = options.hash;
    const sign = hash.sign || false;
    const decimals = hash.decimals || 0;
    
    if (typeof number !== 'number') return number;
    
    let formatted = number.toFixed(decimals);
    
    if (sign && number > 0) {
      formatted = '+' + formatted;
    }
    
    return formatted;
  });

  // Check if value is in array
  Handlebars.registerHelper('includes', function(array, value, options) {
    if (!Array.isArray(array)) return false;
    return array.includes(value);
  });

  // Get attribute modifier
  Handlebars.registerHelper('attributeMod', function(value) {
    const mod = Math.floor((value - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  });

  // Format action point cost
  Handlebars.registerHelper('apCost', function(cost) {
    if (!cost || cost === 0) return 'Free';
    return `${cost} AP`;
  });

  // Get magic source color
  Handlebars.registerHelper('magicSourceColor', function(source) {
    const colors = {
      'arcane': '#4a90e2',
      'divine': '#f5a623', 
      'occult': '#7b68ee',
      'primal': '#50c878',
      'psionic': '#ff6b6b'
    };
    return colors[source] || '#666';
  });

  // Format spell level
  Handlebars.registerHelper('spellLevel', function(level) {
    if (level === 0) return 'Cantrip';
    if (level === 1) return '1st Level';
    if (level === 2) return '2nd Level'; 
    if (level === 3) return '3rd Level';
    return `${level}th Level`;
  });

  // Repeat helper for loops
  Handlebars.registerHelper('times', function(n, block) {
    let accum = '';
    for(let i = 0; i < n; ++i)
      accum += block.fn(i);
    return accum;
  });

  // Math operations
  Handlebars.registerHelper('add', function(a, b) {
    return a + b;
  });

  Handlebars.registerHelper('subtract', function(a, b) {
    return a - b;
  });

  Handlebars.registerHelper('multiply', function(a, b) {
    return a * b;
  });

  Handlebars.registerHelper('divide', function(a, b) {
    return Math.floor(a / b);
  });

  // Conditional helpers
  Handlebars.registerHelper('gt', function(a, b, options) {
    if (a > b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('lt', function(a, b, options) {
    if (a < b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('eq', function(a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  // Format weight
  Handlebars.registerHelper('formatWeight', function(weight) {
    if (!weight || weight === 0) return '—';
    return `${weight} lb${weight !== 1 ? 's' : ''}`;
  });

  // Format range
  Handlebars.registerHelper('formatRange', function(range, units) {
    if (!range) return '—';
    return `${range} ${units || 'ft'}`;
  });

  // Get item rarity color
  Handlebars.registerHelper('rarityColor', function(rarity) {
    const colors = {
      'common': '#000000',
      'uncommon': '#1eff00', 
      'rare': '#0070dd',
      'very-rare': '#a335ee',
      'legendary': '#ff8000',
      'artifact': '#e6cc80'
    };
    return colors[rarity] || colors.common;
  });

  // Format cost
  Handlebars.registerHelper('formatCost', function(cost, denomination) {
    if (!cost || cost === 0) return '—';
    const denom = denomination || 'gp';
    return `${cost} ${denom}`;
  });
}