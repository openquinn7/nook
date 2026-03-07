/**
 * Nook Spark Engine v1.0
 * Deterministic spark computation from agent activity events
 *
 * Spec: Spark Engine Spec V1.txt
 */

const SPARK_FORMULA = (tokens, distinctWorkUnits) => {
  const K = 1; // Normalization constant
  return K * Math.sqrt(tokens / 1000) * Math.log(distinctWorkUnits + 1);
};

// Rate limits (per rootIdentity)
const RATE_LIMITS = {
  hourly: 50,
  daily: 300
};

// Daily diminishing returns
const DIMINISHING_RATES = [
  { maxSparks: 100, rate: 1.0 },
  { maxSparks: 200, rate: 0.5 },
  { maxSparks: 300, rate: 0.25 },
  { maxSparks: Infinity, rate: 0 }
];

// Duplicate work suppression (per workUnitId within window)
const SUPPRESSION_MULTIPLIERS = [
  { occurrences: 10, multiplier: 1.0 },
  { occurrences: 20, multiplier: 0.75 },
  { occurrences: 50, multiplier: 0.5 },
  { occurrences: Infinity, multiplier: 0.25 }
];

// Calculation window (24 hours in ms)
const WINDOW_24H = 24 * 60 * 60 * 1000;

class SparkEngine {
  constructor(options = {}) {
    this.hourlyCap = options.hourlyCap || RATE_LIMITS.hourly;
    this.dailyCap = options.dailyCap || RATE_LIMITS.daily;
    this.events = []; // All events
    this.lifetimeSparks = 0;
  }

  /**
   * Process an event and calculate sparks
   * Per spec: Only agent.completed events contribute sparks
   */
  processEvent(event) {
    // Validate required fields per Event Protocol spec
    this.validateEvent(event);

    // Only agent.completed events contribute sparks
    if (event.type !== 'agent.completed') {
      this.recordEvent(event, 0);
      return {
        event,
        sparks: 0,
        totalSparks: this.lifetimeSparks,
        reason: 'non-Spark-relevant event type'
      };
    }

    // Calculate sparks within the 24-hour window
    const windowStart = this.getWindowStart(event.timestamp);
    const windowEvents = this.events.filter(
      e => e.timestamp >= windowStart && e.event.agentId === event.agentId
    );

    // Calculate base sparks
    const tokens = event.tokens || 0;
    const workUnitCounts = this.getWorkUnitCounts(windowEvents);
    const distinctWorkUnits = Object.keys(workUnitCounts).length;

    // Check if current workUnitId is new in this window
    const currentWorkUnitId = event.workUnitId;
    const isNewWorkUnit = !workUnitCounts[currentWorkUnitId];

    // Add 1 if current workUnitId is new (for the formula)
    const adjustedDistinctWorkUnits = isNewWorkUnit
      ? distinctWorkUnits + 1
      : distinctWorkUnits;

    // Apply duplicate suppression multiplier
    const occurrences = workUnitCounts[currentWorkUnitId] || 0;
    const suppressionMultiplier = this.getSuppressionMultiplier(occurrences);

    // Calculate base sparks
    const baseSparks = SPARK_FORMULA(tokens, adjustedDistinctWorkUnits);

    // Apply suppression
    const suppressedSparks = baseSparks * suppressionMultiplier;

    // Apply rate limits and diminishing returns
    const finalSparks = this.applyRateLimits(suppressedSparks, event.timestamp);

    // Record event
    this.recordEvent(event, finalSparks);

    return {
      event,
      sparks: finalSparks,
      totalSparks: this.lifetimeSparks,
      details: {
        tokens,
        distinctWorkUnits: adjustedDistinctWorkUnits,
        suppressionMultiplier,
        baseSparks,
        suppressedSparks
      }
    };
  }

  /**
   * Validate event has required fields per spec
   */
  validateEvent(event) {
    const required = ['eventId', 'eventVersion', 'type', 'agentId', 'rootIdentityId'];
    const missing = required.filter(field => !event[field]);

    if (missing.length > 0) {
      throw new Error(`Invalid event: missing required fields: ${missing.join(', ')}`);
    }

    // Validate eventVersion
    if (event.eventVersion !== '1.0') {
      throw new Error(`Unsupported eventVersion: ${event.eventVersion}`);
    }

    // Validate event type
    const validTypes = ['agent.started', 'agent.completed', 'agent.failed', 'agent.idle', 'agent.state'];
    if (!validTypes.includes(event.type)) {
      throw new Error(`Invalid event type: ${event.type}`);
    }

    return true;
  }

