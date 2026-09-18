# gops - Galaxy Operations System 系统操作管理工具

## 概述

`gops` 是 Galaxy Operations System 的核心命令行工具，用于管理系统配置、模块操作和系统设置。它提供了完整的系统管理功能，帮助开发者高效地管理 Galaxy 系统的各种组件和配置。

## 基本用法

### 显示版本信息

```bash
gops
# 输出示例：gops: 1.3.0
```

### 显示帮助信息

```bash
gops --help
gops <command> --help
gops <command> <subcommand> --help
```

## 命令结构

`gops` 采用三层命令结构：

```
gops [全局选项] <主命令> [子命令选项] <子命令>
```

### 主命令

1. **`gops prj`** - 部署管理命令
2. **`gops mod`** - 模块管理命令
3. **`gops sys`** - 系统管理命令

## 全局选项

所有命令都支持以下全局选项：

### 调试选项
- `-d, --debug <LEVEL>` - 调试级别（0-3）
  - `0`: 关闭调试输出
  - `1`: 基础调试信息
  - `2`: 详细调试信息
  - `3`: 跟踪调试信息

### 日志选项
- `--log <LOG>` - 日志级别配置
  - 格式：`模块=级别,模块=级别`
  - 例如：`--log setting=debug,system=info`

### 强制选项
- `-f, --force <LEVEL>` - 强制更新级别
  - `0`: 正常模式（默认）
  - `1`: 跳过确认
  - `2`: 覆盖文件
  - `3`: 强制拉取

## 部署工程管理命令 (gops prj)

### 创建维护工程

```bash
gops prj new [OPTIONS]
```

**选项：**
- `-n, --name <NAME>` - 工程配置名称（必填）
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置

**功能：**
- 创建指定名称的维护工程
- 初始化工程目录结构
- 生成必要的配置文件

**示例：**
```bash
# 创建名为 my-project 的工程
gops prj new --name my-project

# 创建工程并启用调试
gops prj new --name my-project --debug 2
```

### 导入系统到工程

```bash
gops prj import [OPTIONS]
```

**选项：**
- `-p, --path <PATH>` - 系统导入路径（必填）
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置
- `-f, --force <LEVEL>` - 强制更新级别

**功能：**
- 从指定路径导入系统配置
- 将系统集成到当前工程
- 自动处理系统依赖关系

**示例：**
```bash
# 从指定路径导入系统
gops prj import --path /path/to/system

# 详细调试导入过程
gops prj import --path /path/to/system --debug 3
```

### 更新工程

```bash
gops prj update [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置
- `-f, --force <LEVEL>` - 强制更新级别

**功能：**
- 更新工程中的系统引用
- 更新模块依赖关系
- 下载远程资源

**示例：**
```bash
# 正常更新工程
gops prj update

# 强制更新（覆盖文件）
gops prj update --force 2

