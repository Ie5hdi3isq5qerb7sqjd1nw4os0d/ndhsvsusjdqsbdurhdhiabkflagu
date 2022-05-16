const AlphaX = require('../events');
const { MessageType } = require('@adiwajshing/baileys');
const Config = require('../config');

AlphaX.addCommand({pattern: 'ping$', fromMe: false, deleteCommand: false, desc: Lang.PING_DESC}, (async (message, match) => {

  var start = new Date().getTime();
  await message.sendMessage(message.jid, { text: Config.C_EMOJI + ' *ʀᴜɴɴɪɴɢ...*'} );
  var end = new Date().getTime();

  await message.client.sendMessage(message.jid, { text: '   ```️🛡️ Pɪɴɢ!```\n*❝ ' + (end - start) + ' ms ❞*' }, { quoted: message.data });

}));