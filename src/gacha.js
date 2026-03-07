/**
 * Nook Gacha System
 * Random cosmetic rewards with tier-based drop rates
 */

const { COSMETIC_TIERS } = require('./cosmetics');

const GACHA_TYPES = {
  SINGLE: { name: 'Single Roll', cost: 100, rolls: 1 },
  MULTI: { name: 'Multi Roll', cost: 900, rolls: 10 },  // 10% discount
  GUARANTEED: { name: 'Guaranteed Epic', cost: 500, rolls: 1, minTier: 'epic' }
};

const GACHA_PITY_SYSTEM = {
  // Pity counter resets after each legendary
  legendary: { threshold: 90, bonusRate: 0.01 },  // Increases by 1% each roll after 90
  epic: { threshold: 30, bonusRate: 0.04 }      // Increases by 4% each roll after 30
};

class GachaSystem {
  constructor(cosmeticSystem) {
    this.cosmeticSystem = cosmeticSystem;
    this.rollHistory = [];
    this.pityCounters = {
      legendary: 0,
      epic: 0
    };
  }

  /**
   * Roll gacha with specified type
   */
  roll(type = 'SINGLE', currency = 'sparks', balance = 0) {
    const gachaType = GACHA_TYPES[type];
    if (!gachaType) {
      throw new Error(`Invalid gacha type: ${type}`);
    }

    if (balance < gachaType.cost) {
      throw new Error(`Not enough ${currency}. Need ${gachaType.cost}, have ${balance}`);
    }

    const results = [];
    for (let i = 0; i < gachaType.rolls; i++) {
      const result = this.rollSingle(gachaType.minTier);
      results.push(result);

      // Update pity
      this.updatePity(result.tier);
    }

    // Store in history
    this.rollHistory.push({
      type: gachaType.name,
      results,
      timestamp: Date.now()
    });

    return {
      type: gachaType.name,
      results,
      remainingBalance: balance - gachaType.cost,
      newPity: { ...this.pityCounters }
    };
  }

  /**
   * Roll a single cosmetic
   */
  rollSingle(minTier = null) {
    const tiers = Object.keys(COSMETIC_TIERS);

    // Apply pity system
    let adjustedRates = { ...COSMETIC_TIERS };

    if (this.pityCounters.legendary >= GACHA_PITY_SYSTEM.legendary.threshold) {
      const bonus = GACHA_PITY_SYSTEM.legendary.bonusRate *
        (this.pityCounters.legendary - GACHA_PITY_SYSTEM.legendary.threshold);
      adjustedRates.legendary.dropRate = Math.min(0.5, 0.01 + bonus);
    }

    if (this.pityCounters.epic >= GACHA_PITY_SYSTEM.epic.threshold) {
      const bonus = GACHA_PITY_SYSTEM.epic.bonusRate *
        (this.pityCounters.epic - GACHA_PITY_SYSTEM.epic.threshold);
      adjustedRates.epic.dropRate = Math.min(0.5, 0.04 + bonus);
    }

    // Filter by minTier if specified
    let validTiers = tiers;
    if (minTier) {
      const minIndex = tiers.indexOf(minTier);
      validTiers = tiers.slice(minIndex);
    }

    // Weighted random selection
    const rand = Math.random();
    let cumulative = 0;
    let selectedTier = validTiers[validTiers.length - 1]; // default to lowest

    for (const tier of validTiers) {
      cumulative += adjustedRates[tier].dropRate;
      if (rand <= cumulative) {
        selectedTier = tier;
        break;
      }
    }

    // Pick random cosmetic from tier
    const cosmetic = this.cosmeticSystem.rollGacha(selectedTier);

    return {
      cosmetic,
      tier: cosmetic.tier,
      isNew: !this.isOwned(cosmetic.id)
    };
  }

  /**
   * Check if cosmetic is owned
   */
  isOwned(cosmeticId) {
    const owned = this.cosmeticSystem.getOwned();
    for (const category of Object.values(owned)) {
      if (category.find(c => c.id === cosmeticId)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Update pity counters after roll
   */
  updatePity(tier) {
    const tierOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
    const tierIndex = tierOrder.indexOf(tier);

    // Increment pity for tiers below what was rolled
    for (let i = tierIndex + 1; i < tierOrder.length; i++) {
      const t = tierOrder[i];
      if (this.pityCounters[t] !== undefined) {
        this.pityCounters[t]++;
      }
    }

    // Reset pity for rolled tier
    if (this.pityCounters[tier] !== undefined) {
      this.pityCounters[tier] = 0;
    }
  }

  /**
   * Get current pity rates
   */
  getPityRates() {
    const rates = {};
    for (const [tier, config] of Object.entries(GACHA_PITY_SYSTEM)) {
      const currentPity = this.pityCounters[tier];
      let adjustedRate = COSMETIC_TIERS[tier].dropRate;

      if (currentPity >= config.threshold) {
        const bonus = config.bonusRate * (currentPity - config.threshold);
        adjustedRate = Math.min(0.5, adjustedRate + bonus);
      }

      rates[tier] = {
        current: currentPity,
        threshold: config.threshold,
        rate: adjustedRate
      };
    }
    return rates;
  }

  /**
   * Get roll history
   */
  getHistory(limit = 10) {
    return this.rollHistory.slice(-limit).reverse();
  }

  /**
   * Get gacha types info
   */
  getGachaTypes() {
    return GACHA_TYPES;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GachaSystem, GACHA_TYPES, GACHA_PITY_SYSTEM };
}
