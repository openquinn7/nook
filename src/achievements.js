/**
 * Nook Achievement System
 * Tracks achievements and daily streaks
 */

const ACHIEVEMENT_DEFINITIONS = {
  // Developer achievements
  'first_commit': {
    name: 'First Commit',
    description: 'Made your first git commit',
    tier: 'common',
    trigger: 'git.commit',
    sparkReward: 10
  },
  'first_pr': {
    name: 'Pull Request',
    description: 'Opened your first pull request',
    tier: 'uncommon',
    trigger: 'git.pr',
    sparkReward: 25
  },
  'commit_streak_7': {
    name: 'Week Warrior',
    description: '7 day commit streak',
    tier: 'rare',
    trigger: 'git.streak',
    sparkReward: 50
  },
  'commit_streak_30': {
    name: 'Monthly Master',
    description: '30 day commit streak',
    tier: 'epic',
    trigger: 'git.streak',
    sparkReward: 200
  },
  'first_bug_fix': {
    name: 'Bug Hunter',
    description: 'Fixed your first bug',
    tier: 'common',
    trigger: 'git.bugfix',
    sparkReward: 15
  },
  'first_release': {
    name: 'Release Ready',
    description: 'Published your first release',
    tier: 'rare',
    trigger: 'git.release',
    sparkReward: 75
  },

  // Agent achievements
  'tokens_1k': {
    name: 'Getting Started',
    description: 'Processed 1,000 tokens',
    tier: 'common',
    trigger: 'agent.tokens',
    sparkReward: 10
  },
  'tokens_100k': {
    name: 'Century',
    description: 'Processed 100,000 tokens',
    tier: 'rare',
    trigger: 'agent.tokens',
    sparkReward: 100
  },
  'tokens_1m': {
    name: 'Millionaire',
    description: 'Processed 1,000,000 tokens',
    tier: 'legendary',
    trigger: 'agent.tokens',
    sparkReward: 500
  },
  'evolution_stage_2': {
    name: 'Sprouted',
    description: 'Evolved to Stage 2',
    tier: 'uncommon',
    trigger: 'agent.evolution',
    sparkReward: 25
  },
  'evolution_stage_3': {
    name: 'Growing',
    description: 'Evolved to Stage 3',
    tier: 'rare',
    trigger: 'agent.evolution',
    sparkReward: 75
  },
  'evolution_stage_4': {
    name: 'Blooming',
    description: 'Evolved to Stage 4',
    tier: 'legendary',
    trigger: 'agent.evolution',
    sparkReward: 200
  },

  // Social achievements
  'first_bounty': {
    name: 'Bounty Hunter',
    description: 'Completed your first bounty',
    tier: 'uncommon',
    trigger: 'social.bounty',
    sparkReward: 30
  },
  'bounties_10': {
    name: 'Pro Hunter',
    description: 'Completed 10 bounties',
    tier: 'rare',
    trigger: 'social.bounty',
    sparkReward: 100
  }
};

const STREAK_REWARDS = {
  7: { type: 'gacha', tier: 1, name: 'Week Streak Chest' },
  30: { type: 'gacha', tier: 2, name: 'Month Streak Chest' },
  100: { type: 'gacha', tier: 3, name: 'Century Streak Chest' },
  365: { type: 'cosmetic', rarity: 'legendary', name: 'Year Streak Cosmetic' }
};

const ACHIEVEMENT_TIERS = {
  common: { dropRate: 0.6, color: '#95a5a6' },
  uncommon: { dropRate: 0.25, color: '#2ecc71' },
  rare: { dropRate: 0.1, color: '#3498db' },
  epic: { dropRate: 0.04, color: '#9b59b6' },
  legendary: { dropRate: 0.01, color: '#f39c12' }
};

class AchievementSystem {
  constructor(options = {}) {
    this.achievements = new Map(); // achievementId -> { unlockedAt, progress }
    this.streak = {
      current: 0,
      best: 0,
      lastActiveDate: null,
      history: [] // Array of date strings
    };
    this.stats = {
      totalCommits: 0,
      totalPRs: 0,
      totalTokens: 0,
      totalBounties: 0,
      bugsFixed: 0
    };
    this.unlockedChests = []; // Chests earned from streaks/achievements
  }

  /**
   * Unlock an achievement
   */
  unlock(achievementId) {
    if (this.achievements.has(achievementId)) {
      return null; // Already unlocked
    }

    const def = ACHIEVEMENT_DEFINITIONS[achievementId];
    if (!def) {
      throw new Error(`Unknown achievement: ${achievementId}`);
    }

    const achievement = {
      id: achievementId,
      ...def,
      unlockedAt: Date.now()
    };

    this.achievements.set(achievementId, achievement);

    return {
      achievement,
      sparkReward: def.sparkReward,
      isNew: true
    };
  }

  /**
   * Update achievement progress
   */
  updateProgress(achievementId, progress) {
    const existing = this.achievements.get(achievementId);
    if (existing) {
      existing.progress = progress;
    }
  }

