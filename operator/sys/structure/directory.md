# System 目录结构

本文档以当前 `gops sys new` 的真实生成结果为准。

## 最小系统骨架

```text
<system-root>/
├── .gitignore
├── version.txt
├── sys-prj.yml
├── _gal/
│   ├── adm.gxl
│   ├── project.toml
│   └── work.gxl
└── sys/
    ├── .gitignore
    ├── sys_model.yml
    ├── mod_list.yml
    ├── workflows/
    │   └── operators.gxl
    └── setting/
        ├── list.yml
        └── vars.yml
```

## 目录说明

### `_gal/`

GXL 工程目录，保存项目级工作流入口：

- `adm.gxl`
- `work.gxl`
- `project.toml`

### `sys/`

系统定义主目录。

### `sys/sys_model.yml`

系统模型定义文件。

### `sys/mod_list.yml`

系统模块列表定义文件。

### `sys/setting/`

系统设置目录。

当前骨架默认会生成：

- `list.yml`
- `vars.yml`

### `sys/workflows/operators.gxl`

系统级工作流入口。

## 现实说明

旧文档里常见的这些内容，不应再视为当前最小骨架的一部分：

- `sys/vars.yml`
- `sys/mods/`
- `test_res/`
- 独立 `gsys` CLI 生成目录

这些内容可能在后续导入模块、本地化或扩展流程中出现，但不是 `gops sys new` 的默认输出。
