# Changelog

# 文档更新 2026-09-18 —— 对齐当前工具集与 galaxy-ops 实现

## 命令行工具
- `gflow` → **`gx`**：`cmd/gflow.md` 重写为 `cmd/gx.md`（命令表按实机 `gx --help` 校正；补 `-c/--conf`、`--cmd-arg`、`--dryrun`；目录 `./_rg/` → `./_gal/`）
- 移除已不存在的 `gmod` / `gsys` 条目；`gprj` 标注为 legacy（能力已并入 `gx init project` / `gx mod update` / `gx adm` / `gx check`）
- `cmd/gops.md`：修正 `ops-systems.yml`（已并入 `ops-prj.yml`）、`gops sys localize` 参数（`--mod` / `--only`）、新增 `sys package` / `prj reimport` / `sys new --kind`；目录树、调试级别、版本号与功能表按当前实现重写
- `cmd/ops/README.md`：补当前命令索引

## 维护器（operator/）
- `operator/sys/README.md`：新增 `kind`（gxl / docker-compose）分派表、值/本地化流程、`${SEC_xxx}` 密钥说明
- `operator/sys/configuration/sys-model.md`：补齐字段（`name` / `kind` / `model` / `vender`）与 `kind` 语义
- `operator/sys/structure/*`：拆出 GXL 与 docker-compose 两套真实目录结构；新增 `sys/merged_vars.yml`、`values/sys_value.yml`（注释模板）、`values/value.yml`、`.env`
- `operator/sys/troubleshooting/common-issues.md`：重写常见问题（未解析变量报错、值文件未生效、未展开 `${GXL_PRJ_ROOT}`、compose 变量未定义）
- 新增 `operator/sys/examples/docker-compose.md`（纯 docker-compose 系统示例：变量/密钥/`.env`/部署/交付）
- `operator/mod/*`、`operator/README.md`：同步 `gx` 名称与命令面

## 工程
- `SUMMARY.md`：移除指向不存在文件的条目（`cmd/gmod.md`、`cmd/gsys.md`、`gxl/gxl.md`），注册新页面
- `book.toml`：移除 mdBook 不认识的字段 `multilingual`，`mdbook build` 恢复可用
- 并入既有的 `galaxy-sec` → `galaxio-labs` 署名与链接更新


# Galaxy Flow v0.8.3 → v0.8.6 发布说明
## 🚀 版本信息
- 起始版本 : v0.8.3
- 目标版本 : v0.8.6
- 当前版本 : 0.8.6
## ✨ 主要新功能
### 1. 日志重定向系统重构
- 新增 : 使用管道(pip)进行日志重定向的全新实现
- 优化 : 改进了日志处理机制，提高了性能和稳定性
- 提交 : a5bf576 , deea236 , 2e1ce2c , be686b1 , 4e3f1a7
### 2. 逻辑表达式支持
- 新增 : 逻辑表达式( logic_exp )功能实现
- 实现 : 完整的逻辑表达式解析和执行能力
- 提交 : d646fd4 , fc7c975
### 3. 归档功能增强
- 新增 : gx.tar 和 gx.untar 命令支持
- 用途 : 提供原生的压缩和解压缩能力
- 提交 : 1755d4d
## 🔧 改进与优化
### 代码质量
- 重构 : 成功状态处理逻辑重构 ( 6dce866 )
- 优化 : 表达式逻辑更新 ( 73dcb46 )
- 清理 : 取消taskvalue中的日志信息 ( 523f85b )
### 依赖更新
- 更新 : clap依赖升级到最新版本 ( 9246378 )
- 更新 : 多个crate依赖项更新 ( 1051001 , 352e19a )
- 维护 : 代码格式化和clippy修复 ( 08b51f2 , c57879b , b049906 )
## 🐛 问题修复
### 关键修复
- 修复 : 模块路径错误问题 (#61) - d099a55
- 修复 : 多个相关问题 (#62, #61) - 4419cad
- 修复 : 模块名称列表问题 - 19bfa32
### 其他修复
- 修复 : 通道与启用状态的关联问题 - 5592286
- 修复 : 干运行参数传递给子gxl的问题 - 4644a1b
## 📋 其他变更
### 构建和部署
- 更新 : artifact构建更新 ( 9c1193d )
- 更新 : 管理配置更新 ( 3dcc127 )
- 维护 : 版本号更新到0.8.6 ( 2f4acfe , 5b4dbb0 )
### 内部改进
- 重构 : 使用常量字符串优化 ( 64e7d30 , daf17ef )
- 新增 : 读取文件日志功能 ( 142b448 )
## 📝 升级建议
1. 1.
   平滑升级 : 从v0.8.3升级到v0.8.6是向后兼容的
2. 2.
   新功能试用 : 建议尝试新的日志重定向和逻辑表达式功能
3. 3.
   依赖检查 : 确保所有依赖项已更新到兼容版本
## 📊 变更统计
- 总提交数 : 30+ 次提交
- 功能新增 : 5个主要功能
- 问题修复 : 6个关键修复
- 代码优化 : 10+ 项改进
本次发布专注于提升系统稳定性、增加新功能，并修复已知问题，为用户提供更好的DevSecOps自动化体验。

# 0.8.3 
## 新增
* GXL 支持 数字、BOOL、数组、对象 数据类型 
* 提供 defined 函数 - 检查变量是否已定义
* 提供 gx.shell 方便 shell 调用
* 支持 ${VAR:default} 变量定义默认值
* gprj update mod 或 gflow --update mod 支持更新项目依赖的Mod
 
## 改进
* gx.read_file 读取内容到对象，便于后续处理
* winnow 升级 0.7
* 对于远程Mod的获取，去掉外部Git 依赖
* 修改外部依赖

# 0.7.0
## 新增
* 支持事务机制 
* 支持dryrun机制 - 允许预览操作结果而不实际执行

# 0.6.4  
## 新增
* 支持 gx.cmd  quiet (静默） - 自定义控制cmd的日志输出与否


# 0.6.2
## 新增
* 优化日志输出，增加日志的重定向，支持捕获控制台标准日志输出


# 0.6.0
## 新增
* 生成任务报告 - 提供执行过程和结果的详细信息
* 支持flow上的Task注解 - 增强流程定义的灵活性

## 改进
* 改进 flow 编排语法，由: 变为 |  符号


# gflow-0.5.3

## 内置环境变量
- GXL_PRJ_ROOT:    最近定义的 _gal/project.toml 的目录

##  extern mod 支持变量
 ```
 extern mod head { path = "${GXL_START_ROOT}/_gal/"; }
 ```
[0.5.3 下载](https://github.com/galaxio-labs/galaxy-flow/releases/tag/v0.5.3)

# 0.5.2
## 内置环境变量
- GXL_START_ROOT:  GXL 启动处理的目录
- GXL_CUR_DIR:  GXL 当前所在目录，在调用gx.run时，与GXL_START_ROOT可能不同
