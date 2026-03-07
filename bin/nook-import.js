/**
 * Nook Import Tool
 * Import historical agent activity from various sources into Nook events
 *
 * Usage:
 *   node bin/nook-import.js cron --openclaw-path <path>
 *   node bin/nook-import.js git --repo-path <path> --agent-id <id>
 *   node bin/nook-import.js all --openclaw-path <path>
 */

const fs = require('fs');
const path = require('path');
const { NookProtocol } = require('../index.js');

// Default OpenClaw path
const DEFAULT_OPENCLAW_PATH = path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw');

/**
 * Import from OpenClaw cron jobs
 * Uses actual token counts from cron run logs
 */
function importFromCron(openclawPath, options = {}) {
  const jobsPath = path.join(openclawPath, 'cron', 'jobs.json');
  const runsPath = path.join(openclawPath, 'cron', 'runs');

  if (!fs.existsSync(jobsPath)) {
    console.log('No cron jobs found at:', jobsPath);
    return [];
  }

  const data = JSON.parse(fs.readFileSync(jobsPath, 'utf-8'));
  const events = [];
  const now = Date.now();

  // First, build a map of job IDs to job info
  const jobMap = {};
  for (const job of data.jobs || []) {
    jobMap[job.id] = job;
  }

  // If runs directory exists, parse actual token usage
  let runData = {};
  if (fs.existsSync(runsPath)) {
    const runFiles = fs.readdirSync(runsPath).filter(f => f.endsWith('.jsonl'));
    for (const runFile of runFiles) {
      const runFilePath = path.join(runsPath, runFile);
      const content = fs.readFileSync(runFilePath, 'utf-8');
      for (const line of content.trim().split('\n')) {
        try {
          const entry = JSON.parse(line);
          if (entry.action === 'finished' && entry.usage) {
            const jobId = entry.jobId;
            if (!runData[jobId]) runData[jobId] = [];
            runData[jobId].push({
              timestamp: entry.runAtMs,
              durationMs: entry.durationMs,
              status: entry.status,
              usage: entry.usage,
              sessionId: entry.sessionId
            });
          }
        } catch (e) {
          // Skip malformed lines
        }
      }
    }
  }

  for (const job of data.jobs || []) {
    if (!job.enabled) continue;

    const state = job.state || {};
    const lastRunAtMs = state.lastRunAtMs;
    const lastDurationMs = state.lastDurationMs || 0;
    const lastStatus = state.lastStatus;

    if (!lastRunAtMs) continue;

    // Try to get actual tokens from run data, otherwise estimate
    let tokens = 0;
    const jobRuns = runData[job.id] || [];
    const lastRun = jobRuns.find(r => r.timestamp === lastRunAtMs);

    if (lastRun && lastRun.usage) {
      // Use actual tokens: input + output
      tokens = (lastRun.usage.input_tokens || 0) + (lastRun.usage.output_tokens || 0);
    } else {
      // Fallback: estimate from duration (100 tokens per minute)
      tokens = Math.round((lastDurationMs / 60000) * 100);
    }

    // Only include successful runs
    if (lastStatus === 'ok') {
      events.push({
        eventId: `cron-${job.id}-${lastRunAtMs}`,
        eventVersion: '1.0',
        type: 'agent.completed',
        agentId: job.agentId || 'unknown',
        rootIdentityId: options.rootIdentityId || 'local',
        workUnitId: job.name || `job-${job.id}`,
        tokens: tokens,
        success: true,
        timestamp: lastRunAtMs,
        source: 'cron',
        metadata: {
          jobName: job.name,
          durationMs: lastDurationMs,
          schedule: job.schedule?.kind,
          inputTokens: lastRun?.usage?.input_tokens,
          outputTokens: lastRun?.usage?.output_tokens
        }
      });
    }
  }

  return events;
}

/**
 * Import from git commits
 * Events: agent.completed for each commit
 */
function importFromGit(repoPath, options = {}) {
  const events = [];

  // Simple check for .git directory
  const gitDir = path.join(repoPath, '.git');
  if (!fs.existsSync(gitDir)) {
    console.log('No git repo found at:', repoPath);
    return events;
  }

  // Try to read git log (simplified - just checking for commits)
  // In a real implementation, you'd use simple-git or spawn git command
  const logPath = path.join(gitDir, 'logs', 'HEAD');
  if (!fs.existsSync(logPath)) {
    return events;
  }

  // For now, return empty - full implementation would parse git log
  // This is a placeholder for git import
  console.log('Git import not fully implemented - would parse git log');

  return events;
}

/**
 * Import from trading bot logs
 * Events: trade.completed for each trade
 */
function importFromTrading(botPath, options = {}) {
  const events = [];
  const tradesPath = path.join(botPath, 'live-trades.json');

  if (!fs.existsSync(tradesPath)) {
    return events;
  }

  try {
    const data = JSON.parse(fs.readFileSync(tradesPath, 'utf-8'));

    for (const trade of data.trades || []) {
      events.push({
        eventId: `trade-${trade.id || Date.now()}`,
        eventVersion: '1.0',
        type: 'agent.completed',
        agentId: options.agentId || 'trading',
        rootIdentityId: options.rootIdentityId || 'local',
        workUnitId: `trade-${trade.id || Date.now()}`,
        tokens: trade.value || 100, // Estimate tokens based on trade value
        success: trade.status === 'closed',
        timestamp: trade.timestamp || Date.now(),
        source: 'trading',
        metadata: {
          market: trade.market,
          side: trade.side,
          pnl: trade.pnl
        }
      });
    }
  } catch (e) {
    console.error('Failed to parse trading log:', e.message);
  }

  return events;
}

