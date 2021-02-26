const color = require('colors-cli');
const request = require('request-promise');

module.exports = function (luogu) {
    luogu
        .command('problem <command> <params>')
        .description('题目提交/查看 (send <file>|view <id>)')
        .alias('p')
        .action(async function (command, file) {
            if (command == "view") {
                try {
                    let problem = await request({
                        url: config['luogu-domain'] + 'problem/' + file,
                        timeout: 1500,
                        headers: {
                            "x-luogu-type": "content-only"
                        }
                    });
                } catch (e) {
                    console.log(color.red('Error:'), "load problem fail.");
                }
            }
            else if (command == "submit") {
                if (!checkTokenStatus()) {
                    console.log('please re-login user.');
                    return;
                }
            }
            else {
                console.log("command not found,try --help.");
            }
        });
}