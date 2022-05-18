const fs = require('fs');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig')
const db = new JsonDB(new Config('./database/configDB', true, false, '/'))
if (fs.existsSync('config.env')) require('dotenv')
    .config({
    path: './config.env'
});

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

DEBUG = process.env.DEBUG === undefined ? false : convertToBool(process.env.DEBUG);

module.exports = {
    VERSION: 'V.2 - Multi-device Beta',
    BRANCH: 'multi-device',
    GROUP: 'https://chat.whatsapp.com/ItIRSBUMN9t2lQzCpfAKWt',
    SESSION: process.env.SESSION || db.getData('/SESSION'),
    LANG: process.env.LANGUAGE.toUpperCase() || db.getData('/LANG'),
    WORKTYPE: process.env.WORK_TYPE || db.getData('/WORKTYPE'),
    HANDLERS: process.env.HANDLERS || db.getData('/HANDLERS'),
    DEBUG: convertToBool(process.env.DEBUG) || db.getData('/DEBUG'),
    PROXY: db.getData('/PROXY'),
    ANTILINK: db.getData('/ANTILINK'),
    AUTOBIO: db.getData('/AUTOBIO'),
    GANSTYLE: db.getData('/GANSTYLE'),
    ALIVEMSG: db.getData('/ALIVEMSG'),
    KICKMEMSG: db.getData('/KICKMEMSG'),
    BLOCKCHAT: db.getData('/BLOCKCHAT'),
    ADDMSG: db.getData('/ADDMSG'),
    MUTEMSG: db.getData('/MUTEMSG'),
    NOLOG: db.getData('/NOLOG'),
    AI_LILY: db.getData('/AI_LILY'),
    BLOCKMSG: db.getData('/BLOCKMSG'),
    UNBLOCKMSG: db.getData('/UNBLOCKMSG'),
    UNMUTEMSG: db.getData('/UNMUTEMSG'),
    PROMOTEMSG: db.getData('/PROMOTEMSG'),
    DEMOTEMSG: db.getData('/DEMOTEMSG'),
    BANMSG: db.getData('/BANMSG'),
    AFKMSG: db.getData('/AFKMSG'),
    SEND_READ: db.getData('/SEND_READ'),
    CAPTION: db.getData('/CAPTION'),
    BOTNAME: db.getData('/BOTNAME'),
    BIONAME: db.getData('/BIONAME'),
    CL_KEY: db.getData('/CL_KEY'),
    AM_KEY: db.getData('/AM_KEY'),
    D_SONG: db.getData('/D_SONG'),
    U_SONG: db.getData('/U_SONG'),
    D_VIDEO: db.getData('/D_VIDEO'),
    U_VIDEO: db.getData('/U_VIDEO'),
    U_NAME: db.getData('/U_NAME'),
    C_EMOJI: db.getData('/C_EMOJI'),
    D_EMOJI: db.getData('/D_EMOJI'),
    W_EMOJI: db.getData('/W_EMOJI'),
    A_PIC: db.getData('/A_PIC'),
    CLIST_MSG: db.getData('/CLIST_MSG'),
    CL_PIC: db.getData('/CL_PIC'),
    D_SONG_PIC: db.getData('/D_SONG_PIC'),
    D_VIDEO_PIC: db.getData('/D_VIDEO_PIC'),
    WLCM_GIF: db.getData('/WLCM_GIF'),
    GBYE_GIF: db.getData('/GBYE_GIF'),
    BLOCKLINK: db.getData('/BLOCKLINK'),
    BLINK_A: db.getData('/BLINK_A'),
    BLINK_B: db.getData('/BLINK_B'),
    ALB_MSG: db.getData('/ALB_MSG'),
    BGM: db.getData('/BGM'),
    CMENU: db.getData('/CMENU'),
    CMENU_MSG: db.getData('/CMENU_MSG'),
    XAPI: db.getData('/XAPI'),
    BKICK: db.getData('/BKICK'),
    BKICK_MSG: db.getData('/BKICK_MSG'),
    RBG_API_KEY: db.getData('/RBG_API_KEY'),
    NO_ONLINE: db.getData('/NO_ONLINE'),
    SUDO: db.getData('/SUDO'),
    COFFEEHOUSE_API_KEY: db.getData('/COFFEEHOUSE_API_KEY'),
    WITAI_API: "TEYMELA6DMC4XB5YM3SPTTQWUUIBKURG",
    BOTHELP: "🙂",
    COMMUNITY: "🙂"
};