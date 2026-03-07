/**
 * Nook Bytes System
 * Premium currency for Nook
 *
 * Placeholder for Phase 3: Bounty Board partnerships
 */

const BYTES_TIERS = [
  { name: 'Starter', amount: 100, price: 0.99 },
  { name: 'Standard', amount: 500, price: 3.99 },
  { name: 'Premium', amount: 1500, price: 9.99 },
  { name: 'Deluxe', amount: 5000, price: 29.99 }
];

const BYTES_REWARDS = {
  // Earned from Bounty Board (Phase 3 - TBD partnerships)
  bounty_reward_min: 10,
  bounty_reward_max: 500
};

class BytesSystem {
  constructor(options = {}) {
    this.balance = options.balance || 0;
    this.transactionHistory = [];
  }

  /**
   * Add bytes to balance (from purchase or bounty)
   */
  addBytes(amount, source = 'unknown') {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    this.balance += amount;
    this.recordTransaction('credit', amount, source);

    return {
      success: true,
      amount,
      balance: this.balance,
      source
    };
  }

  /**
   * Spend bytes (for cosmetics, gacha, etc.)
   */
  spendBytes(amount, purpose = 'unknown') {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (this.balance < amount) {
      return {
        success: false,
        reason: 'insufficient_balance',
        required: amount,
        available: this.balance
      };
    }

    this.balance -= amount;
    this.recordTransaction('debit', amount, purpose);

    return {
      success: true,
      amount,
      balance: this.balance,
      purpose
    };
  }

  /**
   * Get current balance
   */
  getBalance() {
    return this.balance;
  }

  /**
   * Record a transaction
   */
  recordTransaction(type, amount, source) {
    this.transactionHistory.push({
      type,
      amount,
      source,
      timestamp: Date.now(),
      balanceAfter: this.balance
    });
  }

  /**
   * Get transaction history
   */
  getHistory(limit = 20) {
    return this.transactionHistory.slice(-limit).reverse();
  }

  /**
   * Get purchase tiers
   */
  getTiers() {
    return BYTES_TIERS;
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BytesSystem, BYTES_TIERS, BYTES_REWARDS };
}
