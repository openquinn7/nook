/**
 * Nook Cron Job
 * Quick sync - reads recent cron runs and imports new events
 */

const { NookProtocol } = require('../index.js');
const fs = require('fs');
const path = require('path');

const NOOK_PATH = path.join(process.env.USERPROFILE || process.env.HOME, '.nook');
const OPENCLAW_PATH = path.join(process.env.USERPROFILE || process.env.HOME, '.openclaw');

function main() {
  const nook = new NookProtocol({
    storagePath: NOOK_PATH,
    agentId: 'cron-import',
    rootIdentity: 'local'
  });

  const runsPath = path.join(OPENCLAW_PATH, 'cron', 'runs');
  if (!fs.existsSync(runsPath)) {
    console.log('No cron runs found');
    return;
  }

  const existingEvents = nook.getSparkEngine().getEvents();
  const existingIds = new Set(existingEvents.map(e => e.event.eventId));

  let imported = 0;
  const runFiles = fs.readdirSync(runsPath).filter(f => f.endsWith('.jsonl'));

  for (const runFile of runFiles) {
    const content = fs.readFileSync(path.join(runsPath, runFile), 'utf-8');
    for (const line of content.trim().split('\n')) {
      try {
        const entry = JSON.parse(line);
        if (entry.action !== 'finished' || !entry.usage) continue;

        const eventId = `cron-${entry.jobId}-${entry.runAtMs}`;
        if (existingIds.has(eventId)) continue;

        const tokens = (entry.usage.input_tokens || 0) + (entry.usage.output_tokens || 0);

        nook.emit({
          eventId,
          eventVersion: '1.0',
          type: 'agent.completed',
          agentId: entry.sessionKey?.split(':')[1] || 'unknown',
          rootIdentityId: 'local',
          workUnitId: entry.jobId,
          tokens,
          success: entry.status === 'ok',
          timestamp: entry.runAtMs,
          source: 'cron'
        });

        imported++;
        existingIds.add(eventId);
      } catch (e) {}
    }
  }

  const status = nook.getStatus();
  console.log(`Imported: ${imported}, Total sparks: ${status.sparks}`);
}

main();
