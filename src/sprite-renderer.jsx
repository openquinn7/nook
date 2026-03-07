/**
 * Nook Sprite Visualization
 * React component for rendering sprites
 */

import React, { useRef, useEffect, useState } from 'react';
import { SEED_VARIANTS, SPRITE_STATES } from './sprites';

const SPRITE_SIZE = 64;

// Canvas-based sprite renderer
export function SpriteCanvas({ sprite, x = 0, y = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !sprite) return;

    const ctx = canvas.getContext('2d');
    const variant = SEED_VARIANTS[sprite.variant];
    const stateConfig = SPRITE_STATES[sprite.state];

    // Clear
    ctx.clearRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

    // Draw body (circle)
    ctx.fillStyle = variant.color;
    ctx.beginPath();
    ctx.arc(SPRITE_SIZE / 2, SPRITE_SIZE / 2, SPRITE_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw eyes based on state
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(SPRITE_SIZE / 2 - 8, SPRITE_SIZE / 2 - 4, 6, 0, Math.PI * 2);
    ctx.arc(SPRITE_SIZE / 2 + 8, SPRITE_SIZE / 2 - 4, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000';
    const pupilOffset = sprite.state === 'working' ? 2 : 0;
    ctx.beginPath();
    ctx.arc(SPRITE_SIZE / 2 - 8 + pupilOffset, SPRITE_SIZE / 2 - 4, 3, 0, Math.PI * 2);
    ctx.arc(SPRITE_SIZE / 2 + 8 + pupilOffset, SPRITE_SIZE / 2 - 4, 3, 0, Math.PI * 2);
    ctx.fill();

    // Expression based on state
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    if (sprite.state === 'success') {
      // Happy smile
      ctx.beginPath();
      ctx.arc(SPRITE_SIZE / 2, SPRITE_SIZE / 2 + 4, 10, 0, Math.PI);
      ctx.stroke();
    } else if (sprite.state === 'failure') {
      // Sad frown
      ctx.beginPath();
      ctx.arc(SPRITE_SIZE / 2, SPRITE_SIZE / 2 + 12, 8, Math.PI, 0);
      ctx.stroke();
    } else {
      // Neutral
      ctx.beginPath();
      ctx.moveTo(SPRITE_SIZE / 2 - 6, SPRITE_SIZE / 2 + 8);
      ctx.lineTo(SPRITE_SIZE / 2 + 6, SPRITE_SIZE / 2 + 8);
      ctx.stroke();
    }

    // State indicator
    if (sprite.state === 'working') {
      ctx.fillStyle = '#f39c12';
      ctx.beginPath();
      ctx.arc(SPRITE_SIZE - 12, 12, 6, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [sprite]);

  return (
    <canvas
      ref={canvasRef}
      width={SPRITE_SIZE}
      height={SPRITE_SIZE}
      style={{ position: 'absolute', left: x, top: y }}
    />
  );
}

// Simple sprite component using CSS
export function Sprite({ variant = 'worker', state = 'idle', size = 64 }) {
  const variantConfig = SEED_VARIANTS[variant];

  const stateAnimations = {
    idle: 'sprite-idle 2s ease-in-out infinite',
    working: 'sprite-working 0.5s ease-in-out infinite',
    success: 'sprite-success 1s ease-out',
    failure: 'sprite-failure 1s ease-out',
    sleeping: 'sprite-sleeping 3s ease-in-out infinite'
  };

  return (
    <div
      className="nook-sprite"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: variantConfig.color,
        animation: stateAnimations[state] || stateAnimations.idle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.5,
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      {variantConfig.emoji}
    </div>
  );
}

// Sprite world component
export function SpriteWorld({ sprites = [] }) {
  return (
    <div
={{
        position: 'relative',
             style width: '100%',
        height: '400px',
        backgroundColor: '#87CEEB',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {sprites.map((sprite, index) => (
        <Sprite
          key={sprite.id || index}
          variant={sprite.variant}
          state={sprite.state}
          size={sprite.size || 64}
        />
      ))}
    </div>
  );
}

// CSS animations (add to your CSS file)
export const SPRITE_CSS = `
  @keyframes sprite-idle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

  @keyframes sprite-working {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes sprite-success {
    0% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.2) rotate(10deg); }
    100% { transform: scale(1) rotate(0deg); }
  }

  @keyframes sprite-failure {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }

  @keyframes sprite-sleeping {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
`;

export default { Sprite, SpriteCanvas, SpriteWorld, SPRITE_CSS };
