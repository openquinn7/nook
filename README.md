# Workspace Build

Quinn's AI agent workspace for software development and project management.

## Structure

```
workspace-build/
├── CLAUDE.md          # Agent instructions
├── SOUL.md            # Agent personality
├── USER.md            # User profile (Quinn)
├── MEMORY.md          # Long-term memory
├── AGENTS.md          # Agent workflow rules
├── TOOLS.md           # Local tool configuration
├── domains/           # Domain-based task management
│   ├── build/         # Software development
│   ├── ops/           # Operations
│   ├── personal/       # Personal tasks
│   ├── research/      # Research
│   └── trading/       # Trading
├── projects/          # Active software projects
├── scripts/           # Utility scripts
├── skills/            # Quinn skills
└── memory/            # Daily session logs
```

## Projects

- **companycam-bridge** - Cloudflare Workers + CompanyCam API
- **construction-claw** - Construction project
- **benefits-claw** - Benefits project
- **insurance-claw** - Insurance project

## Getting Started

1. Claude Code reads `CLAUDE.md` on session start
2. Check `SOUL.md` and `USER.md` for context
3. Identify the relevant domain/project
4. Execute tasks within that scope

## Project Management

Uses human-in-the-loop workflow via `scripts/projects.db` (SQLite).

See `skills/quinn-projects/SKILL.md` for commands.
