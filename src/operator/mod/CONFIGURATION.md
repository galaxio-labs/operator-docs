# Module Operator 配置说明

本文档只描述当前 `galaxy-ops` 代码中已经存在的模块配置对象和文件名。

## 核心文件

创建模块后，当前实现会生成这些关键文件：

```text
<module-root>/
├── .gitignore
├── mod-prj.yml
├── version.txt
├── _gal/
│   ├── adm.gxl
│   ├── project.toml
│   └── work.gxl
└── mod/
    └── <model>/
        ├── vars.yml
        ├── _gal/work.gxl
        ├── spec/
        │   ├── artifact.yml
        │   └── depends.yml
        └── workflows/
            └── operators.gxl
```

运行 `gops mod update` / `gops mod localize` 后，模块目录还会出现这些约定目录或文件：

- `mod/<model>/local/`：`gops mod localize` 生成的本地化输出
- `mod/<model>/_used.json`：`gops mod localize` 生成的实际使用值
- `values/<model>/sys_value.yml`、`values/<model>/mod_value.yml`：值文件（注意在模块根 `values/` 下，不在 `mod/<model>/` 里）
- `values/<model>/.used_value.yml`：本地化时导出的可读值
- `mod/<model>/setting.yml`：本地化行为设置（可选；`gops mod new` 不生成，`gops mod example` 或手工补充时才有）

这些名字来自当前代码常量：

- `spec/`
- `artifact.yml`
- `depends.yml`
- `setting.yml`
- `values/`
- `workflows/`
- `local/`

## 文件职责

### `mod-prj.yml`

模块项目根配置。它是模块对象的入口配置文件，`ModOperator::load` / `save` 都围绕它工作。

### `_gal/adm.gxl`

管理类工作流入口。

### `_gal/work.gxl`

执行类工作流入口。

### `_gal/project.toml`

当前生成模板里的 GXL 工程配置文件。

### `mod/<model>/vars.yml`

某个 `ModelSTD` 下的模块变量定义。当前模块骨架至少会生成这个文件。

### `mod/<model>/spec/artifact.yml`

模块构件定义，通常用于描述下载资源、源码包或依赖包。

### `mod/<model>/spec/depends.yml`

模块依赖定义，用于组织本地依赖、仓库依赖或附加资源。

### `mod/<model>/setting.yml`

模块本地化行为相关设置（可选，`gops mod new` 不生成）。

### `values/<model>/`

模块值文件目录（位于模块根目录下，**不是** `mod/<model>/values/`）。`gops mod update` 会在此生成 `sys_value.yml` 与 `mod_value.yml`，`gops mod localize` 会读取它们执行本地化。

### `mod/<model>/workflows/`

模块工作流目录，通常放模块级 `operators.gxl` 等流程文件。

### `mod/<model>/local/`

模块本地化结果或局部输出目录。

## ModelSTD 目录

模块目录下按模型拆分。`ModelSTD` 当前支持三种组合（`gops mod new` 会全部生成）：

- `arm-mac14-host`（`CpuArch::Arm` + `OsCPE::MAC14` + `RunSPC::Host`）
- `x86-ubt22-host`（`CpuArch::X86` + `OsCPE::UBT22` + `RunSPC::Host`）
- `x86-ubt22-k8s`（`CpuArch::X86` + `OsCPE::UBT22` + `RunSPC::K8S`）

模型名由 `ModelSTD` 决定，表示 CPU / OS / 运行空间组合（来自 `CpuArch` / `OsCPE` / `RunSPC` 三个枚举）。

## 当前配置边界

当前代码里，模块配置的真实边界是：

- 模块根配置：`mod-prj.yml`
- 模型级配置：`mod/<model>/...`（`vars.yml` / `spec/` / `workflows/` / `_gal/work.gxl`）
- 值文件和本地化输出：模块根 `values/<model>/` 与模型内 `mod/<model>/local/`
- 工作流入口：`_gal/*.gxl` 与 `workflows/operators.gxl`

不要再按旧文档理解为独立 `gmod` 工具或多套历史模板系统。
