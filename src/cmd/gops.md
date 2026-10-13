# gops - Galaxy Operations System 系统操作管理工具

## 概述

`gops` 是 Galaxy Operations System 的核心命令行工具，用于管理系统配置、模块操作和系统设置。它提供了完整的系统管理功能，帮助开发者高效地管理 Galaxy 系统的各种组件和配置。

## 基本用法

### 显示版本信息

```bash
gops
# 输出示例：gops: 2.3.1
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
3. **`gops sys`** - 系统管理命令（定义 / 交付 / 工件）
4. **`gops run`** - 运行时运维命令（在环境里落地 / 运行）
5. **`gops self`** - 自升级命令

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

`gops prj` 管理**运维工程**（`ops-prj.yml`）：把打包好的系统导入进来、长期保持同步，并管理系统的**现场态**（系统目录里**不属于交付包**、且必须跨升级存活的文件）。

现场态声明写在系统侧 `sys-prj.yml`，**五个声明互相独立、各由各自的命令消费，彼此之间没有任何派生 / 覆盖 / 交叠逻辑**：

| 声明（`sys-prj.yml`） | 只服务 | 作用 |
| --- | --- | --- |
| `pkg_include:` | `gops sys package` | 基准集之外额外纳入交付包的路径（默认模式补未被 git 跟踪的生成物）；`pkg_exclude` 优先 |
| `pkg_exclude:` | `gops sys package` | 打包排除的路径（旧名 `ignore`；默认与 `--full` 都生效） |
| `protect:` | `prj sync` / `sys resolve` / `prj upgrade` | 升级 / 重建不覆盖、也不删（旧名 `preserve`） |
| `backup:` | `prj backup` / `prj restore` | 备份选取的现场态（扁平列表；只表达“丢失的代价”，**不触发任何删除**） |
| `contract:` | `prj contract export` / `import` | 对外契约（不可重建的**公开**现场事实：对外域名 / 端点 / 公开证书） |

> `contract` 与 `protect` / `backup` / 打包**互不影响** —— 契约内容只走 `prj contract export` / `import` 独立归档；`protect` / `backup` / 打包各自只按自己那一节声明行事。

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
- 从指定路径导入系统配置（`--path` 必须是**打包产物**：本地 `.tar.gz`、`.git`/`git@` 仓库地址，或 http(s) 的 `.tar.gz` / `.git` 地址；**不接受裸目录**）
- 将系统集成到当前工程（归档根须含 `sys/` 目录）
- 客户值目录 `<sys>/values` 建为指向 `<project>/values/<sys_name>` 的符号链接

**示例：**
```bash
# 从指定路径导入系统
gops prj import --path /path/to/system

# 详细调试导入过程
gops prj import --path /path/to/system --debug 3
```

### 同步 / 补齐工程系统 (prj sync)

```bash
gops prj sync [OPTIONS]      # 旧名 update 仍可用（隐藏别名）
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置
- `-f, --force <LEVEL>` - 强制更新级别

**功能：**
- 按 `ops-prj.yml` 记录的系统逐个同步：
  - 目录**缺失** → 按包**导入**（补齐被删的系统，不再是静默跳过）
  - 目录**已在** → 把**包内内容**非破坏覆盖到各自 `addr` 指向的版本（`protect` 声明的路径不碰，**不删**任何东西）
- 刷新项目 `work_envs`，回写 `ops-prj.yml`
- **不是事务**：无备份 / 无健康检查 / 无回滚；也不同步运行时（不拉镜像、不切换、不探活）。要做一次可回滚的发布升级请用 `gops prj upgrade`

**示例：**
```bash
# 同步 + 补齐缺失系统
gops prj sync

# 强制覆盖
gops prj sync --force 2

# 详细调试
gops prj sync --debug 3 --log update=debug
```

### 备份现场态 (prj backup)

