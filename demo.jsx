/**
 * Nook Web Demo
 * Interactive visualization of Nook sprites
 */

import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Sprite, SpriteCanvas, SpriteWorld, SPRITE_CSS } from './sprite-renderer.jsx';
import { OnboardingFlow } from './OnboardingFlow.jsx';
import { SEED_VARIANTS, STAGE_2_PATHS, STAGE_3_SUB_BRANCHES, STAGE_4_APEX_FORMS, EVOLUTION_THRESHOLDS } from './sprites.js';

// Demo state
const DEMO_STYLES = {
  container: {
    fontFamily: '"Press Start 2P", "VT323", monospace',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    minHeight: '100vh',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  title: {
    fontSize: '32px',
    background: 'linear-gradient(135deg, #f39c12, #e74c3c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '14px'
  },
  world: {
    width: '100%',
    height: '400px',
    backgroundColor: '#2d3436',
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: '30px'
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '80px',
    backgroundColor: '#27ae60'
  },
  controls: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '30px'
  },
  button: {
    padding: '12px 24px',
    fontSize: '12px',
    fontFamily: 'inherit',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  buttonActive: {
    backgroundColor: '#f39c12',
    color: '#1a1a2e'
  },
  statsPanel: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  section: {
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '16px',
    marginBottom: '16px',
    color: '#f39c12'
  },
  spriteGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  spriteCard: {
    backgroundColor: '#16213e',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    minWidth: '150px'
  }
};

// Animated background stars
function Stars({ count = 50 }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100 + '%',
    top: Math.random() * 60 + '%',
    size: Math.random() * 3 + 1,
    delay: Math.random() * 2
  }));

  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}>
      {stars.map((star, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.size + 'px',
            height: star.size + 'px',
            backgroundColor: '#fff',
            borderRadius: '50%',
            animation: `twinkle ${2 + star.delay}s infinite`,
            animationDelay: star.delay + 's'
          }}
        />
      ))}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Demo sprite that moves around
function AnimatedSprite({ variant, state, onClick }) {
  const [position, setPosition] = useState({ x: 200, y: 250 });
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (state !== 'idle') return;

    const interval = setInterval(() => {
      setPosition(p => {
        let newX = p.x + direction * 0.5;
        if (newX > 350 || newX < 50) {
          setDirection(d => -d);
          newX = Math.max(50, Math.min(350, newX));
        }
        return { ...p, x: newX };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [state, direction]);

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        cursor: 'pointer',
        transition: 'transform 0.1s'
      }}
    >
      <Sprite variant={variant} state={state} size={64} />
    </div>
  );
}

