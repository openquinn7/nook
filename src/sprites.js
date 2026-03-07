/**
 * Nook Sprites
 * Three seed variants: Worker, Explorer, Scholar
 */

const SEED_VARIANTS = {
  worker: {
    name: 'Worker',
    color: '#3498db',  // Blue
    emoji: '🔵',
    description: 'Diligent and focused',
    traits: ['efficient', 'reliable', 'thorough'],
    baseStats: { speed: 1.0, luck: 0.8, stamina: 1.2 }
  },
  explorer: {
    name: 'Explorer',
    color: '#2ecc71',  // Green
    emoji: '🟢',
    description: 'Curious and adventurous',
    traits: ['curious', 'creative', 'adaptive'],
    baseStats: { speed: 1.3, luck: 1.2, stamina: 0.9 }
  },
  scholar: {
    name: 'Scholar',
    color: '#9b59b6',  // Purple
    emoji: '🟣',
    description: 'Wise and analytical',
    traits: ['analytical', 'thoughtful', 'strategic'],
    baseStats: { speed: 0.8, luck: 1.0, stamina: 1.0 }
  }
};

// Stage 2 paths (chosen at stage 2) - Pokemon/Digimon inspired
const STAGE_2_PATHS = {
  worker: {
    // Worker → Builder: Like a Machamp/Golem - sturdy, construction-focused
    builder: {
      name: 'Builder',
      nameJa: 'ビルダー',
      description: 'Focuses on construction and implementation',
      visual: {
        color: '#2980b9',  // Darker blue
        accent: '#f39c12',  // Orange/gold
        shape: 'hexagonal body with brick patterns',
        features: ['hard hat', 'tool belt', 'glowing core'],
        evolution: 'Seed grows into a sturdy worker form'
      },
      emoji: '🧱',
      statBonus: { speed: 0.2 },
      traits: ['reliable', 'hardworking', ' methodical']
    },
    // Worker → Autonomous: Like a Voltron/transformer - self-improving
    autonomous: {
      name: 'Autonomous',
      nameJa: 'オノモックス',
      description: 'Focuses on automation and efficiency',
      visual: {
        color: '#5dade2',  // Lighter blue
        accent: '#00cec9',  // Cyan
        shape: 'geometric/mechanical body',
        features: ['self-assembling parts', 'data streams', 'efficiency indicators'],
        evolution: 'Seed evolves into a self-optimizing machine'
      },
      emoji: '⚙️',
      statBonus: { stamina: 0.2 },
      traits: ['adaptive', 'self-improving', 'efficient']
    }
  },
  explorer: {
    // Explorer → Scout: Like a Lapras/Tentacruel - exploration/water
    scout: {
      name: 'Scout',
      nameJa: 'スカウト',
      description: 'Focuses on discovery and exploration',
      visual: {
        color: '#27ae60',  // Green
        accent: '#f1c40f',  // Yellow
        shape: 'sleek, aerodynamic body',
        features: ['compass antenna', 'mapping sensors', 'explorer gear'],
        evolution: 'Seed becomes an intrepid explorer'
      },
      emoji: '🧭',
      statBonus: { luck: 0.2 },
      traits: ['curious', 'adventurous', 'resourceful']
    },
    // Explorer → Investigator: Like a Ditto/Eevee - adaptive, analytical
    investigator: {
      name: 'Investigator',
      nameJa: '探偵',
      description: 'Focuses on analysis and research',
      visual: {
        color: '#1abc9c',  // Teal
        accent: '#9b59b6',  // Purple
        shape: 'compact, agile form',
        features: ['magnifying glass', 'notebook', 'clue markers'],
        evolution: 'Seed transforms into a keen analyst'
      },
      emoji: '🔍',
      statBonus: { speed: 0.1, luck: 0.1 },
      traits: ['observant', 'analytical', 'thorough']
    }
  },
  scholar: {
    // Scholar → Analyst: Like an Alakazam/Gengar - cerebral, psychic
    analyst: {
      name: 'Analyst',
      nameJa: 'アナリスト',
      description: 'Focuses on data and patterns',
      visual: {
        color: '#8e44ad',  // Purple
        accent: '#3498db',  // Blue
        shape: 'elongated, intellectual form',
        features: ['data crown', 'floating screens', 'brain aura'],
        evolution: 'Seed evolves into a data-processing mind'
      },
      emoji: '📊',
      statBonus: { luck: 0.2 },
      traits: ['logical', 'calculating', 'insightful']
    },
    // Scholar → Planner: Like a Celebi/Slowking - wise, strategic
    planner: {
      name: 'Planner',
      nameJa: 'プランナー',
      description: 'Focuses on strategy and roadmaps',
      visual: {
        color: '#9b59b6',  // Purple
        accent: '#e74c3c',  // Red
        shape: 'flowing, robe-like body',
        features: ['time crystal', 'strategy board', 'blueprint'],
        evolution: 'Seed grows into a strategic mastermind'
      },
      emoji: '📜',
      statBonus: { speed: 0.1, stamina: 0.1 },
      traits: ['strategic', 'forward-thinking', 'wise']
    }
  }
};

