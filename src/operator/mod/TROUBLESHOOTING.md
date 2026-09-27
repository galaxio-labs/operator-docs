# Module Operator 故障排除

## 1. `gops mod new` 创建后文件很少

现象：

- 每个 `mod/<model>/` 下只有模板文件（`vars.yml` / `spec/` / `workflows/operators.gxl` / `_gal/work.gxl`）
- 没有 `setting.yml`，也没有 `values/`

原因：

- 当前 `mod new` 生成的是模板骨架，不是完整业务模板
- `setting.yml` 和 `values/` 不由 `mod new` 生成

处理：

- 按需修改 `mod/<model>/` 下的模板文件
- 执行 `gops mod update` 生成 `values/<model>/` 值文件模板
- 需要自定义本地化行为时再手工补充 `setting.yml`

## 2. `gops mod localize` 失败

常见原因：

- `vars.yml` 未定义完整
- 模块根 `values/<model>/` 下的 `sys_value.yml` / `mod_value.yml` 缺失或结构不匹配
- 尚未执行 `gops mod update`，导致值文件模板未生成

建议：

```bash
gops mod update
gops mod localize --debug 2
```

先生成 `values/<model>/` 值文件，再用 `--debug 2` 定位问题。

> 注意：`gops mod localize` 声明的 `--value` / `--default` 目前未被实现消费，值始终来自 `values/<model>/`。

## 3. `gops mod update` 覆盖了本地内容

原因：

- 使用了较强的 `--force` 级别

建议：

- 默认先不用 `--force`
- 必要时先试 `--force 1`
- 只有明确要覆盖时再用 `--force 2` 或 `3`

## 4. 模块目录模型不符合预期

现象：

- `mod/` 下生成的模型目录和预想的平台不同

原因：

- 当前模板和 `ModelSTD` 支持集合由代码决定，不由文档静态列死

建议：

- 以生成结果为准
- 不要继续沿用旧文档里的目标平台列表

## 5. 工作流无法执行

现象：

- 模块骨架存在，但后续执行工作流失败

原因：

- `galaxy-ops` 负责组织和生成
- 真正的工作流执行依赖 `galaxy-flow` / `gx`

建议：

- 先确认模块和系统对象已本地化成功
- 再检查 `gx` 是否可执行、工作流入口是否存在
