const color = require('colors-cli');
const request = require('request-promise');

module.exports = function (luogu) {
    luogu
        .command('benben <command> [params]')
        .description('犇犇 (send <message>|view [page])')
        .alias('b')
        .action(async function (command, message) {
            if (!checkTokenStatus()) {
                console.log('please re-login user.');
                return;
            }
            if (command == "send") {
                if (message == undefined) {
                    console.log(color.red('Error:'), "message can not be null.");
                }
                else {
                    let token = await getCSRFToken();
                    try {
                        let json = await request({
                            url: config['luogu-domain'] + 'api/feed/postBenben',
                            method: 'POST',
                            timeout: 1500,
                            headers: {
                                'referer': config['luogu-domain'],
                                'x-csrf-token': await getCSRFToken()
                            },
                            json: true,
                            form: {
                                content: message
                            },
                            jar: makeJar()
                        });
                        if (json.code != 200 && json.status != 200) {
                            console.log(color.red("Error:"), json.data);
                        }
                        else {
                            console.log(color.green("benben send finish."));
                        }
                    }
                    catch (e) {
                        console.log(color.red('Error:'), 'benben send fail.');
                    }
                }
            }
            else if (command == "view") {
                try {
                    var url = config['luogu-domain'] + 'api/feed/watching';
                    if (message != undefined) {
                        url += "?page=" + message;
                    }
                    let benbens = await request({
                        url: url,
                        timeout: 1500,
                        json: true,
                        jar: makeJar()
                    });
                    if (benbens.status != 200) {
                        throw new Error();
                    }
                    for (let benben of benbens.data) {
                        if (benben.type == 1) {
                            console.log(color.blue(benben.uid) + ":", benben.comment);
                        }
                    }
                } catch (e) {
                    console.log(color.red('Error:'), 'load benben fail.');
                }
            }
            else {
                console.log("command not found,try --help.");
            }
        });
}