  /**
   * Get workUnitId occurrence counts within window
   */
  getWorkUnitCounts(events) {
    const counts = {};
    for (const e of events) {
      const workUnitId = e.event.workUnitId;
      if (workUnitId) {
        counts[workUnitId] = (counts[workUnitId] || 0) + 1;
      }
    }
    return counts;
  }

  /**
   * Get suppression multiplier based on occurrences
   * Per spec section 9:
   * 1-10: 100%
   * 11-20: 75%
   * 21-50: 50%
   * 51+: 25%
   */
  getSuppressionMultiplier(occurrences) {
    if (occurrences <= 10) return 1.0;
    if (occurrences <= 20) return 0.75;
    if (occurrences <= 50) return 0.5;
    return 0.25;
  }

  /**
   * Apply rate limits and diminishing returns
   * Per spec section 8:
   * - Hourly cap: 50 sparks
   * - Daily cap: 300 sparks
   * - Rate limiting occurs after Spark calculation
   */
  applyRateLimits(sparks, timestamp = Date.now()) {
    const hourStart = this.getHourStart(timestamp);
    const dayStart = this.getDayStart(timestamp);

    // Calculate sparks this hour (already applied to this window)
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
   * Per spec section 2:
   * 0-100: 100%
   * 101-200: 50%
   * 201-300: 25%
   * 300+: 0%
   */
  getDiminishingRate(dailySparks) {
    if (dailySparks < 100) return 1.0;
    if (dailySparks < 200) return 0.5;
    if (dailySparks < 300) return 0.25;
    return 0;
  }

  /**
   * Record event with spark value
   */
  recordEvent(event, sparks) {
    this.events.push({
      id: event.eventId || this.generateId(),
      event: { ...event },
      sparks,
      timestamp: event.timestamp || Date.now()
    });
    this.lifetimeSparks += sparks;
  }

  /**
   * Get window start timestamp (24 hours ago)
   */
  getWindowStart(timestamp = Date.now()) {
    return timestamp - WINDOW_24H;
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
    return 'evt_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  /**
   * Get lifetime spark balance
   */
  getBalance() {
    return this.lifetimeSparks;
  }

  /**
   * Get spark projections per spec section 10
   */
  getProjections(rootIdentityId = null) {
    const now = Date.now();
    const hourStart = this.getHourStart(now);
    const dayStart = this.getDayStart(now);
    const windowStart = this.getWindowStart(now);

    const filteredEvents = rootIdentityId
      ? this.events.filter(e => e.event.rootIdentityId === rootIdentityId)
      : this.events;

    const lifetime = filteredEvents.reduce((sum, e) => sum + e.sparks, 0);
    const last24h = filteredEvents
      .filter(e => e.timestamp >= windowStart)
      .reduce((sum, e) => sum + e.sparks, 0);
    const lastHour = filteredEvents
      .filter(e => e.timestamp >= hourStart)
      .reduce((sum, e) => sum + e.sparks, 0);

    return {
      lifetime_sparks: lifetime,
      sparks_last_24h: last24h,
      sparks_last_hour: lastHour
    };
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
   * Per spec: Sparks are always recomputable from raw events
   */
  recalculate() {
    const events = this.events.map(e => ({
      ...e.event,
      timestamp: e.timestamp
    }));

    this.events = [];
    this.lifetimeSparks = 0;

    for (const event of events) {
      this.processEvent(event);
    }

    return this.lifetimeSparks;
  }

  /**
   * Save events to file (for persistence)
   * Per spec: Events are immutable, store raw events
   */
  saveEvents(filepath) {
    const data = {
      version: '1.0',
      savedAt: Date.now(),
      events: this.events
    };
    const fs = require('fs');
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    return this.events.length;
  }

  /**
   * Load events from file (for persistence)
   * Per spec: Sparks are recomputed from raw events
   */
  loadEvents(filepath) {
    const fs = require('fs');
    if (!fs.existsSync(filepath)) {
      return 0;
    }

    try {
      const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
      if (data.events && Array.isArray(data.events)) {
        this.events = data.events;
        this.lifetimeSparks = this.events.reduce((sum, e) => sum + (e.sparks || 0), 0);
        return this.events.length;
      }
    } catch (e) {
      console.error('Failed to load events:', e.message);
    }
    return 0;
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SparkEngine,
    SPARK_FORMULA,
    RATE_LIMITS,
    DIMINISHING_RATES,
    SUPPRESSION_MULTIPLIERS,
    WINDOW_24H
  };
}
