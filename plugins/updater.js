const simpleGit = require('simple-git');
const axios = require('axios');
const git = simpleGit();
const AlphaX = require('../events');
const Config = require('../config');
const exec = require('child_process').exec;
const Heroku = require('heroku-client');
const { PassThrough } = require('stream');
const heroku = new Heroku({ token: Config.HEROKU.API_KEY })
const Language = require('../language');
const Lang = Language.getString('updater');

AlphaX.addCommand({pattern: 'up$', fromMe: true, desc: Lang.UPDATER_DESC}, (async (message, match) => {

    await git.fetch();
    var commits = await git.log([Config.BRANCH + '..origin/' + Config.BRANCH]);
    if (commits.total === 0) {

        await message.client.sendMessage(
            message.jid,
            { text: Lang.UPDATE },
            { quoted: message.data }
        );

    } else {

        var Updates = Lang.NEW_UPDATE;
        commits['all'].map(
        (commit) => {
            Updates += Config.C_EMOJI + ' ➲  ' + commit.message + '\n';
        });

        var result = Config.HANDLERS;
        var hdlr = result.split('^[')[1].split(']')[0];
        var HANDLER = hdlr[hdlr.length = 0];

        var _WebPage = await axios.get('https://SL-Alpha-X.github.io');

        const templateButtons = [{
            index: 1,
            quickReplyButton: {
                displayText: '• ᴜᴘᴅᴀᴛᴇ ʙᴏᴛ ⬆️',
                id: HANDLER + 'up now'
            }
        }];

        const templateMesaage = {
            text: "",
            footer: Updates,
            templateButtons: templateButtons,
            image: {
                url: _WebPage.data.up_url
            }
        };

        await message.client.sendMessage(message.jid, templateMesaage, {
            quoted: message.data
        });

    }

}));

var Action = ''
if (Config.LANG == 'TR') Action = '*🚀 Halihazırda Güncelleniyor!*'
if (Config.LANG == 'SI') Action = '*🚀 දැනට යාවත්කාලීන වෙමින් පවතී!*'
if (Config.LANG == 'AZ') Action = '*🚀 Hal -hazırda Yenilənir!*'
if (Config.LANG == 'EN') Action = '*🚀 Currently Updating!*'
if (Config.LANG == 'RU') Action = '*🚀 сейчас обновляется!*'
if (Config.LANG == 'ES') Action = '*🚀 Actualizando actualmente!*'
if (Config.LANG == 'PT') Action = '*🚀 está sendo atualizado no momento!*'
if (Config.LANG == 'ML') Action = '*🚀 നിലവിൽ അപ്ഡേറ്റ് ചെയ്യുന്നു!*'
if (Config.LANG == 'HI') Action = '*🚀 वर्तमान में अपडेट हो रहा है!*'
if (Config.LANG == 'ID') Action = '*🚀 Saat Ini Memperbarui!*'

AlphaX.addCommand({pattern: 'up now$', fromMe: true, desc: Lang.UPDATE_NOW_DESC}, (async (message, match) => {

    await git.fetch();
    var commits = await git.log([Config.BRANCH + '..origin/' + Config.BRANCH]);
    if (commits.total === 0) {
    
        return await message.client.sendMessage(
            message.jid, 
            { text: Lang.UPDATE }, 
            { quoted: message.data }
        );
        
    } else {
        var on_progress = false
        if (on_progress) return await message.client.sendMessage(message.jid, { text: Action }, { quoted: message.data });

        if (Config.HEROKU.HEROKU) {
            try {
                var app = await heroku.get('/apps/' + Config.HEROKU.APP_NAME)
            } catch {
            
                await message.client.sendMessage(
                    message.jid,
                    { text: Lang.INVALID_HEROKU },
                    { quoted: message.data }
                );
                
                await new Promise(r => setTimeout(r, 1000));
                
                return await message.client.sendMessage(
                    message.jid,
                    { text: Lang.IN_AF },
                    { quoted: message.data }
               );
            }

            git.fetch('upstream', Config.BRANCH);
            git.reset('hard', ['FETCH_HEAD']);

            var git_url = app.git_url.replace(
                "https://", "https://api:" + Config.HEROKU.API_KEY + "@"
            )
            on_progress = true
            try {
                await git.addRemote('heroku', git_url);
            } catch { console.log('heroku remote ekli'); }
            await git.push('heroku', Config.BRANCH);

            await message.client.sendMessage(
                message.jid,
                { text: Lang.UPDATED },
                { quoted: message.data }
            );

            await message.sendMessage(
                message.jid,
                { text: Lang.AFTER_UPDATE },
                { quoted: message.data }
            );
            
        } else {
            git.pull((async (err, update) => {
                if(update && update.summary.changes) {
                
                    await message.client.sendMessage(
                        message.jid,
                        { text: Lang.UPDATED_LOCAL },
                        { quoted: message.data }
                    );
                        
                    exec('npm install').stderr.pipe(process.stderr);
                } else if (err) {
                
                    await message.client.sendMessage(
                        message.jid,
                        { text: '*❌ Update fail*\n*error:* ```' + err + '```' },
                        { quoted: message.data }
                    );
                }
            }));
        }
    }
}));