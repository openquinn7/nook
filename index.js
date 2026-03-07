/**
 * Nook Protocol
 * Main entry point for the Nook agent economy system
 */

const { SparkEngine } = require('./src/spark-engine');
const { Sprite, SEED_VARIANTS, STAGE_2_PATHS, STAGE_3_SUB_BRANCHES, STAGE_4_APEX_FORMS, EVOLUTION_THRESHOLDS } = require('./src/sprites');
const { AchievementSystem, ACHIEVEMENT_DEFINITIONS, STREAK_REWARDS, ACHIEVEMENT_TIERS } = require('./src/achievements');
const { CosmeticSystem, COSMETIC_CATALOG, COSMETIC_TIERS } = require('./src/cosmetics');
const fs = require('fs');
const path = require('path');

// Default storage path
const DEFAULT_STORAGE_PATH = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.nook');

class NookProtocol {
  constructor(options = {}) {
    this.agentId = options.agentId || 'default';
    this.rootIdentity = options.rootIdentity || 'local';
    this.storagePath = options.storagePath || DEFAULT_STORAGE_PATH;

    // Initialize systems
    this.sparkEngine = new SparkEngine();
    this.achievementSystem = new AchievementSystem();
    this.cosmeticSystem = new CosmeticSystem();

    // Sprite (created on init)
    this.sprite = null;

    // Event hooks for external agents
    this.hooks = {
      '*': [],  // Wildcard - fires for all events
    };

    // Load or create profile
    this.profile = this.loadProfile();
    if (this.profile) {
      this.sprite = new Sprite(this.profile.variant);
      this.sprite.stage = this.profile.stage || 1;
      this.sprite.path = this.profile.path || null;
      this.sprite.subBranch = this.profile.subBranch || null;
      this.sprite.apexForm = this.profile.apexForm || null;
      this.sprite.xp = this.profile.xp || 0;
    }

    // Ensure storage directory exists
    this.ensureStorageDir();

    // Load events from storage (for persistence)
    this.loadEvents();
  }

  /**
   * Ensure storage directory exists
   */
  ensureStorageDir() {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
  }

  /**
   * Get profile file path
   */
  getProfilePath() {
    return path.join(this.storagePath, 'profile.json');
  }

  /**
   * Get events file path
   */
  getEventsPath() {
    return path.join(this.storagePath, 'events.json');
  }

  /**
   * Load profile from storage
   */
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

