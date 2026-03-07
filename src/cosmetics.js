/**
 * Nook Cosmetics System
 * Hats, outfits, accessories, backgrounds, trails
 */

const COSMETIC_CATALOG = {
  hats: [
    { id: 'hat_crown', name: 'Tiny Crown', tier: 'legendary', price: 500 },
    { id: 'hat_beanie', name: 'Cozy Beanie', tier: 'common', price: 50 },
    { id: 'hat_cap', name: 'Baseball Cap', tier: 'common', price: 50 },
    { id: 'hat_wizard', name: 'Wizard Hat', tier: 'epic', price: 300 },
    { id: 'hat_cowboy', name: 'Cowboy Hat', tier: 'rare', price: 150 },
    { id: 'hat_helmet', name: 'Safety Helmet', tier: 'uncommon', price: 75 }
  ],
  outfits: [
    { id: 'outfit_tuxedo', name: 'Mini Tuxedo', tier: 'epic', price: 350 },
    { id: 'outfit_hoodie', name: 'Cozy Hoodie', tier: 'common', price: 50 },
    { id: 'outfit_suit', name: 'Little Suit', tier: 'rare', price: 150 },
    { id: 'outfit_pajama', name: 'Pajama Set', tier: 'uncommon', price: 75 },
    { id: 'outfit_armor', name: 'Tiny Armor', tier: 'legendary', price: 500 }
  ],
  accessories: [
    { id: 'acc_glasses', name: 'Round Glasses', tier: 'common', price: 50 },
    { id: 'acc_watch', name: 'Mini Watch', tier: 'rare', price: 150 },
    { id: 'acc_cape', name: 'Hero Cape', tier: 'epic', price: 300 },
    { id: 'acc_bow', name: 'Cute Bow', tier: 'uncommon', price: 75 },
    { id: 'acc_scarf', name: 'Fancy Scarf', tier: 'rare', price: 150 }
  ],
  backgrounds: [
    { id: 'bg_forest', name: 'Forest', tier: 'common', price: 50 },
    { id: 'bg_beach', name: 'Beach', tier: 'common', price: 50 },
    { id: 'bg_space', name: 'Space', tier: 'epic', price: 300 },
    { id: 'bg_sunset', name: 'Sunset', tier: 'rare', price: 150 },
    { id: 'bg_city', name: 'City Lights', tier: 'uncommon', price: 75 }
  ],
  trails: [
    { id: 'trail_sparkle', name: 'Sparkles', tier: 'uncommon', price: 75 },
    { id: 'trail_fire', name: 'Fire Trail', tier: 'epic', price: 300 },
    { id: 'trail_stars', name: 'Star Trail', tier: 'rare', price: 150 },
    { id: 'trail_hearts', name: 'Hearts', tier: 'common', price: 50 },
    { id: 'trail_none', name: 'None', tier: 'common', price: 0 }
  ]
};

const COSMETIC_TIERS = {
  common: { dropRate: 0.60, color: '#95a5a6' },
  uncommon: { dropRate: 0.25, color: '#2ecc71' },
  rare: { dropRate: 0.10, color: '#3498db' },
  epic: { dropRate: 0.04, color: '#9b59b6' },
  legendary: { dropRate: 0.01, color: '#f39c12' }
};

class CosmeticSystem {
  constructor() {
    this.catalog = COSMETIC_CATALOG;
    this.owned = {
      hats: [],
      outfits: [],
      accessories: [],
      backgrounds: [],
      trails: []
    };
    this.equipped = {
      hat: null,
      outfit: null,
      accessory: null,
      background: null,
      trail: null
    };
  }

  /**
   * Get cosmetic by ID
   */
  getCosmetic(id) {
    for (const category of Object.values(this.catalog)) {
      const cosmetic = category.find(c => c.id === id);
      if (cosmetic) return cosmetic;
    }
    return null;
  }

  /**
   * Purchase cosmetic (for Bytes)
   */
  purchaseCosmetic(id, bytes) {
    const cosmetic = this.getCosmetic(id);
    if (!cosmetic) {
      throw new Error(`Cosmetic not found: ${id}`);
    }

    if (bytes < cosmetic.price) {
      throw new Error(`Not enough Bytes. Need ${cosmetic.price}, have ${bytes}`);
    }

    // Add to owned
    const category = this.getCategoryForCosmetic(id);
    if (category) {
      this.owned[category].push(cosmetic);
    }

    return { cosmetic, remainingBytes: bytes - cosmetic.price };
  }

  /**
   * Get category for cosmetic ID
   */
  getCategoryForCosmetic(id) {
    for (const [category, items] of Object.entries(this.catalog)) {
      if (items.find(c => c.id === id)) {
        return category;
      }
    }
    return null;
  }

  /**
   * Equip cosmetic
   */
  equipCosmetic(id) {
    const cosmetic = this.getCosmetic(id);
    if (!cosmetic) {
      throw new Error(`Cosmetic not found: ${id}`);
    }

    const category = this.getCategoryForCosmetic(id);
    if (!category) return;

    // Remove from current equipped in this category
    this.equipped[category.slice(0, -1)] = cosmetic.id;
  }

  /**
   * Unequip cosmetic
   */
  unequipCosmetic(category) {
    this.equipped[category] = null;
  }

  /**
   * Get all owned cosmetics
   */
  getOwned() {
    return this.owned;
  }

  /**
   * Get equipped cosmetics
   */
  getEquipped() {
    return this.equipped;
  }

  /**
   * Get cosmetic details for rendering
   */
  getCosmeticDetails(id) {
    return this.getCosmetic(id);
  }

  /**
   * Roll gacha (returns random cosmetic)
   */
  rollGacha(tier = null) {
    // If tier specified, weight that tier
    // Otherwise random based on drop rates
    const tiers = Object.keys(COSMETIC_TIERS);
    let selectedTier = tier;

    if (!selectedTier) {
      const rand = Math.random();
      let cumulative = 0;
      for (const [t, data] of Object.entries(COSMETIC_TIERS)) {
        cumulative += data.dropRate;
        if (rand <= cumulative) {
          selectedTier = t;
          break;
        }
      }
    }

    // Pick random cosmetic from tier
    const cosmetics = [];
    for (const category of Object.values(this.catalog)) {
      for (const c of category) {
        if (c.tier === selectedTier) {
          cosmetics.push(c);
        }
      }
    }

    if (cosmetics.length === 0) {
      // Fallback to common
      return this.rollGacha('common');
    }

    return cosmetics[Math.floor(Math.random() * cosmetics.length)];
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CosmeticSystem, COSMETIC_CATALOG, COSMETIC_TIERS };
}
