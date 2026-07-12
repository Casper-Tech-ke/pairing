const fs = require('fs');

/**
 * Generates a unique chaotic identifier.
 * "A fragment of an ancient seal... randomized across dimensions."
 */
function casperId(num = 4) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var characters9 = characters.length;
  for (var i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters9));
  }
  return result;
}

/**
 * Extracts a cold, 8-digit sync sequence for the client matrix.
 * "The keys to the binding ritual..."
 */
function generateRandomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Erases traces of temporary artifacts from existence.
 * "Leave no evidence behind. Purge the directory."
 */
async function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    await fs.promises.rm(FilePath, { recursive: true, force: true });
    return true;
}

module.exports = { casperId, removeFile, generateRandomCode };
