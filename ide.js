const fs = require('fs')
const color = require('colors-cli')
const request = require('request-promise')

module.exports = function (luogu) {
    luogu
        .command('ide <code-dir> <input-dir>')
        .description('洛谷在线ide运行')
        .action(async function (code_dir, input_dir) {
            if((!fs.existsSync(code_dir))||(!fs.existsSync(input_dir))){
                console.log(color.red('Error:'),'code dir or input dir not exit.');
                return;
            }
            let code = fs.readFileSync(code_dir).toString(),input = fs.readFileSync(input_dir).toString().toString();
            console.log(code);
            let json = await request({
                method: 'POST',
                url:config['luogu-domain']+'api/ide_submit',
                timeout: 1500,
                headers: {
                    'referer': config['luogu-domain'] + 'ide',
                    'x-csrf-token': await getCSRFToken()
                },
                json: true,
                form: {
                    code: code,
                    lang: 1,
                    input: input,
                    "csrf-token": getCSRFToken()
                },
                jar: makeJar()
            });
            console.log(json);
        });
    }