# System Operator 指南

## 概述

在当前 `galaxy-ops` 实现里，系统通过 `gops sys` 管理，不存在独立的 `gsys` CLI。

`System` 是模块之上的组合层。它负责：

- 维护系统模型定义（含部署类型 `kind`）
- 维护模块列表（GXL 类型）
- 维护系统级设置和值
- 生成 `.env` 等本地化产物
- 提供下载、安装、启动、停止、状态、诊断等系统操作入口

## 当前命令

```bash
gops sys new --name <name> [--kind gxl|docker-compose]
gops sys update [--force]
gops sys package [--force] [--output <path>]
gops sys localize [--mod <module>] [--only]
gops sys setting --init
gops sys download [--mod <module>] [--env <env>]
gops sys install [--mod <module>] [--env <env>]
gops sys uninstall [--mod <module>] [--env <env>]
gops sys start [--mod <module>] [--env <env>]
gops sys stop [--mod <module>] [--env <env>]
gops sys status [--mod <module>] [--env <env>]
gops sys diagnose [--mod <module>] [--env <env>]
```

## 部署类型（kind）

`sys/sys_model.yml` 的 `kind` 字段决定 `gops sys` 的行为：

- `gxl`（默认，兼容旧系统）：部署命令委托外部 `gx` 执行，要求 `sys/workflows/operators.gxl` 与可用的 `gx`。
- `docker-compose`：部署命令直接映射到 `docker compose`，**无需 `gx`**：

  | `gops sys ...` | `docker compose ...` |
  | --- | --- |
  | `download` | `pull` |
  | `install` | `create` |
  | `start` | `up -d` |
  | `stop` | `stop` |
  | `uninstall` | `down` |
  | `status` | `ps` |
  | `diagnose` | `config` |

## 创建系统

```bash
gops sys new --name web-stack                       # 默认 gxl（需要选择系统型号）
gops sys new --name gateway --kind docker-compose   # 纯 compose（无型号）
```

两种类型生成的结构不同，见 [目录结构](./structure/directory.md)。

## 关键文件

- `sys-prj.yml`：系统对象根配置
- `sys/sys_model.yml`：系统模型定义（`name` / `model`（gxl 必填）/ `kind` / `vender`）
- `sys/mod_list.yml`：模块列表（GXL；纯 compose 可省略）
- `sys/setting/vars.yml`：系统设置变量定义（源）
- `sys/setting/list.yml`：按模块的本地化列表（可选）
- `sys/merged_vars.yml`：聚合变量（`sys update` 生成：模块变量 ⊕ 系统变量，需入库）
- `sys/workflows/operators.gxl`：系统级工作流（GXL）
- `values/sys_value.yml`：值文件（`sys update` 生成**注释模板**，取消注释即覆盖）
- `values/value.yml`：额外覆盖层（适合入库的客户覆盖）
- `docker-compose.yml`：系统级 compose 定义（用 `${VAR}` 占位）
- `.env`：`sys localize` 生成的非密钥配置（供 compose 消费）

## 值 / 本地化流程

```text
gops sys update   -> sys/merged_vars.yml（系统默认值）+ values/sys_value.yml（注释模板）
gops sys localize -> .env = merged_vars 默认值 ⊕ values/sys_value.yml ⊕ values/value.yml
```

两个值文件都是**可选、可部分覆盖**：只写需要修改的项，其余取系统默认值。保持注释模板原样时等价于空覆盖。

`sys localize` 在系统变量尚未解析（缺 `sys/merged_vars.yml`）时会自动先执行 `update`；`--only` 跳过这一步（此时若变量仍未解析会明确报错）。

## 密钥

密钥**不写入** `.env`：在 `docker-compose.yml` 里用 `${SEC_xxx}` 占位，`gops sys start` 运行时从 `~/.galaxy/sec_value.yml` 读取并注入子进程环境（key 会归一化为大写并加 `SEC_` 前缀）。详见 `galaxy-ops` 仓库的 `src/system/README.md`。

## 常见流程

### 更新系统本地引用

```bash
gops sys update
gops sys update --force
```

### 本地化系统

```bash
gops sys localize            # 缺 merged_vars.yml 时会自动先 update，再生成 .env
gops sys localize --only     # 只 localize，不解析/下载模块
gops sys localize --mod nginx
```

### 打包交付

```bash
gops sys package             # 先 update 再打包 → ../<name>-<version>.tar.gz
```

### 初始化系统设置

```bash
gops sys setting --init
```

### 执行系统操作

```bash
gops sys start --env default
gops sys status --env default
```

## 与模块和项目的关系

```text
gops mod new      -> 创建模块
gops sys new      -> 组合模块形成系统
gops prj new      -> 创建运维项目
gops prj import   -> 把系统导入项目
gops prj reimport -> 按 ops-prj.yml 重新导入（保留 values/）
gops prj update   -> 同步项目本地引用
```

导入到运维项目后，项目值放在 `<project>/values/<system>/`。在项目内的系统目录执行 `gops sys localize` / `gops sys update` 时，会依据上层 `ops-prj.yml` 直接使用该项目值目录，不依赖 `<sys>/values` 符号链接是否完整。

## 现实边界

- `gxl` 系统的工作流执行仍依赖 `gx`
- `docker-compose` 系统只依赖本机 `docker compose`，不需要 `gx`
