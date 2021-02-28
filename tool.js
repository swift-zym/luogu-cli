module.exports = function (luogu) {
    luogu
        .command('tool <command>')
        .description('工具(captcha)')
        .action(async function (command){
            if(command == "captcha"){
                await getCaptcha();
            }
            else{
                console.log("command not found,try --help.");
            }
        });
    }