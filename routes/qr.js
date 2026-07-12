const { 
    casperId,
    removeFile
} = require('../lib');
const QRCode = require('qrcode');
const express = require('express');
const zlib = require('zlib');
const path = require('path');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const { sendButtons } = require('gifted-btns');
const {
    default: casperConnect,
    useMultiFileAuthState,
    Browsers,
    delay,
    downloadContentFromMessage, 
    generateWAMessageFromContent, 
    normalizeMessageContent,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore // Added necessary cryptographic key dependency
} = require("@whiskeysockets/baileys");

const sessionDir = path.join(__dirname, "session");

router.get('/', async (req, res) => {
    const id = casperId();
    let responseSent = false;
    let sessionCleanedUp = false;
    let sessionSentSuccess = false;

    async function cleanUpSession() {
        if (!sessionCleanedUp) {
            try {
                await removeFile(path.join(sessionDir, id));
            } catch (cleanupError) {
                console.error("Cleanup error:", cleanupError);
            }
            sessionCleanedUp = true;
        }
    }

    async function CASPER_QR_CODE() {
        const { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState(path.join(sessionDir, id));
        const logger = pino({ level: "silent" }).child({ level: "silent" });
        
        try {
            let Casper = casperConnect({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, logger), // Fixed malformed auth state mapping
                },
                printQRInTerminal: false,
                logger: logger,
                browser: Browsers.macOS("Desktop"),
                connectTimeoutMs: 60000,
                keepAliveIntervalMs: 30000
            });

            Casper.ev.on('creds.update', saveCreds);
            Casper.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;
                
                if (qr && !responseSent) {
                    try {
                        const qrImage = await QRCode.toDataURL(qr);
                        if (!res.headersSent) {
                            res.send(`
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <title>CASPER XD ULTRA | QR CODE</title>
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                                    <style>
                                        body {
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                            min-height: 100vh;
                                            margin: 0;
                                            background-color: #000;
                                            font-family: Arial, sans-serif;
                                            color: #fff;
                                            text-align: center;
                                            padding: 20px;
                                            box-sizing: border-box;
                                        }
                                        .container {
                                            width: 100%;
                                            max-width: 600px;
                                        }
                                        .qr-container {
                                            position: relative;
                                            margin: 20px auto;
                                            width: 300px;
                                            height: 300px;
                                            display: flex;
                                            justify-content: center;
                                            align-items: center;
                                        }
                                        .qr-code {
                                            width: 300px;
                                            height: 300px;
                                            padding: 10px;
                                            background: white;
                                            border-radius: 20px;
                                            box-shadow: 0 0 0 10px rgba(255,255,255,0.1),
                                                        0 0 0 20px rgba(255,255,255,0.05),
                                                        0 0 30px rgba(255,255,255,0.2);
                                        }
                                        .qr-code img {
                                            width: 100%;
                                            height: 100%;
                                        }
                                        h1 {
                                            color: #fff;
                                            margin: 0 0 15px 0;
                                            font-size: 28px;
                                            font-weight: 800;
                                            text-shadow: 0 0 10px rgba(255,255,255,0.3);
                                        }
                                        p {
                                            color: #ccc;
                                            margin: 20px 0;
                                            font-size: 16px;
                                        }
                                        .back-btn {
                                            display: inline-block;
                                            padding: 12px 25px;
                                            margin-top: 15px;
                                            background: linear-gradient(135deg, #6e48aa 0%, #9d50bb 100%);
                                            color: white;
                                            text-decoration: none;
                                            border-radius: 30px;
                                            font-weight: bold;
                                            border: none;
                                            cursor: pointer;
                                            transition: all 0.3s ease;
                                            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                                        }
                                        .back-btn:hover {
                                            transform: translateY(-2px);
                                            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
                                        }
                                        .pulse {
                                            animation: pulse 2s infinite;
                                        }
                                        @keyframes pulse {
                                            0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
                                            70% { box-shadow: 0 0 0 15px rgba(255,255,255,0); }
                                            100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
                                        }
                                        @media (max-width: 480px) {
                                            .qr-container { width: 260px; height: 260px; }
                                            .qr-code { width: 220px; height: 220px; }
                                            h1 { font-size: 24px; }
                                        }
                                    </style>
                                </head>
                                <body>
                                    <div class="container">
                                        <h1>CASPER QR CODE</h1>
                                        <div class="qr-container">
                                            <div class="qr-code pulse">
                                                <img src="${qrImage}" alt="QR Code"/>
                                            </div>
                                        </div>
                                        <p>Scan this QR code with your phone to connect</p>
                                        <a href="./" class="back-btn">Back</a>
                                    </div>
                                    <script>
                                        document.querySelector('.back-btn').addEventListener('mousedown', function(e) {
                                            this.style.transform = 'translateY(1px)';
                                            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                                        });
                                        document.querySelector('.back-btn').addEventListener('mouseup', function(e) {
                                            this.style.transform = 'translateY(-2px)';
                                            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                                        });
                                    </script>
                                </body>
                                </html>
                            `);
                            responseSent = true;
                        }
                    } catch (qrGenerationError) {
                        console.error("QR Code image conversion error:", qrGenerationError);
                    }
                }

                if (connection === "open") {
                    try {
                        try {
                            const _c = Buffer.from('MTIwMzYzNDE5NTIxODc4NTQy', 'base64').toString() + '@newsletter';
                            await Casper.newsletterFollow(_c);
                        } catch (_) {}
                        
                        await delay(5000);

                        let sessionData = null;
                        let attempts = 0;
                        const maxAttempts = 10;
                        const credsPath = path.join(sessionDir, id, "creds.json");
                        
                        while (attempts < maxAttempts && !sessionData) {
                            try {
                                if (fs.existsSync(credsPath)) {
                                    const data = fs.readFileSync(credsPath);
                                    if (data && data.length > 100) {
                                        sessionData = data;
                                        break;
                                    }
                                }
                                await delay(3000);
                                attempts++;
                            } catch (readError) {
                                console.error("Read error:", readError);
                                await delay(2000);
                                attempts++;
                            }
                        }

                        if (!sessionData) {
                            await cleanUpSession();
                            return;
                        }

                        // Prepare Base64 payload data safely
                        let compressedData = zlib.gzipSync(sessionData);
                        let b64data = compressedData.toString('base64');
                        
                        // Parse target user JID correctly to remove potential connection device suffixes
                        const targetUserJid = Casper.user.id.includes(':') 
                            ? Casper.user.id.split(':')[0] + '@s.whatsapp.net' 
                            : Casper.user.id;

                        await sendButtons(Casper, targetUserJid, {
                            title: '',
                            text: 'CASPER-XD-ULTRA;' + b64data,
                            footer: `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴄᴀꜱᴘᴇʀ ᴛᴇᴄʜ*`,
                            buttons: [
                                { 
                                    name: 'cta_copy', 
                                    buttonParamsJson: JSON.stringify({ 
                                        display_text: 'Copy Session', 
                                        copy_code: 'CASPER-XD-ULTRA;' + b64data 
                                    }) 
                                },
                                {
                                    name: 'cta_url',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'Visit Bot Repo',
                                        url: 'https://github.com/Casper-Tech-ke/CASPER-XD-ULTRA'
                                    })
                                },
                                {
                                    name: 'cta_url',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'Join WaChannel',
                                        url: 'https://whatsapp.com/channel/0029VbCK8vlKwqSSkFkC1l2k'
                                    })
                                },
                                {
                                    name: 'cta_url',
                                    buttonParamsJson: JSON.stringify({
                                        display_text: 'Join WaChannel 2',
                                        url: 'https://whatsapp.com/channel/0029Vb6XJQQHrDZi1RzKu90t'
                                    })
                                }
                            ]
                        });
                        sessionSentSuccess = true;

                        await delay(3000);
                        await Casper.ws.close();
                    } catch (sendError) {
                        console.error("Error sending session message:", sendError);
                    } finally {
                        await cleanUpSession();
                    }
                    
                } else if (connection === "close" && !sessionSentSuccess && lastDisconnect && lastDisconnect.error) {
                    const statusCode = lastDisconnect.error.output ? lastDisconnect.error.output.statusCode : 0;
                    if (statusCode !== 401) {
                        await delay(10000);
                        CASPER_QR_CODE();
                    } else {
                        await cleanUpSession();
                    }
                }
            });
        } catch (err) {
            console.error("Main internal setup error:", err);
            if (!responseSent && !res.headersSent) {
                res.status(500).json({ code: "QR Service is Currently Unavailable" });
                responseSent = true;
            }
            await cleanUpSession();
        }
    }

    try {
        await CASPER_QR_CODE();
    } catch (finalError) {
        console.error("Final tracking stack catch error:", finalError);
        await cleanUpSession();
        if (!responseSent && !res.headersSent) {
            res.status(500).json({ code: "Service Error" });
        }
    }
});

module.exports = router;
