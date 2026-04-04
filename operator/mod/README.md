# Module Operator 指南

## 概述

在当前 `galaxy-ops` 实现里，模块通过 `gops mod` 管理，不存在独立的 `gmod` CLI。

`Module` 是最小可复用运维单元。它负责沉淀：

- 模块变量
- 模块依赖
- 模块构件
- 模块工作流
- 模块本地化输出

模块本身不直接面向客户交付，它先被组合成 `System`，再由 `Ops Project` 导入和交付。

## 当前命令

```bash
gops mod example
gops mod new --name <name>
gops mod update
gops mod localize [--value <file> | --default]
```

## 典型工作流

### 1. 创建模块

```bash
gops mod new --name nginx
```

当前实现会在目标目录下生成类似结构：

```text
nginx/
├── .gitignore
├── version.txt
├── mod-prj.yml
├── _gal/
│   ├── adm.gxl
│   ├── project.toml
│   └── work.gxl
└── mod/
    ├── arm-mac14-host/
    │   └── vars.yml
    └── x86-ubt22-k8s/
        └── vars.yml
```

注意：

- 当前骨架一定会生成 `mod-prj.yml`
- 当前骨架会按支持的 `ModelSTD` 生成 `mod/<model>/...`
- 初始模板比较轻，后续文件通常通过 update / localize / 手工补充逐步完善

### 2. 更新模块本地引用

```bash
gops mod update
gops mod update --force 2
```

`update` 主要用于同步依赖、本地引用和相关生成内容。`--force` 支持不同强度的覆盖策略。

### 3. 本地化模块

```bash
gops mod localize --value values/dev.yml
```

或：

```bash
gops mod localize --default
```

`localize` 会基于模块变量和值文件生成本地化结果，用于后续系统组合或实际交付。

## 模块在整体分层中的位置

```text
gops mod   -> 定义和维护模块
gops sys   -> 组合模块形成系统
gops prj   -> 导入系统形成具体交付项目
galaxy-flow -> 执行工作流
```

## 文档索引

- [CONFIGURATION.md](./CONFIGURATION.md)
- [DEVELOPMENT.md](./DEVELOPMENT.md)
- [REFERENCE.md](./REFERENCE.md)
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
