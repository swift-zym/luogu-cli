# luogu-cli
洛谷命令行工具

支持以下功能:
- 题目查看
- 题目提交
- 题目搜索
- 犇犇发送
- 犇犇查看

暂时不支持的功能:
- 所有需要验证码的操作

## 安装

`npm install -g luogu-cli`

## 使用

```sh
% luogu -h

Usage: luogu [options] [command]

Options:
  -V, --version                         output the version number
  -h, --help                            display help for command

Commands:
  auth|a <command>                      用户身份验证 (login|logout|status)
  problem|p <command> <params> [other]  题目提交/查看 (send <file> <id>|view <id>|search <keyword>)
  benben|b <command> [params]           犇犇 (send [message]|view [page])
  help [command]                        display help for command             display help for command
```