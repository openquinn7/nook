# Nook Integration Guide

This document explains how to integrate external agent frameworks with Nook.

---

## Quick Start

### 1. Install

```bash
npm install @nook/protocol
```

### 2. Initialize

```typescript
import { NookProtocol } from '@nook/protocol';

const nook = new NookProtocol({
  agentId: 'your-agent-id',
  rootIdentity: 'user-123'
});
```

### 3. Emit Events

```typescript
// When agent starts work
nook.emit({
  type: 'agent.started',
  agentId: 'agent-1',
  workUnitId: 'repo-issue-123'
});

// When agent completes work
nook.emit({
  type: 'agent.completed',
  agentId: 'agent-1',
  workUnitId: 'repo-issue-123',
  tokens: 5000,
  success: true
});
```

---

## Hook System

Subscribe to events using the `on()` method:

```typescript
// Subscribe to specific event
const unsubscribe = nook.on('agent.completed', (event, result) => {
  console.log('Task completed!', result.sparks, 'sparks earned');
});

// Subscribe to all events (wildcard)
nook.on('*', (event, result) => {
  console.log('Event:', event.type);
});

// Unsubscribe
unsubscribe();
```

---

## Event Types

| Event | When to Emit |
|-------|--------------|
| `agent.started` | Agent begins a new task |
| `agent.completed` | Agent finishes a task (include tokens) |
| `agent.failed` | Agent encounters an error |
| `agent.idle` | Agent is waiting / idle |
| `agent.state` | Agent state changes |

---

## Work Units

Work units identify distinct tasks. Use context-appropriate identifiers:

| Context | Work Unit ID Example |
|---------|---------------------|
| GitHub Issues | `repo:owner/repo#123` |
| Claude Code | `session-uuid` |
| Research | `topic-slug` |
| Automation | `workflow-name` |
| Chat | `conversation-id` |

---

## Framework Examples

### Claude Code

```typescript
// In your Claude Code agent
import { NookProtocol } from '@nook/protocol';

const nook = new NookProtocol({
  agentId: 'claude-code',
  rootIdentity: process.env.USER
});

// Emit events based on agent lifecycle
hooks.on('taskStart', (task) => {
  nook.emit({
    type: 'agent.started',
    workUnitId: `task-${task.id}`
  });
});

hooks.on('taskComplete', (task, tokens) => {
  nook.emit({
    type: 'agent.completed',
    workUnitId: `task-${task.id}`,
    tokens: tokens
  });
});
```

### GitHub Actions

```yaml
# .github/workflows/nook.yml
name: Nook Integration

on:
  workflow_run:
    workflows: ["Build"]
    types: [completed]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Emit completion event
        run: |
          curl -X POST ${{ secrets.NOOK_WEBHOOK }} \
            -H "Content-Type: application/json" \
            -d '{
              "type": "agent.completed",
              "agentId": "${{ github.actor }}",
              "workUnitId": "workflow-${{ github.run_id }}",
              "tokens": 10000
            }'
```

### Custom Agent

```typescript
class MyAgent {
  constructor(agentId, rootIdentity) {
    this.nook = new NookProtocol({ agentId, rootIdentity });
  }

  async doTask(task) {
    this.nook.emit({
      type: 'agent.started',
      workUnitId: task.id
    });

    try {
      const result = await this.execute(task);
      this.nook.emit({
        type: 'agent.completed',
        workUnitId: task.id,
        tokens: result.tokens,
        success: true
      });
      return result;
    } catch (error) {
      this.nook.emit({
        type: 'agent.failed',
        workUnitId: task.id,
        error: error.message
      });
      throw error;
    }
  }
}
```

---

## Agent Adapters

Pre-built wrappers for common agent frameworks that automatically track tasks and emit events.

### Generic Adapter

```typescript
const { AgentAdapter } = require('@nook/protocol/adapters/generic');

const adapter = new AgentAdapter({
  agentId: 'my-agent',
  rootIdentity: 'user-123'
});

// Wrap any async function to track it as a task
const trackedTask = adapter.wrapTask(async () => {
  // Do work...
  return result;
}, { workUnitId: 'task-123' });

// Execute the tracked task
const result = await trackedTask();

// Use hooks for callbacks
adapter.createHooks({
  onTaskStart: (event) => console.log('Started:', event.workUnitId),
  onTaskComplete: (event, result) => console.log('Earned:', result.sparks),
  onTaskFail: (event) => console.log('Failed:', event.error)
});
```

### Claude Code Adapter

```typescript
const { ClaudeCodeAdapter } = require('@nook/protocol/adapters/claude-code');

const adapter = new ClaudeCodeAdapter({
  agentId: 'claude-code',
  rootIdentity: process.env.USER
});

// Wrap Claude Code task function
const wrappedTask = adapter.wrapTask(async (task, context) => {
  // Execute the task
  return result;
});

// Register callbacks
adapter.onComplete((event, result) => {
  console.log('Earned sparks:', result.sparks);
});

adapter.onStart((event) => {
  console.log('Started:', event.workUnitId);
});

adapter.onFail((event) => {
  console.log('Failed:', event.error);
});

// Get current status
const status = adapter.getStatus();
const balance = adapter.getBalance();
```

---

## Configuration

### Options

```typescript
const nook = new NookProtocol({
  agentId: 'required - unique agent identifier',
  rootIdentity: 'required - user/owner identifier',
  storagePath: 'optional - default ~/.nook',
  debug: false
});
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NOOK_AGENT_ID` | Default agent ID |
| `NOOK_ROOT_IDENTITY` | Default root identity |
| `NOOK_STORAGE_PATH` | Custom storage path |

---

## Data Storage

Nook stores data locally in:

```
~/.nook/
├── events.json     # Event log (append-only)
├── sparks.json    # Spark calculations
└── profile.json   # Agent profile
```

---

## Troubleshooting

### Events not registering

- Check that `agentId` and `rootIdentity` are provided
- Verify network connectivity (if using remote storage)

### Sparks not calculating

- Ensure `tokens` is included in `agent.completed` events
- Check rate limits: max 50/hour, 300/day

### Profile not updating

- Run `nook.recalculate()` to recompute all sparks

---

## Support

- GitHub: github.com/openquinn/nook
- Discord: #nook-support
