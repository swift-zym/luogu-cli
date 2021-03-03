const request = require("request-promise");
const color = require("colors-cli");

module.exports = function (luogu) {
    luogu
        .command('tool <command>')
        .description('工具(captcha|check-online)')
        .action(async function (command){
            if(command == "captcha"){
                await getCaptcha();
            }
            else if(command == "check-online"){
                try{
                    request({
                        uri:config['luogu-domain'],
                        timeout:1500
                    });
                    console.log(color.green("Luogu's server is online!"));
                }
                catch{
                    console.log(color.red("Error: can't connet to luogu's server."));
                }
            }
            else{
                console.log("command not found,try --help.");
            }
        });
    }