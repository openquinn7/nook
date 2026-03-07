#!/usr/bin/env node

/**
 * Nook CLI
 * Command-line interface for the Nook protocol
 */

const { NookProtocol, SEED_VARIANTS, EVOLUTION_THRESHOLDS, STAGE_2_PATHS, STAGE_3_SUB_BRANCHES, STAGE_4_APEX_FORMS } = require('../index.js');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'status';

async function main() {
  const nook = new NookProtocol();

  switch (command) {
    case 'init':
    case 'start':
      await handleInit(nook);
      break;

    case 'status':
    case 'info':
      await handleStatus(nook);
      break;

    case 'emit':
      await handleEmit(nook, args.slice(1));
      break;

    case 'evolve':
      await handleEvolve(nook, args.slice(1));
      break;

    case 'achievements':
      await handleAchievements(nook);
      break;

    case 'history':
    case 'events':
      await handleHistory(nook);
      break;

    case 'verify':
      await handleVerify(nook);
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    default:
      console.log(chalk.yellow(`Unknown command: ${command}`));
      showHelp();
  }
}

async function handleInit(nook) {
  const status = nook.getStatus();

  if (status.initialized) {
    console.log(chalk.yellow('You already have a sprite!'));
    console.log(chalk.gray(`Variant: ${status.sprite.variant}, Stage: ${status.sprite.stage}`));
    return;
  }

  console.log(chalk.bold.cyan('\n🌱 Welcome to Nook!\n'));

  const { variant } = await inquirer.prompt([
    {
      type: 'list',
      name: 'variant',
      message: 'Choose your seed companion:',
      choices: Object.entries(SEED_VARIANTS).map(([key, v]) => ({
        name: `${v.emoji} ${v.name} - ${v.description}`,
        value: key
      }))
    }
  ]);

  const result = nook.init(variant);
  console.log(chalk.green(`\n✅ ${result.message}\n`));
  showStatus(nook.getStatus());
}

async function handleStatus(nook) {
  const status = nook.getStatus();

  if (!status.initialized) {
    console.log(chalk.yellow('No sprite found. Run "nook init" to get started!'));
    return;
  }

  showStatus(status);
}

function showStatus(status) {
  const s = status.sprite;

  console.log(chalk.bold.cyan('\n📊 Nook Status\n'));
  console.log(chalk`{bold Sprite:} ${s.variant} (Stage ${s.stage})`);

  if (s.path) console.log(chalk`{bold Path:} ${s.path}`);
  if (s.subBranch) console.log(chalk`{bold Branch:} ${s.subBranch}`);
  if (s.apexForm) console.log(chalk`{bold Apex:} ${s.apexForm}`);

  console.log(chalk`\n{bold ⚡ Sparks:} ${status.sparks}`);

  if (status.nextEvolution) {
    const n = status.nextEvolution;
    console.log(chalk`\n{bold 🌱 Next Evolution:}`);
    console.log(`   Stage ${n.stage} (${n.name}) - ${n.sparksRequired} sparks`);
    console.log(`   Progress: ${n.sparksNeeded} sparks needed`);
  }

  console.log(chalk`\n{bold 🔥 Streak:} ${status.streak.current} days (best: ${status.streak.best})`);
  console.log(chalk`{bold 🏆 Achievements:} ${status.achievements}\n`);
}

async function handleEmit(nook, args) {
  const status = nook.getStatus();

  if (!status.initialized) {
    console.log(chalk.yellow('No sprite found. Run "nook init" first!'));
    return;
  }

  // Manual emit removed - sparks must come from verified agent sources
  // Use adapters to integrate with agent frameworks
  console.log(chalk.yellow('Manual emit disabled. Sparks must come from verified agent sources.'));
  console.log(chalk.gray('\nTo earn sparks, integrate an adapter:'));
  console.log(chalk.gray('  const { AgentAdapter } = require("@nook/protocol/adapters/generic")'));
  console.log(chalk.gray('  const adapter = new AgentAdapter({ agentId: "your-agent" })'));
  console.log(chalk.gray('  await adapter.wrapTask(yourAsyncFunction)()\n'));
}

async function handleEvolve(nook, args) {
  const status = nook.getStatus();

  if (!status.initialized) {
    console.log(chalk.yellow('No sprite found. Run "nook init" first!'));
    return;
  }

  const currentStage = status.sprite.stage;

  if (currentStage >= 4) {
    console.log(chalk.green('You are at max evolution!'));
    return;
  }

  if (status.nextEvolution && status.nextEvolution.sparksNeeded > 0) {
    console.log(chalk.yellow(`You need ${status.nextEvolution.sparksNeeded} more sparks to evolve!`));
    return;
  }

  // Get available choices
  let choices;
  let title;

  if (currentStage === 1 || currentStage === 2) {
    choices = STAGE_2_PATHS[status.sprite.variant];
    title = 'Choose your path:';
  } else if (currentStage === 3) {
    choices = STAGE_3_SUB_BRANCHES[status.sprite.variant][status.sprite.path];
    title = 'Choose your sub-branch:';
  } else if (currentStage === 4) {
    choices = STAGE_4_APEX_FORMS[status.sprite.variant];
    title = 'Choose your apex form:';
  }

  // Show available choices
  console.log(chalk.bold.cyan(`\n${title}\n`));
  for (const [key, v] of Object.entries(choices)) {
    console.log(`  ${key}: ${v.name} - ${v.description}`);
  }
  console.log('');

  // If choice provided as argument, use it
  let choice = args[0];
  if (!choice) {
    console.log(chalk.gray('Usage: node bin/nook.js evolve <choice>'));
    return;
  }

  if (!choices[choice]) {
    console.log(chalk.red(`Invalid choice: ${choice}`));
    return;
  }

  const result = nook.evolve(choice);
  console.log(chalk.green(`\n✅ ${result.message}`));
  showStatus(nook.getStatus());
}

