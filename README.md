# luogu-cli
洛谷命令行工具

支持以下功能:
- 题目查看
- 题目提交
- 题目搜索
- 犇犇发送
- 犇犇查看

```sh
% luogu -h

Usage: luogu [options] [command]

Options:
  -V, --version                 output the version number
  -h, --help                    display help for command

Commands:
  auth|a <command>              用户身份验证 (login|logout|status)
  problem|p <command> <params>  题目提交/查看 (send <file>|view <id>|search <keyword>)
  benben|b <command> [params]   犇犇 (send [message]|view [page])
  help [command]                display help for command
```