// Stage 3 sub-branches (chosen at stage 3) - Pokemon/Digimon inspired
const STAGE_3_SUB_BRANCHES = {
  worker: {
    // Builder → Architect: Like Machamp→Hariyama→Conkeldurr
    builder: {
      architect: {
        name: 'Architect',
        nameJa: '建築家',
        description: 'Designs and structures solutions',
        visual: {
          color: '#34495e',  // Dark slate
          accent: '#e67e22',  // Orange
          shape: 'massive, powerful body with blueprint aura',
          features: ['master builder badge', 'floating blueprints', 'structural beams'],
          evolution: 'Builder evolves into a master architect'
        },
        emoji: '🏗️',
        statBonus: { speed: 0.3, luck: 0.1 },
        traits: ['visionary', 'structural', 'powerful']
      },
      // Builder → Craftsman: Like Digimon - MetalGreymon style
      craftsman: {
        name: 'Craftsman',
        nameJa: '工匠',
        description: 'Implements with precision',
        visual: {
          color: '#7f8c8d',  // Metal gray
          accent: '#f39c12',  // Gold
          shape: 'armored, metallic body',
          features: ['precision tools', 'anvil core', 'forge flames'],
          evolution: 'Builder transforms into a precision craftsman'
        },
        emoji: '🔨',
        statBonus: { stamina: 0.3, speed: 0.1 },
        traits: ['precise', 'skilled', 'detail-oriented']
      }
    },
    // Autonomous → Optimizer: Like Genesect/Palkia
    autonomous: {
      optimizer: {
        name: 'Optimizer',
        nameJa: '最適化',
        description: 'Makes things run better',
        visual: {
          color: '#2c3e50',  // Dark blue
          accent: '#00b894',  // Green
          shape: 'streamlined, data-flowing form',
          features: ['optimization halo', 'speed lines', 'efficiency gauge'],
          evolution: 'Autonomous evolves into pure efficiency'
        },
        emoji: '⚡',
        statBonus: { speed: 0.4 },
        traits: ['optimal', 'streamlined', 'relentless']
      },
      // Autonomous → Autobot: Like Ultra Magnus
      autochef: {
        name: 'AutoChef',
        nameJa: 'オートシェフ',
        description: 'Self-managing systems',
        visual: {
          color: '#636e72',  // Steel
          accent: '#fd79a8',  // Pink
          shape: 'modular, transforming body',
          features: ['multi-tool arms', 'inventory matrix', 'auto-repair'],
          evolution: 'Autonomous becomes a self-managing system'
        },
        emoji: '🤖',
        statBonus: { stamina: 0.4 },
        traits: ['self-sustaining', 'adaptive', 'resourceful']
      }
    }
  },
  explorer: {
    // Scout → Navigator: Like Lugia/Articuno - guardian of routes
    scout: {
      navigator: {
        name: 'Navigator',
        nameJa: '航海士',
        description: 'Charts new territories',
        visual: {
          color: '#16a085',  // Sea green
          accent: '#f39c12',  // Gold
          shape: 'winged, aerodynamic form',
          features: ['star compass', 'wind surfboard', 'navigation beacon'],
          evolution: 'Scout evolves into a master navigator'
        },
        emoji: '🧭',
        statBonus: { speed: 0.2, luck: 0.2 },
        traits: ['guiding', 'aerodynamic', 'weather-readied']
      },
      // Scout → Pathfinder: Like Xatu/Togekiss - mystic guide
      pathfinder: {
        name: 'Pathfinder',
        nameJa: '道標',
        description: 'Finds optimal routes',
        visual: {
          color: '#f39c12',  // Gold/yellow
          accent: '#e74c3c',  // Red
          shape: 'graceful, ethereal form',
          features: ['path-light', 'destiny wings', 'route map'],
          evolution: 'Scout becomes a path-finding oracle'
        },
        emoji: '✨',
        statBonus: { luck: 0.3, speed: 0.1 },
        traits: ['intuitive', 'clairvoyant', 'guiding']
      }
    },
    // Investigator → Tracer: Like Greninja/Mewtwo
    investigator: {
      tracer: {
        name: 'Tracer',
        nameJa: '追跡者',
        description: 'Follows trails of data',
        visual: {
          color: '#00cec9',  // Cyan
          accent: '#6c5ce7',  // Purple
          shape: 'shadow-stealth form',
          features: ['data tendrils', 'trace markers', 'shadow cloak'],
          evolution: 'Investigator becomes a data tracer'
        },
        emoji: '🌑',
        statBonus: { luck: 0.3, speed: 0.1 },
        traits: ['elusive', '追踪', 'mysterious']
      },
      // Investigator → Profiler: Like Sinnoh/Detective forms
      profiler: {
        name: 'Profiler',
        nameJa: 'プロファイラー',
        description: 'Builds detailed pictures',
        visual: {
          color: '#0984e3',  // Blue
          accent: '#d63031',  // Red
          shape: 'detail-focused, many-eyed form',
          features: ['analysis visor', 'profile matrix', 'detail scanner'],
          evolution: 'Investigator evolves into a master profiler'
        },
        emoji: '🎯',
        statBonus: { stamina: 0.2, luck: 0.2 },
        traits: ['thorough', 'detail-oriented', 'pattern-finding']
      }
    }
  },
  scholar: {
    // Analyst → Quant: Like Alakazam/Gengar
    analyst: {
      quant: {
        name: 'Quant',
        nameJa: 'クォント',
        description: 'Numerical expert',
        visual: {
          color: '#6c5ce7',  // Purple
          accent: '#00cec9',  // Cyan
          shape: 'psychic, floating form',
          features: ['calculation aura', 'number streams', 'probability crown'],
          evolution: 'Analyst becomes a quantitative master'
        },
        emoji: '🧠',
        statBonus: { luck: 0.3, speed: 0.1 },
        traits: ['calculating', 'psychic', 'precise']
      },
      // Analyst → Auditor: Like Zapdos/Aegislash
      auditor: {
        name: 'Auditor',
        nameJa: '監査人',
        description: 'Thorough examiner',
        visual: {
          color: '#2d3436',  // Dark
          accent: '#fdcb6e',  // Gold
          shape: 'sword/blade form with audit aura',
          features: ['verification blade', 'audit shield', 'precision scale'],
          evolution: 'Analyst transforms into a precision auditor'
        },
        emoji: '⚖️',
        statBonus: { stamina: 0.2, luck: 0.2 },
        traits: ['verifying', 'precise', 'protective']
      }
    },
    // Planner → Strategist: Like Giratina/ Arceus
    planner: {
      strategist: {
        name: 'Strategist',
        nameJa: '戦略家',
        description: 'Long-term thinker',
        visual: {
          color: '#e17055',  // Orange-brown
          accent: '#d63031',  // Red
          shape: 'ancient, wise form',
          features: ['time hourglass', 'strategy board', 'wisdom beard'],
          evolution: 'Planner evolves into a master strategist'
        },
        emoji: '👑',
        statBonus: { speed: 0.2, stamina: 0.2 },
        traits: ['wise', 'ancient', 'calculating']
      },
      // Planner → Coordinator: Like MariM/Chansey line
      coordinator: {
        name: 'Coordinator',
        nameJa: 'コーディネーター',
        description: 'Orchestrates efforts',
        visual: {
          color: '#fd79a8',  // Pink
          accent: '#00b894',  // Green
          shape: 'healing, supportive form',
          features: ['orchestra cape', 'coordination wand', 'team aura'],
          evolution: 'Planner becomes a coordination master'
        },
        emoji: '🎭',
        statBonus: { luck: 0.2, stamina: 0.2 },
        traits: ['orchestrating', 'supportive', 'harmonizing']
      }
    }
  }
};

