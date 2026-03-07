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

// Stage 3 sub-branches (chosen at stage 3)
const STAGE_3_SUB_BRANCHES = {
  worker: {
    builder: {
      architect: { name: 'Architect', description: 'Designs and structures solutions', statBonus: { speed: 0.3, luck: 0.1 } },
      craftsman: { name: 'Craftsman', description: 'Implements with precision', statBonus: { stamina: 0.3, speed: 0.1 } }
    },
    autonomous: {
      optimizer: { name: 'Optimizer', description: 'Makes things run better', statBonus: { speed: 0.4 } },
      autochef: { name: 'AutoChef', description: 'Self-managing systems', statBonus: { stamina: 0.4 } }
    }
  },
  explorer: {
    scout: {
      navigator: { name: 'Navigator', description: 'Charts new territories', statBonus: { speed: 0.2, luck: 0.2 } },
      pathfinder: { name: 'Pathfinder', description: 'Finds optimal routes', statBonus: { luck: 0.3, speed: 0.1 } }
    },
    investigator: {
      tracer: { name: 'Tracer', description: 'Follows trails of data', statBonus: { luck: 0.3, speed: 0.1 } },
      profiler: { name: 'Profiler', description: 'Builds detailed pictures', statBonus: { stamina: 0.2, luck: 0.2 } }
    }
  },
  scholar: {
    analyst: {
      quant: { name: 'Quant', description: 'Numerical expert', statBonus: { luck: 0.3, speed: 0.1 } },
      auditor: { name: 'Auditor', description: 'Thorough examiner', statBonus: { stamina: 0.2, luck: 0.2 } }
    },
    planner: {
      strategist: { name: 'Strategist', description: 'Long-term thinker', statBonus: { speed: 0.2, stamina: 0.2 } },
      coordinator: { name: 'Coordinator', description: 'Orchestrates efforts', statBonus: { luck: 0.2, stamina: 0.2 } }
    }
  }
};

// Stage 4 Apex forms (chosen at stage 4)
const STAGE_4_APEX_FORMS = {
  worker: {
    champion: { name: 'Champion', description: 'Master of execution and delivery', emoji: '🏆', statBonus: { speed: 0.5, stamina: 0.5, luck: 0.3 } },
    legend: { name: 'Legend', description: 'Known for incredible achievements', emoji: '⭐', statBonus: { speed: 0.3, stamina: 0.3, luck: 0.7 } }
  },
  explorer: {
    champion: { name: 'Champion', description: 'Heroic discoverer', emoji: '🏆', statBonus: { speed: 0.5, luck: 0.5, stamina: 0.3 } },
    legend: { name: 'Legend', description: 'Legendary explorer', emoji: '⭐', statBonus: { luck: 0.7, speed: 0.3, stamina: 0.3 } }
  },
  scholar: {
    champion: { name: 'Champion', description: 'Wise champion', emoji: '🏆', statBonus: { stamina: 0.5, luck: 0.5, speed: 0.3 } },
    legend: { name: 'Legend', description: 'Legendary mind', emoji: '⭐', statBonus: { luck: 0.7, stamina: 0.3, speed: 0.3 } }
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
