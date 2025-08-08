# Changelog

All notable changes to the MythCraft RPG system for Foundry VTT will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release of MythCraft RPG system for Foundry VTT v13
- Complete character creation system with ancestries, classes, and backgrounds
- Action Point-based combat system
- Eight attribute system (Strength, Dexterity, Endurance, Intelligence, Awareness, Coordination, Willpower, Presence)
- Three defense types (Physical, Mental, Social)
- Comprehensive item system:
  - Weapons with attack/damage rolls and properties
  - Armor with defense bonuses and restrictions
  - Equipment with uses and special abilities
  - Spells with five magic sources and eight schools
  - Talents with prerequisites and benefits
  - Skills with ranks and proficiency
  - Ancestries with traits and ability modifiers
  - Classes with features and spell progression
  - Backgrounds with personality traits and equipment
- Magic system with five sources (Arcane, Divine, Occult, Primal, Psionic)
- Spell component system (Verbal, Somatic, Material, Focus)
- Active effects system with condition management
- Automated calculations for health, defenses, and action points
- Character and NPC sheet templates
- Item sheets for all item types
- Drag and drop functionality
- Hotbar macro support
- English language support
- System settings for variant rules

### Technical Features
- ES6 module architecture
- Foundry VTT v13 compatibility
- Custom Handlebars helpers
- Modular template system
- Active effects integration
- Roll data preparation
- Chat message integration

### System Configuration
- Variant encumbrance rules option
- Action Point carryover settings
- Token attribute configuration
- Initiative automation

---

## Development Notes

### Architecture
The system is built using modern ES6 modules with a clean separation of concerns:
- `documents/` - Core actor and item document classes
- `sheets/` - UI sheet classes for actors and items
- `helpers/` - Utility functions and configuration
- `templates/` - Handlebars templates for UI

### Data Model
The system uses a comprehensive data model defined in `template.json`:
- Actor types: character, npc
- Item types: weapon, armor, equipment, talent, spell, skill, ancestry, class, background
- Nested templates for code reuse and consistency

### Future Enhancements
Planned features for future releases:
- Additional ancestries and classes
- Monster stat blocks and abilities
- Advanced combat options
- Spell scrolls and magic items
- Character import/export
- Automation improvements
- Additional language support

### Contributing
We welcome contributions! Please see the README.md for development setup and contribution guidelines.

---

*This changelog follows the [Keep a Changelog](https://keepachangelog.com) format.*