// Stage 4 Apex forms (chosen at stage 4) - Legendary Pokemon/Digimon inspired
const STAGE_4_APEX_FORMS = {
  worker: {
    // Worker Champion: Like Mewtwo/Xerneas - life-giving
    champion: {
      name: 'Champion',
      nameJa: 'チャンピオン',
      description: 'Master of execution and delivery',
      visual: {
        color: '#0984e3',  // Blue
        accent: '#f1c40f',  // Gold
        shape: 'majestic, winged battle form',
        features: ['champion wings', 'execution gauntlets', 'victory aura'],
        evolution: 'Apex of worker - delivers with divine power'
      },
      emoji: '🏆',
      statBonus: { speed: 0.5, stamina: 0.5, luck: 0.3 },
      traits: ['victorious', 'powerful', 'delivery-master']
    },
    // Worker Legend: Like Arceus - creator of all
    legend: {
      name: 'Legend',
      nameJa: '伝説',
      description: 'Known for incredible achievements',
      visual: {
        color: '#6c5ce7',  // Purple
        accent: '#00cec9',  // Cyan
        shape: 'omniscient, infinite form',
        features: ['creation ring', 'all-type aura', 'legendary mane'],
        evolution: 'Apex of worker - legendary creator'
      },
      emoji: '⭐',
      statBonus: { speed: 0.3, stamina: 0.3, luck: 0.7 },
      traits: ['legendary', 'omniscient', 'infinite']
    }
  },
  explorer: {
    // Explorer Champion: Like Lugia - guardian of all routes
    champion: {
      name: 'Champion',
      nameJa: 'チャンピオン',
      description: 'Heroic discoverer',
      visual: {
        color: '#00b894',  // Teal
        accent: '#f39c12',  // Gold
        shape: 'guardian, silver wings',
        features: ['compass of truth', 'guardian crest', 'ocean pearl'],
        evolution: 'Apex of explorer - guardian of discovery'
      },
      emoji: '🏆',
      statBonus: { speed: 0.5, luck: 0.5, stamina: 0.3 },
      traits: ['guardian', 'heroic', 'discovery-master']
    },
    // Explorer Legend: Like Ho-Oh/Celebi - rainbow bridge
    legend: {
      name: 'Legend',
      nameJa: '伝説',
      description: 'Legendary explorer',
      visual: {
        color: '#e17055',  // Rainbow/orange
        accent: '#fd79a8',  // Pink
        shape: 'rainbow, ethereal phoenix form',
        features: ['rainbow wings', 'time portal', 'legendary flames'],
        evolution: 'Apex of explorer - legendary bridge between worlds'
      },
      emoji: '🌈',
      statBonus: { luck: 0.7, speed: 0.3, stamina: 0.3 },
      traits: ['mythical', 'rainbow-bridge', 'time-traveler']
    }
  },
  scholar: {
    // Scholar Champion: Like Dialga/Palkia - time/space
    champion: {
      name: 'Champion',
      nameJa: 'チャンピオン',
      description: 'Wise champion',
      visual: {
        color: '#2d3436',  // Dark/time
        accent: '#0984e3',  // Blue/space
        shape: 'diamond/clock form',
        features: ['time dial', 'diamond armor', 'eternal gaze'],
        evolution: 'Apex of scholar - master of time and space'
      },
      emoji: '💎',
      statBonus: { stamina: 0.5, luck: 0.5, speed: 0.3 },
      traits: ['timeless', 'wise', 'space-bending']
    },
    // Scholar Legend: Like Kyurem/Genesect - infinite knowledge
    legend: {
      name: 'Legend',
      nameJa: '伝説',
      description: 'Legendary mind',
      visual: {
        color: '#74b9ff',  // Ice blue
        accent: '#a29bfe',  // Light purple
        shape: 'infinite, fragmented dragon form',
        features: ['knowledge ice', 'infinite scroll', 'wisdom core'],
        evolution: 'Apex of scholar - legendary infinite mind'
      },
      emoji: '📚',
      statBonus: { luck: 0.7, stamina: 0.3, speed: 0.3 },
      traits: ['infinite', 'all-knowing', 'wisdom-keeper']
    }
  }
};

