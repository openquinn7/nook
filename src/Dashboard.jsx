/**
 * Nook Dashboard
 * Basic dashboard for viewing agent activity and sparks
 */

import React, { useState, useEffect } from 'react';
import { Sprite } from './sprite-renderer';
import { SparkEngine } from './spark-engine';
import { AchievementSystem, ACHIEVEMENT_TIERS } from './achievements';
import { OnboardingFlow } from './OnboardingFlow';
import { STAGE_2_PATHS, STAGE_3_SUB_BRANCHES, STAGE_4_APEX_FORMS, EVOLUTION_THRESHOLDS } from './sprites';

const DASHBOARD_STYLES = {
  container: {
    fontFamily: 'system-ui, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sparkCount: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#f39c12'
  },
  stat: {
    display: 'flex',
    gap: '16px',
    marginTop: '12px'
  },
  statItem: {
    flex: 1,
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  statLabel: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '4px'
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    transition: 'width 0.3s ease'
  },
  eventList: {
    maxHeight: '300px',
    overflowY: 'auto'
  },
  eventItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #ecf0f1',
    gap: '12px'
  },
  eventIcon: {
    fontSize: '20px'
  },
  eventText: {
    flex: 1
  },
  eventTime: {
    fontSize: '12px',
    color: '#7f8c8d'
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  achievementItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '8px',
    gap: '12px'
  },
  achievementIcon: {
    fontSize: '24px'
  },
  achievementInfo: {
    flex: 1
  },
  achievementName: {
    fontWeight: 'bold',
    fontSize: '14px'
  },
  achievementDesc: {
    fontSize: '12px',
    color: '#7f8c8d'
  },
  streakBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    borderRadius: '20px',
    fontWeight: 'bold'
  },
  chestItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '8px'
  }
};

