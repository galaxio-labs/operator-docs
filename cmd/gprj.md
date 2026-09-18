# gprj 命令使用文档

> ⚠️ **已过时（legacy）**：`gprj` 已被 `gx` 取代——项目脚手架用 `gx init project`，
> 模块更新用 `gx mod update`，管理流程用 `gx adm`，环境检查用 `gx check`。
> 本文档仅作历史参考，当前 CLI 请见 [gx](gx.md) 与 [gops](gops.md)。

## 概述
`gprj` 是 Galaxy Flow 的项目管理工具，用于初始化和管理 Galaxy 项目环境。

## 基本用法

```bash
gprj <COMMAND> [OPTIONS]
```

## 命令列表

### 1. init - 初始化命令
用于初始化 Galaxy 环境和项目。

#### init env - 初始化 Galaxy 环境
```bash
gprj init env
```
初始化系统级的 Galaxy 运行环境。

#### init prj-with-local - 使用本地模块初始化项目
```bash
gprj init prj-with-local
```
创建新项目并使用本地模块作为依赖。

#### init prj - 使用远程模板初始化项目
```bash
gprj init prj [OPTIONS]
```

##### 参数
- `--tpl <TPL>`: 选择模板名称（默认：simple）
  - 可选值：simple, open_pages, rust_prj 等
- `--branch <BRANCH>`: 指定模板仓库分支
- `--tag <TAG>`: 指定模板仓库标签
  - 可选值：alpha, develop, beta, release/1.0
- `--repo <REPO>`: 模板仓库地址（默认：https://gal-tpl.git）
- `-d, --debug <DEBUG>`: 调试级别（默认：0）
- `--log <LOG>`: 日志配置
- `-p, --cmd-print`: 打印执行的命令

##### 示例
```bash
# 使用默认模板初始化
gprj init prj

# 使用特定模板
gprj init prj --tpl rust_prj

# 使用特定分支
gprj init prj --branch develop

# 使用特定标签
gprj init prj --tag release/1.0
```

### 2. update - 更新命令
用于更新项目模块。

#### update mod - 更新模块
```bash
gprj update mod [OPTIONS]
```

##### 参数
- `-d, --debug <DEBUG>`: 调试级别（默认：0）
- `-f, --conf-work <CONF_WORK>`: 工作配置文件（默认：./_gal/work.gxl）
- `--conf-adm <CONF_ADM>`: 管理配置文件（默认：./_gal/adm.gxl）
- `--log <LOG>`: 日志配置
- `-q, --quiet`: 静默模式（默认：true）

##### 示例
```bash
# 更新模块
gprj update mod

# 使用自定义配置更新
gprj update mod -f ./config/work.gxl
```

### 3. conf - 配置管理
用于管理配置文件。

#### conf init - 初始化配置
```bash
gprj conf init [OPTIONS]
```

##### 参数
- `-r, --remote`: 使用远程配置（默认：false）

##### 示例
```bash
# 初始化本地配置
gprj conf init

# 初始化远程配置
gprj conf init --remote
```

### 4. check - 检查命令
检查当前项目配置和环境。

```bash
gprj check
```

### 5. adm - 管理命令
执行管理任务，等同于 gx 的管理流程。

```bash
gprj adm [OPTIONS]
```

## 配置文件

### 默认配置文件
- `./_gal/work.gxl` - 工作流配置
- `./_gal/adm.gxl` - 管理配置
- `./_gal/head.gxl` - 头部配置

### 配置内容
- 项目元数据
- 模块依赖
- 环境变量
- 执行策略

## 使用流程

### 1. 初始化新项目
```bash
# 1. 初始化环境
gprj init env

# 2. 初始化项目
gprj init prj --tpl simple

# 3. 检查配置
gprj check
```

### 2. 更新项目
```bash
# 更新所有模块
gprj update mod

# 使用自定义配置更新
gprj update mod -f ./my-config.gxl
```

### 3. 配置管理
```bash
# 初始化配置
gprj conf init

# 使用远程配置
gprj conf init --remote
```

## 模板仓库

### 默认模板仓库
- 地址：https://gal-tpl.git
- 包含模板：simple, open_pages, rust_prj 等

### 自定义模板仓库
```bash
gprj init prj --repo https://my-tpl.git --tpl my-template
```

## 环境变量
- `GALAXY_FLOW_HOME`: Galaxy Flow 主目录
- `RUST_LOG`: Rust 日志级别

## 返回值
- `0`: 执行成功
- `非0`: 执行失败，返回错误码

## 常见问题

### 权限问题
确保有执行权限：
```bash
chmod +x gprj
```

### 网络连接
初始化项目时需要网络连接以下载模板。

### 模板选择
使用 `gprj init prj --help` 查看所有可用模板。

### 配置冲突
如果配置文件已存在，先备份再重新初始化：
```bash
mv _gal/work.gxl _gal/work.gxl.backup
gprj conf init
```

## 最佳实践

### 项目初始化
1. 先初始化环境：`gprj init env`
2. 选择合适的模板：`gprj init prj --tpl <template>`
3. 检查配置：`gprj check`
4. 更新模块：`gprj update mod`

### 团队协作
- 使用统一的模板仓库
- 定期更新模块：`gprj update mod`
- 使用版本控制管理配置文件