```bash
gops prj backup [OPTIONS]
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置

**功能：**
- 按系统侧 `sys-prj.yml: backup` 与项目侧 `ops-prj.yml: backup` 的声明，收集现场态到**一个归档**（含清单 + sha256）
- 保留最近 `keep` 份；含私钥 / 凭据的条目会被**点名**，请离机保管
- **不含** `contract:` 契约内容（契约另走 `prj contract export`）

### 还原现场态 (prj restore)

```bash
gops prj restore <ARCHIVE> [OPTIONS]
```

**选项：**
- `<ARCHIVE>` - 备份归档（`.tar.gz`）路径
- `--list` - 只列出归档内容，不落地
- `--dry-run` - 预演：解包校验但不改动现场

**功能：**
- 把备份归档合并回现场（先解到临时目录再覆盖；目录没了就按归档重建这部分）
- 只放回**备份里有的**内容（= 各系统 `sys-prj.yml: backup` 声明命中的路径）；交付包内容与 `contract:` 契约内容都不在其中

**示例：**
```bash
gops prj restore --list ./backup/site-20261012-120000.tar.gz
gops prj restore --dry-run ./backup/site-20261012-120000.tar.gz
gops prj restore ./backup/site-20261012-120000.tar.gz
```

### 对外契约 (prj contract)

```bash
gops prj contract export
gops prj contract import <ARCHIVE>
```

**功能：**
- `export` - 把本部署的对外契约（`sys-prj.yml: contract` 列出的文件 / 目录）打成归档，文件名带日期时间（如 `<系统>-contract-YYYYMMDD-HHMMSS.tar.gz`），用于交付 / 迁移 / 存档
- `import` - 从归档把契约灌回本部署（写进 `contract:` 列出的文件），**幂等**（同一归档重复导入结果不变）

归档的**落点 / 份数**由项目侧 `ops-prj.yml: contract`（`target` / `keep`）决定。

### 升级发布态 (prj upgrade)

```bash
gops prj upgrade [NAME] --to <VERSION|URL|PATH> --on-failure <rollback-all|halt> [OPTIONS]
```

**选项：**
- `[NAME]` - 只升级该系统（缺省 = `ops-prj.yml` 里已导入的全部系统）
- `--to` - 目标版本（按 ref 的 `addr` 模板 `{version}` 解析）或完整地址（URL / 本机路径）
- `--on-failure` - 失败处置：`rollback-all`（整工程回滚）/ `halt`（停在那里不回滚）。现阶段**必填**
- `--dry-run` - 只出计划，不动现场
- `--health-cmd` - 栈外健康检查命令（给 `sh -c`）；给了才做回滚判定
- `--health-timeout` - 健康检查超时（秒）
- `--json` - 机读结果（单行 JSON，给编排器判成败）
- `-f, --force <LEVEL>` / `-d, --debug <LEVEL>` / `--log <LOG>`

**功能：**
- 对已导入的系统做一次**带事务边界**的发布升级：diagnose → backup → apply（覆盖包内内容）→ regenerate（`sys resolve` + `localize`）→ pull → up → health
- 失败按 `--on-failure` 处置
- 第 1 版只支持 `kind: docker-compose` 的系统

### 诊断工程现场态 (prj diagnose)

```bash
gops prj diagnose [OPTIONS]      # 旧名 doctor 仍可用（隐藏别名）
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置
- `--strict` - 将警告视为错误（用于 CI 卡口）

**功能：**
- 只读检查：客户值 `values/` 是否被版本控制纳管（存在、每系统有值目录、未被 `.gitignore`、无未提交改动）
- `ops-prj.yml` 的 `sys_models` 是否重名
- `sys-prj.yml` 的 `contract:` 是否齐备（声明了但路径不在场）
- **只做各声明自身的检查，不做跨声明推理**

**示例：**
```bash
gops prj diagnose
gops prj diagnose --strict
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
- 渲染 `spec/` → `local/` 后打印**文件变更表**（`FILE | STATE`，`created` / `replaced`）：用前后内容指纹（sha256）比对，先清空 `local/` 再重建不会误报未变文件，删除不报；标头为 `<输出目录> ← <源模板>`（如 `…/local ← sys/setting/warp-fusion`），区分来源

**示例：**
```bash
# 使用默认值本地化
gops mod localize --default

# 使用自定义值文件本地化
gops mod localize --value prod-values.yml

# 使用自定义值文件并启用调试
gops mod localize --value dev-values.yml --debug 2
```

### 展示模块值变更

```bash
gops mod diff [--json]
```

只读比对「模块默认值」（`mod/<model>/vars.yml`，来源 `mod-default`）与生效值，**按模型**列出每个键的初始值 / 生效值 / 来源 / 可变性 / 变更状态。`gops mod localize` 结束时也会打印同一张表。

**示例：**
```bash
gops mod diff
gops mod diff --json
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

### 解析系统定义 (sys resolve)

```bash
gops sys resolve [OPTIONS]      # 旧名 update 仍可用（隐藏别名）
```

