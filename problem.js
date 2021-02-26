const color = require('colors-cli');
const request = require('request-promise');

module.exports = function (luogu) {
    luogu
        .command('problem <command> <params> [other]')
        .description('题目提交/查看 (send <file> <id>|view <id>|search <keyword>)')
        .alias('p')
        .action(async function (command, file, other) {
            if (command == "view") {
                try {
                    let json = await request({
                        url: config['luogu-domain'] + 'problem/' + file,
                        timeout: 1500,
                        headers: {
                            "x-luogu-type": "content-only"
                        },
                        json: true
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
                    var idx = 0;
                    for (let sample of problem.samples) {
                        idx += 1;
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
                if (other == undefined) {
                    console.log(color.red('Error:'), 'problem not found.');
                    return;
                }
                try {
                    let json = await request({
                        url: config['luogu-domain'] + 'fe/api/problem/submit/' + other,
                        timeout: 1500,
                        headers: {
                            'referer': config['luogu-domain'] + 'problem/' + other,
                            'x-csrf-token': await getCSRFToken()
                        },
                        json: true,
                        formData: {

                        }
                    });
                } catch (e) {
                    console.log(color.red('Error:'),'submit problem fail.');
                }
            }
            else if (command == "search") {
                try {
                    let problems = await request({
                        url: config['luogu-domain'] + 'problem/list' + '?keyword=' + require('urlencode')(file),
                        timeout: 1500,
                        headers: {
                            "x-luogu-type": "content-only"
                        },
                        json: true
                    });
                    for (let problem of problems.currentData.problems.result) {
                        console.log(color.blue(problem.pid + ':'), problem.title);
                    }
                } catch (e) {
                    console.log(e);
                    console.log(color.red('Error:'), 'load problem fail.');
                }
            }
            else {
                console.log("command not found,try --help.");
            }
        });
}