  /**
   * Track an event and check for achievements
   */
  trackEvent(eventType, data = {}) {
    const results = [];

    // Token milestones
    if (eventType === 'agent.tokens') {
      this.stats.totalTokens += data.tokens || 0;

      const tokenMilestones = [
        { threshold: 1000, id: 'tokens_1k' },
        { threshold: 100000, id: 'tokens_100k' },
        { threshold: 1000000, id: 'tokens_1m' }
      ];

      for (const milestone of tokenMilestones) {
        if (this.stats.totalTokens >= milestone.threshold) {
          const result = this.unlock(milestone.id);
          if (result) results.push(result);
        }
      }
    }

    // Evolution milestones
    if (eventType === 'agent.evolution') {
      const stage = data.stage;
      if (stage >= 2) {
        const result = this.unlock('evolution_stage_2');
        if (result) results.push(result);
      }
      if (stage >= 3) {
        const result = this.unlock('evolution_stage_3');
        if (result) results.push(result);
      }
      if (stage >= 4) {
        const result = this.unlock('evolution_stage_4');
        if (result) results.push(result);
      }
    }

    // Git events
    if (eventType === 'git.commit') {
      this.stats.totalCommits++;
      if (this.stats.totalCommits === 1) {
        const result = this.unlock('first_commit');
        if (result) results.push(result);
      }
    }

    if (eventType === 'git.pr') {
      this.stats.totalPRs++;
      if (this.stats.totalPRs === 1) {
        const result = this.unlock('first_pr');
        if (result) results.push(result);
      }
    }

    if (eventType === 'git.bugfix') {
      this.stats.bugsFixed++;
      if (this.stats.bugsFixed === 1) {
        const result = this.unlock('first_bug_fix');
        if (result) results.push(result);
      }
    }

    if (eventType === 'git.release') {
      const result = this.unlock('first_release');
      if (result) results.push(result);
    }

    // Social events
    if (eventType === 'social.bounty') {
      this.stats.totalBounties++;
      if (this.stats.totalBounties === 1) {
        const result = this.unlock('first_bounty');
        if (result) results.push(result);
      }
      if (this.stats.totalBounties >= 10) {
        const result = this.unlock('bounties_10');
        if (result) results.push(result);
      }
    }

    return results;
  }

  /**
   * Update daily streak
   * Call this once per day when user is active
   */
  updateStreak() {
    const today = new Date().toISOString().split('T')[0];

    // Already processed today
    if (this.streak.lastActiveDate === today) {
      return { streak: this.streak.current, isNew: false };
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (this.streak.lastActiveDate === yesterday) {
      // Continuing streak
      this.streak.current++;
    } else if (this.streak.lastActiveDate !== today) {
      // Streak broken (or first day)
      this.streak.current = 1;
    }

    this.streak.lastActiveDate = today;
    this.streak.history.push(today);

    // Update best streak
    if (this.streak.current > this.streak.best) {
      this.streak.best = this.streak.current;
    }

    // Check for streak rewards
    const rewards = [];
    for (const [days, reward] of Object.entries(STREAK_REWARDS)) {
      if (this.streak.current === parseInt(days)) {
        this.unlockedChests.push(reward);
        rewards.push(reward);
      }
    }

    return { streak: this.streak.current, isNew: true, rewards };
  }

  /**
   * Get all unlocked achievements
   */
  getUnlockedAchievements() {
    return Array.from(this.achievements.values());
  }

  /**
   * Get achievement by ID
   */
  getAchievement(id) {
    return this.achievements.get(id) || null;
  }

  /**
   * Get current streak info
   */
  getStreak() {
    return { ...this.streak };
  }

  /**
   * Get pending streak rewards
   */
  getPendingStreakRewards() {
    const pending = [];
    for (const [days, reward] of Object.entries(STREAK_REWARDS)) {
      if (this.streak.current >= parseInt(days) &&
          !this.unlockedChests.some(c => c.name === reward.name)) {
        pending.push({ ...reward, days: parseInt(days) });
      }
    }
    return pending;
  }

  /**
   * Get available chests
   */
  getChests() {
    return [...this.unlockedChests];
  }

  /**
   * Claim a chest
   */
  claimChest(index) {
    if (index < 0 || index >= this.unlockedChests.length) {
      throw new Error('Invalid chest index');
    }
    return this.unlockedChests.splice(index, 1)[0];
  }

  /**
   * Get stats
   */
  getStats() {
    return { ...this.stats };
  }

  /**
   * Get total spark rewards from achievements
   */
  getTotalSparkRewards() {
    let total = 0;
    for (const achievement of this.achievements.values()) {
      total += achievement.sparkReward || 0;
    }
    return total;
  }

  /**
   * Export data for persistence
   */
  export() {
    return {
      achievements: Array.from(this.achievements.entries()),
      streak: this.streak,
      stats: this.stats,
      chests: this.unlockedChests
    };
  }

  /**
   * Import data from persistence
   */
  import(data) {
    if (data.achievements) {
      this.achievements = new Map(data.achievements);
    }
    if (data.streak) {
      this.streak = data.streak;
    }
    if (data.stats) {
      this.stats = data.stats;
    }
    if (data.chests) {
      this.unlockedChests = data.chests;
    }
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AchievementSystem, ACHIEVEMENT_DEFINITIONS, STREAK_REWARDS, ACHIEVEMENT_TIERS };
}
