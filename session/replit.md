# Gifted-MD Session

## Overview
A WhatsApp bot session pairing service built with Node.js and Express. Allows users to pair their WhatsApp account via pair code or QR code for the Gifted-MD WhatsApp bot.

## Project Architecture
- **Runtime**: Node.js 20 (CommonJS)
- **Framework**: Express.js
- **Port**: 5000 (bound to 0.0.0.0)
- **Key Dependencies**: @whiskeysockets/baileys (WhatsApp Web API), qrcode, pino

## Project Structure
```
index.js          - Main Express server entry point
routes/
  index.js        - Route exports
  pair.js         - Pair code route handler
  qr.js           - QR code route handler
gift/
  index.js        - Utility functions (ID generation, file cleanup)
public/
  index.html      - Landing page
  pair.html       - Pair code page
```

## Recent Changes
- 2026-02-20: Initial Replit setup
  - Changed port from 50900 to 5000
  - Bound server to 0.0.0.0 for Replit compatibility
  - Replaced pm2 start script with direct node execution
