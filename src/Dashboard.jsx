/**
 * Nook Dashboard
 * Basic dashboard for viewing agent activity and sparks
 */

import React, { useState, useEffect } from 'react';
import { Sprite } from './sprite-renderer';
import { SparkEngine } from './spark-engine';

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
  }
};

export function NookDashboard({ sparkEngine, profile }) {
  const [events, setEvents] = useState([]);
  const [sparks, setSparks] = useState(0);

  useEffect(() => {
    if (sparkEngine) {
      setEvents(sparkEngine.getEvents().slice(-20).reverse());
      setSparks(sparkEngine.getBalance());
    }
  }, [sparkEngine]);

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
    </div>
  );
}

export default NookDashboard;