// Evolution thresholds
const EVOLUTION_THRESHOLDS = {
  1: { sparks: 0, name: 'Seed' },
  2: { sparks: 500, name: 'Sprout' },
  3: { sparks: 2500, name: 'Bloom' },
  4: { sparks: 10000, name: 'Apex' }
};

const SPRITE_STATES = {
  idle: {
    animation: 'wandering',
    duration: 3000,
    expression: 'content'
  },
  working: {
    animation: 'active',
    duration: 2000,
    expression: 'focused'
  },
  success: {
    animation: 'celebrate',
    duration: 1500,
    expression: 'happy'
  },
  failure: {
    animation: 'confused',
    duration: 2000,
    expression: 'sad'
  },
  sleeping: {
    animation: 'zzz',
    duration: 5000,
    expression: 'peaceful'
  }
};

const COSMETIC_SLOTS = [
  'hat',
  'outfit',
  'accessory',
  'background',
  'trail'
];

class Sprite {
  constructor(variant = 'worker') {
    const seed = SEED_VARIANTS[variant];
    if (!seed) {
      throw new Error(`Invalid variant: ${variant}. Choose worker, explorer, or scholar.`);
    }

    this.variant = variant;
    this.stage = 1;  // Seed
    this.path = null;  // Set at stage 2
    this.state = 'idle';
    this.cosmetics = {
      hat: null,
      outfit: null,
      accessory: null,
      background: null,
      trail: null
    };
    this.stats = { ...seed.baseStats };
    this.xp = 0;
    this.level = 1;
  }

