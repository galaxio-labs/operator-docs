# gx 命令使用文档

> **`gx` 是 `gflow` 的新名字**（`galaxy-flow` 的执行器 CLI）。本文档按当前 `gx` CLI 编写。

## 概述

`gx` 用于运行 GXL 工作流，并提供运行环境 / 项目初始化与模块管理。它负责“执行”这一层：

- `galaxy-flow`（`gx`）：定义并执行工作流
- `galaxy-ops`（`gops`）：组织与交付模块、系统、运维项目

## 基本用法

```bash
gx <COMMAND>
```

## 命令列表

| 命令 | 说明 |
| --- | --- |
| `gx run [FLOWS]...` | 运行工作流（默认 `./_gal/work.gxl`） |
| `gx adm [FLOWS]...` | 运行管理流程（默认 `./_gal/adm.gxl`） |
| `gx init env` | 初始化本地 Galaxy 环境（`~/.galaxy`、网络访问控制等） |
| `gx init project [--repo URL] [--path SUBDIR] [--branch B] [--tag T]` | 初始化项目（默认用本地模板；`--path`/`--repo` 走远程） |
| `gx mod update` | 更新项目模块（依据本地 `_gal` 配置） |
| `gx doc [TOPIC]` | 查看内置文档 |
| `gx check` | 打印当前运行环境信息 |
| `gx self check\|update\|rollback` | 自更新管理 |

## 参数说明

### 位置参数

- `FLOWS...`：流程名称列表（用于 `gx run` / `gx adm`）

### 选项参数

- `-e, --env <ENV>`：环境名称（默认 `default`）
- `-d, --debug <DEBUG>`：调试级别（默认 `0`）
- `-c, --conf <CONF>`：GXL 配置文件路径（默认值由子命令决定）
- `--log <LOG>`：日志配置，例如 `--log cmd=debug,parse=info`
- `--cmd-arg <ARG>`：传递给流程的命令行参数
- `-q, --quiet`：静默模式
- `-h, --help` / `-V, --version`

## 使用示例

```bash
# 运行默认工作流
gx run

# 运行指定流程
gx run conf ver

# 运行管理流程
gx adm package

# 指定环境与调试级别
gx adm -e dev -d 2 start

# 初始化项目（默认模板仓库）
gx init project --path <subdir>

# 更新模块 / 查看环境
gx mod update
gx check
```

## 目录约定

- `./_gal/work.gxl`：工作流入口（`gx run`）
- `./_gal/adm.gxl`：管理流程入口（`gx adm`）
- `./_gal/mods/`：本地项目模块

> 注意：旧文档里的 `./_rg/` 已改为 `./_gal/`。

## 环境变量

- `RUST_LOG`：Rust 日志级别
- GXL 模块渠道等变量按具体工作流约定（例如模板里的 `GXL_CHANNEL`）

## 返回值

- `0`：执行成功
- 非 `0`：执行失败，返回错误码

## 常见问题

### 找不到配置文件

`gx run` / `gx adm` 默认读取当前目录下的 `./_gal/work.gxl` / `./_gal/adm.gxl`，请在项目根目录执行，或用 `-c` 指定配置文件。

### 权限问题

```bash
chmod +x gx
```

### 模块加载失败

检查网络连接与模块路径配置（`_gal` 中的 `extern mod`）。

### 与 `gops` 的关系

`kind: gxl` 的系统在 `gops sys start/stop/status/...` 时委托外部执行器执行系统的管理流程；
`kind: docker-compose` 的系统不需要 `gx`，直接映射到本机 `docker compose`。
