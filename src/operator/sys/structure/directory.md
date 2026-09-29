# System 目录结构

本文档以当前 `gops sys new` 的真实生成结果为准。系统有两种部署类型，目录结构不同。

## GXL 系统（默认）

```bash
gops sys new --name <name>
```

```text
<system-root>/
├── .gitignore
├── sys-prj.yml              # 系统根配置
├── version.txt
├── _gal/                    # GXL 工程目录
│   ├── adm.gxl
│   ├── project.toml
│   └── work.gxl
├── values/                  # 值文件目录（本地化输入）
└── sys/
    ├── .gitignore
    ├── sys_model.yml        # name / model / vender（kind 缺省 = gxl）
    ├── docker-compose.yaml  # sys new 默认生成的 compose 定义（用 ${VAR} 占位）
    ├── mod_list.yml         # 模块列表
    ├── workflows/
    │   └── operators.gxl
    └── setting/
        ├── list.yml
        └── vars.yml
```

## 纯 docker-compose 系统

```bash
gops sys new --name <name> --kind docker-compose
```

```text
<system-root>/
├── .gitignore
├── sys-prj.yml
├── version.txt
└── sys/
    ├── sys_model.yml        # name / kind: docker-compose / vender
    ├── docker-compose.yaml  # 系统级 compose 定义
    └── setting/
        └── vars.yml
```

compose 类型不生成 `_gal/`、`values/`、`mod_list.yml`、`workflows/`、`setting/list.yml`。

compose 文件默认位于 `sys/`，`gops sys` 按 `sys/compose.{yaml,yml}` → `sys/docker-compose.{yaml,yml}` → 系统根同名文件的顺序查找。无论文件在哪，compose **项目目录都锚定系统根**（项目名 = 根目录名，相对挂载路径与 `.env` 均相对系统根）。把文件放在系统根（旧布局）仍受支持：此时 `gops` 不加 `-f`，交由 docker 自动发现（`docker-compose.override.yml` 自动合并、`COMPOSE_FILE` 环境变量继续生效）；`sys/` 布局下由 `gops` 显式合并 `<sys>/<stem>.override.{yaml,yml}`。

## 运行时生成的文件

`gops sys update` / `gops sys localize` 会在需要时补齐：

- `sys/merged_vars.yml`：聚合变量（模块 ⊕ 系统），需入库
- `values/sys_value.yml`：值文件（**注释模板**；取消注释需要覆盖的项即可）
- `values/setting/mod_value.yml`：本地化辅助值文件
- `.env`：`sys localize` 导出的非密钥配置（供 compose 消费）

## 可选文件

下列文件缺失时按空处理，纯 compose 系统可以完全不提供：

- `sys/mod_list.yml`
- `sys/workflows/`
- `sys/setting/list.yml`

## 现实说明

旧文档里常见的这些内容，不应再视为当前最小骨架的一部分：

- `sys/vars.yml`
- `sys/<model>/mods/`（由 `gops sys update` 生成，不是初始结构）
- `test_res/`
- 独立 `gsys` CLI 生成目录
