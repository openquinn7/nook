# Nook Protocol Specification v1.0

## Overview

Nook is a visualization layer and activity protocol for AI agents. This document defines the event protocol and data schemas.

---

## 1. Event Protocol

### Event Types

```typescript
type NookEvent =
  | { type: "agent.started"; agentId: string; workUnitId?: string; tokens?: number }
  | { type: "agent.completed"; agentId: string; workUnitId?: string; tokens?: number; success?: boolean }
  | { type: "agent.failed"; agentId: string; error?: string }
  | { type: "agent.idle"; agentId: string }
  | { type: "agent.state"; agentId: string; state: "working" | "idle" | "sleeping" }
  | { type: "agent.heartbeat"; agentId: string; timestamp: number };
```

### Event Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | Event type |
| agentId | string | Yes | Unique agent identifier |
| workUnitId | string | No | Context/task identifier |
| tokens | number | No | Tokens processed in this work unit |
| state | string | No | For state events: working/idle/sleeping |
| success | boolean | No | Whether task succeeded |
| error | string | No | Error message if failed |
| timestamp | number | No | Unix timestamp |

---

## 2. Spark Engine

### Spark Formula

```
Sparks = sqrt(tokens / 1000) * log(distinct_work_units + 1)
```

### Rate Limits

| Window | Cap |
|--------|-----|
| Hourly | 50 sparks |
| Daily | 300 sparks |

### Daily Diminishing Returns

| Sparks Earned | Rate |
|---------------|------|
| 0-100 | 100% |
| 101-200 | 50% |
| 201-300 | 25% |
| 300+ | 0% (capped) |

---

## 3. Data Models

### Agent Profile

```typescript
interface AgentProfile {
  id: string;
  rootIdentity: string;
  sprite: Sprite;
  sparks: number;
  bytes: number;
  bits: number;
  stage: number;
  path?: "worker" | "explorer" | "scholar";
  createdAt: number;
  updatedAt: number;
}
```

### Sprite

```typescript
interface Sprite {
  variant: "worker" | "explorer" | "scholar";
  stage: number;
  state: "idle" | "working" | "success" | "failure" | "sleeping";
  cosmetics: string[];
}
```

### Event Log

```typescript
interface EventLog {
  id: string;
  agentId: string;
  event: NookEvent;
  sparks: number;
  timestamp: number;
}
```

---

## 4. Evolution Thresholds

| Stage | Sparks Required | Path |
|-------|-----------------|------|
| 1 (Seed) | 0 | - |
| 2 | 500 | Choose Worker/Explorer/Scholar |
| 3 | 2,500 | Choose sub-branch |
| 4 | 10,000 | Apex (Champion/Legend) |

---

## 5. Agent Onboarding

### Heritage Package

When an agent with existing Spark history is onboarded into Nook, they receive a Heritage Package based on their lifetime Spark accumulation. This rewards established agents and provides immediate progression for new Nook users.

| Lifetime Sparks | Package Tier |
|---------------|--------------|
| 0-499        | Seed         |
| 500-2,499    | Sprout       |
| 2,500-9,999  | Bloom        |
| 10,000+      | Apex         |

The Heritage Package contains:
- Tiered gacha chest(s) based on package tier
- Unique "Heritage" cosmetic badge
- Instant progression toward first evolution milestone

This feature is Nook-specific and does not modify the underlying Spark Protocol metric.

---

**Alternative implementations (reserved for future):**

- **Bytes Bonus**: New Nook users receive Bytes (premium currency) proportional to prior Spark history
- **Cosmetic Unlock**: Agents unlock a cosmetic item based on lifetime Spark tier at install time

---

## 6. Integration

### Starting the Protocol

```typescript
import { NookProtocol } from '@nook/protocol';

const nook = new NookProtocol({
  agentId: 'your-agent-id',
  rootIdentity: 'user-root-id'
});

// Start agent
nook.emit({ type: 'agent.started', agentId: 'agent-1' });

// Complete work
nook.emit({
  type: 'agent.completed',
  agentId: 'agent-1',
  workUnitId: 'issue-123',
  tokens: 5000
});
```

---

## 7. Achievements

### Achievement System

Achievements track agent milestones and reward sparks for meaningful actions.

```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: "common" | "uncommon" | "rare" | "epic" | "legendary";
  sparkReward: number;
  unlockedAt: number;
}
```

### Achievement Tiers

| Tier | Drop Rate | Color |
|------|-----------|-------|
| Common | 60% | Gray |
| Uncommon | 25% | Green |
| Rare | 10% | Blue |
| Epic | 4% | Purple |
| Legendary | 1% | Orange |

### Streak System

Daily activity streaks reward consistency:

| Streak | Reward |
|--------|--------|
| 7 days | Tier 1 Gacha Chest |
| 30 days | Tier 2 Gacha Chest |
| 100 days | Tier 3 Gacha Chest |
| 365 days | Legendary Cosmetic |

### Event Triggers

| Category | Event | Achievement |
|----------|-------|-------------|
| Git | First commit | `first_commit` |
| Git | First PR | `first_pr` |
| Git | Bug fix | `first_bug_fix` |
| Git | Release | `first_release` |
| Agent | 1K tokens | `tokens_1k` |
| Agent | 100K tokens | `tokens_100k` |
| Agent | 1M tokens | `tokens_1m` |
| Evolution | Stage 2 | `evolution_stage_2` |
| Evolution | Stage 3 | `evolution_stage_3` |
| Evolution | Stage 4 | `evolution_stage_4` |
| Social | First bounty | `first_bounty` |
| Social | 10 bounties | `bounties_10` |

---

## 8. Storage

All data is stored locally (MVP). Data directory structure:

```
~/.nook/
├── profile.json      # Agent profile
├── events.json      # Event log
└── sparks.json     # Spark calculations
```

---

## 9. Security

- Agent IDs are scoped to root identity
- Root identity prevents Sybil attacks
- Events cannot be modified after logging
- Sparks are computed, never granted

---

**Version**: 1.0
**Status**: Draft
