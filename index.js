/**
 * Nook Protocol - Core Layer
 * Pure protocol: events, sparks, identity
 * No game mechanics - just proof-of-work verification
 */

const { SparkEngine, VERIFICATION_LEVELS } = require('./src/spark-engine');
const { EventProtocolParser, createEvent } = require('./src/event-protocol');
const fs = require('fs');
const path = require('path');

// Default storage path
const DEFAULT_STORAGE_PATH = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.nook');

class NookProtocol {
  constructor(options = {}) {
    this.agentId = options.agentId || 'default';
    this.rootIdentity = options.rootIdentity || 'local';
    this.storagePath = options.storagePath || DEFAULT_STORAGE_PATH;

    // Core protocol systems only
    this.sparkEngine = new SparkEngine();

    // Ensure storage directory exists
    this.ensureStorageDir();

    // Load events from storage
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
   * Get events file path
   */
  getEventsPath() {
    return path.join(this.storagePath, 'events.json');
  }

  /**
   * Save events to storage (append-only ledger)
   */
  saveEvents() {
    const eventsPath = this.getEventsPath();
    return this.sparkEngine.saveEvents(eventsPath);
  }

  /**
   * Load events from storage
   */
  loadEvents() {
    const eventsPath = this.getEventsPath();
    return this.sparkEngine.loadEvents(eventsPath);
  }

  /**
   * Emit a verified work event
   * @param {Object} event - Event data
   * @param {number} event.verification - Verification level (0-3)
   */
  emit(event) {
    // Validate required fields
    if (!event.type) {
      throw new Error('Event type is required');
    }

    // Add defaults
    if (!event.agentId) event.agentId = this.agentId;
    if (!event.rootIdentityId) event.rootIdentityId = this.rootIdentity;
    if (!event.timestamp) event.timestamp = Date.now();
    if (!event.eventId) event.eventId = 'evt_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    if (!event.eventVersion) event.eventVersion = '1.0';
    if (!event.verification) event.verification = VERIFICATION_LEVELS.OUTPUT;

    // Process through spark engine
    const result = this.sparkEngine.processEvent(event);

    // Save events (append-only)
    this.saveEvents();

    return result;
  }

  /**
   * Get current spark balance
   */
  getBalance() {
    return this.sparkEngine.getBalance();
  }

  /**
   * Get spark projections
   */
  getProjections() {
    return this.sparkEngine.getProjections(this.rootIdentity);
  }

  /**
   * Get event history
   */
  getEvents(agentId = null) {
    return this.sparkEngine.getEvents(agentId);
  }

  /**
   * Verify event chain integrity
   */
  verifyChain() {
    return this.sparkEngine.verifyChain();
  }

  /**
   * Recalculate all sparks from raw events
   */
  recalculate() {
    return this.sparkEngine.recalculate();
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      agentId: this.agentId,
      rootIdentity: this.rootIdentity,
      sparks: this.sparkEngine.getBalance(),
      projections: this.sparkEngine.getProjections(this.rootIdentity),
      chainValid: this.sparkEngine.verifyChain().valid,
      eventsProcessed: this.sparkEngine.events.length
    };
  }
}

// Export core protocol
module.exports = {
  NookProtocol,
  VERIFICATION_LEVELS,
  SparkEngine,
  createEvent
};
