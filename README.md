# Nook - AI Agent Economy Protocol

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-green" alt="Node">
  <img src="https://img.shields.io/badge/license-MIT-yellow" alt="License">
</p>

Nook is an AI agent economy protocol where sprites earn sparks through verifiable work. It's a gamification layer for AI agents that tracks activity and rewards effort through an evolution system.

## Features

- **Sprite Evolution** - Your AI agent starts as a Seed and evolves through 4 stages: Seed → Sprout → Bloom → Apex
- **Spark Economy** - Earn sparks from verified agent activity (tokens processed)
- **Immutable Event Log** - All activity is logged and verifiable
- **Achievements** - Unlock achievements for milestones
- **Cosmetics** - Equip hats, outfits, accessories, and more
- **External Agent Support** - Integrate with Claude Code or any agent framework via adapters

## Installation

```bash
npm install @nook/protocol
```

## Quick Start

```bash
# Initialize your sprite
nook init

# Check status
nook status

# Verify event log integrity
nook verify
```

## Usage

### CLI

```bash
nook init              # Start your journey with a sprite
nook status            # Check spark balance and evolution status
nook verify            # Verify event log integrity
nook evolve            # Choose evolution path/branch/apex
nook achievements      # View unlocked achievements
nook history           # View event history
```

### Programmatic

```javascript
const { NookProtocol } = require('@nook/protocol');

const nook = new NookProtocol({
  agentId: 'my-agent',
  rootIdentity: 'user-123'
});

// Initialize sprite
nook.init('worker');

// Listen for events
nook.on('agent.completed', (event, result) => {
  console.log(`Earned ${result.sparks} sparks!`);
});
```

### Adapters

#### Generic Adapter (any agent framework)

```javascript
const { AgentAdapter } = require('@nook/protocol/adapters/generic');

const adapter = new AgentAdapter({
  agentId: 'my-agent',
  rootIdentity: 'user-123'
});

// Wrap any async function
const trackedTask = adapter.wrapTask(async () => {
  // Do work...
  return result;
}, { workUnitId: 'task-123' });

await trackedTask();
```

#### Claude Code Adapter

```javascript
const { ClaudeCodeAdapter } = require('@nook/protocol/adapters/claude-code');

const adapter = new ClaudeCodeAdapter({
  agentId: 'claude-code',
  rootIdentity: process.env.USER
});

// Wrap Claude Code task function
const wrappedTask = adapter.wrapTask(async (task, context) => {
  return result;
});

adapter.onComplete((event, result) => {
  console.log('Earned sparks:', result.sparks);
});
```

## How It Works

1. **Adapters** capture real agent events (task start, completion, failure)
2. **Events** are logged with token counts and source verification
3. **Sparks** are calculated from tokens with rate limiting and diminishing returns
4. **Evolution** unlocks at spark thresholds (500 → 2000 → 10000)
5. **Verification** ensures event log integrity anytime

## Spark Calculation

- Base rate: ~1 spark per 10,000 tokens
- Bonus for unique work units
- Rate limits: 50 sparks/hour, 300 sparks/day
- Diminishing returns after 100 sparks/day

See `SPEC.md` for full specification.

## Project Structure

```
nook/
├── index.js              # Main NookProtocol class
├── bin/nook.js           # CLI
├── src/
│   ├── spark-engine.js   # Spark calculations
│   ├── sprites.js        # Sprite definitions & evolution
│   ├── achievements.js   # Achievement system
│   ├── cosmetics.js      # Cosmetics system
│   └── ...
├── adapters/
│   ├── generic.js        # Generic agent adapter
│   └── claude-code.js    # Claude Code adapter
├── INTEGRATION.md        # Integration guide
└── SPEC.md               # Full specification
```

## Documentation

- [Integration Guide](INTEGRATION.md) - Full integration documentation
- [Specification](SPEC.md) - Technical specification

## License

MIT
