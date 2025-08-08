# MythCraft RPG System for Foundry VTT

An implementation of the MythCraft RPG system for Foundry Virtual Tabletop, featuring Action Point-based combat, complex character creation, and d20 mechanics.

![MythCraft RPG](https://img.shields.io/badge/Foundry%20VTT-v13-green?style=flat-square)
![License](https://img.shields.io/github/license/leonartdan/MythcraftRPG?style=flat-square)

## Features

### 🎲 Core System
- **Action Point Combat**: Tactical combat system with Action Points for dynamic turn management
- **Eight Attributes**: Strength, Dexterity, Endurance, Intelligence, Awareness, Coordination, Willpower, and Presence
- **Three Defense Types**: Physical, Mental, and Social defenses
- **Comprehensive Character Creation**: Full ancestry, class, and background system

### ⚔️ Combat & Items
- **Weapon System**: Melee, ranged, and thrown weapons with custom properties
- **Armor System**: Light, medium, heavy armor and shields with defense bonuses
- **Equipment Management**: Complete inventory system with weight, cost, and rarity
- **Automated Calculations**: Health, defenses, and action points calculated automatically

### 🔮 Magic System
- **Five Magic Sources**: Arcane, Divine, Occult, Primal, and Psionic magic
- **Spell Schools**: Eight traditional schools of magic
- **Spell Components**: Verbal, somatic, material, and focus components
- **Flexible Casting**: Action Point costs for tactical spellcasting

### 🎭 Character Development
- **Talent System**: General, combat, magic, skill, lineage, and background talents
- **Skill System**: Comprehensive skill system with ranks and proficiencies
- **Ancestry System**: Detailed lineages with traits and ability modifications
- **Class System**: Traditional classes with features, hit dice, and progression
- **Background System**: Rich backgrounds with skills, equipment, and personality traits

### 🎨 User Interface
- **Modern UI**: Clean, intuitive interface designed for ease of use
- **Multiple Sheets**: Specialized sheets for characters, NPCs, and all item types
- **Active Effects**: Visual effect management with conditions and bonuses
- **Drag & Drop**: Full support for drag-and-drop functionality
- **Hotbar Integration**: Macro support for quick actions

## Installation

### Method 1: Foundry VTT Module Browser
1. Open Foundry VTT and navigate to the "Game Systems" tab
2. Click "Install System"
3. Search for "MythCraft RPG"
4. Click "Install"

### Method 2: Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/leonartdan/MythcraftRPG/releases)
2. Extract the zip file to your Foundry VTT `Data/systems` directory
3. Restart Foundry VTT
4. Create a new world using the "MythCraft RPG" system

### Method 3: Manifest URL
Use this manifest URL in Foundry VTT:
```
https://github.com/leonartdan/MythcraftRPG/releases/latest/download/system.json
```

## Getting Started

### Creating a Character
1. Create a new Actor and select "Character" type
2. Set basic information: name, ancestry, class, background
3. Assign attribute scores
4. Select talents and skills
5. Equip weapons and armor
6. Learn spells (if applicable)

### Combat
1. **Initiative**: Roll 1d20 + Awareness
2. **Action Points**: Start each turn with your Action Point maximum
3. **Actions**: Spend Action Points on attacks, spells, movement, and other actions
4. **Carryover**: Unused Action Points can be carried over (if enabled)

### Magic
1. **Prerequisites**: Must have access to the appropriate magic source
2. **Casting**: Spells cost Action Points to cast
3. **Components**: Some spells require verbal, somatic, material, or focus components
4. **Schools**: Spells are organized by their magical school

## System Structure

```
mythcraft/
├── scripts/
│   ├── documents/         # Actor and Item document classes
│   ├── sheets/           # Character and item sheet classes
│   ├── helpers/          # Utility functions and configurations
│   └── mythcraft.mjs     # Main system initialization
├── templates/
│   ├── actor/            # Actor sheet templates
│   └── item/             # Item sheet templates
├── styles/
│   └── mythcraft.css     # System styling
├── lang/
│   └── en.json          # English language support
├── system.json          # System manifest
└── template.json        # Data model definitions
```

## Configuration

### System Settings
- **Variant Encumbrance**: Enable detailed weight tracking
- **Action Point Carryover**: Allow carrying over unused Action Points

### Token Configuration
- **Primary Attribute**: Health (displays as token bar)
- **Secondary Attribute**: Action Points (displays as token bar)

## Compatibility

- **Foundry VTT Version**: 11-13 (verified on v13)
- **Modules**: Compatible with most Foundry VTT modules
- **Recommended Modules**:
  - Dice So Nice! (for enhanced dice rolling)
  - Token Action HUD (for quick access to actions)
  - Combat Utility Belt (for enhanced combat features)

## Development

### Prerequisites
- Node.js (for development tools)
- Git (for version control)

### Building
```bash
# Clone the repository
git clone https://github.com/leonartdan/MythcraftRPG.git

# Install dependencies (if any)
npm install

# Link to Foundry data directory
ln -s $(pwd) /path/to/foundry/Data/systems/mythcraft
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

### Documentation
- [System Wiki](https://github.com/leonartdan/MythcraftRPG/wiki)
- [FAQ](https://github.com/leonartdan/MythcraftRPG/wiki/FAQ)

### Community
- [GitHub Issues](https://github.com/leonartdan/MythcraftRPG/issues) - Bug reports and feature requests
- [Foundry VTT Discord](https://discord.gg/foundryvtt) - General Foundry support

### Bug Reports
When reporting bugs, please include:
- Foundry VTT version
- MythCraft system version
- Browser and version
- Steps to reproduce
- Console errors (F12 → Console)

## License

This system is licensed under the [MIT License](LICENSE). 

MythCraft RPG content and rules are used with permission. This system is not affiliated with or endorsed by the official MythCraft RPG.

## Acknowledgments

- **Foundry VTT Community** - For tools, templates, and inspiration
- **MythCraft RPG** - For the excellent tabletop RPG system
- **Contributors** - Thanks to all who have contributed to this project

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

---

*Built for Foundry Virtual Tabletop*