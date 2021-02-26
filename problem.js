const color = require('colors-cli');
const request = require('request-promise');

module.exports = function (luogu) {
    luogu
        .command('problem <command> <params>')
        .description('题目提交/查看 (send <file>|view <id>|search <keyword>)')
        .alias('p')
        .action(async function (command, file) {
            if (command == "view") {
                try {
                    let json = await request({
                        url: config['luogu-domain'] + 'problem/' + file,
                        timeout: 1500,
                        headers: {
                            "x-luogu-type": "content-only"
                        },
                        json:true
                    });
                    let problem = json.currentData.problem;
                    console.log(color.blue("题目背景:"));
                    console.log(problem.background);
                    console.log(color.blue("题目描述:"));
                    console.log(problem.description);
                    console.log(color.blue("输入格式:"));
                    console.log(problem.inputFormat);
                    console.log(color.blue("输出格式:"));
                    console.log(problem.outputFormat);
                    var idx=0;
                    for(let sample of problem.samples){
                        idx+=1;
                        console.log(color.blue(`样例输入${idx}:`));
                        console.log(sample[0]);
                        console.log(color.blue(`样例输出${idx}:`));
                        console.log(sample[1]);
                    }
                    console.log(color.blue("提示:"));
                    console.log(problem.hint);
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