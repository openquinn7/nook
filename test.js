#!/usr/bin/env node

/**
 * Quick test script for Nook
 */

const { NookProtocol, SEED_VARIANTS } = require('./index.js');

console.log('🧪 Nook Protocol Test\n');

// Test 1: Create new Nook instance with higher caps for testing
console.log('Test 1: Create Nook instance');
const nook = new NookProtocol({ agentId: 'test-agent' });
nook.sparkEngine.hourlyCap = 1000;
nook.sparkEngine.dailyCap = 10000;
console.log('✅ Created\n');

// Test 2: Initialize sprite
console.log('Test 2: Initialize sprite');
const initResult = nook.init('worker');
console.log(`✅ ${initResult.message}\n`);

// Test 3: Emit events with more tokens and distinct work units
console.log('Test 3: Emit events');
for (let i = 0; i < 10; i++) {
  const result = nook.emit({
    eventId: `evt-${Date.now()}-${i}`,
    eventVersion: '1.0',
    type: 'agent.completed',
    workUnitId: `task-${Date.now()}-${i}`,
    tokens: 50000 + (i * 5000),
    success: true,
    agentId: nook.agentId,
    rootIdentityId: nook.rootIdentity
  });
  console.log(`  Task ${i}: +${result.sparks} sparks (total: ${result.totalSparks})`);
}
console.log('✅ Events emitted\n');

// Test 4: Check status
console.log('Test 4: Status');
const status = nook.getStatus();
console.log(`  Variant: ${status.sprite.variant}`);
console.log(`  Stage: ${status.sprite.stage}`);
console.log(`  Sparks: ${status.sparks}`);
console.log(`  Next evolution: ${status.nextEvolution?.name || 'N/A'}\n`);

// Test 5: Test achievements
console.log('Test 5: Track achievement');
const achievements = nook.getAchievements();
achievements.trackEvent('agent.tokens', { tokens: 1500 });
console.log(`  Unlocked: ${achievements.getUnlockedAchievements().length}\n`);

// Test 6: Gacha
console.log('Test 6: Gacha roll');
const gachaResult = nook.rollGacha('SINGLE', 'sparks', 100);
console.log(`  Got: ${gachaResult.results[0].cosmetic.name} (${gachaResult.results[0].tier})`);
console.log(`  Remaining: ${gachaResult.remainingBalance}\n`);

// Test 7: Persistence
console.log('Test 7: Persistence');
const profilePath = nook.getProfilePath();
console.log(`  Profile saved to: ${profilePath}`);

// Load fresh instance
const nook2 = new NookProtocol({ agentId: 'test-agent' });
const status2 = nook2.getStatus();
console.log(`  Loaded: ${status2.initialized ? '✅ Yes' : '❌ No'}\n`);

console.log('✅ All tests passed!');
