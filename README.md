# galaxio-labs Operator Ecosystem

## 包括

* DSL 语言：GXL
* 维护器（模块 / 系统 / 运维项目）
* 命令行工具
    * `gx`：GXL 执行器（`galaxy-flow`）
    * `gops`：模块 / 系统 / 运维项目管理（`galaxy-ops`）

> 命名变更：早期的独立命令已收敛或更名——
> `gflow` → **`gx`**；`gmod` / `gsys` → **`gops mod` / `gops sys`**；
> `gprj` 的项目脚手架能力 → **`gx init project`**。

## 核心流程

1. `gops mod` 创建模块维护器，用 GXL 编写维护器的 workflow
2. `gops sys` 创建系统维护器，组合多个模块维护器，用 GXL 编写 workflow
3. 系统维护器保存到配置管理库中，待发布到客户环境
4. 在客户环境中，使用 `gops prj` 创建维护工程，并加载系统维护器
5. 在客户环境中，使用 `gx` 执行维护器的 workflow
6. 保存维护工程到配置管理库中

## 文档索引

- 命令行工具
    - [gops](cmd/gops.md)：模块 / 系统 / 运维项目管理
    - [gx](cmd/gx.md)：GXL 执行器
- 维护器
    - [概述](operator/README.md)
    - [系统维护器](operator/sys/README.md)
    - [模块维护器](operator/mod/README.md)
- GXL
    - [语法](gxl/help.md)
    - [变量定义](gxl/var_def.md)
    - [内置常量](gxl/const.md)
- 配置
    - [网络访问控制](config/net-access-ctrl-guide.md)
