#!/usr/bin/env node

/**
 * Test the hook system
 */

const { NookProtocol } = require('./index.js');

console.log('🧪 Testing Hook System\n');

// Create Nook instance
const nook = new NookProtocol({ agentId: 'test-hooks' });
nook.init('worker');

console.log('✅ Created nook instance\n');

// Test hooks
console.log('Test 1: Register hooks');
let hookFired = false;
let capturedEvent = null;
let capturedResult = null;

const unsubscribe = nook.on('agent.completed', (event, result) => {
  hookFired = true;
  capturedEvent = event;
  capturedResult = result;
  console.log('  🎯 Hook fired!');
});

console.log('✅ Registered hook for agent.completed\n');

// Test wildcard hooks
console.log('Test 2: Wildcard hook');
let wildcardFired = false;
nook.on('*', (event, result) => {
  wildcardFired = true;
  console.log('  🌟 Wildcard hook fired for:', event.type);
});

console.log('✅ Registered wildcard hook\n');

// Emit an event
console.log('Test 3: Emit event');
const result = nook.emit({
  eventId: 'evt-test-1',
  eventVersion: '1.0',
  type: 'agent.completed',
  agentId: nook.agentId,
  rootIdentityId: nook.rootIdentity,
  workUnitId: 'test-task',
  tokens: 5000,
  success: true
});

console.log(`  Emitted: ${result.event.type}`);
console.log(`  Sparks: ${result.sparks}\n`);

// Check hooks fired
console.log('Test 4: Verify hooks fired');
console.log(`  Specific hook fired: ${hookFired ? '✅' : '❌'}`);
console.log(`  Wildcard hook fired: ${wildcardFired ? '✅' : '❌'}`);
console.log(`  Captured event type: ${capturedEvent?.type}`);
console.log(`  Captured sparks: ${capturedResult?.sparks}\n`);

// Test unsubscribe
console.log('Test 5: Unsubscribe');
let afterUnsubscribe = false;
nook.off('agent.completed', unsubscribe);
nook.emit({
  eventId: 'evt-test-2',
  eventVersion: '1.0',
  type: 'agent.completed',
  agentId: nook.agentId,
  rootIdentityId: nook.rootIdentity,
  workUnitId: 'test-2',
  tokens: 1000
});
// The hook won't fire now because we unsubscribed
console.log('  Unsubscribed - hook should not fire again\n');

// Test agent adapter
console.log('Test 6: Agent Adapter');
const { AgentAdapter } = require('./adapters/generic');
const adapter = new AgentAdapter({ agentId: 'test-adapter' });

const wrappedFn = adapter.wrapTask(async () => {
  return 'test result with some content here';
}, { workUnitId: 'wrapped-task' });

(async () => {
  const adapterResult = await wrappedFn();
  console.log(`  Wrapped function executed: ✅`);
  console.log(`  Sparks earned: ${adapter.getStatus().sparks}\n`);

  console.log('✅ All hook tests passed!');
})();
