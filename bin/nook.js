#!/usr/bin/env node

/**
 * Nook CLI
 * Command-line interface for the Nook protocol
 */

const { NookProtocol, SEED_VARIANTS, EVOLUTION_THRESHOLDS, STAGE_2_PATHS, STAGE_3_SUB_BRANCHES, STAGE_4_APEX_FORMS } = require('../index.js');
const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

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
      await handleEvolve(nook);
      break;

    case 'gacha':
    case 'roll':
      await handleGacha(nook);
      break;

    case 'achievements':
      await handleAchievements(nook);
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

  // Parse args: nook emit <tokens> [workUnitId]
  const tokens = parseInt(args[0]) || 1000;
  const workUnitId = args[1] || `task-${Date.now()}`;

  console.log(chalk.gray(`Emitting event: completed ${workUnitId} with ${tokens} tokens`));

  const result = nook.emit({
    eventId: `evt-${Date.now()}`,
    eventVersion: '1.0',
    type: 'agent.completed',
    workUnitId,
    tokens,
    success: true,
    agentId: nook.agentId,
    rootIdentityId: nook.rootIdentity
  });

  console.log(chalk.green(`\n✅ Earned ${result.sparks} sparks!`));
  console.log(chalk.gray(`Total balance: ${result.totalSparks}`));

  // Check for evolution
  const newStatus = nook.getStatus();
  if (newStatus.nextEvolution && newStatus.nextEvolution.sparksNeeded <= 0) {
    console.log(chalk.cyan(`\n🌟 Ready to evolve to Stage ${newStatus.nextEvolution.stage}!`));
  }
}

async function handleEvolve(nook) {
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

  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: title,
      choices: Object.entries(choices).map(([key, v]) => ({
        name: `${v.name} - ${v.description}`,
        value: key
      }))
    }
  ]);

  const result = nook.evolve(choice);
  console.log(chalk.green(`\n✅ ${result.message}`));
  showStatus(nook.getStatus());
}

async function handleGacha(nook) {
  const status = nook.getStatus();

  if (!status.initialized) {
    console.log(chalk.yellow('No sprite found. Run "nook init" first!'));
    return;
  }

  const { type } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Choose gacha type:',
      choices: [
        { name: 'Single Roll (100 sparks)', value: 'SINGLE' },
        { name: 'Multi Roll (900 sparks, 10% off)', value: 'MULTI' },
        { name: 'Guaranteed Epic (500 sparks)', value: 'GUARANTEED' }
      ]
    }
  ]);

  if (status.sparks < 100 && type !== 'GUARANTEED') {
    console.log(chalk.yellow('Not enough sparks!'));
    return;
  }

  const spinner = ora('Rolling...').start();
  await new Promise(r => setTimeout(r, 1000));

  const result = nook.rollGacha(type, 'sparks');
  spinner.stop();

  console.log(chalk.bold.cyan('\n🎉 Results:\n'));

  for (const item of result.results) {
    const tierEmoji = {
      common: '⚪',
      uncommon: '🟢',
      rare: '🔵',
      epic: '🟣',
      legendary: '🟡'
    }[item.tier];

    console.log(chalk`${tierEmoji} {bold ${item.cosmetic.name}} (${item.tier})`);
    if (item.isNew) {
      console.log(chalk.green('  ✨ NEW!'));
    }
  }

  console.log(chalk.gray(`\nRemaining sparks: ${result.remainingBalance}`));
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

function showHelp() {
  console.log(chalk.bold.cyan(`
🌱 Nook CLI

Usage: nook <command>

Commands:
  init, start     Initialize a new sprite
  status, info     Show sprite status
  emit <tokens>    Emit a completed event to earn sparks
  evolve           Choose evolution path/branch/apex
  gacha, roll     Roll gacha for cosmetics
  achievements     Show unlocked achievements
  help             Show this help message

Examples:
  nook init              # Start your journey
  nook emit 5000         # Complete a task with 5000 tokens
  nook evolve            # Choose your evolution
  nook gacha             # Roll for cosmetics

Learn more: https://github.com/openquinn7/nook
`));
}

main().catch(console.error);
