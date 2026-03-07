# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an AI agent workspace for Quinn, containing multiple software projects and domain-based task management. The workspace follows a structured organization with core agent files, domain directories, and active projects.

## Startup Protocol

When starting a session in this workspace, follow this exact order:

1. Read `SOUL.md`
2. Read `USER.md`
3. Identify the active domain from the user request
4. Read `domains/<domain>/DIRECTIVES.md`
5. Read today's session log `memory/YYYY-MM-DD.md` only if it is relevant to the current task or needed for continuity.

Do not read the entire repository unless required.
Focus only on the relevant domain and project.

## Protected Files

The following files are read-only unless Quinn explicitly requests changes:

SOUL.md
USER.md
MEMORY.md
AGENTS.md
TOOLS.md
HEARTBEAT.md

Do not modify these automatically.
Always ask before editing them.

## Repository Exploration Rule

Do not scan the entire workspace by default.

Start with the target project or domain.

Only expand exploration if the task requires additional context.

## Workspace Structure

```
workspace-build/
├── AGENTS.md          # Agent workflow and session rules
├── SOUL.md            # Agent personality and core values
├── USER.md            # User profile (Quinn)
├── MEMORY.md          # Long-term memory (domain-scoped)
├── TOOLS.md           # Local tool configuration
├── HEARTBEAT.md       # Periodic task checklist
├── domains/           # Domain-based task management
│   ├── build/         # Software development domain
│   ├── ops/           # Operations domain
│   ├── personal/      # Personal tasks domain
│   ├── research/      # Research domain
│   └── trading/       # Trading domain
├── projects/          # Active software projects
│   ├── companycam-bridge/
│   ├── construction-claw/
│   ├── benefits-claw/
│   └── insurance-claw/
└── memory/            # Daily session logs (YYYY-MM-DD.md)
```

## Code Editing Rules

When modifying code:

1. Prefer small incremental edits over large rewrites
2. Explain architectural changes before implementing
3. Never modify multiple projects in one step
4. Run project commands only inside the relevant project directory
5. When unsure about project behavior, inspect code before proposing changes

## Agent Workspace Context

This workspace supports OpenClaw agents.

Key agent concepts:

- Domains represent long-running areas of responsibility
- DIRECTIVES.md contains instructions issued by Quinn
- ROLLUP.md tracks directive processing state
- MEMORY.md stores curated context

Agents should prioritize directive execution and accurate state tracking.

## Scope & Project Selection

Before editing or running commands, identify the single target project or domain in scope.

Operate only inside that scope.

Do not inspect or modify unrelated projects, root control files, or other domains unless Quinn explicitly asks for cross-project work.

If scope is ambiguous, inspect first and state the intended scope before making edits.

## Active Projects

### companycam-bridge
Cloudflare Workers project integrating with CompanyCam API.
- **Tech**: TypeScript, Wrangler, Vitest
- **Commands**:
  - `npm run dev` - Start dev server
  - `npm run deploy` - Deploy to Cloudflare
  - `npm test` - Run tests
- **Config**: `wrangler.toml`, `tsconfig.json`

### benefits-claw, construction-claw
Active software projects with subdirectories: app/, benefits/, eval/, ops/, research/

### insurance-claw
Business project with pitch deck (INSURANCE_CLAW_PITCH_DECK.pdf) and project brief

## Domain System

Each domain (build, ops, personal, research, trading) has:
- `DIRECTIVES.md` - Task directives from Quinn
- `ROLLUP.md` - Status tracking with directive_id_seen and directive_id_applied

**SYNCSTAMP_ONLY mode**: When message contains SYNCSTAMP_ONLY, do not perform normal task work.

Only read:
- SOUL.md
- USER.md
- domains/<domain>/DIRECTIVES.md

Stamp the relevant ROLLUP.md file and return the single required output line.
Do not inspect other files.

## Memory Management

- **Daily notes**: `memory/YYYY-MM-DD.md` - Raw session logs
- **Long-term memory**: `MEMORY.md` - Curated memories (only in main sessions)
- **Domain memory**: `MEMORY.md` in each domain directory - domain-specific context
- **Never write directly to** `memory/domain-memory.md` without reading first

## Communication Style

- Discord: Use bullet lists instead of tables, wrap links in `<>`, prefix with `[agent-id -> domain]`
- Group chats: Use reactions (thumbs up, heart, etc.) instead of replying to everything
- Be concise - skip filler phrases like "Great question!"

