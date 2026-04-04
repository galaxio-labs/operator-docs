# System Operator 指南

## 概述

在当前 `galaxy-ops` 实现里，系统通过 `gops sys` 管理，不存在独立的 `gsys` CLI。

`System` 是模块之上的组合层。它负责：

- 维护系统模型定义
- 维护模块列表
- 维护系统级设置和值
- 提供下载、安装、启动、停止、状态、诊断等系统操作入口

## 当前命令

```bash
gops sys new --name <name>
gops sys update [--force]
gops sys localize [--mod <module>]
gops sys setting --init
gops sys download [--mod <module>] [--env <env>]
gops sys install [--mod <module>] [--env <env>]
gops sys uninstall [--mod <module>] [--env <env>]
gops sys start [--mod <module>] [--env <env>]
gops sys stop [--mod <module>] [--env <env>]
gops sys status [--mod <module>] [--env <env>]
gops sys diagnose [--mod <module>] [--env <env>]
```

## 创建系统

```bash
gops sys new --name web-stack
```

当前实现会生成类似结构：

```text
web-stack/
├── .gitignore
├── version.txt
├── sys-prj.yml
├── _gal/
│   ├── adm.gxl
│   ├── project.toml
│   └── work.gxl
└── sys/
    ├── .gitignore
    ├── sys_model.yml
    ├── mod_list.yml
    ├── workflows/
    │   └── operators.gxl
    └── setting/
        ├── list.yml
        └── vars.yml
```

## 关键文件

### `sys-prj.yml`

系统对象根配置。

### `sys/sys_model.yml`

系统模型定义。

### `sys/mod_list.yml`

系统包含的模块列表。

### `sys/setting/list.yml`

系统设置导出或本地化用的列表配置。

### `sys/setting/vars.yml`

系统设置变量定义。

### `sys/workflows/operators.gxl`

系统级工作流定义。

## 常见流程

### 更新系统本地引用

```bash
gops sys update
gops sys update --force
```

### 本地化系统

```bash
gops sys localize
gops sys localize --mod nginx
```

### 初始化系统设置

```bash
gops sys setting --init
```

### 执行系统操作

```bash
gops sys download --env default
gops sys install --env default
gops sys start --env default
gops sys status --env default
```

## 与模块和项目的关系

```text
gops mod new      -> 创建模块
gops sys new      -> 组合模块形成系统
gops prj new      -> 创建项目
gops prj import   -> 把系统导入项目
gops prj update   -> 同步项目本地引用
```

## 现实边界

当前 `gops sys` 已经提供系统操作入口，但具体工作流执行仍依赖 `gflow`。

也就是说：

- `galaxy-ops` 负责系统结构和交付组织
- `galaxy-flow` / `gflow` 负责工作流执行