**选项：**
- `-d, --debug <LEVEL>` - 调试级别
- `--log <LOG>` - 日志配置
- `-f, --force` - 强制重新拉取模块 / 依赖

**功能：**
- 按 `sys/mod_list.yml` 各模块的 `addr` 把它们取到新布局 `sys/<model>/mods/<mod>/`，并解析模块 / 系统依赖
- 把模块变量 ⊕ 系统 `sys/setting/vars.yml` 变量聚合写入 `sys/merged_vars.yml`（解析结果，需入库），并刷新 `values/sys_value.yml` 注释模板
- 只动定义与磁盘内容：**不生成 `.env`**（用 `sys localize`）、**不碰运行中的服务**（用 `gops run`）

**示例：**
```bash
# 解析系统定义
gops sys resolve

# 强制重新拉取
gops sys resolve --force

# 详细调试
gops sys resolve --debug 3 --log sys=debug
```

### 打包系统

```bash
gops sys package [OPTIONS]
```

**选项：**
- `-f, --force` - 强制更新级别
- `--output <PATH>` - 输出路径（默认：父目录下 `<name>-<version>.tar.gz`）
- `--full` - 打当前目录**全部**（含制品与本地化产物，用于隔离网络交付；默认只打 git 入库文件）。旧名 `--no-git` 仍可用（隐藏别名）

**功能：**
- 先执行一次 `sys resolve`（取模块、解析变量、生成 `sys/merged_vars.yml`），保证交付包可被 `gops prj import` 完整导入
- 再打包为 `.tar.gz`：**默认只含 git 入库文件**（`git ls-files`，等价 `git archive` 的“只含入库文件”，需在 git 仓库内运行），自然排除被 `.gitignore` 忽略的产物（`sys/*/mods/`、`**/local`、`.env` 等）；`--full` 则打当前目录全部（含制品/本地化产物）
- 两种模式都会排除 `sys-prj.yml` 的 `pkg_exclude:` 节列出的路径；`pkg_include:` 则在基准集之外**额外纳入**命中它的路径（用于让**未被 git 跟踪**的生成物随包走，默认模式，可覆盖 `.gitignore`）；`deliver.lock` 作为交付清单始终随包分发（不受影响）

**`pkg_exclude` 节（`sys-prj.yml`，旧名 `ignore`）**：列出打包时排除的路径模式（glob，**相对系统根**），即使 `--full` 也排除。匹配文件自身**或**其任一祖先目录——目录级模式（如 `sys/*/mods`）会排除整棵子树。模式**锚定在根**：裸名 `mods` 只匹配根级 `mods`，任意层级请用 `**/mods`；`*` 不跨 `/`，跨级用 `**`；前导 `/` 或 `./` 会被归一化（等价于不带）。

**`pkg_include` 节（`sys-prj.yml`）**：在默认（git 入库文件）或 `--full`（整目录）的**基准集之外**额外把命中它的路径纳入交付包 —— 用于让**未被 git 跟踪**的生成物 / 制品随包走。`pkg_exclude`（排除）**优先于** `pkg_include`（相交时以排除为准）。

> 注意：`pkg_exclude` 模式过宽（如 `*`）会连 `sys/merged_vars.yml` 等一并排除；`deliver.lock` 不受影响（始终随包）。

```yaml
# sys-prj.yml
pkg_exclude:
  - artifacts
  - sys/*/mods
  - '**/cache'
  - .env
# pkg_include:
#   - artifacts/app.bin
```

**示例：**
```bash
# 默认：只含入库文件（不含制品）
gops sys package
# 整目录打包（含制品 / 被忽略的产物，用于隔离网络）
gops sys package --full
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
- `--only` - 只 localize，跳过 resolve（不解析/下载模块）

**功能：**
- 生成 `.env`：`sys/merged_vars.yml` 默认值 ⊕ `values/sys_value.yml` ⊕ `values/value.yml`
- 两个值文件都是可选、可部分覆盖：只写需要修改的项，其余取系统默认值
- **默认先解析变量**：`gops sys localize` 默认**无条件**先解析（等价于先跑一次 `gops sys resolve`，含解析/下载模块），因此改完 `sys/setting/vars.yml` 一条命令即生效；`--only` 跳过该步骤（用现有 `sys/merged_vars.yml`，**缺失时会明确报错**）。
- 若变量定义（`sys/setting/vars.yml` 等）比 `sys/merged_vars.yml` 新（常见于 `--only` 跳过解析），结尾会打印一行 `[WARN]`（仅比对 `.env` 看不到这层陈旧）
- `kind: docker-compose` 时，`.env` 供 compose 消费（默认 compose 文件为 `sys/docker-compose.yaml`，`.env` 仍在系统根）

**示例：**
```bash
# 生成本地化配置（默认先解析变量，再写 .env）
gops sys localize