async function handleAchievements(nook) {
  const achievements = nook.getAchievements().getUnlockedAchievements();

  if (achievements.length === 0) {
    console.log(chalk.yellow('No achievements yet. Keep working!'));
    return;
  }

  console.log(chalk.bold.cyan('\n🏆 Achievements\n'));

  for (const a of achievements) {
    const tierColors = {
      common: chalk.gray,
      uncommon: chalk.green,
      rare: chalk.blue,
      epic: chalk.magenta,
      legendary: chalk.yellow
    };

    console.log(tierColors[a.tier](`${a.tier.toUpperCase()} - ${a.name}`));
    console.log(chalk.gray(`  ${a.description}`));
    console.log(chalk.gray(`  +${a.sparkReward} sparks\n`));
  }
}

async function handleHistory(nook) {
  const events = nook.getSparkEngine().getEvents();

  if (events.length === 0) {
    console.log(chalk.yellow('No events yet. Emit an event to start earning sparks!'));
    return;
  }

  const projections = nook.getSparkEngine().getProjections();

  console.log(chalk.bold.cyan('\n📜 Event History\n'));
  console.log(chalk`{bold Total Events:} ${events.length}`);
  console.log(chalk`{bold Lifetime Sparks:} ${projections.lifetime_sparks}`);
  console.log(chalk`{bold Last 24h:} ${projections.sparks_last_24h}`);
  console.log(chalk`{bold Last Hour:} ${projections.sparks_last_hour}`);
  console.log(chalk.bold.cyan('\nRecent Events:\n'));

  // Show last 10 events
  const recent = events.slice(-10).reverse();
  for (const e of recent) {
    const date = new Date(e.timestamp);
    const dateStr = date.toLocaleString();
    const typeIcon = e.event.type === 'agent.completed' ? '✅' : '📝';
    console.log(chalk`${typeIcon} {bold ${e.event.type}} - ${e.event.tokens || 0} tokens`);
    console.log(chalk`  {gray ${dateStr}} - sparks: {bold ${e.sparks}}`);
    if (e.event.workUnitId) {
      console.log(chalk`  {gray workUnitId: ${e.event.workUnitId}}`);
    }
    console.log('');
  }
}

async function handleVerify(nook) {
  const status = nook.getStatus();

  if (!status.initialized) {
    console.log(chalk.yellow('No sprite found. Run "nook init" first!'));
    return;
  }

  const events = nook.getSparkEngine().getEvents();

  if (events.length === 0) {
    console.log(chalk.yellow('No events to verify. Integrate an adapter to start tracking.'));
    return;
  }

  console.log(chalk.bold.cyan('\n🔍 Verifying Event Log\n'));

  // Verify each event has required fields and sum stored sparks
  let verifiedTotal = 0;
  let validEvents = 0;
  let invalidEvents = 0;

  for (const e of events) {
    // Check required fields per spec
    if (!e.event.eventId || !e.event.eventVersion || !e.event.type || !e.event.agentId) {
      console.log(chalk.red(`  ❌ Invalid event: ${e.event.eventId || 'missing eventId'}`));
      invalidEvents++;
      continue;
    }

    // Event is valid - sum stored sparks
    validEvents++;
    verifiedTotal += e.sparks;
  }

  console.log(chalk`{bold Valid events:} ${validEvents}/${events.length}`);
  if (invalidEvents > 0) {
    console.log(chalk`{red Invalid events: ${invalidEvents}}`);
  }
  console.log(chalk`{bold Verified sparks (sum from events):} ${verifiedTotal}`);
  console.log(chalk`{bold Stored balance:} ${status.sparks}`);

  if (verifiedTotal === status.sparks && invalidEvents === 0) {
    console.log(chalk.green('\n✅ Verification passed - event log is valid\n'));
  } else {
    console.log(chalk.red('\n⚠️  Verification failed\n'));
  }
}

function showHelp() {
  console.log(chalk.bold.cyan(`
🌱 Nook CLI

Usage: nook <command>

Commands:
  init, start     Initialize a new sprite
  status, info     Show sprite status
  evolve           Choose evolution path/branch/apex
  achievements     Show unlocked achievements
  history, events  Show event history and spark accumulation
  verify           Verify event log integrity
  help             Show this help message

Examples:
  nook init              # Start your journey
  nook status            # Check spark balance
  nook verify            # Verify event log integrity
  nook evolve            # Choose your evolution

Learn more: https://github.com/openquinn7/nook
`));
}

main().catch(console.error);
