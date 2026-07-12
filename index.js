const express = require('express');
const path = require('path');
const app = express();
__path = process.cwd();
const bodyParser = require("body-parser");

// The seal is broken on port 10000 (Optimized for Render free-tier stability)
const PORT = process.env.PORT || 10000; 
const { 
  qrRoute,
  pairRoute
} = require('./routes');

// Granting the server infinite stamina to endure heavy traffic spikes
require('events').EventEmitter.defaultMaxListeners = 2000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Intercepting core communication lines
app.use('/qr', qrRoute);
app.use('/code', pairRoute);

app.get('/pair', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pair.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Outward dimensional rifts (Redirect routes)
app.get('/pairing', (req, res) => {
  res.redirect('https://github.com/Casper-Tech-ke/pairing');
});

app.get('/projects', (req, res) => {
  res.redirect('https://xcasper.space');
});

// Vitality link monitoring
app.get('/health', (req, res) => {
    res.json({
        status: 200,
        success: true,
        realm: 'MLTN-MD CORE ENGINE',
        condition: 'PERFECT_STANDBY',
        timestamp: new Date().toISOString()
    });
});

// Awakening the system
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  🔮 [THE SEALS ARE BROKEN] 🔮
  =============================================================
   "Do you truly believe you can control this power...?"
  =============================================================
   ⚡ SYSTEM:  MLTN-MD Pairing Interface Awake
   🌌 REALM:   Listening cleanly on Port: ${PORT}
   🩸 STATUS:  The shadow matrix has initialized perfectly.
  =============================================================
  [Waiting for a user to link their soul to the device matrix...]
    `);
});

module.exports = app;
