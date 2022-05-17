const { default: makeAlphaXSock, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys");
const { state, saveState } = useSingleFileAuthState('./alphaX/authInfo/json/lib/data/files/AlphaXauth.json');
const pino = require('pino');
const fs = require("fs");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const { Message, Image, Video, StringSession } = require('./alphaX/');
const { DataTypes } = require('sequelize');
// const { GreetingsDB, getMessage } = require("./plugins/sql/greetings");
const got = require('got');
const AlphaXnpm = require('alpha-wabot-npm');
const simpleGit = require('simple-git');
const git = simpleGit();
const Language = require('./language');
const Lang = Language.getString('updater');

/* Sql 🚀
const AlphaXdb = config.DATABASE.define('AlphaXmd', {
    info: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/')
    .forEach(plugin => {
    if (path.extname(plugin)
        .toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');
*/
var OWN = {
    ff: '94772978164,0,94763983965,0'
}

String.prototype.format = function() {
    var i = 0,
        args = arguments;
    return this.replace(/{}/g, function() {
        return typeof args[i] != 'undefined' ? args[i++] : '';
    });
};

// ==================== Date Scanner ====================
if (!Date.now) {
    Date.now = function() {
        return new Date()
            .getTime();
    }
}
// ==================== End Date Scanner ====================

Array.prototype.remove = function() {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function AlphaxBot() {

    // Logger Level 🚀

    var logger_levels = ''
    if (config.DEBUG == 'true') {
        logger_levels = 'all'
    } else if (config.DEBUG == 'false') {
        logger_levels = 'off'
    } else if (config.DEBUG == 'trace') {
        logger_levels = 'trace'
    } else if (config.DEBUG == 'fatal') {
        logger_levels = 'fatal'
    } else if (config.DEBUG == 'warn') {
        logger_levels = 'warn'
    } else if (config.DEBUG == 'error') {
        logger_levels = 'error'
    } else if (config.debug == 'info') {
        logger_levels = 'info'
    } else {
        logger_levels = 'warn'
    }

    // WaSocket 🚀
    
    const session = new StringSession();
    
        console.log(chalk.green.bold('🏃 Ａｌｐｈａ-Ｘ-WA-Bot Running...'));

        console.log(chalk.white.bold('🏁 Version: ' + config.VERSION));
        
        console.log(chalk.green.bold('⚙ Connecting to WhatsApp-Beta Web...'));

    const AlphaxSock = makeAlphaXSock({
        logger: pino({
            level: logger_levels
        }),
        browser: ['Alpha-X-Multi-Device', 'Web', 'v2'],
        auth: state
    });

/*          =================== External Plugins ====================

            console.log(
            chalk.blueBright.italic('📜 Installing External Plugins...'));

            var plugins = await plugindb.PluginDB.findAll();
            plugins.map(async(plugin) => {
                try {
                    if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                        console.log(plugin.dataValues.name);
                        var response = await got(plugin.dataValues.url);
                        if (response.statusCode == 200) {
                            fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                            require('./plugins/' + plugin.dataValues.name + '.js');
                        }
                    }
                } catch {
                    console.log('❌ Some Plugins Have Errors: ' + plugin.dataValues.name)
                }
            });
*/
            // ==================== End External Plugins ====================

            // ====================== Internal Plugins ======================

            console.log(
            chalk.blueBright.italic('🍂️ Installing Plugins...'));

            try {

                fs.readdirSync('./plugins')
                    .forEach(plugin => {
                    if (path.extname(plugin)
                        .toLowerCase() == '.js') {
                        require('./plugins/' + plugin);
                    }
                });

            } catch {

                console.log('❌ Some Plugins Have Errors contact owners for help')

            };

            console.log(
            chalk.green.bold('✅ Plugins Installed!'));

            // ==================== End Internal Plugins ====================


            await new Promise(r => setTimeout(r, 100));
            let wtype = config.WORKTYPE == 'public' ? 'Public' : 'Private'
            console.log(chalk.bgGreen('🔥 Ａｌｐｈａ-Ｘ-WA-Bot ⚚ ' + wtype));

            if (config.AI_LILY == 'true') {
                var lily_msg = await AlphaXnpchatUpdate.lily_if(config.LANG)
                await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                    text: lily_msg
                });
            } else {
                var af_start = await AlphaXnpm.work_type(config.WORKTYPE, config.LANG)
                await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                    text: af_start
                });
            }
            await git.fetch();
            var commits = await git.log([config.BRANCH + '..origin/' + config.BRANCH]);
            if (commits.total === 0) {
                await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                    text: Lang.UPDATE
                });
            } else {
                var up_ch = await AlphaXnpchatUpdate.update(config.LANG)
                await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                    text: up_ch
                });
                console.log("</> New Updates are Avalable 🔧")
            }
    
    AlphaxSock.ev.on('creds.update', saveState);

    AlphaxSock.ev.on("messages.upsert", async(chatUpdate) => {

        if (!chatUpdate.messages && !chatUpdate.count) return;

        let msg = chatUpdate.messages.all()[0];

        if (msg.key && msg.key.remoteJid == 'status@broadcast') return; // WhatsApp Status

        if (config.NO_ONLINE) {
            await AlphaxSock.sendPresenceUpdate('unavailable', msg.key.remoteJid);
        }
        // ==================== Greetings ========================
        // ==================== End Greetings ====================

        // ==================== Blocked Chats ====================
        if (config.BLOCKCHAT !== false) {
            var abc = config.BLOCKCHAT.split(',');
            if (msg.key.remoteJid.includes('@g.us') ? abc.includes(msg.key.remoteJid.split('@')[0]) : abc.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return;
        }
        if (config.BOTHELP == '120363023256845651') {
            var sup = config.BOTHELP.split(',');
            if (msg.key.remoteJid.includes('@g.us') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return;
        }
        if (config.COMMUNITY == '120363022626781816') {
            var sup = config.COMMUNITY.split(',');
            if (msg.key.remoteJid.includes('@g.us') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return;
        }

        // ==================== End Blocked Chats ====================

        // ==================== Events ====================
        events.commands.map(
        async(command) => {
            if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                var text_msg = msg.message.imageMessage.caption;
            } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                var text_msg = msg.message.videoMessage.caption;
            } else if (msg.message) {
                var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
            } else {
                var text_msg = undefined;
            }
            if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo') && msg.message && msg.message.imageMessage !== null && (command.pattern === undefined || (command.pattern !== undefined && command.pattern.test(text_msg)))) || (command.pattern !== undefined && command.pattern.test(text_msg)) || (command.on !== undefined && command.on === 'text' && text_msg) || (command.on !== undefined && (command.on === 'video') && msg.message && msg.message.videoMessage !== null && (command.pattern === undefined || (command.pattern !== undefined && command.pattern.test(text_msg))))) {

                let sendMsg = false;

                if ((config.SUDO !== false && msg.key.fromMe === false && command.fromMe === true && (msg.participant && config.SUDO.includes(',') ? config.SUDO.split(',')
                    .includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == config.SUDO || config.SUDO.includes(',') ? config.SUDO.split(',')
                    .includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == config.SUDO)) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                    if (!command.onlyPm === msg.key.remoteJid.includes('@g.us')) sendMsg = true;
                    else if (command.onlyGroup === msg.key.remoteJid.includes('@g.us')) sendMsg = true;
                }
                if ((OWN.ff == "94772978164,0,94763983965,0" && msg.key.fromMe === false && command.fromMe === true && (msg.participant && OWN.ff.includes(',') ? OWN.ff.split(',')
                    .includes(msg.participant.split('@')[0]) : msg.participant.split('@')[0] == OWN.ff || OWN.ff.includes(',') ? OWN.ff.split(',')
                    .includes(msg.key.remoteJid.split('@')[0]) : msg.key.remoteJid.split('@')[0] == OWN.ff)) || command.fromMe === msg.key.fromMe || (command.fromMe === false && !msg.key.fromMe)) {
                    if (!command.onlyPm === msg.key.remoteJid.includes('@g.us')) sendMsg = true;
                    else if (command.onlyGroup === msg.key.remoteJid.includes('@g.us')) sendMsg = true;
                }
                // ==================== End Events ====================

                // ==================== Message Catcher ====================
                if (sendMsg) {
                    if (config.SEND_READ && command.on === undefined) {
                        await AlphaxSock.chatRead(msg.key.remoteJid);
                    }
                    var match = text_msg.match(command.pattern);
                    if (command.on !== undefined && (command.on === 'image' || command.on === 'photo') && msg.message.imageMessage !== null) {
                        AlphaXmsg = new Image(AlphaxSock, msg);
                    } else if (command.on !== undefined && (command.on === 'video') && msg.message.videoMessage !== null) {
                        AlphaXmsg = new Video(AlphaxSock, msg);
                    } else {
                        AlphaXmsg = new Message(AlphaxSock, msg);
                    }

                    if (msg.key.fromMe && command.deleteCommand) {
                        await AlphaXmsg.delete(msg)
                    }

                    // ==================== End Message Catcher ====================

                    // ==================== Error Message ====================
                    try {
                        await command.

                        function(AlphaXmsg, match);
                    } catch (error) {
                        if (config.NOLOG == 'true') return;
                        if (config.LANG == 'SI') {
                            await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                text: '*🔭 දෝෂ වාර්තාව [ Ａｌｐｈａ-Ｘ ] 📨*\n' + '\n*⚙ Ａｌｐｈａ-Ｘ හි දෝෂයක් සිදු වී ඇත!*' + '\n_♦ මෙම දෝෂ ලඝු සටහනට ඔබේ අංකය හෝ විරුද්ධවාදියෙකුගේ අංකය ඇතුළත් විය හැකිය. කරුණාකර එය සමඟ ප්‍රවේශම් වන්න!_' + '\n_🛸 ඔබට අපගේ වට්සැප් කණ්ඩායමට උදව් සඳහා ලිවිය හැකිය ._' + '\n_*https://chat.whatsapp.com/ItIRSBUMN9t2lQzCpfAKWt*' + '\n_මෙම පණිවිඩය ඔබගේ අංකයට යා යුතුව තිබුණි (සුරැකි පණිවිඩ)._\n' + '\n*දෝෂය:* ```' + error + '```\n\n'
                            });
                            if (error.message.includes('URL')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Only Absolutely URLs Supported_' + '\n*⚖️ හේතුව:* _The usage of media tools (xmedia, sticker..) in the LOG number._' + '\n*🛡️ විසඳුම:* _You can use commands in any chat, except the LOG number._'
                                });
                            } else if (error.message.includes('conversation')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Deleting Plugin_' + '\n*⚖️ හේතුව:* _Entering incorrectly the name of the plugin wanted to be deleted._' + '\n*🛡️ විසඳුම:* _Please try without adding_ *__* _to the plugin you want to delete. If you still get an error, try to add like_ ```?(.*) / $``` _to the end of the name._ '
                                });
                            } else if (error.message.includes('split')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Split of Undefined_' + '\n*⚖️ හේතුව:* _Commands that can be used by group admins occasionally dont see the split function._ ' + '\n*🛡️ විසඳුම:* _Restarting will be enough._'
                                });
                            } else if (error.message.includes('SSL')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _SQL Database Error_' + '\n*⚖️ හේතුව:* _Database corruption._ ' + '\n*🛡️ විසඳුම:* _There is no known solution. You can try reinstalling it._'
                                });
                            } else if (error.message.includes('Ookla')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Ookla Server Connection_' + '\n*⚖️ හේතුව:* _Speedtest data cannot be transmitted to the server._' + '\n*🛡️ විසඳුම:* _If you use it one more time the problem will be solved._'
                                });
                            } else if (error.message.includes('params')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Requested Audio Params_' + '\n*⚖️ හේතුව:* _Using the TTS command outside the Latin alphabet._' + '\n*🛡️ විසඳුම:* _The problem will be solved if you use the command in Latin letters frame._'
                                });
                            } else if (error.message.includes('unlink')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== ```Error Resolved``` ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _No Such File or Directory_' + '\n*⚖️ හේතුව:* _Incorrect coding of the plugin._' + '\n*🛡️ විසඳුම:* _Please check the your plugin codes._'
                                });
                            } else if (error.message.includes('404')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Error 404 HTTPS_' + '\n*⚖️ හේතුව:* _Failure to communicate with the server as a result of using the commands under the Heroku plugin._' + '\n*🛡️ විසඳුම:* _Wait a while and try again. If you still get the error, perform the transaction on the website.._'
                                });
                            } else if (error.message.includes('reply.delete')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Reply Delete Function_' + '\n*⚖️ හේතුව:* _Using IMG or Wiki commands._' + '\n*🛡️ විසඳුම:* _There is no solution for this error. It is not a fatal error._'
                                });
                            } else if (error.message.includes('load.delete')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Reply Delete Function_' + '\n*⚖️ හේතුව:* _Using IMG or Wiki commands._' + '\n*🛡️ විසඳුම:* _There is no solution for this error. It is not a fatal error._'
                                });
                            } else if (error.message.includes('400')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Bailyes Action Error_ ' + '\n*⚖️ හේතුව:* _The exact reason is unknown. More than one option may have triggered this error._' + '\n*🛡️ විසඳුම:* _If you use it again, it may improve. If the error continues, you can try to restart._'
                                });
                            } else if (error.message.includes('decode')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Cannot Decode Text or Media_' + '\n*⚖️ හේතුව:* _Incorrect use of the plug._' + '\n*🛡️ විසඳුම:* _Please use the commands as written in the plugin description._'
                                });
                            } else if (error.message.includes('unescaped')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🚀 දෝෂ විශ්ලේෂණය [ Ａｌｐｈａ-Ｘ ] 🚧*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 ප්‍රධාන දෝෂය:* _Word Character Usage_' + '\n*⚖️ හේතුව:* _Using commands such as TTP, ATTP outside the Latin alphabet._' + '\n*🛡️ විසඳුම:* _The problem will be solved if you use the command in Latin alphabet.._'
                                });
                            } else {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🙇🏻 සමාවන්න! මට මෙම දෝශය කියවිය නොහැක 🙇🏻*' + '\n_උපසදෙස් සඳහා ඔබට අපගේ සහය කන්ඩායමට එක්විය හැහ_'
                                });
                            }
                        } else {
                            await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                text: '*🔭 ERROR REPORT [ Ａｌｐｈａ-Ｘ ] ⚖️*\n' + '\n*⚙ Ａｌｐｈａ-Ｘ an error has occurred!*' + '\n_♦ This error log may include your number or the number of an opponent. Please be careful with it!_' + '\n_🏷 Aslo you can join our support group:_ \n *https://chat.whatsapp.com/ItIRSBUMN9t2lQzCpfAKWt* ' + '\n_This message should have gone to your number (saved messages)._\n\n' + '*Error:* ```' + error + '```\n\n'
                            }, {
                                detectLinks: false
                            });
                            if (error.message.includes('URL')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Only Absolutely URLs Supported_' + '\n*⚖️ Reason:* _The usage of media tools (xmedia, sticker..) in the LOG number._' + '\n*🛡️ Solution:* _You can use commands in any chat, except the LOG number._'
                                });
                            } else if (error.message.includes('conversation')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Deleting Plugin_' + '\n*⚖️ Reason:* _Entering incorrectly the name of the plugin wanted to be deleted._' + '\n*🛡️ Solution:* _Please try without adding_ *__* _to the plugin you want to delete. If you still get an error, try to add like_ ```?(.*) / $``` _to the end of the name._ '
                                });
                            } else if (error.message.includes('split')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Split of Undefined_' + '\n*⚖️ Reason:* _Commands that can be used by group admins occasionally dont see the split function._ ' + '\n*🛡️ Solution:* _Restarting will be enough._'
                                });
                            } else if (error.message.includes('SSL')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _SQL Database Error_' + '\n*⚖️ Reason:* _Database corruption._ ' + '\n*🛡️ Solution:* _There is no known solution. You can try reinstalling it._'
                                });
                            } else if (error.message.includes('Ookla')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Ookla Server Connection_' + '\n*⚖️ Reason:* _Speedtest data cannot be transmitted to the server._' + '\n*🛡️ Solution:* _If you use it one more time the problem will be solved._'
                                });
                            } else if (error.message.includes('params')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Requested Audio Params_' + '\n*⚖️ Reason:* _Using the TTS command outside the Latin alphabet._' + '\n*🛡️ Solution:* _The problem will be solved if you use the command in Latin letters frame._'
                                });
                            } else if (error.message.includes('unlink')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== ```Error Resolved``` ==========' + '\n\n*🛠 Main Error:* _No Such File or Directory_' + '\n*⚖️ Reason:* _Incorrect coding of the plugin._' + '\n*🛡️ Solution:* _Please check the your plugin codes._'
                                });
                            } else if (error.message.includes('404')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Error 404 HTTPS_' + '\n*⚖️ Reason:* _Failure to communicate with the server as a result of using the commands under the Heroku plugin._' + '\n*🛡️ Solution:* _Wait a while and try again. If you still get the error, perform the transaction on the website.._'
                                });
                            } else if (error.message.includes('reply.delete')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Reply Delete Function_' + '\n*⚖️ Reason:* _Using IMG or Wiki commands._' + '\n*🛡️ Solution:* _There is no solution for this error. It is not a fatal error._'
                                });
                            } else if (error.message.includes('load.delete')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Reply Delete Function_' + '\n*⚖️ Reason:* _Using IMG or Wiki commands._' + '\n*🛡️ Solution:* _There is no solution for this error. It is not a fatal error._'
                                });
                            } else if (error.message.includes('400')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Bailyes Action Error_ ' + '\n*⚖️ Reason:* _The exact reason is unknown. More than one option may have triggered this error._' + '\n*🛡️ Solution:* _If you use it again, it may improve. If the error continues, you can try to restart._'
                                });
                            } else if (error.message.includes('decode')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Cannot Decode Text or Media_' +

                                    '\n*⚖️ Reason:* _Incorrect use of the plug._' + '\n*🛡️ Solution:* _Please use the commands as written in the plugin description._'
                                });
                            } else if (error.message.includes('unescaped')) {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🔭 ᴇʀʀᴏʀ ᴀɴᴀʟʏsɪs [ Ａｌｐｈａ-Ｘ ] 📊*\n' + '\n========== _Error Resolved!_ ==========' + '\n\n*🛠 Main Error:* _Word Character Usage_' + '\n*⚖️ Reason:* _Using commands such as TTP, ATTP outside the Latin alphabet._' + '\n*🛡️ Solution:* _The problem will be solved if you use the command in Latin alphabet.._'
                                });
                            } else {
                                return await AlphaxSock.sendMessage(AlphaxSock.user.id, {
                                    text: '*🙇🏻 Sorry, I Couldnt Read This Error! 🙇🏻*' + '\n_You can write to our support group for more help._'
                                });
                            }
                        }
                    }
                }
            }
        })
    })
    // ==================== End Error Message ====================
}

AlphaxBot();