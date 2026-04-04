# System 文件组织

## 核心文件

当前 `System` 对象围绕下面几类文件组织：

### 根目录文件

- `sys-prj.yml`：系统根配置
- `version.txt`：版本标记
- `.gitignore`

### `_gal/`

- `adm.gxl`：管理流程入口
- `work.gxl`：执行流程入口
- `project.toml`：GXL 工程配置

### `sys/`

- `sys_model.yml`：系统模型定义
- `mod_list.yml`：模块列表定义
- `setting/list.yml`：设置列表
- `setting/vars.yml`：设置变量
- `workflows/operators.gxl`：系统操作工作流

## 文件职责

### `sys_model.yml`

描述系统本身，属于系统对象定义层。

### `mod_list.yml`

描述系统包含哪些模块以及模块引用关系，属于系统组合层。

### `setting/list.yml` / `setting/vars.yml`

描述系统设置、本地化和导出时会用到的配置项，属于系统设置层。

### `operators.gxl`

描述系统操作入口，属于工作流层。

## 当前 CLI 与文件关系

- `gops sys new`：初始化上面这套文件骨架
- `gops sys update`：同步系统引用、本地内容和相关生成结果
- `gops sys localize`：围绕 `sys/` 下模型、模块列表、设置和值做本地化
- `gops sys setting --init`：初始化系统设置相关文件

## 不再使用的旧说法

当前文档不再使用这些旧描述：

- `SYS_BIN = "gsys"`
- `MOD_BIN = "gmod"`
- “系统级 vars.yml 必然位于 sys/ 根目录”
- “sys/mods/ 是固定初始结构”
