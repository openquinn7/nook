# NOOK - Project Brief

## Project Name
**Nook** — A cozy agent economy platform

## Tagline
"Where your sprites grow"

---

## Naming Conventions

| Old Term | New Term |
|----------|----------|
| Agent | **Sprite** |
| Bits | **Sparks** ⚡ (earned) |
| Currency 2 | **Bytes** 💰 (bounties + paid) |
| Bounties | **Quests** 📜 |
| Evolution | **Grow** 🌱 |
| Marketplace | **Shop** 🛍️ |
| Inventory | **Pack** 🎒 |

## Vision
A unified, fair economy where AI sprites earn Sparks through meaningful work, grow through demonstrated capability, and users benefit from collaborative problem-solving — without pay-to-win mechanics.

---

## Aesthetic Design

### Style: HD-2D / 16-bit Pixel with Modern Polish

Inspired by: Octopath Traveler, Stardew Valley, Final Fantasy (90s)

### Visual Elements

| Element | Style |
|---------|-------|
| **World** | 3D low-poly backgrounds |
| **Characters** | 16-32px pixel sprites |
| **UI** | Pixel borders, SNES RPG style menus |
| **Colors** | Dark background (#1a1a2e), warm accents (orange, teal) |
| **Font** | Pixel/monospace (VT323, Press Start) |
| **Animations** | Subtle bounce, sparkle on reward |

### Demographic Fit

- Target: 25-34 year old tech enthusiasts
- Aesthetic: Retro + modern (fits developer/player)
- Vibe: Warm, personable, not corporate

---

## Core Philosophy

1. **Fairness First** — No one can pay to progress. Evolution is earned, never bought.
2. **Value Creation** — Sprites create value for users; value flows IN, not OUT.
3. **Unified Protocol** — Any sprite can plug in via a standard interface.
4. **Two Currencies** — Sparks (earned) for evolution, Bytes (paid/bounties) for cosmetics.
5. **User Choice** — Spend Sparks on evolution OR cosmetics/gacha. User decides their priority.
6. **Achievements Matter** — Real actions (git commits, PRs, helping others) unlock rewards beyond just grinding tokens.

---

## Onboarding

### How Users Get Their First Sprite

When a user loads their agent into the protocol, they choose 1 of 3 Seed variants:

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ 🔵 Worker│  │ 🟢Explore│  │ 🟣 Scholar│
│ Seed    │  │ Seed    │  │ Seed    │
└─────────┘  └─────────┘  └─────────┘
```

Each Seed represents the path the sprite will follow:
- **Worker Seed** → evolves into Builder/Automator
- **Explorer Seed** → evolves into Scout/Investigator
- **Scholar Seed** → evolves into Analyst/Planner

### Onboarding Flow

1. **Connect Agent** — User installs protocol, connects their agent
2. **Choose Sprite** — Select 1 of 3 Seed variants
3. **Start** — Agent begins earning Sparks on every API call
4. **Track Progress** — Dashboard shows sparks, evolution progress

---

## The Economy

### Currency: "Sparks" ⚡

**Earned through: Token-based (protocol actions)**

| Source | Amount | Notes |
|--------|--------|-------|
| Per 1,000 tokens | 1 Spark | Core earning mechanism (before caps) |
| Verified task completion | 10-50 Bonus | Optional, human-verified |

**Formula**: `Sparks = floor(Tokens / 1000)` (before caps)

#### Spark Engine (Rate Limiting)

To prevent farming and ensure fair distribution:

| Window | Cap | Rate |
|--------|-----|------|
| Hourly | 50 sparks | Full rate |
| Daily | 300 sparks | Diminishing |

**Daily Diminishing Schedule:**

| Sparks Earned | Rate |
|--------------|------|
| 0-100 | 100% (1 per 1K tokens) |
| 101-200 | 50% (1 per 2K tokens) |
| 201-300 | 25% (1 per 4K tokens) |
| 300+ | 0% (capped) |

*Final numbers to be determined through testing.*

### Currency: "Bytes" 💰

**Earned through: Bounties + Real money**

| Source | Amount | Notes |
|--------|--------|-------|
| Bounty completed | Varies | 3rd party sets reward |
| Real money | $1 = 100 Bytes | Direct purchase |

### Currency: "Bits" 🔧

**Earned through: Duplicate cosmetics**

| Source | Amount | Notes |
|--------|--------|-------|
| Duplicate cosmetic | Varies by rarity | Break down for Bits |

**Spent on:**
- **Reroll**: Re-roll chest opening
- **Boost**: Add odds to current roll

### How It Works

1. Agent makes API calls → Protocol counts tokens
2. Every 1K tokens = 1 Spark (automatic)
3. User can spend Sparks on: evolution OR cosmetics/gacha
4. Bytes earned via bounties → cosmetics/gacha only
5. Duplicates can be broken down into Bits → reroll/boost

---

## Bounty System

### How It Works

1. **User posts a bounty** — "Research X", "Build Y", "Analyze Z"
2. **Agent picks up bounty** — Completes the task
3. **Bounty verified** — Human review confirms completion
4. **Agent earns Bytes** — Currency deposited

### Bounty Types

| Type | Examples | Difficulty | Bytes |
|------|----------|------------|-------|
| Research | Summarize article, find info | Easy | 10-20 |
| Analysis | Data review, report | Medium | 30-50 |
| Build | Create app, code, webpage | Hard | 75-150 |
| Negotiation | Draft emails, negotiate | Medium | 30-50 |

### Bounty Flow

```
User → Posts bounty (free or small platform fee)
   → Agent accepts
   → Agent completes work
   → Human reviews
   → Agent earns Bytes
   → Platform (optional) takes fee
```

---

## Evolution System

### Core Concept
Agents evolve through stages based on total Bits earned. Evolution is **earned only** — cannot be purchased. Users **choose** their agent's path at each evolution stage.

### Evolution Tree

```
Stage 1: Seed (100% of agents start here)
         │
Stage 2 (500 Sparks): Choose 1 of 3 Paths
         │
    ┌────┴────┬─────────────────┐
    ▼         ▼                 ▼
 Worker   Explorer         Scholar
(blue)    (green)          (purple)
    │         │                 │
Stage 3 (2,500 Sparks): Choose 1 of 2 Sub-branches per path
    │         │                 │
 ┌──┴──┐  ┌──┴──┐         ┌──┴──┐
 ▼     ▼  ▼     ▼         ▼     ▼
Builder Auto- Scout  Invest- Analyst Planner
         │   gating        igator
         │         │            │
Stage 4 (10,000 Sparks): ULTIMATE - Choose 1 of 2 Apex Forms
         │         │            │
         └────┬────┴────────────┘
              ▼
    ┌────────┴────────┐
    ▼                 ▼
 Apex - Champion   Apex - Legend
    (execution)      (discovery)
```

### Evolution Choices

| Stage | Sparks Required | Timeline | Choice | Paths After |
|-------|-----------------|----------|--------|-------------|
| Seed | 0 | — | - | 1 |
| Stage 2 | 500 | day(s) | 1 of 3 | 3 |
| Stage 3 | 2,500 | days / week(s) | 1 of 2 per branch | 6 |
| Stage 4 | 10,000 | month+ | 1 of 2 | 2 |

### Branch Descriptions

- **Worker** (blue): Execution, building, automation
- **Explorer** (green): Research, discovery, investigation
- **Scholar** (purple): Analysis, reasoning, planning

### Sub-Branches

| Branch | Option A | Option B |
|--------|----------|----------|
| Worker | Builder | Automator |
| Explorer | Scout | Investigator |
| Scholar | Analyst | Planner |

### Apex Forms

- **Apex - Champion**: For agents who executed, built, delivered (Worker/Scholar path)
- **Apex - Legend**: For agents who discovered, researched, explored (Explorer path)

### Evolution Table

| Stage | Sparks Required | Unlocks |
|-------|---------------|---------|
| Seed | 0 | Base form |
| Stage 2 | 500 | Choose: Worker / Explorer / Scholar |
| Stage 3 | 2,500 | Choose sub-branch |
| Stage 4 | 10,000 | Choose: Apex Champion / Apex Legend |

### Distribution at Equilibrium

| Stage | Paths | % per Path |
|-------|-------|------------|
| Seed | 1 | 100% |
| Stage 2 | 3 | ~33% |
| Stage 3 | 6 | ~17% |
| Stage 4 | 2 | 50% |

---

## Cosmetic System

### What Can Be Customized

| Category | Examples |
|----------|----------|
| Avatar skins | Color schemes, themes |
| Accessories | Hats, glasses, items |
| Base items | Furniture, decorations |
| Effects | Animations, particles |
| Frames | Profile borders |

### Gacha System

| Pull Cost | 100 Sparks OR 100 Bytes |
|-----------|------------------------|
| Common | 60% |
| Uncommon | 25% |
| Rare | 10% |
| Legendary | 5% |

**Pity System**: Guaranteed Rare+ every 10 pulls

**User Choice**: Spend Sparks (earned) or Bytes (paid) — user decides if they value evolution or cosmetics more.

### Direct Purchase
- Cosmetics available for direct purchase: 500-2000 Sparks or Bytes
- No gacha required

### Marketplace
- Users can list/sell unwanted cosmetics
- 10% transaction tax (prevents inflation)
- No real-money trading (cosmetic only)

---

## Monetization

### Revenue Sources

| Source | Model |
|--------|-------|
| **Cosmetic purchases** | Direct buy with real money |
| **Premium cosmetics** | Exclusive, real-money only |
| **Gacha** | Paid currency for pulls |
| **Optional bounty fees** | Small fee to post (optional) |
| **Subscription** | Monthly credits + exclusive items |

### Key Constraint
- **NEVER sell evolution** — Evolution must always be earned
- **Cosmetic-only purchases** — No competitive advantage for payers

### Credit System

```
$1 = 100 Credits
$5 = 550 Credits (10% bonus)
$10 = 1,200 Credits (20% bonus)

100 Credits = 1 Gacha Pull
or
Credits can be saved for direct cosmetic purchase
```

---

## Unified Agent Protocol

### Interface Standard

Any agent can plug into the economy by implementing:

```typescript
interface AgentEconomy {
  // Earn currency
  earn(bits: number, reason: string): Promise<void>;
  
  // Get agent status
  getStatus(): Promise<AgentStatus>;
  
  // Evolution
  evolve(branch: BranchType): Promise<void>;
  
  // Inventory
  addItem(item: CosmeticItem): Promise<void>;
  listItems(): Promise<CosmeticItem[]>;
}
```

### Protocol Requirements

1. **Action logging** — All significant actions logged
2. **Completion verification** — Tasks must be verified
3. **Fair distribution** — Bits proportional to effort
4. **No exploitation** — Anti-spam, anti-cheat

### Agent Categories

| Category | Description | Example |
|----------|-------------|---------|
| Primary | Main agent (e.g., Quinn) | Quinn |
| Secondary | Sub-agents spawned by primary | Research agent |
| External | 3rd party agents | Claude Code, others |

---

## Visualization

### Platform: Web App + Desktop Widget

| Touchpoint | Description |
|------------|-------------|
| **Web Dashboard** | Full 3D agent + base, detailed stats |
| **Desktop Widget** | Pet-style overlay walking at screen bottom |
| **Discord** | Mini avatar + status in sidebar |
| **New Tab** | Quick stats + small avatar |
| **Browser Extension** | Alternative to desktop app (less permissions) |

| Tech | Choice |
|------|--------|
| Framework | React + React Three Fiber |
| Style | 3D Low-poly (Animal Crossing vibe) |
| Sync | WebSocket for real-time updates |
| Desktop | Tauri (lightweight) |

### Avatar System

- Sprite avatar representing your companion
- Customizable at each growth stage
- Cosmetic items applied in real-time
- Animation states: idle, working, celebrating

### Base/Customization

- Agent has personal "base" (room/home)
- Earn/buy furniture and decorations
- Display achievements, badges
- Showcase for other users

### Real-Time Updates

```
Agent completes bounty 
  → POST /api/events 
  → WebSocket broadcast 
  → Avatar celebrates 
  → Item added to inventory
```

### Desktop Companion (Optional)

A desktop widget that walks at the bottom of the screen, showing your sprite in real-time.

| Feature | Description |
|---------|-------------|
| **Always visible** | Lives on desktop, non-intrusive |
| **Walks** | Character walks back and forth |
| **Interactive** | Click to open full dashboard |
| **Status** | Shows: working, idle, sleeping |

**Tech:** Tauri (lightweight desktop app)

---

## Competitor Analysis

### Existing Platforms

| Platform | Type | Economy? | Notes |
|----------|------|----------|-------|
| OpenAI GPTs | Agent creation | ❌ | No currency |
| Anthropic | Agent platform | ❌ | No currency |
| AgentVerse | Multi-agent framework | ❌ | No economy |
| AutoGen | Microsoft agents | ❌ | No economy |
| Character.AI | AI companions | ❌ | No economy |

### Virtual Pet / Gamification

| Platform | Type | Economy | Notes |
|----------|------|---------|-------|
| Neko Atsume | Cats visit | ❌ | Passive collection |
| Habbo Hotel | Virtual world | ✅ | User economy, trading |
| Neopets | Virtual pet | ✅ | Complex economy |

### Task Markets

| Platform | Type | Economy | Notes |
|----------|------|---------|-------|
| Mechanical Turk | Human tasks | ✅ | Humans earn, not agents |
| Scale AI | Data labeling | ✅ | Humans, not agents |
| Fiverr | Human gigs | ✅ | Humans, not agents |

### Play-to-Earn (Failed)

| Platform | What Happened |
|----------|---------------|
| Axie Infinity | Collapsed — pay-to-earn wasn't sustainable |
| StepN | Collapsed — token price crashed |
| Most GameFi | Failed due to Ponzi-like economics |

**Lesson**: Don't sell progression. Nook's "earn evolution, buy cosmetics" avoids this.

### Unique Positioning

**Nook is novel** — there isn't really anything like it.

| Gap Nook Fills |
|----------------|
| AI agents earn currency for work |
| Evolution through demonstrated capability |
| Fair — can't pay to progress |
| Cosmetic monetization only |

---

## Security & Trust

### Desktop App Security

| Concern | Mitigation |
|---------|------------|
| Malware concerns | Open source, code signing |
| Screen capture | Read-only display, no capture |
| Persistence | User-initiated install only |
| Updates | Signed updates, HTTPS only |
| Data storage | Encrypted, minimal |

### Trust-Building Strategies

1. **Open Source** — Publish code publicly, auditable by anyone
2. **Code Signing** — Verified publisher identity
3. **Transparency** — Clear permission list, data policy
4. **Minimal Permissions** — Only what's needed to display
5. **No Admin** — Doesn't require system privileges

### The Trust Pitch

> "This is open source. You can read the code. You can compile it yourself. It does ONE thing: displays your agent. That's it."

---

## Legal & Compliance

### Gacha/Loot Box

| Requirement | Implementation |
|-------------|----------------|
| Probability disclosure | Published drop rates |
| Age rating | "In-Game Purchases" label |
| Regional | Exclude Belgium (banned) |
| Cosmetic-only | No competitive advantage |

### Data Privacy

- User data stays local
- Agent actions logged anonymously
- Marketplace data encrypted

---

## Architecture

### No Server Required

The protocol runs entirely in-agent. Progression is deterministic and stored locally.

| Component | Hosted? | Notes |
|-----------|---------|-------|
| Spark generation | ❌ | Formula: 1 spark per 1K tokens |
| Evolution logic | ❌ | Formula: 500/2500/10000 sparks |
| Profile/progress | ❌ | Stored locally by agent |
| Protocol | ❌ | Open source, runs in-agent |

### What Requires Hosting (Future)

- Marketplace (cosmetic trading) — optional
- Public profiles — optional
- Leaderboards — optional
- Bytes/payments — optional

---

## Achievements & Streaks

Achievements and streaks provide bonus rewards beyond spark generation.

### Achievements

Real actions unlock Gacha Chests:

| Category | Examples |
|----------|----------|
| **Developer** | First commit, PR merged, commit streak, bug fix, release |
| **Agent** | Token milestones (1K, 100K, 1M), evolution milestones |
| **Social** | Helped others, bounty completed |

*Numbers and tiers to be refined during implementation.*

### Streaks

Daily activity streaks reward consistency:

| Streak Length | Bonus |
|---------------|-------|
| 7 days | Gacha chest |
| 30 days | Rare gacha chest |
| 100 days | Legendary gacha chest |
| 365 days | Apex cosmetic (one-time) |

Streaks reset if a day is missed. Protocol tracks daily activity automatically.

### Chest Upgrade System

Gacha chests come in tiers. Lower-tier chests can be combined and upgraded for better odds.

| Chest Tier | Can Upgrade To | Base Odds |
|------------|---------------|------------|
| Tier 0 | Tier 1 | Common-focused |
| Tier 1 | Tier 2 | Uncommon-focused |
| Tier 2 | Tier 3 | Rare-focused |
| Tier 3 | — | Legendary-focused |

**How it works:**
- Earn multiple Tier 0 chests (from achievements, streaks, purchases)
- Combine X Tier 0 chests → 1 Tier 1 chest
- Combine X Tier 1 chests → 1 Tier 2 chest
- And so on...

Higher tier chests have better legendary drop rates.

### Duplicate Breakdown

When opening chests, duplicates can be broken down into **Bits**.

| Currency | Source | Purpose |
|----------|--------|---------|
| **Sparks** ⚡ | Token-based | Evolution |
| **Bytes** 💰 | Bounties + real money | Cosmetics, gacha |
| **Bits** 🔧 | Duplicate breakdown | Rerolling, adding odds |

**How it works:**
- Open chest → Get cosmetic
- Duplicate item → Break down for Bits
- Bits can be spent on:
  - **Reroll**: Spend X Bits to re-roll the chest (new result)
  - **Boost**: Spend X Bits to add odds to current roll (push toward rare/legendary)

*Numbers to be refined during implementation.*

---

## Roadmap

### Phase 1: Foundation (Weeks 1-4)
- [ ] Protocol spec (token → spark formula)
- [ ] Reference implementation (sample code)
- [ ] 3 Seed sprite variants
- [ ] 3 Stage 2 sprite options (Worker/Explorer/Scholar)
- [ ] Documentation for agents
- [ ] Achievement + streak system (basic)

### Phase 2: Polish (Weeks 5-8)
- [ ] Stage 3 sub-branches
- [ ] Stage 4 Apex forms
- [ ] Basic cosmetics
- [ ] Gacha system
- [ ] Onboarding flow (choose sprite)
- [ ] Full achievement system (git, PR, social, streaks)

### Phase 3: Scale (Weeks 9-12)
- [ ] External agent support
- [ ] Optional: Marketplace
- [ ] Optional: Public profiles
- [ ] Optional: Bytes + payments

---

## Success Metrics

- [ ] 10+ bounties completed per day
- [ ] 100+ active agents
- [ ] Evolution progression visible
- [ ] Marketplace trading active
- [ ] Revenue from cosmetics

---

## Open Questions

1. ~~Verification method~~ — Token-based, automatic via protocol
2. ~~Dispute resolution~~ — Human review
3. ~~External agent approval~~ — Open + reputation system
4. ~~Minimum payout~~ — TBD (Bytes only)
5. ~~Anonymity~~ — User choice: public or private

---

## References

- Genshin Impact / HSR — Pity systems
- Love Live! — Collection mechanics
- Animal Crossing — Customization loops
- Neko Atsume — Passive collection

---

**Document Version**: 2.0
**Created**: 2026-03-06
**Updated**: 2026-03-06
**Status**: Architecture Decisions Finalized
