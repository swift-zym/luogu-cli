const color = require('colors-cli');
const inquirer = require('inquirer');

module.exports = function (luogu) {
    luogu
        .command('auth <command>')
        .description('用户身份验证')
        .alias('a')
        .action(async function (command) {
            if (command == "login") {
                const promptList = [{
                    type: 'input',
                    message: 'uid:',
                    name: 'uid'
                }, {
                    type: 'input',
                    message: 'client id(可从浏览器 cookie 中获取):',
                    name: 'clientid'
                }];
                await inquirer.prompt(promptList).then(answers => {
                    data.user = answers;
                });
                let isOK=await checkTokenStatus();
                if (!isOK) {
                    console.log(color.red('Error:'), 'login fail,check your uid and clientid.');
                    data.user = {};
                }
                else {
                    console.log(color.green('login success.'));
                }
            }
            else if (command == "logout") {
                data.user = {};
                console.log("logout finished.");
            }
            else if (command == "status") {
                if (data.user.uid == undefined) {
                    console.log(color.red("Error:"), "user is not login.");
                }
                else {
                    console.log(color.blue("uid:"), data.user.uid);
                    console.log(color.blue("token:"), data.user.clientid);
                    let isOK=await checkTokenStatus();
                    if (isOK) {
                        console.log(color.green("token is valid."));
                    }
                    else {
                        console.log(color.red("token is invalid,please re-login."));
                    }
                }
            }
            else {
                console.log("command not found,try --help");
            }
        });
}