## Relay System (Quinn → Claude Code)

When Quinn needs to delegate work, tasks are written to `quinn-relay.json`. This solves timeout issues by having Quinn orchestrate while I execute.

### Relay File Structure

```
C:\Users\Carlton\.openclaw\workspace-build\quinn-relay.json
```

```json
{
  "tasks": [
    {
      "id": "uuid",
      "type": "task|message",
      "content": "ask build agent to review companycam-bridge code",
      "priority": "high|normal",
      "createdAt": "ISO timestamp",
      "status": "pending|in_progress|done"
    }
  ],
  "responses": [],
  "notifications": [
    {
      "id": "uuid",
      "type": "info|alert",
      "content": "Claude completed setup of relay system",
      "createdAt": "ISO timestamp",
      "read": false
    }
  ]
}
```

### Quinn's Skill

Quinn can use the `claude-relay` skill in `~/.agents/skills/claude-relay/` to invoke this workspace.

**Example Discord commands:**
```
@quinn claude list companycam-bridge files
@quinn claude run tests in construction-claw
@quinn ask claude to summarize benefits-claw
```

### Task Processing

1. **On session start**: Check relay file for pending tasks
2. **Pick up task**: Immediately update task status from `pending` to `in_progress`
3. **Process tasks**: Use Agent tool to execute
4. **Complete task**:
   - Write result to `responses[]` array
   - Write notification to `notifications[]` with `read: false`
   - Update task status to `done`

### Task Status Lifecycle

- `pending` - Task waiting to be picked up
- `in_progress` - Claude is actively working on it
- `done` - Task completed

When you pick up a task, update its status to `in_progress` immediately.
When finished, update to `done` and write a notification.

### Response Format

```json
{
  "taskId": "uuid",
  "result": "executed successfully...",
  "completedAt": "ISO timestamp"
}
```

## Project Management System (Human-in-the-Loop)

Quinn uses a structured workflow for managing projects. When working on a project for Quinn, follow this system.

### Database
- **Location:** `scripts/projects.db` (SQLite)
- **Schema:** See `~/.agents/skills/quinn-projects/SKILL.md`

### Workflow

1. ** Quinn creates project** → status = 'planning'
2. **You plan** → Read pending projects, create milestones and components
3. **Quinn approves milestone** → Components become actionable
4. **Development loop:**
   - Pick next pending component
   - Update status to 'in_progress'
   - Ship component
   - Update status to 'awaiting_review'
   - Wait for Quinn's approval/rejection
5. **Milestone complete** → All components done → Quinn approves → Next milestone or project complete

### Commands

```bash
# Project operations
node scripts/project-cmds.js list
node scripts/project-cmds.js status <project_id>
node scripts/project-cmds.js pending                           # Projects needing planning

# Milestone operations
node scripts/project-cmds.js add-milestone <project_id> "Name"
node scripts/project-cmds.js approve-milestone <milestone_id>
node scripts/project-cmds.js reject-milestone <milestone_id>
node scripts/project-cmds.js milestones-for-review

# Component operations
node scripts/project-cmds.js add-component <milestone_id> "Name"
node scripts/project-cmds.js workable                           # Approved milestones with pending work
node scripts/project-cmds.js awaiting                           # Components awaiting review
node scripts/project-cmds.js approve-component <component_id>
node scripts/project-cmds.js reject-component <component_id>
node scripts/project-cmds.js get-component <component_id>
```

### Status Flow
- Components: pending → in_progress → awaiting_review → done (or back to pending on reject)
- Milestones: draft → approved (or rejected)
- Projects: planning → active (when first milestone approved) → completed

### Session Start Checklist
On session start, check for work:
1. `node scripts/project-cmds.js pending` — Any projects need planning?
2. `node scripts/project-cmds.js workable` — Any approved milestones with pending components?
3. `node scripts/project-cmds.js awaiting` — Any components need Quinn's review?

### Your Responsibilities
- **Plan only if**: project.status='planning' AND no milestones exist
- **Build only if**: milestone.status='approved' AND component.status='pending'
- Create detailed milestone/component plans for Quinn to review
- Update status after each step
- Write output_reference when marking component for review (file paths, commit hash, test results)
- Never skip the approval gate — always wait for Quinn to approve before moving forward

## Safety Rules

- Ask before external actions (emails, public posts)
- Never exfiltrate private data
- Use `trash` over `rm` for deletable files
- When in doubt, ask first
