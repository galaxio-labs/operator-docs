# Module Operator 开发流程

## 当前开发入口

模块开发从 `gops mod` 开始，而不是 `gmod`。

```bash
gops mod new --name <module-name>
```

## 推荐流程

### 1. 创建模块骨架

```bash
mkdir demo-work && cd demo-work
gops mod new --name postgresql
cd postgresql
```

### 2. 补齐模块模型内容

先检查 `mod/` 下生成的模型目录（`gops mod new` 默认生成三个）：

```text
mod/
├── arm-mac14-host/
├── x86-ubt22-host/
└── x86-ubt22-k8s/
```

每个模型目录已包含以下文件，按需修改即可：

- `vars.yml`
- `spec/artifact.yml`
- `spec/depends.yml`
- `workflows/operators.gxl`
- `_gal/work.gxl`

`setting.yml` 不在 `gops mod new` 的初始骨架中，需要自定义本地化行为时再手工补充。

### 3. 更新本地引用

```bash
gops mod update
```

需要强覆盖时：

```bash
gops mod update --force 2
```

### 4. 本地化验证

先准备好值文件（`gops mod update` 会在模块根生成 `values/<model>/` 下的模板）：

```text
values/
└── x86-ubt22-k8s/
    ├── sys_value.yml
    └── mod_value.yml
```

然后执行本地化：

```bash
gops mod localize
```

本地化会读取 `values/<model>/` 生成 `mod/<model>/local/`。

> `--value` / `--default` 参数虽然可用，但当前 `gops mod localize` 实现并未消费它们；实际值始终来自 `values/<model>/`。

### 5. 进入系统组合

模块完成后，通常不直接交付，而是继续：

```bash
gops sys new --name demo-system
```

把模块纳入系统对象中。

## 调试参数

当前模块命令统一支持调试参数：

```bash
gops mod new --name nginx --debug 1
gops mod update --debug 2 --log debug
gops mod localize --debug 3
```

## 现实边界

当前实现里，模块开发流程要注意几点：

- `gops mod new` 生成的是模板骨架，业务文件仍需按需修改
- `localize` 依赖 `values/<model>/` 下的值文件和 `vars.yml` 变量定义，先补齐 `vars.yml` 再做本地化
- 模块是系统的输入，不是交付终点
- 执行类工作流能力最终仍由 `galaxy-flow` / `gx` 承担
