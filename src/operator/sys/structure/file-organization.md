# System 文件组织

系统围绕下面几类文件组织。其中 `_gal/`、`mod_list.yml`、`workflows/`、`setting/list.yml` 只属于 GXL 类型（见 [目录结构](./directory.md)）。

## 根目录文件

- `sys-prj.yml`：系统根配置
- `docker-compose.yml`：系统级 compose 定义（`sys new` 默认生成，用 `${VAR}` 占位）
- `version.txt`：版本标记
- `.gitignore`

## `_gal/`（仅 GXL 系统）

- `adm.gxl`：管理流程入口
- `work.gxl`：执行流程入口
- `project.toml`：GXL 工程配置

## `sys/`

- `sys_model.yml`：系统模型定义（`name` / `model` / `kind` / `vender`）
- `mod_list.yml`：模块列表定义（GXL；可选）
- `merged_vars.yml`：聚合变量（`sys update` 生成，需入库）
- `setting/list.yml`：设置列表（可选）
- `setting/vars.yml`：设置变量定义（源）
- `workflows/operators.gxl`：系统操作工作流（GXL；可选）

## `values/`（本地化输入）

- `sys_value.yml`：值文件。`sys update` 首次生成的是**注释模板**（可用变量全部以注释列出），取消注释需要覆盖的项即可；保持注释的项取系统默认值。
- `value.yml`：额外覆盖层，优先级最高（适合入库的客户覆盖）。
- `setting/mod_value.yml`、`<mod>/mod_value.yml`：本地化辅助值文件。

## `.env`

`gops sys localize` 生成的非密钥配置（`KEY=VALUE`），供 `docker compose` 消费。密钥不写入 `.env`。

## 文件职责与本地化

```text
.env = sys/merged_vars.yml 默认值 ⊕ values/sys_value.yml ⊕ values/value.yml
```

后两者都是**可选、可部分覆盖**：只写需要修改的项，其余取系统默认值。

- `sys_model.yml`：描述系统本身（含 `kind`），属于系统对象定义层
- `mod_list.yml`：描述系统包含哪些模块，属于系统组合层
- `setting/vars.yml` / `setting/list.yml`：系统设置层
- `merged_vars.yml`：已解析的聚合变量（系统默认值的来源）
- `operators.gxl`：工作流层

## 当前 CLI 与文件关系

- `gops sys new`：初始化文件骨架（按 `kind` 决定是否生成 GXL 骨架）
- `gops sys update`：解析变量 → `sys/merged_vars.yml`，并初始化 `values/`
- `gops sys package`：先 `update` 再打包为 `<name>-<version>.tar.gz`
- `gops sys localize`：按上述规则生成 `.env`
- `gops sys setting --init`：初始化系统设置相关文件

## 不再使用的旧说法

- `SYS_BIN = "gsys"` / `MOD_BIN = "gmod"`（GXL 模板中已改为 `"gops sys"` / `"gops mod"`）
- “系统级 vars.yml 必然位于 sys/ 根目录”
- “sys/mods/ 是固定初始结构”
- “系统变量文件叫 `sys/sys_vars.yml`”（已重命名为 `merged_vars.yml`，旧名仅作读取兼容）
