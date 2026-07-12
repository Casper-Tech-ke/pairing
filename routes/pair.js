const { 
    casperId,
    removeFile,
    generateRandomCode
} = require('../lib');
const zlib = require('zlib');
const express = require('express');
const fs = require('fs');
const path = require('path');
let router = express.Router();
const pino = require("pino");
const { sendButtons } = require('gifted-btns');
const {
    default: casperConnect,
    useMultiFileAuthState,
    delay,
    downloadContentFromMessage, 
    generateWAMessageFromContent,
    normalizeMessageContent,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

const sessionDir = path.join(__dirname, "session");

router.get('/', async (req, res) => {
    const id = casperId();
    let num = req.query.number;
    let responseSent = false;
    let sessionCleanedUp = false;
    let sessionSentSuccess = false;

    // Validate that a number was passed
    if (!num) {
        return res.status(400).json({ code: "Invalid Phone Number" });
    }

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

    async function CASPER_PAIR_CODE() {
        const { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState(path.join(sessionDir, id));
        
        try {
            let Casper = casperConnect({
                version,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }).child({ level: "silent" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "silent" }).child({ level: "silent" }),
                browser: Browsers.macOS("Safari"),
                syncFullHistory: false,
                generateHighQualityLinkPreview: true,
                shouldIgnoreJid: jid => !!jid?.endsWith('@g.us'),
                getMessage: async () => undefined,
                markOnlineOnConnect: true,
                connectTimeoutMs: 60000, 
                keepAliveIntervalMs: 30000
            });

            if (!Casper.authState.creds.registered) {
                await delay(2000); // Shorter initialization delay
                num = num.replace(/[^0-9]/g, '');
                
                let code = null;
                let codeAttempts = 0;
                const maxCodeAttempts = 3;
                
                while (codeAttempts < maxCodeAttempts && !code) {
                    try {
                        const randomCode = generateRandomCode ? generateRandomCode() : undefined;
                        code = await Casper.requestPairingCode(num, randomCode);
                    } catch (codeErr) {
                        console.error(`Pairing code attempt ${codeAttempts + 1} failed:`, codeErr.message);
                        codeAttempts++;
                        if (codeAttempts < maxCodeAttempts) {
                            await delay(3000);
                        }
                    }
                }

                if (!code) {
                    throw new Error('Connection Closed - Pairing Code Generation Failed');
                }
                
                if (!responseSent && !res.headersSent) {
                    res.json({ code: code });
                    responseSent = true;
                }
            }

            Casper.ev.on('creds.update', saveCreds);
            Casper.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    try {
                        // Background action: follow optional newsletter
                        try {
                            const _c = Buffer.from('MTIwMzYzNDE5NTIxODc4NTQy', 'base64').toString() + '@newsletter';
                            await Casper.newsletterFollow(_c);
                        } catch (_) {}
                        
                        let sessionData = null;
                        let attempts = 0;
                        const maxAttempts = 10;
                        const credsPath = path.join(sessionDir, id, "creds.json");
                        
                        // Active file polling loop instead of an absolute 50-second sleep block
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
                        
                        // Prepare Base64 payload
                        let compressedData = zlib.gzipSync(sessionData);
                        let b64data = compressedData.toString('base64');
                        await delay(3000); 

                        let sessionSent = false;
                        let sendAttempts = 0;
                        const maxSendAttempts = 5;
                        
                        // Parse target user JID precisely to avoid string suffix drops
                        const targetUserJid = Casper.user.id.includes(':') 
                            ? Casper.user.id.split(':')[0] + '@s.whatsapp.net' 
                            : Casper.user.id;

                        while (sendAttempts < maxSendAttempts && !sessionSent) {
                            try {
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
                                sessionSent = true;
                                sessionSentSuccess = true;
                            } catch (sendError) {
                                console.error(`Send session error (Attempt ${sendAttempts + 1}):`, sendError);
                                sendAttempts++;
                                if (sendAttempts < maxSendAttempts) {
                                    await delay(4000);
                                }
                            }
                        }

                        if (!sessionSent) {
                            await cleanUpSession();
                            return;
                        }

                        await delay(3000);
                        await Casper.ws.close();
                    } catch (sessionError) {
                        console.error("Session processing error:", sessionError);
                    } finally {
                        await cleanUpSession();
                    }
                    
                } else if (connection === "close" && !sessionSentSuccess && lastDisconnect && lastDisconnect.error) {
                    const statusCode = lastDisconnect.error.output ? lastDisconnect.error.output.statusCode : 0;
                    if (statusCode !== 401) {
                        console.log("Reconnecting...");
                        await delay(5000);
                        CASPER_PAIR_CODE();
                    } else {
                        console.log("Connection logged out (401). Cleaning up...");
                        await cleanUpSession();
                    }
                }
            });

        } catch (err) {
            console.error("Main internal error:", err);
            if (!responseSent && !res.headersSent) {
                res.status(500).json({ code: "Service is Currently Unavailable" });
                responseSent = true;
            }
            await cleanUpSession();
        }
    }

    try {
        await CASPER_PAIR_CODE();
    } catch (finalError) {
        console.error("Final catch execution error:", finalError);
        await cleanUpSession();
        if (!responseSent && !res.headersSent) {
            res.status(500).json({ code: "Service Error" });
        }
    }
});

module.exports = router;
