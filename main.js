const P = require('pino')
const { default: AlphaXmakeWASocket, useSingleFileAuthState, DisconnectReason} = require("@adiwajshing/baileys")
const chalk = require("chalk")
const fs = require('fs')

console.log(`${chalk.red.bold('<>========')}${chalk.blue.bold('Alpha-X-Bot')}${chalk.red.bold('=====')}${chalk.blue.bold('[beta]-QR-Code')}${chalk.red.bold('========<>')}
${chalk.white.bold('[[ New and speed version of Alpha-X-Bot-QR Code ]]')} `);

const FuckOff = () => {

    const { state, saveState } = useSingleFileAuthState('AlphaxAuth.json')

    const AlphaxSock = AlphaXmakeWASocket({
        logger: P({
            level: 'silent'
        }),
        printQRInTerminal: true,
        browser: ['Alpha-X-Multi-Device', 'Web', 'v2'],
        auth: state
    });

    AlphaxSock.ev.on('creds.update', saveState);

      fs.writeFileSync('encoded.txt', 'AlphaX;;;' + Buffer.from(JSON.stringify(AlphaxSock.authState.creds), 'utf-8').toString('base64'))

    /* ============================================================================ */
    /* ============================================================================ */

    AlphaxSock.ev.on('messages.upsert', async m => {

        // console.log("\n--------------------------------\n" + JSON.stringify(m) + "\n--------------------------------\n")

        const msg = m.messages[0]

        if (!msg.key.fromMe) {

            var send = "\n*=====* ``` message.upsert ``` *=====*\n\n" + `$ {
                JSON.stringify(m)
            }` + "\n\n*================================*"

              /* await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                text: send
            }); */

        };

    });

    /*
  AlphaxSock.ev.on('chats.set', async m => {
  
        var send = "\n*=====* ``` chats.set ``` *=====*\n\n" + `${JSON.stringify(m)}` + "\n\n*================================*"

        // await AlphaxSock.sendMessage(AlphaxSock.user.id, { text: send });
  });
  
  AlphaxSock.ev.on('messages.set', async m => {
  
        var send = "\n*=====* ``` messages.set ``` *=====*\n\n" + `${JSON.stringify(m)}` + "\n\n*================================*"

        await AlphaxSock.sendMessage(AlphaxSock.user.id, { text: send });
  });
  
  AlphaxSock.ev.on('contacts.set', async m => {
  
        var send = "\n*=====* ``` contacts.set ``` *=====*\n\n" + `${JSON.stringify(m)}` + "\n\n*================================*"

        await AlphaxSock.sendMessage(AlphaxSock.user.id, { text: send });
  });
  
  AlphaxSock.ev.on('chats.delete', async m => {
  
        var send = "\n*=====* ``` chats.delete ``` *=====*\n\n" + `${JSON.stringify(m)}` + "\n\n*================================*"

        await AlphaxSock.sendMessage(AlphaxSock.user.id, { text: send });
  });

  AlphaxSock.ev.on('presence.update', async m => {
  
        var send = "\n*=====* ``` presence.update ``` *=====*\n\n" + `${JSON.stringify(m)}` + "\n\n*================================*"

        await AlphaxSock.sendMessage(AlphaxSock.user.id, { text: send });
  });

  AlphaxSock.ev.on('contacts.upsert', async m => {
  
        var send = "\n*=====* ``` contacts.upsert ``` *=====*\n\n" + `${JSON.stringify(m)}` + "\n\n*================================*"

        await AlphaxSock.sendMessage(AlphaxSock.user.id, { text: send });
  });

  AlphaxSock.ev.on('contacts.update', async m => {
  
        var send = "\n*=====* ``` contacts.update ``` *=====*\n\n" + `${JSON.stringify(m)}` + "\n\n*================================*"

        // await AlphaxSock.sendMessage(AlphaxSock.user.id, { text: send });
  });

  AlphaxSock.ev.on('messages.delete', async m => {
  
        var send = "\n*=====* ``` messages.delete ``` *=====*\n\n" + `${JSON.stringify(m)}` + "\n\n*================================*"

        await AlphaxSock.sendMessage(AlphaxSock.user.id, { text: send });
  });

  AlphaxSock.ev.on('message-info.update', async m => {
  
        var send = "\n*=====* ``` message-info.update ``` *=====*\n\n" + `${JSON.stringify(m)}` + "\n\n*================================*"

        await AlphaxSock.sendMessage(AlphaxSock.user.id, { text: send });
  });
 */

    AlphaxSock.ev.on('connection.update', async(update) => {

        let _a, _b;
        let connection = update.connection, lastDisconnect = update.lastDisconnect;

        if (connection == 'connecting') {
            console.log(
            chalk.green.bold('⚙ Connecting to WhatsApp Web...'))
        }

        else if (connection == 'open') {


            console.log(chalk.green.bold('✅ Successfully connected to WhatsApp Web'));

        }

        else if (connection == 'close') {

            console.log(update);

            if (((_b = (_a = lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== DisconnectReason.loggedOut) {

                //               FuckOff()
                console.log("❌ Error ")

            } else {

                console.log(chalk.redBright("❌ Couldn't connect to whatsapp!"));


            };

        };

    });

};

FuckOff()