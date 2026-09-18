# Galaxy-Ops Operator 文档

这里的 `operator` 文档以当前 `galaxy-ops` 仓库实现为准，不再沿用早期的 `gmod`、`gsys`、`gops project` 等旧工具拆分说法。

当前 CLI 只有一个入口：

```bash
gops <COMMAND>
```

一级命令：

- `gops mod`：模块管理
- `gops sys`：系统管理
- `gops prj`：运维项目管理

## 对象模型

`galaxy-ops` 围绕三层对象工作：

```text
Module -> System -> Ops Project
```

- `Module`：最小可复用运维单元
- `System`：由多个模块组合形成的系统定义
- `Ops Project`：面向具体客户或环境的交付项目

这三层分别对应当前 CLI 的三组命令：

- `gops mod ...`
- `gops sys ...`
- `gops prj ...`

## 当前命令面

### 模块命令

```bash
gops mod example
gops mod new --name <name>
gops mod update
gops mod localize [--value <file> | --default]
```

### 系统命令

```bash
gops sys new --name <name> [--kind gxl|docker-compose]
gops sys update
gops sys package
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

`sys/sys_model.yml` 的 `kind` 决定部署行为：`gxl`（默认）委托 `gx` 执行；`docker-compose` 直接映射到本机 `docker compose`。

### 运维项目命令

```bash
gops prj new --name <name>
gops prj import --path <system-path>
gops prj update
gops prj reimport
```

`gops prj reimport` 按 `ops-prj.yml` 记录的 `sys_models` 重新导入系统，保留 `values/` 客户值。

## 文档索引

- [mod/README.md](./mod/README.md)：模块对象说明与 `gops mod` 使用方式
- [mod/CONFIGURATION.md](./mod/CONFIGURATION.md)：模块配置与文件结构
- [mod/DEVELOPMENT.md](./mod/DEVELOPMENT.md)：模块开发与本地调试流程
- [mod/REFERENCE.md](./mod/REFERENCE.md)：当前 CLI / 目录 / 概念参考
- [mod/TROUBLESHOOTING.md](./mod/TROUBLESHOOTING.md)：常见问题排查
- [sys/README.md](./sys/README.md)：系统对象说明与 `gops sys` 使用方式
- [sys/configuration/sys-model.md](./sys/configuration/sys-model.md)：`sys_model.yml` 字段与 `kind`
- [sys/structure/directory.md](./sys/structure/directory.md)：GXL / docker-compose 两种目录结构
- [sys/examples/microservices.md](./sys/examples/microservices.md)：GXL 多模块系统示例
- [sys/examples/docker-compose.md](./sys/examples/docker-compose.md)：纯 docker-compose 系统示例（含密钥与 `.env`）
- [sys/troubleshooting/common-issues.md](./sys/troubleshooting/common-issues.md)：常见问题排查

## 对齐说明

本目录文档已经按当前 `galaxy-ops` 代码实现收敛为以下原则：

- 只使用 `gops` 作为 CLI 入口
- 只描述当前代码里存在的命令和对象
- 文件树以真实生成结果为准
- 不再保留推断型 Rust API、旧命令名和过时的架构图
