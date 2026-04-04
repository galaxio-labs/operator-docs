# System 常见问题

## 1. `gops sys new` 卡在选择系统型号

原因：

- 当前实现会交互选择 `ModelSTD`

建议：

- 正常在交互终端选择
- 自动化测试场景可设置 `TEST_MODE=1`

## 2. `gops sys setting --init` 没有生成预期文件

确认点：

- 当前目录必须是系统根目录
- `sys/setting/` 目录是否存在

## 3. `gops sys localize` 失败

常见原因：

- `sys_model.yml` 缺失
- `mod_list.yml` 未维护完整
- 设置变量和值文件未准备好

建议：

```bash
gops sys localize --debug 2
```

先打开调试输出定位是哪一层配置缺失。

## 4. `download/install/start` 等系统命令失败

原因：

- 这些命令最终依赖系统工作流和 `gflow`

建议：

- 先确认 `sys/workflows/operators.gxl` 存在
- 再确认 `gflow` 可执行
- 再检查 `--env` 与 `--mod` 传参是否正确

## 5. 文档和目录树不一致

处理原则：

- 以当前 `gops sys new` 真实生成结果为准
- 以当前仓库代码为准
- 不再使用旧版 `gsys` 文档作为依据