# 只 localize，不解析/下载（用现有 merged_vars.yml；缺失则报错）
gops sys localize --only

# 只处理某个模块
gops sys localize --mod gateway
```

**值文件说明：** `values/sys_value.yml` 由 `sys resolve` 首次生成，整份是**注释模板**——取消注释需要覆盖的项即可；`values/value.yml` 优先级更高（覆盖层优先：`value.yml` > `sys_value.yml` > 变量定义），适合入库的客户覆盖。

`localize` 渲染 sys setting 模板（`src` → `dst`）后，会打印**文件变更表**（`FILE | STATE`，`created` / `replaced`），用前后内容指纹（sha256）比对：清空输出树再重建不会把内容未变的文件误报为变更，删除不报。

> 改了 `sys/setting/vars.yml` 而未重新解析时，`gops sys localize` 结尾会输出一行 `[WARN]`（仅比对 `.env` 看不到这层陈旧）。

### 展示系统值变更

```bash
gops sys diff [--json]
```

只读比对「系统默认值」（`sys/merged_vars.yml` 的 `system:` 段，来源 `sys-defaults`）与生效值（⊕ `values/sys_value.yml`(`sys-setting`) ⊕ `values/value.yml`(`customer`)），只列出被覆盖的键：

| 列 | 含义 |
|---|---|
| `KEY` | 变量名 |
| `INITIAL` | 初始层取值（`-` 表示初始层无此键） |
| `EFFECTIVE` | 生效值 |
| `ORIGIN` | 生效值来自哪一层 |
| `MUTABILITY` | 生效值可变性（`merged_vars.yml` 不序列化可变性，故多为 `module`） |
| `STATE` | `same` / `changed` / `added` / `removed`（表格只列非 `same` 行） |

比对用**未展开**值（`${VAR}` 展开前），避免伪变更。`gops sys localize` 结束时也会打印同一张表（无覆盖时打 `[OK] 值无覆盖`）。

对 **gxl 系统**（有 `sys/mod_list.yml`），`sys localize` 会逐模块消费 `values/<mod>/mod_value.yml`，故 `sys diff` / `localize` 还按模块分组呈现 `[mod: <name>]`（初始层 = `sys/<model>/mods/<mod>/vars.yml`；生效层 ⊕ `values/<mod>/value.yml` ⊕ `values/<mod>/mod_value.yml` ⊕ 系统层）。模块内容未下载时给 `[WARN]`（先 `gops sys resolve`）。

值文件键**大小写不敏感**（加载时归一化为大写）。`--json` 为 `{ "system": [...], "modules": [{ "module": …, "changes": [...] }], "files": [{ "target": …, "changes": [...] }] }`（只含有变更的分组）。

**文件覆盖层：** 除值以外，`sys diff` 还会列出 `sys/setting/<mod>/**` 相对模块 `<mod>/spec/**` 的**新增 / 替换**（localize 把两者都渲染进 `local/`，即「setting 覆盖了模块默认的哪些文件」）；纯路径 + 内容比对，不需渲染，也不依赖上次 localize 的磁盘状态。

**示例：**
```bash
gops sys diff
# [sys] 值变更 (1 项):
# KEY         INITIAL      EFFECTIVE    ORIGIN    MUTABILITY  STATE
# NGINX_TAG   1.25-alpine  1.27-alpine  customer  module      changed
# [mod: warp-parse] 值变更 (1 项):
# KEY  INITIAL  EFFECTIVE  ORIGIN       MUTABILITY  STATE
# CPU  1000     2000       mod-setting  module      changed

gops sys diff --json
```

> `gops prj diff` 暂不提供（prj 视角即逐系统的 `sys` 表）。

## 运行时运维命令 (gops run)

在目标系统上执行**标准运维动作**（算子流契约）。按 `sys/sys_model.yml` 的 `kind` 分派：`gxl` 系统委托 `gx run <cmd>`（需 `gx >= 0.13.0`）；`docker-compose` 系统映射到 `docker compose` 子命令（无需 gx）。

```bash
gops run download    # 下载制品        compose: pull
gops run install     # 安装组件        compose: create
gops run uninstall   # 卸载组件        compose: down
gops run start       # 启动服务        compose: up -d
gops run stop        # 停止服务        compose: stop
gops run status      # 查询状态        compose: ps
gops run diagnose    # 诊断问题        compose: config（密钥掩码注入）
```

**通用选项：** `--mod <MODULE>`、`-e, --env <ENV>`（默认 `default`）、`-d/--debug`、`--log`。

> 与 `gops sys`（**定义/交付/工件**：`new`/`resolve`/`localize`/`package`/`diff`）区分：`gops run` 只管「在环境里落地/运行」。

**示例：**
```bash
gops run start --env default
gops run status --mod nginx
gops run diagnose     # 校验并展示解析后的 compose（密钥以 ******** 掩码注入）
```

## 自升级命令 (gops self)

与 `gx self` 对齐，用于检查与升级 `gops` 自身。

### 查看状态

```bash
gops self status
```

输出当前版本、安装目录与最近一次自升级结果（`state.last_remote_version` / `state.last_result` / `state.last_error`）。

### 检查更新

```bash
# 默认 stable 通道
gops self check

# 指定通道
gops self check --channel alpha

# 机器可读输出（stdout 仅 JSON，不含版本横幅）
gops self check --channel alpha --json

# 走下载镜像
gops self check --channel alpha --mirror githubproxy
```

### 升级

```bash
# 升级到通道最新版
gops self update --channel alpha

# 跳过交互确认
gops self update --channel alpha --yes

# 只演练，不实际安装
gops self update --channel alpha --dry-run

# 指定目标版本（与清单不一致时报错）
gops self update --channel alpha --to 2.1.0

# 已是最新时强制重装
gops self update --channel alpha --force

# 走下载镜像（预设，或自定义前缀 URL）
gops self update --channel alpha --mirror githubproxy
gops self update --channel alpha --mirror https://githubproxy.cc/
```

更新前会备份当前二进制；新版本 `--version` 健康检查失败会自动回滚。

### 回滚

```bash
# 回滚到最近一次备份
gops self rollback

# 指定备份 id（14 位时间戳）
gops self rollback --id 20260321123456
```

### 下载镜像（`--mirror`）

`check` / `update` 均支持 `--mirror <PRESET|URL>`：把清单与制品的下载地址改为经过镜像前缀。

```bash
# 内置预设：githubproxy → https://githubproxy.cc/
gops self update --channel alpha --mirror githubproxy

# 自定义前缀（必须是带 scheme 的完整 URL）
gops self update --channel alpha --mirror https://githubproxy.cc/
```

- 只重写**绝对的 `http(s)` 下载地址**，`sha256` 校验不变；本地/相对路径不受影响。
- 未知预设名（既不是预设、也不是带 `scheme` 的 URL）会**直接报错**，不会被当作 URL 使用。
- 适用于 GitHub 访问慢或被阻断的网络环境。

### 说明

- 制品清单来自 `galaxio-labs/get` 的 `updates/gops` 通道，与 `inst-x.sh gops <channel>` 同一来源。
- 状态、锁与备份存放于 `~/.galaxy/self_update/gops`（与 `gx` 的同名目录隔离）。

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
├── ops-prj.yml              # 工程 manifest：name + work_envs + sys_models + backup/contract 归档设定
├── version.txt
├── _gal/                    # GXL 工程文件
├── values/                  # 客户值目录
│   └── {system-name}/
│       ├── sys_value.yml    # 值文件（只写需要覆盖的项）
│       └── value.yml        # 额外覆盖层（可选）
└── {system-name}/           # 已导入的系统目录
    └── values -> ../values/{system-name}   # 符号链接（prj import / prj sync 建立）
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
├── sys-prj.yml              # 系统根配置（test_envs / pkg_include / pkg_exclude / protect / backup / contract）
├── version.txt
├── _gal/                    # GXL 工程文件（仅 kind: gxl）
├── values/                  # 值文件目录
└── sys/
    ├── sys_model.yml        # name / model / kind / vender
    ├── docker-compose.yaml  # 系统级 compose 定义（${VAR} 占位）
    ├── mod_list.yml         # 模块列表（GXL；可选）
    ├── merged_vars.yml      # 聚合变量（sys resolve 生成，需入库）
    ├── workflows/           # GXL 工作流（可选）
    └── setting/
        ├── list.yml         # 可选
        └── vars.yml         # 系统设置变量定义（源）
```

纯 docker-compose 系统只保留 `sys_model.yml`、`docker-compose.yaml` 与 `setting/vars.yml`（详见 [System 目录结构](../operator/sys/structure/directory.md)）。

`sys-prj.yml` 里的五个现场态声明**互相独立**（各由各自的命令消费，互不影响）：`pkg_include` / `pkg_exclude`（只服务 `sys package`）、`protect`（只服务 `sys resolve` / `prj sync` / `prj upgrade`）、`backup`（只服务 `prj backup` / `restore`）、`contract`（只服务 `prj contract export` / `import`）。另，对外契约归档的落点 / 份数写在项目侧 `ops-prj.yml: contract`。

## 最佳实践

### 工程管理
```bash
# 1. 创建新工程
gops prj new --name my-project

# 2. 导入系统到工程（打包产物：.tar.gz / git / http 地址）
gops prj import --path /path/to/system --force 1

# 3. 同步 / 补齐工程系统（包内内容非破坏覆盖；缺失系统按包导入）
gops prj sync

# 4. 客户差异写在 values/<system>/value.yml（只写要覆盖的项）

# 5. 存一份现场态；或用 prj restore 还原
gops prj backup
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
gops sys resolve --force 1

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
gops sys resolve --debug 3 --log sys=debug
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

### 调试模式使用

```bash
# 基础调试
gops prj import --path /test --debug 1

# 详细调试
gops mod update --debug 2 --log mod=debug

# 跟踪级别调试
gops sys resolve --debug 3 --log sys=trace

# 跟踪级别调试（工程）
gops prj sync --debug 3 --log all=debug
```

### 日志配置示例

```bash
# 调试特定模块
gops mod update --log mod=debug

# 调试多个模块
gops sys resolve --log sys=debug,net=info

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
```

## 示例工作流

### 开发环境设置

```bash
# 1. 创建开发工程
gops prj new --name dev-project

# 2. 导入开发系统
gops prj import --path /path/to/dev-system --force 1

# 3. 同步 / 补齐工程依赖
gops prj sync --debug 2

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

当前版本：`2.3.1`

## 功能状态

| 命令 | 子命令 | 状态 | 说明 |
|------|--------|------|------|
| `gops prj` | `new` | ✅ 完成 | 创建维护工程 |
| `gops prj` | `import` | ✅ 完成 | 导入系统到工程（打包产物 `.tar.gz` / git / http） |
| `gops prj` | `sync` | ✅ 完成 | 同步 / 补齐工程系统（旧名 `update`；非破坏覆盖 + 补齐缺失系统） |
| `gops prj` | `backup` / `restore` | ✅ 完成 | 现场态归档 / 还原（清单 + sha256，含私钥点名） |
| `gops prj` | `contract export` / `import` | ✅ 完成 | 对外契约独立归档 / 回填 |
| `gops prj` | `upgrade` | ✅ 完成 | 事务式发布升级（目前仅 `kind: docker-compose`） |
| `gops prj` | `diagnose` | ✅ 完成 | 现场态只读诊断（旧名 `doctor`；`--strict` 卡口） |
| `gops mod` | `example` | ✅ 完成 | 创建示例模块结构 |
| `gops mod` | `new` | ✅ 完成 | 定义新模块操作符 |
| `gops mod` | `update` | ✅ 完成 | 更新现有模块操作符 |
| `gops mod` | `localize` | ✅ 完成 | 本地化模块配置 |
| `gops mod` | `diff` | ✅ 完成 | 展示模块值变更 |
| `gops sys` | `new` | ✅ 完成 | 创建系统（`--kind gxl` / `docker-compose`） |
| `gops sys` | `resolve` | ✅ 完成 | 解析系统定义（旧名 `update`）：取模块 + 解析变量、初始化值文件 |
| `gops sys` | `package` | ✅ 完成 | 先 resolve 再打包交付产物（`--full` 整目录） |
| `gops sys` | `localize` | ✅ 完成 | 生成 `.env`（`--only` 跳过 resolve） |
| `gops sys` | `diff` | ✅ 完成 | 展示系统值变更 |
| `gops run` | `download/install/uninstall/start/stop/status/diagnose` | ✅ 完成 | 运行时运维（按 `kind` 分派：gxl→gx；docker-compose→docker compose） |
| `gops self` | `status/check/update/rollback/skill` | ✅ 完成 | 自升级闭环 + agent skills 管理 |



## 许可证

本项目采用 MIT 许可证 - 详见项目根目录的 LICENSE 文件
