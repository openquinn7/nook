/**
 * Claude Code Adapter
 * Integration wrapper for Claude Code agents
 *
 * Usage:
 *   const { ClaudeCodeAdapter } = require('./adapters/claude-code');
 *
 *   const adapter = new ClaudeCodeAdapter({
 *     agentId: 'claude-code',
 *     rootIdentity: process.env.USER
 *   });
 *
 *   // Wrap your agent's task function
 *   const wrappedTask = adapter.wrapTask(async (task) => {
 *     // Do work...
 *     return result;
 *   });
 *
 *   // Or use hooks
 *   adapter.onComplete((event, result) => {
 *     console.log('Task completed, earned sparks:', result.sparks);
 *   });
 */

const { NookProtocol } = require('../index.js');

class ClaudeCodeAdapter {
  constructor(options = {}) {
    this.nook = new NookProtocol({
      agentId: options.agentId || 'claude-code',
      rootIdentity: options.rootIdentity || process.env.USER || 'local',
      storagePath: options.storagePath
    });

    this.options = {
      autoInit: options.autoInit ?? true,
      defaultVariant: options.defaultVariant || 'worker',
      trackTokens: options.trackTokens ?? true,
      ...options
    };

    // Auto-initialize if no profile exists
    if (this.options.autoInit && !this.nook.getStatus().initialized) {
      this.nook.init(this.options.defaultVariant);
    }

    // Token tracking state
    this.totalTokens = 0;
    this.currentWorkUnit = null;
  }

  /**
   * Create a task wrapper that automatically tracks Claude Code tasks
   * @param {Function} taskFn - The Claude Code task function to wrap
   * @param {Object} options - Task options
   */
  wrapTask(taskFn, options = {}) {
    const workUnitId = options.workUnitId || `claude-${Date.now()}`;

    return async (task, context) => {
      try {
        // Emit started
        this.nook.emit(this._createEvent('agent.started', {
          workUnitId,
          metadata: {
            taskId: task?.id,
            taskDescription: task?.description,
            model: context?.model,
            provider: context?.provider
          }
        }));

        this.currentWorkUnit = workUnitId;

        // Execute the actual task
        const result = await taskFn(task, context);

        // Calculate tokens from result if available
        const tokens = this._extractTokens(result) || options.tokens || this.totalTokens;

        // Emit completed
        this.nook.emit(this._createEvent('agent.completed', {
          workUnitId,
          tokens,
          success: true,
          metadata: {
            taskId: task?.id,
            model: context?.model,
            provider: context?.provider
          }
        });

        this.currentWorkUnit = null;

        return result;

      } catch (error) {
        // Emit failed
        this.nook.emit(this._createEvent('agent.failed', {
          workUnitId,
          error: error.message,
          metadata: {
            taskId: task?.id,
            taskDescription: task?.description
          }
        }));

        this.currentWorkUnit = null;
        throw error;
      }
    };
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
   * Extract tokens from Claude Code result
   */
  _extractTokens(result) {
    // Claude Code returns results with token usage info
    if (result?.usage?.total_tokens) {
      return result.usage.total_tokens;
    }
    if (result?.tokens) {
      return result.tokens;
    }
    return null;
  }

  /**
   * Add token count to current task
   */
  addTokens(count) {
    this.totalTokens += count;
    if (this.currentWorkUnit) {
      // Emit update with accumulated tokens
      this.nook.emit(this._createEvent('agent.completed', {
        workUnitId: this.currentWorkUnit,
        tokens: count,
        success: true
      }));
    }
  }

  /**
   * Register callback for task completion
   */
  onComplete(callback) {
    return this.nook.on('agent.completed', callback);
  }

  /**
   * Register callback for task start
   */
  onStart(callback) {
    return this.nook.on('agent.started', callback);
  }

  /**
   * Register callback for task failure
   */
  onFail(callback) {
    return this.nook.on('agent.failed', callback);
  }

  /**
   * Get current spark balance
   */
  getBalance() {
    return this.nook.getSparkEngine().getBalance();
  }

  /**
   * Get full status
   */
  getStatus() {
    return this.nook.getStatus();
  }

  /**
   * Get the NookProtocol instance for direct access
   */
  getNook() {
    return this.nook;
  }

  /**
   * Emit idle event (when agent is waiting)
   */
  setIdle(reason = 'waiting') {
    this.nook.emit(this._createEvent('agent.idle', {
      workUnitId: this.currentWorkUnit,
      metadata: { reason }
    }));
  }

  /**
   * Emit working event (when agent is active)
   */
  setWorking(taskDescription = 'working') {
    this.nook.emit(this._createEvent('agent.state', {
      state: 'working',
      workUnitId: this.currentWorkUnit,
      metadata: { description: taskDescription }
    }));
  }
}

// Export
module.exports = { ClaudeCodeAdapter };
