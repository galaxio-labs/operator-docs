# Module Operator 参考

## CLI 参考

### `gops mod`

```bash
gops mod <COMMAND>
```

子命令：

- `example`
- `new`
- `update`
- `localize`

### `gops mod new`

```bash
gops mod new --name <NAME> [--debug <0..3>] [--log <level>]
```

### `gops mod update`

```bash
gops mod update [--debug <0..3>] [--log <level>] [--force <0..3>]
```

`--force` 当前含义：

- `0`：正常
- `1`：跳过确认
- `2`：覆盖文件
- `3`：强制拉取

### `gops mod localize`

```bash
gops mod localize [--value <file>] [--default]
```

> 注意：`--value` / `--default` 参数已声明，但当前实现未消费；实际值来自模块根 `values/<model>/` 下的值文件。

## 目录参考

### 最小模块骨架

`gops mod new` 按支持的 `ModelSTD` 生成三个模型目录（`arm-mac14-host` / `x86-ubt22-host` / `x86-ubt22-k8s`），每个模型结构相同：

```text
<module>/
├── .gitignore
├── version.txt
├── mod-prj.yml
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

### 运行 / 本地化后新增

```text
<module>/
├── values/
│   └── <model>/
│       ├── sys_value.yml
│       ├── mod_value.yml
│       └── .used_value.yml
└── mod/<model>/
    ├── local/                 # gops mod localize 输出
    ├── _used.json             # gops mod localize 生成
    └── setting.yml            # 可选，非 gops mod new 生成
```

## 代码参考

当前模块相关实现主要在这些文件：

- `app/gops/commands/mod_cmd.rs`
- `src/module/operator.rs`
- `src/module/spec.rs`
- `src/module/model.rs`
- `src/module/refs.rs`
- `src/module/depend.rs`

## 术语参考

- `Module`：模块对象
- `ModOperator`：模块对象的代码实现入口
- `ModelSTD`：模型标识，描述 CPU / OS / 运行空间组合
- `localize`：根据变量和值文件生成本地结果
- `update_local`：同步本地依赖和引用

## 当前限制

下面这些内容不再视为当前实现的一部分：

- 独立 `gmod` CLI
- 旧版多工具拆分说明
- 推断型 Rust API 文档
- 未在当前代码里出现的模板系统和扩展点
