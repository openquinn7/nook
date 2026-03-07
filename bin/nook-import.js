/**
 * Nook Import Tool
 * Import historical agent activity from various sources into Nook events
 */

const fs = require('fs');
const path = require('path');
const { NookProtocol } = require('../index.js');

const DEFAULT_OPENCLAW_PATH = path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw');

function importFromCron(openclawPath, options = {}) {
  const runsPath = path.join(openclawPath, 'cron', 'runs');
  if (!fs.existsSync(runsPath)) return [];

  const events = [];
  const runFiles = fs.readdirSync(runsPath).filter(f => f.endsWith('.jsonl'));

  for (const runFile of runFiles) {
    const content = fs.readFileSync(path.join(runsPath, runFile), 'utf-8');
    for (const line of content.trim().split('\n')) {
      try {
        const entry = JSON.parse(line);
        if (entry.action !== 'finished' || !entry.usage) continue;

        const tokens = (entry.usage.input_tokens || 0) + (entry.usage.output_tokens || 0);
        events.push({
          eventId: `cron-${entry.jobId}-${entry.runAtMs}`,
          eventVersion: '1.0',
          type: 'agent.completed',
          agentId: entry.sessionKey?.split(':')[1] || 'unknown',
          rootIdentityId: options.rootIdentityId || 'local',
          workUnitId: entry.jobId,
          tokens,
          success: entry.status === 'ok',
          timestamp: entry.runAtMs,
          source: 'cron'
        });
      } catch (e) {}
    }
  }

  return events;
}

function importEvents(nook, events) {
  let imported = 0, skipped = 0;
  for (const event of events) {
    const existing = nook.getSparkEngine().getEvents().find(e => e.event.eventId === event.eventId);
    if (existing) { skipped++; continue; }
    nook.emit(event);
    imported++;
  }
  return { imported, skipped };
}

const args = process.argv.slice(2);
const openclawPath = args[0] || DEFAULT_OPENCLAW_PATH;
const nook = new NookProtocol({ agentId: 'import', rootIdentity: 'local' });

const events = importFromCron(openclawPath);
const result = importEvents(nook, events);

console.log(`Imported: ${result.imported}, Skipped: ${result.skipped}`);
console.log(`Total sparks: ${nook.getStatus().sparks}`);
