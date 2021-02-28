如果 `luogu-cli` 在运行时产生了类似下面的错误：
```sh
/usr/bin/env: “node\r”: 没有那个文件或目录
```
请尝试下面的操作：
![image.png](https://i.loli.net/2021/02/27/odWZ5B8GsKLi91A.png)

# luogu-cli
洛谷命令行工具

支持以下功能:
- 题目查看
- 题目提交
- 题目搜索
- 犇犇发送
- 犇犇查看
- 云剪切板新建
- 云剪切板查看

暂时不支持的功能:
- 所有需要验证码的操作

## 安装

`npm install -g luogu-cli`

## 使用

### 全部功能

```sh
% luogu -h

Usage: luogu [options] [command]

Options:
  -V, --version                    output the version number
  -h, --help                       display help for command

Commands:
  auth|a <command>                 用户身份验证 (login|logout|status)
  problem|p <command> [params...]  题目提交/查看 (submit <file> <id> [contest id]|view <id>|search <keyword>)
  benben|b <command> [params]      犇犇 (send <message>|view [page])
  help [command]                   display help for command
```

### 示例
```sh
luogu p submit main.cpp P1000
luogu benben view
```
