# Changelog

# 工程 2026-09-18 —— 站点源移入 src/，避免 .git 被拷进产物

- `book.toml` 的 `src` 由 `./` 改为 `src`，站点内容（`SUMMARY.md`、`README.md`、`CHANGELOG.md`、`cmd/`、`gxl/`、`operator/`、`config/`、`buildin.md`、`work.md`、`mermaid.min.js`、`favicon.svg`）平移至 `src/`
- 原因：站点源为仓库根时，mdBook 会把 `.git/`（约 5.2MB，含 objects/refs）、`.github/`、`.gitignore` 一并拷进 `book/` 产物（并且遍历 `.git` 时会撞上 git 临时 index 文件而偶发构建失败）。移入子目录后这些落在站点源之外
- `theme/` 保留在 `book.toml` 同级（mdBook 从 book root 取 `theme/`，已实测确认）；产物不再包含 `book.toml`
- galaxy-flow 的 `scripts/sync-gxl-docs.sh` 默认 `--dest` 与 `GXL docs sync check` workflow 同步改为 `src/gxl`

# 页面风格 2026-09-18 —— 对齐 wp-docs 主题

- 移植 wp-docs 的 VitePress 风格 mdBook 主题：新增 `theme/`（`site.css` 与上游一致；`site.js` 裁掉 wp 专有的顶栏/中英切换/版本横幅，保留侧栏折叠、侧栏宽度持久化、本页目录、mermaid 主题联动），`book.toml` 设 `default-theme` / `preferred-dark-theme` 并指向该目录
- favicon 改由 `theme/favicon.svg` 提供；删除 `mermaid.css`（其内容是一段报错文本，被误当样式表引用）
- `mermaid.min.js` 改为按需懒加载（站内无 mermaid 图，原先每页白加载 2.9MB）
- CI 固定 mdBook `0.5.2`：主题依赖 0.5 的 DOM 结构

# 文档更新 2026-09-18 —— 对齐当前工具集与 galaxy-ops 实现

- **命令行工具**：`cmd/gflow.md` 重写为 `cmd/gx.md`（命令表按实机 `gx --help` 校正）；移除 `gmod` / `gsys` 条目，`gprj` 标注 legacy；`cmd/gops.md` 按当前实现重写（`ops-systems.yml` 已并入 `ops-prj.yml`、`sys localize` 参数、`sys package` / `prj reimport` / `sys new --kind`）
- **维护器**：`operator/sys/*` 补齐 `kind`（gxl / docker-compose）分派、`sys-model` 字段、GXL 与 docker-compose 两套目录结构、`merged_vars.yml` / `sys_value.yml` / `.env` 与常见问题，并新增 docker-compose 示例；`operator/mod/*` 与 README 同步 `gx` 名称
- **工程**：`SUMMARY.md` 清掉指向不存在文件的条目并注册新页；`book.toml` 移除非法字段 `multilingual`（`mdbook build` 恢复可用）；并入 `galaxy-sec` → `galaxio-labs` 署名

# Galaxy Flow v0.8.3 → v0.8.6

## 新增
- 日志重定向系统重构：改用管道(pipe)实现，改进处理机制与稳定性
- 逻辑表达式（`logic_exp`）：完整的解析与执行能力
- `gx.tar` / `gx.untar`：原生压缩与解压缩能力

## 改进
- 成功状态处理逻辑重构、表达式逻辑更新、清理 taskvalue 中的日志
- 依赖更新（clap 等）、代码格式化与 clippy 修复、artifact 构建更新
- 新增读取文件日志功能

## 修复
- 模块路径错误、模块名称列表问题
- 通道与启用状态的关联问题
- 干运行参数未传递给子 gxl 的问题

> 从 v0.8.3 升级到 v0.8.6 向后兼容；建议试用新的日志重定向与逻辑表达式功能。

# 0.8.3
## 新增
* GXL 支持 数字、BOOL、数组、对象 数据类型
* 提供 defined 函数 - 检查变量是否已定义
* 提供 gx.shell 方便 shell 调用
* 支持 ${VAR:default} 变量定义默认值
* gprj update mod 或 gflow --update mod 支持更新项目依赖的 Mod

## 改进
* gx.read_file 读取内容到对象，便于后续处理
* winnow 升级 0.7
* 对于远程Mod的获取，去掉外部Git 依赖
* 修改外部依赖

# 0.7.0

## 新增
* 支持事务机制
* 支持 dryrun 机制（预览操作结果而不实际执行）

# 0.6.4

## 新增
* `gx.cmd` 支持 quiet（静默）：自定义控制 cmd 的日志输出

# 0.6.2

## 新增
* 优化日志输出、增加日志重定向，支持捕获控制台标准日志输出

# 0.6.0

## 新增
* 生成任务报告（执行过程与结果详情）
* 支持 flow 上的 Task 注解

## 改进
* flow 编排语法由 `:` 改为 `|`

# gflow-0.5.3

## 内置环境变量
- `GXL_PRJ_ROOT`：最近定义的 `_gal/project.toml` 所在目录

## extern mod 支持变量

```gxl
extern mod head { path = "${GXL_START_ROOT}/_gal/"; }
```

[0.5.3 下载](https://github.com/galaxio-labs/galaxy-flow/releases/tag/v0.5.3)

# 0.5.2

## 内置环境变量
- `GXL_START_ROOT`：GXL 启动处理的目录
- `GXL_CUR_DIR`：GXL 当前所在目录（调用 `gx.run` 时可能与 `GXL_START_ROOT` 不同）
