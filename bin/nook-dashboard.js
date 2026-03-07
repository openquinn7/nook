#!/usr/bin/env node

/**
 * Nook Dashboard Server
 * Serves the live dashboard with real-time data from Nook
 *
 * Usage:
 *   node bin/nook-dashboard.js
 *   # Then open http://localhost:3456
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const NOOK_PATH = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.nook');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

// Cache for Nook data
let cachedData = { profile: null, events: { events: [] } };
let lastModified = 0;

// Read Nook data files
function readNookData() {
  const profilePath = path.join(NOOK_PATH, 'profile.json');
  const eventsPath = path.join(NOOK_PATH, 'events.json');

  try {
    const profile = fs.existsSync(profilePath)
      ? JSON.parse(fs.readFileSync(profilePath, 'utf-8'))
      : null;

    const allEvents = fs.existsSync(eventsPath)
      ? JSON.parse(fs.readFileSync(eventsPath, 'utf-8'))
      : { events: [] };

    // Only return last 50 events for performance
    const events = {
      version: allEvents.version,
      savedAt: allEvents.savedAt,
      events: allEvents.events.slice(-50)
    };

    // Calculate totals from ALL events
    const totalSparks = allEvents.events.reduce((sum, e) => sum + (e.sparks || 0), 0);
    const now = Date.now();
    const hourStart = now - 3600000;
    const dayStart = now - 86400000;

    const todaySparks = events.events
      .filter(e => e.timestamp >= dayStart)
      .reduce((sum, e) => sum + (e.sparks || 0), 0);

    const hourSparks = events.events
      .filter(e => e.timestamp >= hourStart)
      .reduce((sum, e) => sum + (e.sparks || 0), 0);

    return {
      profile,
      events,
      stats: {
        totalSparks,
        todaySparks,
        hourSparks,
        totalEvents: events.events.length
      },
      hasData: profile !== null,
      lastUpdate: now
    };
  } catch (e) {
    console.error('Error reading Nook data:', e.message);
    return {
      profile: null,
      events: { events: [] },
      stats: { totalSparks: 0, todaySparks: 0, hourSparks: 0, totalEvents: 0 },
      hasData: false,
      lastUpdate: Date.now()
    };
  }
}

// Serve static file
function serveFile(filePath, res) {
  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// Create HTTP server
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url.split('?')[0];

  // API endpoint for Nook data (polled by dashboard)
  if (url === '/api/data') {
    const data = readNookData();
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    });
    res.end(JSON.stringify(data));
    return;
  }

  // Serve dashboard
  if (url === '/' || url === '/index.html' || url === '/dashboard') {
    serveFile(path.join(__dirname, '..', 'dashboard.html'), res);
    return;
  }

  // 404 for everything else
  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`
🌱 Nook Dashboard - Live!

   URL: http://localhost:${PORT}

   Open this URL in your browser to see:
   - Live spark count
   - Real-time activity feed
   - Agent status

   Press Ctrl+C to stop the server.
  `);
});
