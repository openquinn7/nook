#!/usr/bin/env node

/**
 * Nook SVG Sprites Demo
 * Renders all sprite variants and states
 */

const { SVGSpriteRenderer, SVG_SPRITES } = require('./src/svg-renderer');

const renderer = new SVGSpriteRenderer();

console.log('🎨 Nook SVG Sprites Demo\n');
console.log('='.repeat(50));

// Render each variant and state to an HTML file
const variants = renderer.getVariants();
const states = ['idle', 'working', 'success', 'failure', 'sleeping'];

let html = `<!DOCTYPE html>
<html>
<head>
  <title>Nook Sprites Demo</title>
  <style>
    body { font-family: monospace; background: #1a1a2e; color: #eee; padding: 20px; }
    h1 { color: #FFD700; text-align: center; }
    h2 { color: #82E0AA; border-bottom: 1px solid #333; padding-bottom: 10px; }
    .variant { margin-bottom: 40px; }
    .states { display: flex; flex-wrap: wrap; gap: 20px; }
    .state { background: #16213e; padding: 15px; border-radius: 8px; text-align: center; }
    .state-name { color: #888; margin-bottom: 10px; font-size: 12px; }
    svg { width: 64px; height: 64px; }
  </style>
</head>
<body>
  <h1>🎨 Nook Sprites</h1>
`;

for (const variant of variants) {
  const variantName = variant.charAt(0).toUpperCase() + variant.slice(1);
  html += `  <div class="variant">\n    <h2>${variantName}</h2>\n    <div class="states">\n`;

  for (const state of states) {
    const svg = renderer.render(variant, state);
    html += `      <div class="state">
        <div class="state-name">${state}</div>
        ${svg}
      </div>\n`;
  }

  html += `    </div>\n  </div>\n`;
}

html += `</body>\n</html>`;

// Write to file
const fs = require('fs');
fs.writeFileSync('./sprites-demo.html', html);

console.log('✅ Generated sprites-demo.html');
console.log('\nVariants:', variants.join(', '));
console.log('States:', states.join(', '));
console.log('\nOpen sprites-demo.html in a browser to view!');