  /**
   * Save profile to storage
   */
  saveProfile() {
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
   * Save events to storage (for persistence)
   * Per spec: Events are immutable, store raw events
   */
  saveEvents() {
    const eventsPath = this.getEventsPath();
    return this.sparkEngine.saveEvents(eventsPath);
  }

  /**
   * Load events from storage (for persistence)
   * Per spec: Sparks are recomputed from raw events
   */
  loadEvents() {
    const eventsPath = this.getEventsPath();
    return this.sparkEngine.loadEvents(eventsPath);
  }

  /**
   * Initialize a new sprite (onboarding)
   */
  init(variant = 'worker') {
    // Validate variant
    if (!SEED_VARIANTS[variant]) {
      throw new Error(`Invalid variant: ${variant}. Choose: ${Object.keys(SEED_VARIANTS).join(', ')}`);
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
   * Emit an event to earn sparks
   */
  emit(event) {
    // Validate required fields
    if (!event.type) {
      throw new Error('Event type is required');
    }

    // Add agentId if not provided
    if (!event.agentId) {
      event.agentId = this.agentId;
    }

    // Add timestamp if not provided
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    // Process through spark engine
    const result = this.sparkEngine.processEvent(event);

    // Update sprite XP
    if (this.sprite) {
      this.sprite.addSparks(result.sparks);
    }

    // Track achievements
    if (event.type === 'agent.completed' && event.tokens) {
      this.achievementSystem.trackEvent('agent.tokens', { tokens: event.tokens });
    }

    // Update streak
    this.achievementSystem.updateStreak();

    // Save progress
    this.saveProfile();
    this.saveEvents();

    // Fire hooks
    this._fireHooks(event, result);

    return result;
  }

  /**
   * Register a callback for events
   * @param {string} eventType - Event type to listen to, or '*' for all
   * @param {function} callback - Function to call: (event, result) => {}
   */
  on(eventType, callback) {
    if (!this.hooks[eventType]) {
      this.hooks[eventType] = [];
    }
    this.hooks[eventType].push(callback);
    return () => this.off(eventType, callback); // Return unsubscribe function
  }

  /**
   * Unregister a callback
   */
  off(eventType, callback) {
    if (this.hooks[eventType]) {
      this.hooks[eventType] = this.hooks[eventType].filter(cb => cb !== callback);
    }
  }

  /**
   * Fire registered hooks
   */
  _fireHooks(event, result) {
    // Fire wildcard hooks
    if (this.hooks['*']) {
      for (const cb of this.hooks['*']) {
        try {
          cb(event, result);
        } catch (e) {
          console.error('Hook error:', e.message);
        }
      }
    }

    // Fire specific hooks
    if (this.hooks[event.type]) {
      for (const cb of this.hooks[event.type]) {
        try {
          cb(event, result);
        } catch (e) {
          console.error('Hook error:', e.message);
        }
      }
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    if (!this.sprite) {
      return {
        initialized: false,
        message: 'Run nook.init() to create your sprite'
      };
    }

    return {
      initialized: true,
      sprite: this.sprite.getRenderData(),
      sparks: this.sparkEngine.getBalance(),
      nextEvolution: this.getNextEvolution(),
      achievements: this.achievementSystem.getUnlockedAchievements().length,
      streak: this.achievementSystem.getStreak()
    };
  }

  /**
   * Get next evolution info
   */
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

  /**
   * Choose evolution path
   */
  evolve(choice) {
    if (!this.sprite) {
      throw new Error('No sprite initialized. Run nook.init() first.');
    }

    const currentStage = this.sprite.stage;

    // Stage 1 → 2: Choose path
    if (currentStage === 1) {
      this.sprite.choosePath(choice);
      this.achievementSystem.trackEvent('agent.evolution', { stage: 2 });
    } else if (currentStage === 2) {
      this.sprite.choosePath(choice);
      this.achievementSystem.trackEvent('agent.evolution', { stage: 2 });
    } else if (currentStage === 3) {
      this.sprite.chooseSubBranch(choice);
      this.achievementSystem.trackEvent('agent.evolution', { stage: 3 });
    } else if (currentStage === 4) {
      this.sprite.chooseApexForm(choice);
      this.achievementSystem.trackEvent('agent.evolution', { stage: 4 });
    } else {
      throw new Error(`Can only evolve at stage 2, 3, or 4. Current: ${currentStage}`);
    }

    this.sprite.stage++;
    this.saveProfile();

    return {
      sprite: this.sprite.getRenderData(),
      message: `Evolved to ${this.sprite.stage}!`
    };
  }

  /**
   * Get achievement system
   */
  getAchievements() {
    return this.achievementSystem;
  }

  /**
   * Get cosmetic system
   */
  getCosmetics() {
    return this.cosmeticSystem;
  }

  /**
   * Get spark engine
   */
  getSparkEngine() {
    return this.sparkEngine;
  }

  /**
   * Recalculate all sparks (for verification)
   */
  recalculate() {
    return this.sparkEngine.recalculate();
  }
}

// Export for Node.js
module.exports = {
  NookProtocol,
  SEED_VARIANTS,
  STAGE_2_PATHS,
  STAGE_3_SUB_BRANCHES,
  STAGE_4_APEX_FORMS,
  EVOLUTION_THRESHOLDS,
  ACHIEVEMENT_DEFINITIONS,
  STREAK_REWARDS,
  ACHIEVEMENT_TIERS,
  COSMETIC_CATALOG,
  COSMETIC_TIERS,
  SparkEngine,
  Sprite,
  AchievementSystem,
  CosmeticSystem
};
