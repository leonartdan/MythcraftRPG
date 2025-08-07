# MythCraft RPG System for Foundry VTT

An implementation of the MythCraft RPG system for Foundry Virtual Tabletop. This system brings the Action Point-based combat, complex character creation, and rich d20 mechanics of MythCraft to your virtual tabletop.

## Features

- **Complete Character Creation**: Lineages, backgrounds, occupations, professions, and talents
- **Action Point System**: Dynamic combat with AP spending and carryover mechanics
- **Eight Attributes**: Strength, Dexterity, Endurance, Intelligence, Awareness, Coordination, Willpower, and Presence
- **Multiple Magic Sources**: Arcane, Divine, Occult, Primal, and Psionic magic systems
- **Automated Calculations**: Health, defenses, and derived values calculated automatically
- **Item Management**: Weapons, armor, equipment, talents, and spells with full functionality
- **Interactive Rolling**: Click-to-roll attributes, attacks, damage, and spells

## Installation

### Method 1: Manual Installation

1. Download the system files as a ZIP archive
2. Extract to your Foundry VTT `Data/systems/` directory
3. The folder structure should be: `Data/systems/mythcraft/`
4. Restart Foundry VTT
5. Create a new world using the "MythCraft RPG" system

### Method 2: Manifest URL (Future)

Once published, you can install directly from Foundry:

1. Open Foundry VTT Setup
2. Go to the "Game Systems" tab
3. Click "Install System"
4. Paste the manifest URL: `[Your GitHub Release URL]/system.json`
5. Click "Install"

## File Structure

```
mythcraft/
├── system.json                 # System manifest
├── template.json              # Data model definitions
├── scripts/
│   ├── mythcraft.mjs          # Main system script
│   └── documents/
│       ├── actor.mjs          # Actor document class
│       └── item.mjs           # Item document class
├── sheets/
│   ├── actor-sheet.mjs        # Actor sheet class
│   └── item-sheet.mjs         # Item sheet class
├── templates/
│   └── actor/
│       └── actor-character-sheet.hbs  # Character sheet template
├── styles/
│   └── mythcraft.css          # System styles
├── lang/
│   └── en.json               # English localization
└── README.md                 # This file
```

## Getting Started

1. **Create a Character**: 
   - Choose a lineage (race) and sublineage
   - Select background, occupation, and profession
   - Assign attribute points (5 points to distribute)
   - Pick starting talents

2. **Understanding Action Points**:
   - Base 3 AP per turn + Coordination modifier
   - Spend AP for actions (attacks, spells, etc.)
   - Unused AP can be carried over (limited by level)

3. **Magic System**:
   - Check magic source boxes to enable spell casting
   - Different sources provide access to different spell types
   - Spells cost AP to cast

4. **Combat**:
   - Roll initiative (1d20 + Awareness)
   - Spend AP for actions on your turn
   - Attack rolls: 1d20 + attribute vs target's defense

## Customization

### Adding New Items

The system supports several item types:
- **Weapons**: Melee, ranged, or thrown weapons with damage and AP costs
- **Armor**: Light, medium, heavy armor and shields
- **Equipment**: General gear and items
- **Talents**: Character abilities and feats
- **Spells**: Magic spells from various sources
- **Skills**: Character skills and proficiencies

### Modifying Templates

You can customize character sheets by editing the Handlebars templates in the `templates/` directory. The main character sheet is in `templates/actor/actor-character-sheet.hbs`.

### Adding Lineages and Backgrounds

Currently, lineages and backgrounds are entered as free text. Future versions may include dropdown selections with predefined options.

## API Usage

### Actor Methods

```javascript
// Roll an attribute check
actor.rollAttribute('strength');

// Roll initiative
actor.rollInitiative();

// Spend Action Points
actor.spendActionPoints(2);

// Take a rest
actor.rest(true);  // short rest
actor.rest(false); // long rest
```

### Item Methods

```javascript
// Weapon attacks and damage
weapon.rollAttack();
weapon.rollDamage();

// Cast a spell
spell.castSpell();

// Use a talent
talent.useTalent();
```

## Contributing

This system is based on the MythCraft RPG by The Forge Studios. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Roadmap

### Planned Features

- [ ] Compendium packs with sample content
- [ ] Advanced talent trees
- [ ] Magic item creation tools
- [ ] Combat automation improvements
- [ ] Character import/export
- [ ] NPC stat block generator
- [ ] Initiative tracker integration
- [ ] Status effect automation
- [ ] Encumbrance tracking
- [ ] Rest automation
- [ ] Spell slot tracking (if applicable)

### Version History

- **v1.0.0**: Initial release with core functionality
  - Character creation with lineages, backgrounds, and talents
  - Action Point system
  - Basic combat mechanics
  - Spell casting system
  - Item management

## Support

For issues, suggestions, or questions:

1. Check the [Issues](https://github.com/yourusername/mythcraft-foundry/issues) page
2. Join the Foundry VTT Discord and ask in the system-specific channels
3. Consult the [MythCraft RPG SRD](https://srd.mythcraftrpg.com) for rule clarifications

## Legal

This system is an independent implementation for use with Foundry Virtual Tabletop. MythCraft RPG is created by The Forge Studios. Please support the official game by purchasing the core rulebooks.

The system code is provided under [LICENSE] for community use and modification.

## Acknowledgments

- The Forge Studios for creating MythCraft RPG
- The Foundry VTT community for development resources and support
- Contributors and testers who help improve the system

---

*Ready to craft your own myths? Create epic characters and embark on legendary adventures with the MythCraft RPG system for Foundry VTT!*