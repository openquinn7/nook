/**
 * Generic Agent Adapter
 * Wrapper to integrate Nook with any agent framework
 */

const { NookProtocol } = require('../index.js');

class AgentAdapter {
  /**
   * Create an adapter for an agent framework
   * @param {Object} options - NookProtocol options + adapter options
   */
  constructor(options = {}) {
    this.nook = new NookProtocol({
      agentId: options.agentId || 'agent',
      rootIdentity: options.rootIdentity || 'local',
      storagePath: options.storagePath
    });

    this.options = {
      autoInit: options.autoInit ?? true,
      defaultVariant: options.defaultVariant || 'worker',
      ...options
    };

    // Auto-initialize if no profile exists
    if (this.options.autoInit && !this.nook.getStatus().initialized) {
      this.nook.init(this.options.defaultVariant);
    }

    // Track active task
    this.activeTask = null;
    this.taskStartTime = null;
  }

  /**
   * Wrap an async function to track it as a task
   * @param {Function} fn - The function to wrap
   * @param {Object} options - Task options
   */
  wrapTask(fn, options = {}) {
    const workUnitId = options.workUnitId || `task-${Date.now()}`;
    const taskName = options.name || workUnitId;

    return async (...args) => {
      try {
        // Emit started event
        this.nook.emit(this._createEvent('agent.started', {
          workUnitId,
          metadata: { taskName, ...options.metadata }
        }));

        this.activeTask = workUnitId;
        this.taskStartTime = Date.now();

        // Execute the function
        const result = await fn(...args);

        // Estimate tokens (you can override this with actual token counting)
        const tokens = options.tokens || this._estimateTokens(result);

        // Emit completed event
        this.nook.emit(this._createEvent('agent.completed', {
          workUnitId,
          tokens,
          success: true,
          metadata: { taskName, result, ...options.metadata }
        }));

        this.activeTask = null;
        this.taskStartTime = null;

        return result;

      } catch (error) {
        // Emit failed event
        this.nook.emit(this._createEvent('agent.failed', {
          workUnitId,
          error: error.message,
          metadata: { taskName, ...options.metadata }
        }));

        this.activeTask = null;
        this.taskStartTime = null;

        throw error;
      }
    };
  }

  /**
   * Emit a custom event
   */
  emit(type, data = {}) {
    return this.nook.emit(this._createEvent(type, data));
  }

  /**
   * Get current status
   */
  getStatus() {
    return this.nook.getStatus();
  }

  /**
   * Create a properly formatted event
   * @param {string} type - Event type
   * @param {Object} data - Event data
   */
  _createEvent(type, data = {}) {
    return {
      eventId: data.eventId || `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      eventVersion: '1.0',
      type,
      agentId: this.nook.agentId,
      rootIdentityId: this.nook.rootIdentity,
      ...data
    };
  }

  /**
   * Simple token estimation (override with actual token counting)
   */
  _estimateTokens(result) {
    // Rough estimation: ~4 chars per token
    if (typeof result === 'string') {
      return Math.ceil(result.length / 4);
    }
    if (typeof result === 'object') {
      return Math.ceil(JSON.stringify(result).length / 4);
    }
    return 1000; // Default estimate
  }

  /**
   * Create hooks for common agent patterns
   */
  createHooks(hooks = {}) {
    // Task lifecycle hooks
    if (hooks.onTaskStart) {
      this.nook.on('agent.started', (event, result) => {
        hooks.onTaskStart(event, result);
      });
    }

    if (hooks.onTaskComplete) {
      this.nook.on('agent.completed', (event, result) => {
        hooks.onTaskComplete(event, result);
      });
    }

    if (hooks.onTaskFail) {
      this.nook.on('agent.failed', (event, result) => {
        hooks.onTaskFail(event, result);
      });
    }

    // Return unsubscribe function
    return () => {
      // Clean up hooks
    };
  }

  /**
   * Get the underlying NookProtocol instance
   */
  getNook() {
    return this.nook;
  }
}

// Export
module.exports = { AgentAdapter };
