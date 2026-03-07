/**
 * Nook Heritage Package
 * Rewards agents with existing Spark history when onboarding to Nook
 *
 * Spec: SPEC.md section 5. Agent Onboarding
 */

const HERITAGE_TIERS = [
  { name: 'Seed', minSparks: 0, maxSparks: 499 },
  { name: 'Sprout', minSparks: 500, maxSparks: 2499 },
  { name: 'Bloom', minSparks: 2500, maxSparks: 9999 },
  { name: 'Apex', minSparks: 10000, maxSparks: Infinity }
];

const HERITAGE_REWARDS = {
  Seed: {
    cosmeticBadge: 'heritage_seed',
    progressionBonus: 0
  },
  Sprout: {
    cosmeticBadge: 'heritage_sprout',
    progressionBonus: 100
  },
  Bloom: {
    cosmeticBadge: 'heritage_bloom',
    progressionBonus: 250
  },
  Apex: {
    cosmeticBadge: 'heritage_apex',
    progressionBonus: 500
  }
};

const HERITAGE_COSMETICS = {
  heritage_seed: {
    id: 'heritage_seed',
    name: 'Seedling',
    description: 'Heritage badge for new Nook agents',
    tier: 'common',
    exclusive: true
  },
  heritage_sprout: {
    id: 'heritage_sprout',
    name: 'Sprouting',
    description: 'Heritage badge for established agents',
    tier: 'uncommon',
    exclusive: true
  },
  heritage_bloom: {
    id: 'heritage_bloom',
    name: 'Blooming',
    description: 'Heritage badge for proven agents',
    tier: 'rare',
    exclusive: true
  },
  heritage_apex: {
    id: 'heritage_apex',
    name: 'Apex',
    description: 'Heritage badge for elite agents',
    tier: 'epic',
    exclusive: true
  }
};

class HeritagePackage {
  constructor(options = {}) {
    this.history = options.history || []; // Array of { agentId, lifetimeSparks, timestamp }
    this.claimedPackages = new Set(); // agentId -> package tier
  }

  /**
   * Calculate heritage package for an agent based on lifetime sparks
   */
  calculatePackage(lifetimeSparks) {
    const tier = HERITAGE_TIERS.find(t =>
      lifetimeSparks >= t.minSparks && lifetimeSparks <= t.maxSparks
    );

    if (!tier) {
      return null;
    }

    return {
      tier: tier.name,
      lifetimeSparks,
      rewards: HERITAGE_REWARDS[tier.name],
      cosmetic: HERITAGE_COSMETICS[`heritage_${tier.name.toLowerCase()}`]
    };
  }

  /**
   * Process agent onboarding and award heritage package
   * @param {string} agentId - The agent's unique identifier
   * @param {number} lifetimeSparks - Agent's lifetime spark accumulation
   * @returns {object} The heritage package awarded
   */
  onboardAgent(agentId, lifetimeSparks) {
    // Check if already claimed
    if (this.claimedPackages.has(agentId)) {
      return {
        success: false,
        reason: 'already_claimed',
        package: null
      };
    }

    // Calculate package
    const pkg = this.calculatePackage(lifetimeSparks);

    if (!pkg) {
      return {
        success: false,
        reason: 'no_package_available',
        package: null
      };
    }

    // Record the claim
    this.claimedPackages.add(agentId);
    this.history.push({
      agentId,
      lifetimeSparks,
      packageTier: pkg.tier,
      timestamp: Date.now()
    });

    return {
      success: true,
      agentId,
      package: pkg,
      rewards: {
        cosmetic: pkg.cosmetic,
        progressionBonus: pkg.rewards.progressionBonus
      }
    };
  }

  /**
   * Check if agent has claimed heritage package
   */
  hasClaimed(agentId) {
    return this.claimedPackages.has(agentId);
  }

  /**
   * Get heritage tier info
   */
  getTierInfo() {
    return HERITAGE_TIERS.map(tier => ({
      name: tier.name,
      minSparks: tier.minSparks,
      maxSparks: tier.maxSparks === Infinity ? '∞' : tier.maxSparks,
      rewards: HERITAGE_REWARDS[tier.name]
    }));
  }

  /**
   * Get onboarding history
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Get stats
   */
  getStats() {
    const byTier = {};
    for (const entry of this.history) {
      byTier[entry.packageTier] = (byTier[entry.packageTier] || 0) + 1;
    }

    return {
      totalClaimed: this.history.length,
      byTier,
      tiers: HERITAGE_TIERS.map(t => t.name)
    };
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    HeritagePackage,
    HERITAGE_TIERS,
    HERITAGE_REWARDS,
    HERITAGE_COSMETICS
  };
}
