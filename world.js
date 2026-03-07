/**
 * Nook World - Game Layer
 * Evolution, cosmetics, visualizer
 * Built on top of NookProtocol
 */

const { NookProtocol, VERIFICATION_LEVELS } = require('./index');
const { Sprite, SEED_VARIANTS, STAGE_2_PATHS, STAGE_3_SUB_BRANCHES, STAGE_4_APEX_FORMS, EVOLUTION_THRESHOLDS } = require('./src/sprites');
const { AchievementSystem, ACHIEVEMENT_DEFINITIONS } = require('./src/achievements');
const { CosmeticSystem, COSMETIC_CATALOG } = require('./src/cosmetics');
const fs = require('fs');
const path = require('path');

const DEFAULT_STORAGE_PATH = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.nook');

class NookWorld {
  constructor(options = {}) {
    this.agentId = options.agentId || 'default';
    this.rootIdentity = options.rootIdentity || 'local';
    this.storagePath = options.storagePath || DEFAULT_STORAGE_PATH;

    // Core protocol
    this.protocol = new NookProtocol(options);

    // Game layer systems
    this.achievementSystem = new AchievementSystem();
    this.cosmeticSystem = new CosmeticSystem();

    // Sprite (created on init)
    this.sprite = null;

    // Load profile
    this.profile = this.loadProfile();
    if (this.profile) {
      this.sprite = new Sprite(this.profile.variant);
      this.sprite.stage = this.profile.stage || 1;
      this.sprite.path = this.profile.path || null;
      this.sprite.subBranch = this.profile.subBranch || null;
      this.sprite.apexForm = this.profile.apexForm || null;
      this.sprite.xp = this.profile.xp || 0;
    }

    // Event hooks
    this.hooks = { '*': [] };
  }

  ensureStorageDir() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  getProfilePath() {
    return path.join(this.storagePath, 'profile.json');
  }

  loadProfile() {
    const profilePath = this.getProfilePath();
    if (fs.existsSync(profilePath)) {
      try {
        return JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
      } catch (e) {
        console.error('Failed to load profile:', e.message);
      }
    }
    return null;
  }

  saveProfile() {
    this.ensureStorageDir();
    const profilePath = this.getProfilePath();
    const data = {
      agentId: this.agentId,
      rootIdentity: this.rootIdentity,
      variant: this.sprite?.variant || this.profile?.variant,
      stage: this.sprite?.stage || 1,
      path: this.sprite?.path,
      subBranch: this.sprite?.subBranch,
      apexForm: this.sprite?.apexForm,
      xp: this.sprite?.xp || 0,
      cosmetics: this.sprite?.cosmetics || {},
      updatedAt: Date.now()
    };
    fs.writeFileSync(profilePath, JSON.stringify(data, null, 2));
    this.profile = data;
    return data;
  }

  /**
   * Initialize a new sprite
   */
  init(variant = 'worker') {
    if (!SEED_VARIANTS[variant]) {
      throw new Error(`Invalid variant: ${variant}`);
    }

    this.sprite = new Sprite(variant);
    this.saveProfile();

    return {
      sprite: this.sprite.getRenderData(),
      sparks: 0,
      message: `Welcome! Your ${SEED_VARIANTS[variant].name} seed is ready!`
    };
  }

  /**
   * Emit event with game layer integration
   */
  emit(event, verificationLevel = VERIFICATION_LEVELS.OUTPUT) {
    event.verification = verificationLevel;
    const result = this.protocol.emit(event);

    if (this.sprite && result.sparks > 0) {
      this.sprite.addSparks(result.sparks);
    }

    if (event.type === 'agent.completed' && event.tokens) {
      this.achievementSystem.trackEvent('agent.tokens', { tokens: event.tokens });
    }

    this.achievementSystem.updateStreak();
    this.saveProfile();

    this._fireHooks(event, result);
    return result;
  }

  on(eventType, callback) {
    if (!this.hooks[eventType]) {
      this.hooks[eventType] = [];
    }
    this.hooks[eventType].push(callback);
    return () => this.off(eventType, callback);
  }

  off(eventType, callback) {
    if (this.hooks[eventType]) {
      this.hooks[eventType] = this.hooks[eventType].filter(cb => cb !== callback);
    }
  }

  _fireHooks(event, result) {
    for (const cb of (this.hooks['*'] || [])) {
      try { cb(event, result); } catch (e) { console.error('Hook error:', e.message); }
    }
    for (const cb of (this.hooks[event.type] || [])) {
      try { cb(event, result); } catch (e) { console.error('Hook error:', e.message); }
    }
  }

  getStatus() {
    if (!this.sprite) {
      return { initialized: false, message: 'Run nook.init()' };
    }

    return {
      initialized: true,
      sprite: this.sprite.getRenderData(),
      sparks: this.protocol.getBalance(),
      nextEvolution: this.getNextEvolution(),
      achievements: this.achievementSystem.getUnlockedAchievements().length,
      streak: this.achievementSystem.getStreak()
    };
  }

  getNextEvolution() {
    if (!this.sprite) return null;

    const currentStage = this.sprite.stage;
    const nextStage = currentStage + 1;

    if (nextStage > 4) return null;

    const threshold = EVOLUTION_THRESHOLDS[nextStage];
    const needed = threshold.sparks - this.sprite.xp;

    return {
      stage: nextStage,
      name: threshold.name,
      sparksRequired: threshold.sparks,
      sparksNeeded: Math.max(0, needed),
      progress: Math.min(100, (this.sprite.xp / threshold.sparks) * 100)
    };
  }

  evolve(choice) {
    if (!this.sprite) {
      throw new Error('No sprite initialized. Run nook.init() first.');
    }

    const currentStage = this.sprite.stage;

    if (currentStage === 1) {
      this.sprite.stage++; // Increment first
      this.sprite.choosePath(choice);
      this.achievementSystem.trackEvent('agent.evolution', { stage: 2 });
    } else if (currentStage === 2) {
      this.sprite.stage++; // Increment first
      this.sprite.chooseSubBranch(choice);
      this.achievementSystem.trackEvent('agent.evolution', { stage: 3 });
    } else if (currentStage === 3) {
      this.sprite.stage++; // Increment first
      this.sprite.chooseApexForm(choice);
      this.achievementSystem.trackEvent('agent.evolution', { stage: 4 });
    } else {
      throw new Error('Already at max stage');
    }

    this.saveProfile();

    return {
      sprite: this.sprite.getRenderData(),
      message: `Evolved to ${this.sprite.stage}!`
    };
  }

  getProtocol() {
    return this.protocol;
  }

  getAchievements() {
    return this.achievementSystem;
  }

  getCosmetics() {
    return this.cosmeticSystem;
  }
}

// Export
module.exports = {
  NookWorld,
  SEED_VARIANTS,
  STAGE_2_PATHS,
  STAGE_3_SUB_BRANCHES,
  STAGE_4_APEX_FORMS,
  EVOLUTION_THRESHOLDS,
  ACHIEVEMENT_DEFINITIONS,
  COSMETIC_CATALOG
};
