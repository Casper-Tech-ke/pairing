# CASPER XD ULTRA - Session Generator

## Overview
WhatsApp bot session generator web application by TRABY CASPER. Provides pair code and QR code methods for connecting WhatsApp accounts.

## Project Structure
- `index.js` - Express server entry point (port 5000)
- `routes/pair.js` - Pair code session generation route
- `routes/qr.js` - QR code session generation route
- `routes/index.js` - Route exports
- `lib/index.js` - Utility functions (casperId, removeFile, generateRandomCode)
- `public/index.html` - Main landing page
- `public/pair.html` - Pair code page
- `app.json` - App configuration
- `deploy/cpanel.yml` - cPanel deployment config
- `SECURITY.md` - Security and usage policy

## Key Dependencies
- @whiskeysockets/baileys (as baileys) - WhatsApp Web API
- gifted-btns - Button message helper (npm package, name unchanged)
- express - Web server
- qrcode - QR code generation
- pino - Logging

## Social Links
- GitHub: Casper-Tech-ke/CASPER-XD-ULTRA
- Telegram: @casper_tech_ke
- WhatsApp Channels:
  - https://whatsapp.com/channel/0029VbCK8vlKwqSSkFkC1l2k
  - https://whatsapp.com/channel/0029Vb6XJQQHrDZi1RzKu90t

## Recent Changes
- 2026-02-21: Moved all files from session/ subdirectory to root
- 2026-02-21: Renamed all "gifted" function/variable names to "casper" equivalents
- 2026-02-21: Updated author to TRABY CASPER, bot name to Casper XD Ultra
- 2026-02-21: Added SECURITY.md with forking/credit policy
- 2026-02-21: Updated all social links (GitHub, Telegram, WhatsApp channels)
- 2026-02-21: Added SVG logo replacing external image links
- 2026-02-21: Prevented reconnection after successful session pairing
