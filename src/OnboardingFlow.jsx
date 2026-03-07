/**
 * Nook Onboarding Flow
 * New user sprite selection and initialization
 */

import React, { useState } from 'react';
import { SEED_VARIANTS } from './sprites';

const ONBOARDING_STYLES = {
  container: {
    fontFamily: 'system-ui, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px'
  },
  title: {
    fontSize: '48px',
    marginBottom: '8px',
    background: 'linear-gradient(135deg, #f39c12, #e74c3c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '18px',
    color: '#7f8c8d'
  },
  cardsContainer: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '900px'
  },
  card: {
    backgroundColor: '#16213e',
    borderRadius: '16px',
    padding: '32px',
    width: '220px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '3px solid transparent'
  },
  cardSelected: {
    border: '3px solid #f39c12',
    transform: 'scale(1.05)'
  },
  cardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
  },
  emoji: {
    fontSize: '64px',
    marginBottom: '16px',
    display: 'block'
  },
  variantName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  description: {
    fontSize: '14px',
    color: '#bdc3c7',
    marginBottom: '16px'
  },
  traits: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  trait: {
    fontSize: '12px',
    padding: '4px 8px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    color: '#95a5a6'
  },
  stats: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '4px'
  },
  statLabel: {
    color: '#7f8c8d'
  },
  statValue: {
    fontWeight: 'bold'
  },
  button: {
    marginTop: '40px',
    padding: '16px 48px',
    fontSize: '18px',
    fontWeight: 'bold',
    backgroundColor: '#f39c12',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  buttonDisabled: {
    backgroundColor: '#7f8c8d',
    cursor: 'not-allowed'
  },
  progressDots: {
    display: 'flex',
    gap: '8px',
    marginTop: '40px'
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#7f8c8d'
  },
  dotActive: {
    backgroundColor: '#f39c12'
  }
};

export function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const variants = Object.entries(SEED_VARIANTS);

  const handleSelect = (variant) => {
    setSelectedVariant(variant);
  };

  const handleContinue = () => {
    if (step === 0 && selectedVariant) {
      setStep(1);
    } else if (step === 1) {
      onComplete?.({
        variant: selectedVariant,
        stage: 1,
        xp: 0,
        path: null,
        cosmetics: {
          hat: null,
          outfit: null,
          accessory: null,
          background: null,
          trail: null
        }
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div style={ONBOARDING_STYLES.container}>
      {/* Header */}
      <div style={ONBOARDING_STYLES.header}>
        <h1 style={ONBOARDING_STYLES.title}>🌱 Welcome to Nook</h1>
        <p style={ONBOARDING_STYLES.subtitle}>
          {step === 0
            ? 'Choose your seed companion'
            : `You've chosen ${SEED_VARIANTS[selectedVariant]?.name}! Ready to begin?`}
        </p>
      </div>

      {/* Step 0: Choose Seed */}
      {step === 0 && (
        <div style={ONBOARDING_STYLES.cardsContainer}>
          {variants.map(([key, variant]) => (
            <div
              key={key}
              style={{
                ...ONBOARDING_STYLES.card,
                ...(selectedVariant === key ? ONBOARDING_STYLES.cardSelected : {}),
                ...(hoveredCard === key ? ONBOARDING_STYLES.cardHover : {})
              }}
              onClick={() => handleSelect(key)}
              onMouseEnter={() => setHoveredCard(key)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <span style={ONBOARDING_STYLES.emoji}>{variant.emoji}</span>
              <div style={{ ...ONBOARDING_STYLES.variantName, color: variant.color }}>
                {variant.name}
              </div>
              <div style={ONBOARDING_STYLES.description}>{variant.description}</div>
              <div style={ONBOARDING_STYLES.traits}>
                {variant.traits.map(trait => (
                  <span key={trait} style={ONBOARDING_STYLES.trait}>{trait}</span>
                ))}
              </div>
              <div style={ONBOARDING_STYLES.stats}>
                {Object.entries(variant.baseStats).map(([stat, value]) => (
                  <div key={stat} style={ONBOARDING_STYLES.statRow}>
                    <span style={ONBOARDING_STYLES.statLabel}>{stat}</span>
                    <span style={{ ...ONBOARDING_STYLES.statValue, color: variant.color }}>
                      {value}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Confirmation */}
      {step === 1 && selectedVariant && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '120px',
            marginBottom: '24px',
            animation: 'bounce 1s ease infinite'
          }}>
            {SEED_VARIANTS[selectedVariant].emoji}
          </div>
          <h2 style={{ fontSize: '32px', marginBottom: '16px', color: SEED_VARIANTS[selectedVariant].color }}>
            {SEED_VARIANTS[selectedVariant].name} Seed
          </h2>
          <p style={{ fontSize: '18px', color: '#bdc3c7', maxWidth: '400px', margin: '0 auto' }}>
            Your journey begins! Your {SEED_VARIANTS[selectedVariant].name} seed will earn sparks
            through work and grow through evolution.
          </p>
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ color: '#7f8c8d', marginBottom: '16px' }}>What to expect:</h3>
            <ul style={{ textAlign: 'left', color: '#bdc3c7', lineHeight: '2' }}>
              <li>⚡ Earn sparks for every task completed</li>
              <li>🌱 Evolve through 4 stages</li>
              <li>🎨 Unlock cosmetics and achievements</li>
              <li>🏆 Compete on leaderboards</li>
            </ul>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
        {step > 0 && (
          <button
            onClick={handleBack}
            style={{
              ...ONBOARDING_STYLES.button,
              backgroundColor: 'transparent',
              border: '2px solid #7f8c8d',
              color: '#fff'
            }}
          >
            ← Back
          </button>
        )}
        <button
          onClick={handleContinue}
          disabled={step === 0 && !selectedVariant}
          style={{
            ...ONBOARDING_STYLES.button,
            ...((step === 0 && !selectedVariant) ? ONBOARDING_STYLES.buttonDisabled : {})
          }}
        >
          {step === 0 ? 'Continue →' : "Let's Go! 🚀"}
        </button>
      </div>

      {/* Progress dots */}
      <div style={ONBOARDING_STYLES.progressDots}>
        {[0, 1].map(i => (
          <div
            key={i}
            style={{
              ...ONBOARDING_STYLES.dot,
              ...(step === i ? ONBOARDING_STYLES.dotActive : {})
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}

export default OnboardingFlow;
