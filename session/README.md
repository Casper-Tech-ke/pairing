# Gifted-Session-Generator
- Fork, Star and Edit as you wish
- Deploy to your favourite hosting server eg Heroku or Render or self hosting
- This is what I use in my **[Session Site](https://session.giftedtech.co.ke)** so don't ask for more...

<details>
<summary>SAMPLE USAGE IN BOT</summary>
   
```js
// 1. IN YOUR LIB OR SOMEWHERE YOU LIKE:
const fs = require('fs'),
      zlib = require('zlib');
      path = require('path'), 
      axios = require('axios'),
      sessionDir = path.join(__dirname, 'session'),
      credsPath = path.join(sessionDir, 'creds.json'),
      createDirIfNotExist = dir => !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

createDirIfNotExist(sessionDir);

async function loadSession() {
    try {
        if (fs.existsSync(sessionPath)) {
            fs.unlinkSync(sessionPath);
            console.log("♻️ ᴏʟᴅ ꜱᴇꜱꜱɪᴏɴ ʀᴇᴍᴏᴠᴇᴅ");
        }

        if (!config.SESSION_ID || typeof config.SESSION_ID !== 'string') {
            throw new Error("❌ SESSION_ID is missing or invalid");
        }

        const [header, b64data] = config.SESSION_ID.split('~');

        if (header !== "Gifted" || !b64data) {
            throw new Error("❌ Invalid session format. Expected 'Gifted~.....'");
        }

        const cleanB64 = b64data.replace('...', '');
        const compressedData = Buffer.from(cleanB64, 'base64');
        const decompressedData = zlib.gunzipSync(compressedData);

        if (!fs.existsSync(sessionDir)) {
            fs.mkdirSync(sessionDir, { recursive: true });
        }

        fs.writeFileSync(credsPath, decompressedData, "utf8");
        console.log("✅ ɴᴇᴡ ꜱᴇꜱꜱɪᴏɴ ʟᴏᴀᴅᴇᴅ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ");

    } catch (e) {
        console.error("❌ Session Error:", e.message);
        throw e;
    }
}

module.exports = { loadSession }


// 2. IN YOUR BOT START FILE(INDEX.JS/CLIENT.JS):
const { loadSession } = require("./lib");
// Other things....
async function ConnectGiftedToWA() {
  await loadSession();
console.log('⏱️ Conneting Gifted Md ⏱️')
const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/session/')
var { version, isLatest } = await fetchLatestBaileysVersion()

const Gifted = GiftedConnect({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: !config.SESSION_ID, // Continue your functions......


```

</details>

<details>
<summary>MORE INFO</summary>
   
<strong>NB:<strong/> This repo also generates session ID for all bots using gifted-baileys/whiskeysockets/baileys but with ***zlib*** comressor.
[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#table-of-contents)
<br/>WEB - PAIR CODE FOR BOTS WITH GIFTED-BAILEYS
[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#table-of-contents)
<p align="center">
   <a href="https://github.com/mauricegift">
    <img src="https://files.catbox.moe/52699c.jpg" width="500">
     
</a>
 <p align="center"><img src="https://profile-counter.glitch.me/{mauricegift}/count.svg" alt="Gifted:: Visitor's Count" /></p>

</details>



[`ℹ️Contact Owner`](https://api.giftedtech.co.ke/contact)
 <br>
<a href='https://github.com/mauricegift/gifted-session/fork' target="_blank">
    <img alt='FORK REPO' src='https://img.shields.io/badge/-FORK REPO-black?style=for-the-badge&logo=github&logoColor=white'/>
</a>



<details>
<summary>DEPLOYMENT</summary>
 
<a href='https://dashboard.heroku.com/new?template=https://github.com/mauricegift/gifted-session' target="_blank"><img alt='HEROKU DEPLOY' src='https://img.shields.io/badge/-HEROKU DEPLOY-black?style=for-the-badge&logo=heroku&logoColor=white'/>
 <br>
<a href='https://dashboard.render.com' target="_blank">
    <img alt='DEPLOY TO RENDER' src='https://img.shields.io/badge/-DEPLOY TO RENDER-black?style=for-the-badge&logo=render&logoColor=white'/>
</a>
 <br>
<a href='https://app.koyeb.com' target="_blank">
    <img alt='DEPLOY TO KOYEB' src='https://img.shields.io/badge/-DEPLOY TO KOYEB-black?style=for-the-badge&logo=koyeb&logoColor=white'/>
</a>

</details>

[`HERE'S AN EXAMPLE OUTPUT`](https://session.giftedtech.co.ke)
# `Owner`

 <a href="https://github.com/mauricegift"><img src="https://github.com/mauricegift.png" width="250" height="250" alt="Gifted Tech"/></a>


   
