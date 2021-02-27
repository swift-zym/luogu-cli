const color = require('colors-cli');
const request = require('request-promise');
const fs = require('fs');
const { resolve } = require('path');

async function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
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
                if (file[0] != '/') file = './' + file;
                let tmp = file.split('/');
                let filename = tmp[tmp.length - 1];
                try {
                    let json = await request({
                        method: 'POST',
                        url: config['luogu-domain'] + 'fe/api/problem/submit/' + other,
                        timeout: 1500,
                        headers: {
                            'referer': config['luogu-domain'] + 'problem/' + other,
                            'x-csrf-token': await getCSRFToken()
                        },
                        json: true,
                        body: {
                            code: fs.readFileSync(file).toString(),
                            lang: 0
                        },
                        jar: makeJar()
                    });
                    if (json.rid == undefined) {
                        throw new Error('submit problem fail.');
                    }
                    let luogu_config = await request({
                        url: config['luogu-domain'] + '_lfe/config',
                        timeout: 1500,
                        json:true
                    });
                    var T = 0;
                    while (true) {
                        try {
                            let status = await request({
                                url: config['luogu-domain'] + 'record/' + json.rid,
                                timeout: 1500,
                                headers: {
                                    "x-luogu-type": "content-only",
                                    'referer': config['luogu-domain'] + 'record/' + json.rid,
                                    'x-csrf-token': await getCSRFToken()
                                },
                                json: true,
                                jar: makeJar()
                            });
                            let detail = status.currentData.record.detail;
                            if (detail.compileResult == null) {
                                console.log(`(T+${T})submit ${other}:`, color.blue('Wating'));
                            }
                            else if (detail.compileResult.success == false) {
                                console.log(`(T+${T})submit ${other}:`, color.red('Complie Error'));
                                break;
                            }
                            else if (status.currentData.record.score == 100) {
                                console.log(`(T+${T})submit ${other}:`, color.green('Accept'));
                                break;
                            }
                            else {
                                let isFinish = true;
                                for (var i = 0; i < status.currentData.testCaseGroup.length; i++) {
                                    for (let testcase of status.currentData.testCaseGroup[i]) {
                                        let res = detail.judgeResult.subtasks[i].testCases[testcase.toString()];
                                        if (res.status == 1) {
                                            isFinish = false;
                                        }
                                    }
                                }
                                if (isFinish) {
                                    console.log(`(T+${T})submit ${other}:`, color.red('Unaccept'));
                                    console.log(color.blue("details:"));
                                    for (var i = 0; i < status.currentData.testCaseGroup.length; i++) {
                                        console.log(color.green(`Subtask ${i+1}:`));
                                        for (let testcase of status.currentData.testCaseGroup[i]) {
                                            let res = detail.judgeResult.subtasks[i].testCases[testcase.toString()];
                                            console.log(color.blue(`testcase ${testcase+1}:`),luogu_config.recordStatus[res.status.toString()].name);
                                        }
                                    }
                                    break;
                                }
                                else {
                                    console.log(`(T+${T})submit ${other}:`, color.blue('Running'));
                                }
                            }
                            await (sleep(1));
                            T += 1;
                        }
                        catch (e) {
                            console.log(`(T+${T})submit ${other}:`, color.blue('Unknown'));
                            await (sleep(1));
                            T += 1;
                        }
                    }
                } catch (e) {
                    console.log(color.red('Error:'), 'submit problem fail.');
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
                    console.log(color.red('Error:'), 'load problem fail.');
                }
            }
            else {
                console.log("command not found,try --help.");
            }
        });
}