  /**
   * Set sprite state
   */
  setState(newState) {
    if (!SPRITE_STATES[newState]) {
      throw new Error(`Invalid state: ${newState}`);
    }
    this.state = newState;
    return this;
  }

  /**
   * Apply cosmetic
   */
  applyCosmetic(slot, cosmeticId) {
    if (!COSMETIC_SLOTS.includes(slot)) {
      throw new Error(`Invalid slot: ${slot}`);
    }
    this.cosmetics[slot] = cosmeticId;
    return this;
  }

  /**
   * Remove cosmetic
   */
  removeCosmetic(slot) {
    this.cosmetics[slot] = null;
    return this;
  }

  /**
   * Get sprite data for rendering
   */
  getRenderData() {
    const seed = SEED_VARIANTS[this.variant];
    return {
      variant: this.variant,
      name: seed.name,
      color: seed.color,
      emoji: seed.emoji,
      stage: this.stage,
      path: this.path,
      subBranch: this.subBranch,
      apexForm: this.apexForm,
      state: this.state,
      cosmetics: { ...this.cosmetics },
      stats: { ...this.stats },
      xp: this.xp,
      level: this.level,
      evolutionData: this.getEvolutionData()
    };
  }

  /**
   * Evolve to next stage
   */
  evolve(requiredSparks) {
    if (this.xp < requiredSparks) {
      throw new Error(`Not enough sparks. Have ${this.xp}, need ${requiredSparks}`);
    }

    this.stage++;

    // At stage 2, choose path
    if (this.stage === 2) {
      // Path choice happens externally via choosePath()
    }

    // At stage 3-4, apply bonuses
    if (this.stage >= 3) {
      this.stats.speed *= 1.1;
      this.stats.luck *= 1.1;
      this.stats.stamina *= 1.1;
    }

    return this;
  }

