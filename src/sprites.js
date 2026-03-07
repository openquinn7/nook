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
      state: this.state,
      cosmetics: { ...this.cosmetics },
      stats: { ...this.stats },
      xp: this.xp,
      level: this.level
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
    if (this.stage !== 2) {
      throw new Error('Can only choose path at stage 2');
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
    return this;
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
  module.exports = { Sprite, SEED_VARIANTS, SPRITE_STATES, COSMETIC_SLOTS };
}
