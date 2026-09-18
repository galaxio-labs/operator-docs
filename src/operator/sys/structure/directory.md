# System 目录结构

本文档以当前 `gops sys new` 的真实生成结果为准。系统有两种部署类型，目录结构不同。

## GXL 系统（默认）

```bash
gops sys new --name <name>
```

```text
<system-root>/
├── .gitignore
├── docker-compose.yml       # sys new 默认生成的 compose 定义（用 ${VAR} 占位）
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
├── docker-compose.yml       # 系统级 compose 定义
├── sys-prj.yml
├── version.txt
└── sys/
    ├── sys_model.yml        # name / kind: docker-compose / vender
    └── setting/
        └── vars.yml
```

compose 类型不生成 `_gal/`、`values/`、`mod_list.yml`、`workflows/`、`setting/list.yml`。

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
- `sys/mods/`（由本地化过程生成，不是初始结构）
- `test_res/`
- 独立 `gsys` CLI 生成目录