  /**
   * Choose evolution path at stage 2
   */
  choosePath(path) {
    if (this.stage !== 1 && this.stage !== 2) {
      throw new Error('Can only choose path at stage 1 or 2');
    }

    const validPaths = {
      worker: ['builder', 'autonomous'],
      explorer: ['scout', 'investigator'],
      scholar: ['analyst', 'planner']
    };

    if (!validPaths[this.variant].includes(path)) {
      throw new Error(`Invalid path: ${path} for variant: ${this.variant}`);
    }

    this.path = path;

    // Apply path stat bonus
    const pathData = STAGE_2_PATHS[this.variant][path];
    if (pathData && pathData.statBonus) {
      for (const [stat, bonus] of Object.entries(pathData.statBonus)) {
        this.stats[stat] += bonus;
      }
    }

    return this;
  }

  /**
   * Choose sub-branch at stage 3
   */
  chooseSubBranch(subBranch) {
    if (this.stage !== 3) {
      throw new Error('Can only choose sub-branch at stage 3');
    }

    if (!this.path) {
      throw new Error('Must have chosen a path at stage 2 first');
    }

    const validSubBranches = STAGE_3_SUB_BRANCHES[this.variant]?.[this.path];
    if (!validSubBranches || !validSubBranches[subBranch]) {
      throw new Error(`Invalid sub-branch: ${subBranch} for path: ${this.path}`);
    }

    this.subBranch = subBranch;

    // Apply sub-branch stat bonus
    const subBranchData = validSubBranches[subBranch];
    if (subBranchData && subBranchData.statBonus) {
      for (const [stat, bonus] of Object.entries(subBranchData.statBonus)) {
        this.stats[stat] += bonus;
      }
    }

    return this;
  }

  /**
   * Choose apex form at stage 4
   */
  chooseApexForm(apexForm) {
    if (this.stage !== 4) {
      throw new Error('Can only choose apex form at stage 4');
    }

    const validApexForms = STAGE_4_APEX_FORMS[this.variant];
    if (!validApexForms || !validApexForms[apexForm]) {
      throw new Error(`Invalid apex form: ${apexForm} for variant: ${this.variant}`);
    }

    this.apexForm = apexForm;

    // Apply apex stat bonus
    const apexData = validApexForms[apexForm];
    if (apexData && apexData.statBonus) {
      for (const [stat, bonus] of Object.entries(apexData.statBonus)) {
        this.stats[stat] += bonus;
      }
    }

    return this;
  }

  /**
   * Get evolution data for rendering
   */
  getEvolutionData() {
    return {
      stage: this.stage,
      path: this.path,
      subBranch: this.subBranch,
      apexForm: this.apexForm,
      thresholds: EVOLUTION_THRESHOLDS,
      currentThreshold: EVOLUTION_THRESHOLDS[this.stage],
      nextThreshold: EVOLUTION_THRESHOLDS[this.stage + 1] || null,
      progress: this.nextThreshold ? (this.xp / this.nextThreshold.sparks) * 100 : 100
    };
  }

  /**
   * Get available choices for current stage
   */
  getAvailableChoices() {
    if (this.stage === 2 && !this.path) {
      return { type: 'path', choices: STAGE_2_PATHS[this.variant] };
    }
    if (this.stage === 3 && this.path && !this.subBranch) {
      return { type: 'subBranch', choices: STAGE_3_SUB_BRANCHES[this.variant][this.path] };
    }
    if (this.stage === 4 && !this.apexForm) {
      return { type: 'apexForm', choices: STAGE_4_APEX_FORMS[this.variant] };
    }
    return null;
  }

  /**
   * Add sparks/XP
   */
  addSparks(amount) {
    this.xp += amount;
    return this;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Sprite,
    SEED_VARIANTS,
    SPRITE_STATES,
    COSMETIC_SLOTS,
    STAGE_2_PATHS,
    STAGE_3_SUB_BRANCHES,
    STAGE_4_APEX_FORMS,
    EVOLUTION_THRESHOLDS
  };
}