/**
 * Import from all available sources
 */
function importAll(openclawPath, options = {}) {
  const allEvents = [];
  const now = Date.now();
  const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

  console.log('Importing from OpenClaw...\n');

  // 1. Import cron jobs
  console.log('📅 Cron jobs:');
  const cronEvents = importFromCron(openclawPath, options);
  console.log(`   Found ${cronEvents.length} completed job runs`);
  allEvents.push(...cronEvents);

  // 2. Import from workspace directories
  const workspacesPath = path.join(openclawPath, 'workspace');
  if (fs.existsSync(workspacesPath)) {
    const dirs = fs.readdirSync(workspacesPath).filter(d =>
      fs.statSync(path.join(workspacesPath, d)).isDirectory()
    );

    for (const dir of dirs) {
      // Check for trading bot logs
      const botPath = path.join(workspacesPath, dir);
      const tradingEvents = importFromTrading(botPath, {
        ...options,
        agentId: dir
      });

      if (tradingEvents.length > 0) {
        console.log(`   Trading (${dir}): ${tradingEvents.length} events`);
        allEvents.push(...tradingEvents);
      }
    }
  }

  // Filter to last 30 days
  const filtered = allEvents.filter(e => e.timestamp >= oneMonthAgo);

  console.log(`\n📊 Total events (last 30 days): ${filtered.length}`);

  return filtered;
}

/**
 * Import events into Nook
 */
function importEvents(nook, events, options = {}) {
  let imported = 0;
  let skipped = 0;

  for (const event of events) {
    try {
      // Check if already imported (by eventId)
      const existing = nook.getSparkEngine().getEvents()
        .find(e => e.event.eventId === event.eventId);

      if (existing) {
        skipped++;
        continue;
      }

      nook.emit(event);
      imported++;
    } catch (e) {
      console.error(`Failed to import event ${event.eventId}:`, e.message);
    }
  }

  return { imported, skipped };
}

// CLI
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === 'help') {
  console.log(`
🌱 Nook Import Tool

Usage:
  node bin/nook-import.js <command> [options]

Commands:
  cron <path>              Import from OpenClaw cron jobs
  all                      Import from all sources
  status                   Show import status

Options:
  --openclaw-path <path>   OpenClaw home path (default: ~/.openclaw)
  --agent-id <id>          Agent ID for events
  --root-identity <id>     Root identity (default: local)
  --dry-run                Show what would be imported without importing

Examples:
  node bin/nook-import.js all
  node bin/nook-import.js cron --openclaw-path ~/.openclaw
`);
  process.exit(0);
}

// Parse options
const options = {};
const remainingArgs = [];

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg.startsWith('--')) {
    const key = arg.replace('--', '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    options[key] = args[++i];
  } else {
    remainingArgs.push(arg);
  }
}

const openclawPath = options.openclawPath || DEFAULT_OPENCLAW_PATH;
options.rootIdentityId = options.rootIdentity || 'local';

console.log(`🔍 OpenClaw path: ${openclawPath}\n`);

const nook = new NookProtocol({
  agentId: options.agentId || 'import',
  rootIdentity: options.rootIdentityId
});

switch (command) {
  case 'cron': {
    const events = importFromCron(openclawPath, options);
    console.log(`\n📋 Found ${events.length} events`);

    if (options.dryRun) {
      console.log('\n🔍 Dry run - events to import:');
      for (const e of events.slice(0, 10)) {
        console.log(`   ${e.type} - ${e.workUnitId} (${e.tokens} tokens)`);
      }
      if (events.length > 10) console.log(`   ... and ${events.length - 10} more`);
    } else {
      const result = importEvents(nook, events, options);
      console.log(`\n✅ Imported: ${result.imported}, Skipped: ${result.skipped}`);
    }
    break;
  }

  case 'all': {
    const events = importAll(openclawPath, options);

    if (options.dryRun) {
      console.log('\n🔍 Dry run - events to import:');
      for (const e of events.slice(0, 10)) {
        console.log(`   ${e.type} - ${e.workUnitId} (${e.tokens} tokens)`);
      }
      if (events.length > 10) console.log(`   ... and ${events.length - 10} more`);
    } else {
      const result = importEvents(nook, events, options);
      console.log(`\n✅ Imported: ${result.imported}, Skipped: ${result.skipped}`);
    }
    break;
  }

  case 'status': {
    const events = nook.getSparkEngine().getEvents();
    console.log(`📊 Events in Nook: ${events.length}`);
    console.log(`   Source breakdown:`);

    const sources = {};
    for (const e of events) {
      const source = e.event.source || 'unknown';
      sources[source] = (sources[source] || 0) + 1;
    }

    for (const [source, count] of Object.entries(sources)) {
      console.log(`   ${source}: ${count}`);
    }
    break;
  }

  default:
    console.log(`Unknown command: ${command}`);
    console.log('Run "node bin/nook-import.js help" for usage');
}
