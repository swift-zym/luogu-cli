const request = require('request-promise')
const color = require('colors-cli')
const inquirer = require('inquirer')

module.exports = function (luogu) {
    luogu
        .command('paste <command> [params...]')
        .description('云剪切板(list|view <id>|new)')
        .alias('pas')
        .action(async function (command, params) {
            if (command == "list") {
                let json = await getContent('paste');
                for (let paste of json.currentData.pastes.result) {
                    console.log(color.blue('id:'), paste.id);
                }
            }
            else if (command == "view") {
                if (params == undefined || params[0] == undefined) {
                    console.log(color.red("Error:"), "id is null.");
                    return;
                }
                let id = params[0];
                let json = await getContent(`paste/${id}`);
                try {
                    console.log(color.blue("Data:\n"),json.currentData.paste.data);
                }catch(e){
                    console.log(color.red("Error:"),`paste ${id} not found.`);
                }
            }
            else if (command == "new") {
                let text = undefined, public = undefined;
                const promptList = [{
                    type: "editor",
                    message: "请输入内容：",
                    name: "text"
                },
                {
                    type: "confirm",
                    message: "是否公开？",
                    name: "public"
                }
                ];
                await inquirer.prompt(promptList).then(answers => {
                    text = answers.text;
                    public = answers.public;
                });
                if (text == undefined) {
                    console.log(color.red("Error:"), 'paste text is null.');
                }
                let json = await request({
                    method: 'POST',
                    url: config['luogu-domain'] + 'paste/new',
                    timeout: 1500,
                    headers: {
                        'referer': config['luogu-domain'] + 'paste',
                        'x-csrf-token': await getCSRFToken()
                    },
                    json: true,
                    body: {
                        public: public,
                        data: text
                    },
                    jar: makeJar()
                });
                if (json.id != undefined) {
                    console.log(color.blue('id:'), json.id);
                }
                else {
                    console.log(color.red('Error:'), 'create paste fail.');
                }
            }
            else {
                console.log("command not found,try --help.");
            }
        })
}