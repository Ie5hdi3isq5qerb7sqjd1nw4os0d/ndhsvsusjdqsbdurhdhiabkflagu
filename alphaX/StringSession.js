const fs = require('fs');
const config = require('../config')


class StringSession {
    constructor() { }

    CreateAuthJson(string = undefined) {

        if (string.includes('AlphaX;;;')) {
            if ('_ALPHA_SESSION' in process.env || string === undefined) {
                string = config.SESSION;
            } else if (string !== undefined) {
                if (fs.existsSync(string)) {
                    string = fs.readFileSync(string, { encoding: 'utf8', flag: 'r' });
                }
            }

            var split = string.split(';;;');
            if (split.length = 2) {

                var decrypt = JSON.parse(Buffer.from(split[split.length - 1], 'base64').toString('utf-8'));

            }

            var buffer = Buffer.from(JSON.stringify(decrypt));
        
            fs.writeFileSync('./alphaX/auth.json', buffer, 'utf8', (err) => { });
            
        } else return console.log('Invalid Session!')

    }
}

module.exports = StringSession;