# 详细调试更新过程
gops prj update --debug 3 --log update=debug
```

### 重新导入系统

```bash
gops prj reimport [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置
- `-f, --force <LEVEL>` - 强制更新级别

**功能：**
- 按 `ops-prj.yml` 记录的 `sys_models` 重新导入系统
- 保留 `values/` 客户值（适用于“删除了已导入系统目录、但保留了 values/ + ops-prj.yml”的场景）

**示例：**
```bash
gops prj reimport
```

## 模块管理命令 (gops mod)

### 创建示例模块结构

```bash
gops mod example [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置

**功能：**
- 创建完整的示例模块结构
- 包含示例配置和工作流
- 展示模块组织最佳实践

**示例：**
```bash
# 创建示例模块
gops mod example

# 创建示例模块并启用调试
gops mod example --debug 2
```

### 定义新模块操作符

```bash
gops mod new [OPTIONS]
```

**选项：**
- `-n, --name <NAME>` - 模块名称（必填）
  - 支持字母数字、连字符和下划线
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置

**功能：**
- 使用给定名称创建新模块规范
- 初始化模块目录结构
- 生成所有必要的配置文件

**示例：**
```bash
# 创建名为 my-module 的模块
gops mod new --name my-module

# 创建模块并启用调试
gops mod new --name my-module --debug 3
```

### 更新现有模块操作符

```bash
gops mod update [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置
- `-f, --force <LEVEL>` - 强制更新级别

**功能：**
- 更新现有模块的配置
- 更新模块依赖关系或规范
- 支持强制更新模式

**示例：**
```bash
# 正常更新模块
gops mod update

# 强制更新模块
gops mod update --force 1

# 详细调试更新过程
gops mod update --debug 3 --log mod=debug
```

### 本地化模块配置

```bash
gops mod localize [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置
- `--value <PATH>` - 包含环境特定值的 YAML/JSON 文件路径
- `--default` - 使用内置默认值而不是用户提供的 value.yml

**功能：**
- 基于环境特定值生成本地化配置文件
- 适配不同部署环境的需求
- 支持自定义值或默认值选择

**示例：**
```bash
# 使用默认值本地化
gops mod localize --default

# 使用自定义值文件本地化
gops mod localize --value prod-values.yml

# 使用自定义值文件并启用调试
gops mod localize --value dev-values.yml --debug 2
```

## 系统管理命令 (gops sys)

### 创建新的系统操作符

```bash
gops sys new [OPTIONS]
```

**选项：**
- `-n, --name <NAME>` - 系统名称（必填）
  - 支持字母数字、连字符和下划线
- `--kind <KIND>` - 部署类型：`gxl`（默认）或 `docker-compose`；不指定时交互式选择

**功能：**
- 创建新的系统规范
- 初始化系统目录结构（`kind` 决定是否生成 GXL 骨架）
- `gxl`：交互式选择系统型号（测试环境下设 `TEST_MODE=1` 自动选择）
- `docker-compose`：无型号，只生成精简骨架

**示例：**
```bash
# 默认：GXL 系统（交互式选择型号）
gops sys new --name my-system

# 纯 docker-compose 系统
gops sys new --name gateway --kind docker-compose

# 在测试环境中创建系统
TEST_MODE=1 gops sys new --name test-system
```

### 更新系统配置

```bash
gops sys update [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置
- `-f, --force <LEVEL>` - 强制更新级别

**功能：**
- 更新现有系统配置
- 更新系统规范或依赖关系
- 支持强制更新以不确认的情况下覆盖配置

**示例：**
```bash
# 正常更新系统
gops sys update

# 强制更新系统（跳过确认）
gops sys update --force 1

# 详细调试更新过程
gops sys update --debug 3 --log sys=debug
```

### 打包系统

```bash
gops sys package [OPTIONS]
```

**选项：**
- `-f, --force <LEVEL>` - 强制更新级别
- `--output <PATH>` - 输出路径（默认：父目录下 `<name>-<version>.tar.gz`）

**功能：**
- 先执行一次 `update`（解析变量、生成 `sys/merged_vars.yml`），保证交付包可被 `gops prj import` 完整导入
- 再把系统打包为 `.tar.gz`

**示例：**
```bash
gops sys package
gops sys package --output /tmp/gateway-0.1.0.tar.gz
```

### 为环境本地化系统配置

```bash
gops sys localize [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置
- `--mod <MODULE>` - 只处理指定模块
- `--only` - 只 localize，跳过 update（不解析/下载模块）

**功能：**
- 生成 `.env`：`sys/merged_vars.yml` 默认值 ⊕ `values/sys_value.yml` ⊕ `values/value.yml`
- 两个值文件都是可选、可部分覆盖：只写需要修改的项，其余取系统默认值
- 系统变量尚未解析（缺 `sys/merged_vars.yml`）时会自动先执行 `update`；`--only` 跳过该步骤
- `kind: docker-compose` 时，`.env` 供同目录的 `docker-compose.yml` 消费

**示例：**
```bash
# 生成本地化配置（必要时自动先 update）
gops sys localize

# 只 localize，不解析/下载（变量未解析时会明确报错）
gops sys localize --only

# 只处理某个模块
gops sys localize --mod gateway
```

**值文件说明：** `values/sys_value.yml` 由 `sys update` 首次生成，整份是**注释模板**——取消注释需要覆盖的项即可；`values/value.yml` 优先级更高，适合入库的客户覆盖。

## 环境变量

### 调试环境变量
- `TEST_MODE` - 测试模式设置
  - 当设置为任意值时，启用测试环境行为
  - 在 `gops sys new` 中自动选择系统型号而不是交互式选择

### 模拟环境变量
- `MOCK_SUCCESS` - 模拟成功状态
  - 用于测试环境中模拟成功的操作
  - 通常与 `TEST_MODE` 一起使用

## 配置文件结构

### 工程目录结构
```
my-project/
├── ops-prj.yml              # 工程 manifest：name + work_envs + sys_models
├── version.txt
├── _gal/                    # GXL 工程文件
├── values/                  # 客户值目录
│   └── {system-name}/
│       ├── sys_value.yml    # 值文件（只写需要覆盖的项）
│       └── value.yml        # 额外覆盖层（可选）
└── {system-name}/           # 已导入的系统目录
    └── values -> ../values/{system-name}   # 符号链接（prj import/reimport 建立）
```

> 历史：原 `ops-systems.yml` 已合并进 `ops-prj.yml`；加载时会兼容合并旧文件，保存后写入单文件。

### 模块目录结构
```
my-module/
├── mod.yml                  # 模块配置文件
├── sys/                     # 系统配置
├── workflow/                # 工作流配置
├── artifacts/               # 构建产物
├── config/                  # 配置文件
└── settings/                # 模块设置
```

### 系统目录结构
```
my-system/
├── sys-prj.yml              # 系统根配置
├── docker-compose.yml       # 系统级 compose 定义（${VAR} 占位）
├── version.txt
├── _gal/                    # GXL 工程文件（仅 kind: gxl）
├── values/                  # 值文件目录
└── sys/
    ├── sys_model.yml        # name / model / kind / vender
    ├── mod_list.yml         # 模块列表（GXL；可选）
    ├── merged_vars.yml      # 聚合变量（sys update 生成，需入库）
    ├── workflows/           # GXL 工作流（可选）
    └── setting/
        ├── list.yml         # 可选
        └── vars.yml         # 系统设置变量定义（源）
```

纯 docker-compose 系统只保留 `sys_model.yml` 与 `setting/vars.yml`（详见 [System 目录结构](../operator/sys/structure/directory.md)）。

## 最佳实践

### 工程管理
```bash
# 1. 创建新工程
gops prj new --name my-project

# 2. 导入系统到工程
gops prj import --path /path/to/system --force 1

# 3. 更新工程
gops prj update

# 4. 按 ops-prj.yml 重新导入并保留 values/
gops prj reimport

# 5. 客户差异写在 values/<system>/value.yml（只写要覆盖的项）
```

### 模块开发
```bash
# 1. 创建示例模块（学习结构）
gops mod example

# 2. 创建新模块
gops mod new --name my-module

# 3. 更新模块
gops mod update --force 2

# 4. 本地化模块配置
gops mod localize --value dev-values.yml
```

### 系统管理
```bash
# 1. 创建新系统
gops sys new --name my-system

# 2. 解析变量 / 初始化值文件
gops sys update --force 1

# 3. 本地化（生成 .env）
gops sys localize
```

### 调试技巧
```bash
# 启用详细调试
gops prj import --path /test --debug 3 --log all=debug

# 调试特定模块
gops mod update --debug 3 --log mod=debug

# 调试系统操作
gops sys update --debug 3 --log sys=debug

# 调试设置操作
gops sys setting --init --debug 2 --log setting=debug
```

## 故障排除

### 常见错误及解决方案

**Q: 工程创建失败**
```
错误：无法创建目录 "my-project"
解决：检查目录权限，或选择不同的名称
```

**Q: 系统导入失败**
```
错误：load project from ./path fail!
解决：检查路径是否正确，确保有适当的访问权限
gops prj import --path /path/to/system --debug 3
```

**Q: 模块更新失败**
```
错误：无法加载模块配置
解决：确保在正确的模块目录中执行命令
gops mod update --debug 3 --log mod=debug
```

**Q: 系统创建卡在选择界面**
```
解决：在测试环境中设置 TEST_MODE 环境变量
TEST_MODE=1 gops sys new --name test-system
```

**Q: 设置命令在非交互模式下失败**
```
解决：确保 sys/setting/ 目录存在，并在系统根目录执行
gops sys setting --init --debug 2
```

### 调试模式使用

```bash
# 基础调试
gops prj import --path /test --debug 1

# 详细调试
gops mod update --debug 2 --log mod=debug

# 跟踪级别调试
gops sys update --debug 3 --log sys=trace

# 跟踪级别调试（工程）
gops prj update --debug 3 --log all=debug
```

### 日志配置示例

```bash
# 调试特定模块
gops mod update --log mod=debug

# 调试多个模块
gops sys update --log sys=debug,net=info

# 设置不同级别
gops prj import --log import=debug,system=info,net=trace

# 调试所有内容
gops mod update --log all=debug
```

## 测试

项目包含完整的测试套件：

```bash
# 运行所有测试
cargo test

# 运行特定测试
cargo test test_gxops_run_success

# 运行测试并显示输出
cargo test -- --nocapture

# 在测试环境中运行
TEST_MODE=true cargo test

# 运行特定命令的测试
cargo test test_ia_setting_interactive
cargo test test_ia_setting_non_interactive
```

## 示例工作流

### 开发环境设置

```bash
# 1. 创建开发工程
gops prj new --name dev-project

# 2. 导入开发系统
gops prj import --path /path/to/dev-system --force 1

# 3. 更新工程依赖
gops prj update --debug 2

# 4. 写客户差异（项目值目录，只写要覆盖的项）
#    dev-project/values/dev-system/value.yml

# 5. 创建开发模块
gops mod new --name dev-module

# 6. 本地化模块配置
gops mod localize --value dev-values.yml
```

### 生产环境部署

```bash
# 1. 创建生产工程
gops prj new --name prod-project

# 2. 导入生产系统（打包产物：.tar.gz 或 git/http 地址）
gops prj import --path /path/to/prod-system-0.1.0.tar.gz --force 3

# 3. 在项目值目录里写客户差异（只写需要覆盖的项）
#    prod-project/values/prod-system/value.yml

# 4. 本地化生产配置（在系统目录内执行，自动使用项目值）
cd prod-system
gops sys localize
```

## 版本信息

当前版本：`1.3.0`

## 功能状态

| 命令 | 子命令 | 状态 | 说明 |
|------|--------|------|------|
| `gops prj` | `new` | ✅ 完成 | 创建维护工程 |
| `gops prj` | `import` | ✅ 完成 | 导入系统到工程（打包产物） |
| `gops prj` | `update` | ✅ 完成 | 更新工程 |
| `gops prj` | `reimport` | ✅ 完成 | 按 `ops-prj.yml` 重新导入（保留 `values/`） |
| `gops mod` | `example` | ✅ 完成 | 创建示例模块结构 |
| `gops mod` | `new` | ✅ 完成 | 定义新模块操作符 |
| `gops mod` | `update` | ✅ 完成 | 更新现有模块操作符 |
| `gops mod` | `localize` | ✅ 完成 | 本地化模块配置 |
| `gops sys` | `new` | ✅ 完成 | 创建系统（`--kind gxl` / `docker-compose`） |
| `gops sys` | `update` | ✅ 完成 | 解析变量、初始化值文件 |
| `gops sys` | `package` | ✅ 完成 | 先 update 再打包交付产物 |
| `gops sys` | `localize` | ✅ 完成 | 生成 `.env`（`--only` 跳过 update） |
| `gops sys` | `setting` | ✅ 完成 | 初始化系统设置 |
| `gops sys` | `download/install/start/stop/uninstall/status/diagnose` | ✅ 完成 | 按 `kind` 分派（gxl→gx；docker-compose→docker compose） |



## 许可证

本项目采用 MIT 许可证 - 详见项目根目录的 LICENSE 文件
