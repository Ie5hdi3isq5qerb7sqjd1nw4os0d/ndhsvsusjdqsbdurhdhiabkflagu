const { Sequelize } = require('sequelize');
const fs = require('fs');
const {JsonDB} = require('node-json-db');
const {Config} = require('node-json-db/dist/lib/JsonDBConfig')
const db = new JsonDB(new Config('db', true, false, '/'))
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

DATABASE_URL = process.env.DATABASE_URL === undefined ? './alphaX.db' : process.env.DATABASE_URL;
DEBUG = process.env.DEBUG === undefined ? false : convertToBool(process.env.DEBUG);

if ( fs.existsSync('config.env') ){

    db.push('/WORKTYPE', process.env.WORK_TYPE)
    db.push('/LANG', process.env.LANGUAGE.toUpperCase())
    db.push('/HANDLERS', process.env.HANDLERS)
    db.push('/U_NAME', process.env.USER_NAME)
    db.push('/SUDO', process.env.SUDO)
    db.push('/DEBUG', convertToBool(process.env.DEBUG))
}

module.exports = {
    VERSION: 'V.1 Global Stable',
    BRANCH: 'main',
    GROUP: 'https://chat.whatsapp.com/ItIRSBUMN9t2lQzCpfAKWt',
    PROXY: db.getData('/PROXY'),
    SESSION: db.getData('/SESSION'),
    ANTILINK: db.getData('/ANTILINK'),
    AUTOBIO:db.getData('/AUTOBIO'),
    GANSTYLE: db.getData('/GANSTYLE'),
    LANG: db.getData('/LANG'),
    ALIVEMSG: db.getData('/ALIVEMSG'),
    KICKMEMSG: db.getData('/KICKMEMSG'),
    BLOCKCHAT: db.getData('/BLOCKCHAT'),
    ADDMSG: db.getData('/ADDMSG'),
    MUTEMSG: db.getData('/MUTEMSG'),
    NOLOG: db.getData('/NOLOG'),
    AI_LILY: db.getData('/AI_LILY'),
    BLOCKMSG: db.getData('/BLOCKMSG'),
    UNBLOCKMSG:db.getData('/UNBLOCKMSG'),
    UNMUTEMSG: db.getData('/UNMUTEMSG'),
    WORKTYPE: db.getData('/WORKTYPE'),
    PROMOTEMSG: db.getData('/PROMOTEMSG'),
    DEMOTEMSG: db.getData('/DEMOTEMSG'),
    BANMSG: db.getData('/BANMSG'),
    AFKMSG: db.getData('/AFKMSG'),
    HANDLERS: db.getData('/HANDLERS'),
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
    C_EMOJI:db.getData('/C_EMOJI'),
    D_EMOJI: db.getData('/D_EMOJI'),
    W_EMOJI: db.getData('/W_EMOJI'),
    A_PIC: db.getData('/A_PIC'),
    CLIST_MSG: db.getData('/CLIST_MSG'),
    CL_PIC: db.getData('/CL_PIC'),
    D_SONG_PIC:db.getData('/D_SONG_PIC'),
    D_VIDEO_PIC:db.getData('/D_VIDEO_PIC'),
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
    DATABASE_URL: DATABASE_URL,
    DATABASE: DATABASE_URL === './alphaX.db' ? new Sequelize({ dialect: "sqlite", storage: DATABASE_URL, logging: DEBUG }) : new Sequelize(DATABASE_URL, { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } }, logging: DEBUG }),
    RBG_API_KEY: db.getData('/RBG_API_KEY'),
    NO_ONLINE: db.getData('/NO_ONLINE'),
    SUDO: db.getData('/SUDO'),
    DEBUG: db.getData('/DEBUG'),
    COFFEEHOUSE_API_KEY: db.getData('/COFFEEHOUSE_API_KEY'),
    WITAI_API: "TEYMELA6DMC4XB5YM3SPTTQWUUIBKURG", 
    BOTHELP: "🙂",
    COMMUNITY: "🙂"
    };