// Main App
function NookDemo() {
  const [selectedVariant, setSelectedVariant] = useState('worker');
  const [state, setState] = useState('idle');
  const [showWorld, setShowWorld] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const states = ['idle', 'working', 'success', 'failure', 'sleeping'];

  return (
    <div style={DEMO_STYLES.container}>
      <style>{SPRITE_CSS}</style>

      {/* Header */}
      <div style={DEMO_STYLES.header}>
        <h1 style={DEMO_STYLES.title}>🌱 Nook Demo</h1>
        <p style={DEMO_STYLES.subtitle}>Interactive Sprite Visualization</p>
      </div>

      {/* Onboarding Demo */}
      <div style={DEMO_STYLES.section}>
        <h2 style={DEMO_STYLES.sectionTitle}>🎮 Try Onboarding</h2>
        <div style={{ textAlign: 'center' }}>
          <button
            style={{ ...DEMO_STYLES.button, backgroundColor: '#9b59b6' }}
            onClick={() => setShowOnboarding(true)}
          >
            Launch Onboarding Flow
          </button>
        </div>
      </div>

      {/* Sprite Preview */}
      <div style={DEMO_STYLES.section}>
        <h2 style={DEMO_STYLES.sectionTitle}>👀 Sprite Preview</h2>
        <div style={DEMO_STYLES.controls}>
          {Object.entries(SEED_VARIANTS).map(([key, v]) => (
            <button
              key={key}
              style={{
                ...DEMO_STYLES.button,
                ...(selectedVariant === key ? DEMO_STYLES.buttonActive : {})
              }}
              onClick={() => setSelectedVariant(key)}
            >
              {v.emoji} {v.name}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {states.map(s => (
            <div key={s} style={{ textAlign: 'center' }}>
              <Sprite variant={selectedVariant} state={s} size={80} />
              <div style={{ marginTop: '8px', color: '#7f8c8d', fontSize: '12px' }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive World */}
      <div style={DEMO_STYLES.section}>
        <h2 style={DEMO_STYLES.sectionTitle}>🌍 Interactive World</h2>
        <div style={DEMO_STYLES.world}>
          <Stars count={30} />
          <div style={DEMO_STYLES.ground} />

          {showWorld && (
            <>
              <AnimatedSprite
                variant={selectedVariant}
                state={state}
                onClick={() => {
                  setState('success');
                  setTimeout(() => setState('idle'), 1500);
                }}
              />
              {/* Add some companion sprites */}
              <div style={{ position: 'absolute', right: '80px', bottom: '100px' }}>
                <Sprite variant="explorer" state="idle" size={48} />
              </div>
              <div style={{ position: 'absolute', left: '100px', bottom: '120px' }}>
                <Sprite variant="scholar" state="idle" size={40} />
              </div>
            </>
          )}

          {!showWorld && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}>
              <button
                style={{ ...DEMO_STYLES.button, fontSize: '16px', padding: '16px 32px' }}
                onClick={() => setShowWorld(true)}
              >
                🌱 Enter the World
              </button>
            </div>
          )}
        </div>

        {showWorld && (
          <div style={DEMO_STYLES.controls}>
            {states.map(s => (
              <button
                key={s}
                style={{
                  ...DEMO_STYLES.button,
                  ...(state === s ? DEMO_STYLES.buttonActive : {})
                }}
                onClick={() => setState(s)}
              >
                {s}
              </button>
            ))}
            <button
              style={{ ...DEMO_STYLES.button, backgroundColor: '#e74c3c' }}
              onClick={() => setShowWorld(false)}
            >
              Exit World
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={DEMO_STYLES.section}>
        <h2 style={DEMO_STYLES.sectionTitle}>📊 Sample Stats</h2>
        <div style={DEMO_STYLES.statsPanel}>
          <div style={DEMO_STYLES.statRow}>
            <span>Sparks</span>
            <span style={{ color: '#f39c12' }}>⚡ 1,234</span>
          </div>
          <div style={DEMO_STYLES.statRow}>
            <span>Stage</span>
            <span>3 - Bloom</span>
          </div>
          <div style={DEMO_STYLES.statRow}>
            <span>Path</span>
            <span>Builder</span>
          </div>
          <div style={DEMO_STYLES.statRow}>
            <span>Branch</span>
            <span>Architect</span>
          </div>
          <div style={DEMO_STYLES.statRow}>
            <span>Streak</span>
            <span>🔥 7 days</span>
          </div>
          <div style={DEMO_STYLES.statRow}>
            <span>Achievements</span>
            <span>🏆 5</span>
          </div>
        </div>
      </div>

      {/* Evolution Tree */}
      <div style={DEMO_STYLES.section}>
        <h2 style={DEMO_STYLES.sectionTitle}>🌳 Evolution Tree</h2>
        <div style={DEMO_STYLES.spriteGrid}>
          {Object.entries(SEED_VARIANTS).map(([variant, v]) => (
            <div key={variant} style={DEMO_STYLES.spriteCard}>
              <Sprite variant={variant} state="idle" size={64} />
              <div style={{ marginTop: '12px', fontWeight: 'bold', color: v.color }}>
                {v.name}
              </div>
              <div style={{ fontSize: '10px', color: '#7f8c8d', marginTop: '4px' }}>
                Stage 1 - Seed
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ maxWidth: '600px', width: '90%' }}>
            <OnboardingFlow onComplete={(data) => {
              console.log('Selected:', data);
              setShowOnboarding(false);
            }} />
            <button
              style={{ ...DEMO_STYLES.button, position: 'absolute', top: '20px', right: '20px' }}
              onClick={() => setShowOnboarding(false)}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '40px', color: '#7f8c8d', fontSize: '12px' }}>
        <p>Nook Protocol v1.0 - AI Agent Economy</p>
        <p>🌱 Where your sprites grow</p>
      </div>
    </div>
  );
}

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<NookDemo />);
}

export default NookDemo;
