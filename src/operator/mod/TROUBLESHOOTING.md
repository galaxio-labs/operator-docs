# Module Operator 故障排除

## 1. `gops mod new` 创建后文件很少

现象：

- 只看到 `mod-prj.yml`
- 只看到 `_gal/` 和少量 `vars.yml`

原因：

- 当前 `mod new` 生成的是最小骨架，不是完整业务模板

处理：

- 继续补齐 `spec/`、`setting.yml`、`values/`、`workflows/`
- 之后执行 `gops mod update`

## 2. `gops mod localize` 失败

常见原因：

- `vars.yml` 未定义完整
- 指定的 `--value` 文件不存在
- 值文件内容和变量结构不匹配

建议：

```bash
gops mod localize --default --debug 2
```

先用默认值跑通，再切换到真实值文件。

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
