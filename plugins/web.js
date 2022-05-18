const Events = require('../events');
const Config = require('../config');

Events.alphaXCMD({pattern: 'ping$', fromMe: false, deleteCommand: false, desc: "ping pong 📨"}, (async (message, match) => {

  var start = new Date().getTime();
  await message.sendMessage(message.jid, { text: Config.C_EMOJI + ' *ʀᴜɴɴɪɴɢ...*'} );
  var end = new Date().getTime();

  await message.client.sendMessage(message.jid, { text: '   ```️🛡️ Pɪɴɢ!```\n*❝ ' + (end - start) + ' ms ❞*' }, { quoted: message.data });

}));