export function NookDashboard({ sparkEngine, profile, achievementSystem }) {
  const [events, setEvents] = useState([]);
  const [sparks, setSparks] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState({ current: 0, best: 0 });
  const [chests, setChests] = useState([]);
  const [showEvolutionChoice, setShowEvolutionChoice] = useState(false);
  const [evolutionType, setEvolutionType] = useState(null); // 'path', 'subBranch', 'apexForm'

  useEffect(() => {
    if (sparkEngine) {
      setEvents(sparkEngine.getEvents().slice(-20).reverse());
      setSparks(sparkEngine.getBalance());
    }
    if (achievementSystem) {
      setAchievements(achievementSystem.getUnlockedAchievements());
      setStreak(achievementSystem.getStreak());
      setChests(achievementSystem.getChests());
    }
  }, [sparkEngine, achievementSystem]);

  const getNextEvolution = (currentSparks) => {
    const thresholds = [
      { stage: 2, sparks: 500 },
      { stage: 3, sparks: 2500 },
      { stage: 4, sparks: 10000 }
    ];

    for (const threshold of thresholds) {
      if (currentSparks < threshold.sparks) {
        return threshold;
      }
    }
    return null;
  };

  const nextEvolution = getNextEvolution(sparks);
  const progress = nextEvolution
    ? (sparks / nextEvolution.sparks) * 100
    : 100;

  const getEventIcon = (type) => {
    switch (type) {
      case 'agent.started': return '🚀';
      case 'agent.completed': return '✅';
      case 'agent.failed': return '❌';
      case 'agent.idle': return '💤';
      default: return '📝';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Show onboarding if no profile exists
  if (!profile) {
    return <OnboardingFlow onComplete={(data) => {
      // In real app, save to storage and update parent
      console.log('Onboarding complete:', data);
    }} />;
  }

  return (
    <div style={DASHBOARD_STYLES.container}>
      {/* Header */}
      <div style={DASHBOARD_STYLES.card}>
        <div style={DASHBOARD_STYLES.header}>
          <h1 style={{ margin: 0 }}>Nook Dashboard</h1>
          <Sprite variant={profile?.sprite?.variant || 'worker'} state="idle" size={64} />
        </div>

        {/* Spark Count */}
        <div style={{ textAlign: 'center' }}>
          <div style={DASHBOARD_STYLES.sparkCount}>⚡ {sparks}</div>
          <div style={{ color: '#7f8c8d' }}>Total Sparks</div>
        </div>

        {/* Stats */}
        <div style={DASHBOARD_STYLES.stat}>
          <div style={DASHBOARD_STYLES.statItem}>
            <div style={DASHBOARD_STYLES.statValue}>{events.length}</div>
            <div style={DASHBOARD_STYLES.statLabel}>Events</div>
          </div>
          <div style={DASHBOARD_STYLES.statItem}>
            <div style={DASHBOARD_STYLES.statValue}>{profile?.stage || 1}</div>
            <div style={DASHBOARD_STYLES.statLabel}>Stage</div>
          </div>
          <div style={DASHBOARD_STYLES.statItem}>
            <div style={DASHBOARD_STYLES.statValue}>{profile?.path || '-'}</div>
            <div style={DASHBOARD_STYLES.statLabel}>Path</div>
          </div>
          <div style={DASHBOARD_STYLES.statItem}>
            <div style={DASHBOARD_STYLES.statValue}>{profile?.subBranch || '-'}</div>
            <div style={DASHBOARD_STYLES.statLabel}>Branch</div>
          </div>
          <div style={DASHBOARD_STYLES.statItem}>
            <div style={DASHBOARD_STYLES.statValue}>{profile?.apexForm || '-'}</div>
            <div style={DASHBOARD_STYLES.statLabel}>Apex</div>
          </div>
        </div>

        {/* Progress to next evolution */}
        {nextEvolution && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>Progress to Stage {nextEvolution.stage}</span>
              <span>{nextEvolution.sparks - sparks} sparks needed</span>
            </div>
            <div style={DASHBOARD_STYLES.progressBar}>
              <div style={{ ...DASHBOARD_STYLES.progressFill, width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Evolution Choice (when eligible) */}
      {profile?.stage >= 2 && sparks >= (profile?.stage === 2 ? 500 : profile?.stage === 3 ? 2500 : 10000) && !showEvolutionChoice && (
        <div style={DASHBOARD_STYLES.card}>
          <h3 style={{ marginTop: 0, color: '#f39c12' }}>🌟 Evolution Available!</h3>
          <p>Your sprite is ready to evolve to Stage {profile?.stage + 1}!</p>
          <button
            onClick={() => {
              if (profile?.stage === 2 && !profile?.path) setShowEvolutionChoice(true);
              else if (profile?.stage === 3 && !profile?.subBranch) setShowEvolutionChoice(true);
              else if (profile?.stage === 4 && !profile?.apexForm) setShowEvolutionChoice(true);
            }}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#f39c12',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Choose Evolution →
          </button>
        </div>
      )}

      {/* Evolution Choice Modal */}
      {showEvolutionChoice && (
        <div style={{
          ...DASHBOARD_STYLES.card,
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          maxWidth: '600px',
          width: '90%'
        }}>
          <h3 style={{ marginTop: 0 }}>
            {profile?.stage === 2 && 'Choose Your Path'}
            {profile?.stage === 3 && 'Choose Your Sub-Branch'}
            {profile?.stage === 4 && 'Choose Your Apex Form'}
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '20px' }}>
            {profile?.stage === 2 && Object.entries(STAGE_2_PATHS[profile?.sprite?.variant] || {}).map(([key, data]) => (
              <div
                key={key}
                onClick={() => {
                  // In real app, call sprite.choosePath(key)
                  console.log('Chose path:', key);
                  setShowEvolutionChoice(false);
                }}
                style={{
                  flex: '1 1 150px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{data.description}</div>
              </div>
            ))}
            {profile?.stage === 3 && Object.entries(STAGE_3_SUB_BRANCHES[profile?.sprite?.variant]?.[profile?.path] || {}).map(([key, data]) => (
              <div
                key={key}
                onClick={() => {
                  console.log('Chose sub-branch:', key);
                  setShowEvolutionChoice(false);
                }}
                style={{
                  flex: '1 1 150px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{data.description}</div>
              </div>
            ))}
            {profile?.stage === 4 && Object.entries(STAGE_4_APEX_FORMS[profile?.sprite?.variant] || {}).map(([key, data]) => (
              <div
                key={key}
                onClick={() => {
                  console.log('Chose apex form:', key);
                  setShowEvolutionChoice(false);
                }}
                style={{
                  flex: '1 1 150px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{data.emoji}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{data.name}</div>
                <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{data.description}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowEvolutionChoice(false)}
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              backgroundColor: '#7f8c8d',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Recent Events */}
      <div style={DASHBOARD_STYLES.card}>
        <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
        <div style={DASHBOARD_STYLES.eventList}>
          {events.map((eventItem, index) => (
            <div key={index} style={DASHBOARD_STYLES.eventItem}>
              <span style={DASHBOARD_STYLES.eventIcon}>
                {getEventIcon(eventItem.event.type)}
              </span>
              <div style={DASHBOARD_STYLES.eventText}>
                <div>{eventItem.event.type.replace('agent.', '')}</div>
                {eventItem.event.workUnitId && (
                  <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                    {eventItem.event.workUnitId}
                  </div>
                )}
              </div>
              <div style={DASHBOARD_STYLES.eventTime}>
                {formatTime(eventItem.timestamp)}
              </div>
              <div style={{ color: '#f39c12', fontWeight: 'bold' }}>
                +{eventItem.sparks}
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#7f8c8d' }}>
              No activity yet. Start your agent!
            </div>
          )}
        </div>
      </div>

      {/* Streak & Achievements */}
      {(achievementSystem || streak.current > 0 || achievements.length > 0) && (
        <div style={DASHBOARD_STYLES.card}>
          <h3 style={{ marginTop: 0 }}>Progress</h3>

          {/* Streak */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold' }}>Daily Streak</span>
              <span style={DASHBOARD_STYLES.streakBadge}>
                🔥 {streak.current} days
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
              Best: {streak.best} days
            </div>
          </div>

          {/* Unlocked Chests */}
          {chests.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ marginBottom: '10px' }}>Unlocked Chests</h4>
              {chests.map((chest, index) => (
                <div key={index} style={DASHBOARD_STYLES.chestItem}>
                  <span>📦 {chest.name}</span>
                  <button
                    onClick={() => achievementSystem?.claimChest(index)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#3498db',
                      color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          <div>
            <h4 style={{ marginBottom: '10px' }}>Achievements ({achievements.length})</h4>
            {achievements.length === 0 ? (
              <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>
                No achievements yet. Keep working to unlock them!
              </div>
            ) : (
              achievements.map((achievement, index) => (
                <div
                  key={index}
                  style={{
                    ...DASHBOARD_STYLES.achievementItem,
                    backgroundColor: ACHIEVEMENT_TIERS[achievement.tier]?.color + '20' || '#f8f9fa'
                  }}
                >
                  <span style={DASHBOARD_STYLES.achievementIcon}>🏆</span>
                  <div style={DASHBOARD_STYLES.achievementInfo}>
                    <div style={DASHBOARD_STYLES.achievementName}>
                      {achievement.name}
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          backgroundColor: ACHIEVEMENT_TIERS[achievement.tier]?.color || '#95a5a6',
                          color: '#fff'
                        }}
                      >
                        {achievement.tier}
                      </span>
                    </div>
                    <div style={DASHBOARD_STYLES.achievementDesc}>{achievement.description}</div>
                  </div>
                  <div style={{ color: '#f39c12', fontWeight: 'bold', fontSize: '14px' }}>
                    +{achievement.sparkReward}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NookDashboard;
