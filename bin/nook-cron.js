/**
 * Nook Cron Job
 * Run this periodically to import agent activity into Nook
 *
 * Usage:
 *   node bin/nook-cron.js
 *
 * Run from: nook directory
 */

const { NookProtocol } = require('../index.js');
const fs = require('fs');
const path = require('path');

// Default OpenClaw path
const DEFAULT_OPENCLAW_PATH = path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw');

/**
 * Import from OpenClaw cron runs
 */
function importFromCron(openclawPath, options = {}) {
  const runsPath = path.join(openclawPath, 'cron', 'runs');
  const events = [];

  if (!fs.existsSync(runsPath)) {
    return events;
  }

  // Read all run files
  const runFiles = fs.readdirSync(runsPath).filter(f => f.endsWith('.jsonl'));

  for (const runFile of runFiles) {
    const runFilePath = path.join(runsPath, runFile);
    const content = fs.readFileSync(runFilePath, 'utf-8');

    for (const line of content.trim().split('\n')) {
      try {
        const entry = JSON.parse(line);

        // Only process finished events with usage
        if (entry.action === 'finished' && entry.usage) {
          const tokens = (entry.usage.input_tokens || 0) + (entry.usage.output_tokens || 0);

          events.push({
            eventId: `cron-${entry.jobId}-${entry.runAtMs}`,
            eventVersion: '1.0',
            type: 'agent.completed',
            agentId: entry.sessionKey?.split(':')[1] || 'unknown',
            rootIdentityId: options.rootIdentityId || 'local',
            workUnitId: entry.jobId,
            tokens: tokens,
            success: entry.status === 'ok',
            timestamp: entry.runAtMs,
            source: 'cron',
            metadata: {
              durationMs: entry.durationMs,
              model: entry.model
            }
          });
        }
      } catch (e) {
        // Skip malformed lines
      }
    }
  }

  return events;
}

function importEvents(nook, events, options = {}) {
  let imported = 0;
  let skipped = 0;

  for (const event of events) {
    try {
      // Check if already imported
      const existing = nook.getSparkEngine().getEvents()
        .find(e => e.event.eventId === event.eventId);

      if (existing) {
        skipped++;
        continue;
      }

      nook.emit(event);
      imported++;
    } catch (e) {
      // Skip errors
    }
  }

  return { imported, skipped };
}

// Run
const nookPath = process.argv[2] || path.join(DEFAULT_OPENCLAW_PATH, '..', '.nook');
const openclawPath = process.argv[3] || DEFAULT_OPENCLAW_PATH;

const nook = new NookProtocol({
  storagePath: nookPath,
  agentId: 'cron-import',
  rootIdentity: 'local'
});

console.log(`[Nook Import] Starting...`);
console.log(`[Nook Import] OpenClaw: ${openclawPath}`);

const events = importFromCron(openclawPath);
const result = importEvents(nook, events);

console.log(`[Nook Import] Events: ${events.length}, Imported: ${result.imported}, Skipped: ${result.skipped}`);

const status = nook.getStatus();
console.log(`[Nook Import] Total sparks: ${status.sparks}`);
