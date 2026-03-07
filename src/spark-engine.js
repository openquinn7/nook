/**
 * Nook Spark Engine
 * Computes sparks from agent activity events
 */

const SPARK_FORMULA = (tokens, distinctWorkUnits) => {
  return Math.sqrt(tokens / 1000) * Math.log(distinctWorkUnits + 1);
};

// Rate limits
const RATE_LIMITS = {
  hourly: 50,
  daily: 300
};

// Daily diminishing returns
const DIMINISHING_RATES = [
  { threshold: 100, rate: 1.0 },
  { threshold: 200, rate: 0.5 },
  { threshold: 300, rate: 0.25 },
  { threshold: Infinity, rate: 0 }
];

class SparkEngine {
  constructor(options = {}) {
    this.hourlyCap = options.hourlyCap || RATE_LIMITS.hourly;
    this.dailyCap = options.dailyCap || RATE_LIMITS.daily;
    this.events = [];
    this.sparkBalance = 0;
  }

  /**
   * Process an event and calculate sparks
   */
  processEvent(event) {
    // Validate event
    if (!event.type || !event.agentId) {
      throw new Error('Invalid event: missing type or agentId');
    }

    const sparks = this.calculateSparks(event);
    const cappedSparks = this.applyRateLimits(sparks, event.timestamp);

    // Store event
    this.events.push({
      id: this.generateId(),
      event,
      sparks: cappedSparks,
      timestamp: event.timestamp || Date.now()
    });

    this.sparkBalance += cappedSparks;

    return {
      event,
      sparks: cappedSparks,
      totalSparks: this.sparkBalance
    };
  }

  /**
   * Calculate sparks from event using formula
   */
  calculateSparks(event) {
    if (event.type !== 'agent.completed') return 0;

    const tokens = event.tokens || 0;
    const workUnits = this.getDistinctWorkUnits(event.agentId);

    return SPARK_FORMULA(tokens, workUnits);
  }

  /**
   * Apply rate limits and diminishing returns
   */
  applyRateLimits(sparks, timestamp = Date.now()) {
    const hourStart = this.getHourStart(timestamp);
    const dayStart = this.getDayStart(timestamp);

    // Calculate sparks this hour
    const hourlySparks = this.events
      .filter(e => e.timestamp >= hourStart)
      .reduce((sum, e) => sum + e.sparks, 0);

    // Calculate sparks today
    const dailySparks = this.events
      .filter(e => e.timestamp >= dayStart)
      .reduce((sum, e) => sum + e.sparks, 0);

    // Apply hourly cap
    let remaining = this.hourlyCap - hourlySparks;
    if (remaining <= 0) return 0;
    sparks = Math.min(sparks, remaining);

    // Apply daily cap
    remaining = this.dailyCap - dailySparks;
    if (remaining <= 0) return 0;
    sparks = Math.min(sparks, remaining);

    // Apply diminishing returns
    const rate = this.getDiminishingRate(dailySparks);
    return Math.floor(sparks * rate);
  }

  /**
   * Get diminishing rate based on daily sparks
   */
  getDiminishingRate(dailySparks) {
    for (const tier of DIMINISHING_RATES) {
      if (dailySparks < tier.threshold) {
        return tier.rate;
      }
    }
    return 0;
  }

  /**
   * Get distinct work units for an agent
   */
  getDistinctWorkUnits(agentId) {
    const agentEvents = this.events.filter(e => e.event.agentId === agentId);
    const workUnits = new Set(
      agentEvents
        .map(e => e.event.workUnitId)
        .filter(wu => wu !== undefined)
    );
    return workUnits.size;
  }

  /**
   * Get hour start timestamp
   */
  getHourStart(timestamp) {
    const date = new Date(timestamp);
    date.setMinutes(0, 0, 0);
    return date.getTime();
  }

  /**
   * Get day start timestamp
   */
  getDayStart(timestamp) {
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Get current balance
   */
  getBalance() {
    return this.sparkBalance;
  }

  /**
   * Get event history
   */
  getEvents(agentId = null) {
    if (agentId) {
      return this.events.filter(e => e.event.agentId === agentId);
    }
    return this.events;
  }

  /**
   * Recalculate all sparks (for verification)
   */
  recalculate() {
    const events = [...this.events];
    this.events = [];
    this.sparkBalance = 0;

    for (const { event, timestamp } of events) {
      event.timestamp = timestamp;
      this.processEvent(event);
    }

    return this.sparkBalance;
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SparkEngine, SPARK_FORMULA, RATE_LIMITS, DIMINISHING_RATES };
}
