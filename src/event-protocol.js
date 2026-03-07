/**
 * Nook Event Protocol Parser v1.0
 * Parses and validates events according to Spark Complete Protocol Spec V1.txt
 */

const CANONICAL_EVENT_TYPES = [
  'agent.started',
  'agent.completed',
  'agent.failed',
  'agent.idle',
  'agent.state'
];

const VALID_STATES = [
  'working',
  'idle',
  'sleeping',
  'queued',
  'success',
  'failure',
  'offline'
];

const VALID_SOURCES = [
  'openclaw',
  'crewai',
  'autogen',
  'local-runtime',
  'custom'
];

const REQUIRED_ENVELOPE_FIELDS = [
  'eventId',
  'eventVersion',
  'type',
  'timestamp',
  'agentId',
  'rootIdentityId',
  'source'
];

class EventProtocolParser {
  constructor(options = {}) {
    this.options = options;
    this.seenEventIds = new Set(); // For idempotency
    this.allowDuplicates = options.allowDuplicates || false;
  }

  /**
   * Parse and validate an event
   * Returns normalized event or throws error
   */
  parse(event) {
    // Check for required fields
    this.validateRequiredFields(event);

    // Check eventVersion
    this.validateEventVersion(event.eventVersion);

    // Validate event type
    this.validateEventType(event.type);

    // Check idempotency
    if (!this.allowDuplicates) {
      this.checkIdempotency(event.eventId);
    }

    // Validate type-specific fields
    this.validateTypeSpecificFields(event);

    // Normalize and return
    return this.normalize(event);
  }

  /**
   * Validate required envelope fields
   */
  validateRequiredFields(event) {
    const missing = REQUIRED_ENVELOPE_FIELDS.filter(field => {
      return event[field] === undefined || event[field] === null || event[field] === '';
    });

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    return true;
  }

  /**
   * Validate eventVersion
   */
  validateEventVersion(version) {
    if (version !== '1.0') {
      throw new Error(`Unsupported eventVersion: ${version}. Expected: 1.0`);
    }
    return true;
  }

  /**
   * Validate event type is canonical
   */
  validateEventType(type) {
    if (!CANONICAL_EVENT_TYPES.includes(type)) {
      throw new Error(`Invalid event type: ${type}. Valid types: ${CANONICAL_EVENT_TYPES.join(', ')}`);
    }
    return true;
  }

  /**
   * Validate type-specific fields
   */
  validateTypeSpecificFields(event) {
    // agent.state requires a state field
    if (event.type === 'agent.state') {
      if (!event.state) {
        throw new Error('agent.state event requires "state" field');
      }
      if (!VALID_STATES.includes(event.state)) {
        throw new Error(`Invalid state: ${event.state}. Valid states: ${VALID_STATES.join(', ')}`);
      }
    }

    // tokens should be a number if provided
    if (event.tokens !== undefined && typeof event.tokens !== 'number') {
      throw new Error(`tokens must be a number, got: ${typeof event.tokens}`);
    }

    // timestamp should be a number
    if (typeof event.timestamp !== 'number') {
      throw new Error(`timestamp must be a number, got: ${typeof event.timestamp}`);
    }

    return true;
  }

  /**
   * Check for duplicate events (idempotency)
   */
  checkIdempotency(eventId) {
    if (this.seenEventIds.has(eventId)) {
      throw new Error(`Duplicate eventId: ${eventId}. Events must be idempotent.`);
    }
    return true;
  }

  /**
   * Mark eventId as seen
   */
  markSeen(eventId) {
    this.seenEventIds.add(eventId);
  }

  /**
   * Normalize event to standard format
   */
  normalize(event) {
    return {
      eventId: event.eventId,
      eventVersion: event.eventVersion,
      type: event.type,
      timestamp: event.timestamp,
      agentId: event.agentId,
      rootIdentityId: event.rootIdentityId,
      source: event.source,
      workUnitId: event.workUnitId || null,
      sessionId: event.sessionId || null,
      parentAgentId: event.parentAgentId || null,
      tokens: event.tokens || null,
      model: event.model || null,
      provider: event.provider || null,
      metadata: event.metadata || null,
      state: event.state || null,
      // Add parsed timestamp info
      _parsed: {
        timestamp: Date.now()
      }
    };
  }

  /**
   * Validate source (warn if not standard)
   */
  validateSource(source) {
    if (!VALID_SOURCES.includes(source)) {
      console.warn(`Warning: Non-standard source: ${source}`);
    }
    return true;
  }

  /**
   * Get event type classification for Spark Engine
   * Per spec: Only agent.completed is Spark-relevant
   */
  getSparkRelevance(eventType) {
    return {
      isSparkRelevant: eventType === 'agent.completed',
      sparkContribution: eventType === 'agent.completed' ? 'eligible' : 0,
      reason: eventType === 'agent.completed'
        ? 'agent.completed is Spark-relevant in v1.0'
        : `${eventType} contributes 0 sparks in v1.0`
    };
  }

  /**
   * Reset idempotency tracking
   */
  reset() {
    this.seenEventIds.clear();
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      eventsProcessed: this.seenEventIds.size,
      allowDuplicates: this.allowDuplicates
    };
  }
}

/**
 * Create a NookEvent from raw input
 */
function createEvent(options) {
  const required = {
    eventId: options.eventId || 'evt_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    eventVersion: options.eventVersion || '1.0',
    type: options.type,
    timestamp: options.timestamp || Math.floor(Date.now() / 1000),
    agentId: options.agentId,
    rootIdentityId: options.rootIdentityId,
    source: options.source || 'custom'
  };

  const optional = {};
  if (options.workUnitId) optional.workUnitId = options.workUnitId;
  if (options.sessionId) optional.sessionId = options.sessionId;
  if (options.parentAgentId) optional.parentAgentId = options.parentAgentId;
  if (options.tokens !== undefined) optional.tokens = options.tokens;
  if (options.model) optional.model = options.model;
  if (options.provider) optional.provider = options.provider;
  if (options.metadata) optional.metadata = options.metadata;
  if (options.state) optional.state = options.state;

  return { ...required, ...optional };
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    EventProtocolParser,
    createEvent,
    CANONICAL_EVENT_TYPES,
    VALID_STATES,
    VALID_SOURCES,
    REQUIRED_ENVELOPE_FIELDS
  };
}
