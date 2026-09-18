# System 常见问题

## 1. `gops sys new` 卡在选择系统型号

原因：

- `kind: gxl` 的系统会交互选择 `ModelSTD`

建议：

- 正常在交互终端选择
- 自动化测试场景可设置 `TEST_MODE=1`
- 不需要型号的纯 compose 系统用 `gops sys new --kind docker-compose`（不询问型号）

## 2. `gops sys setting --init` 没有生成预期文件

确认点：

- 当前目录必须是系统根目录
- `sys/setting/` 目录是否存在

## 3. `gops sys localize` 失败

常见原因与报错：

- **`系统变量未解析：缺少 .../sys/merged_vars.yml`**
  → 先执行 `gops sys update` 解析变量；或去掉 `--only`，让 `localize` 自动先 `update`。
- `sys_model.yml` 缺失
- 值文件内容不是合法 YAML
  （提示：全注释 / 空文件会被视为**空覆盖**，不会报错）

建议：

```bash
gops sys localize --debug 2
```

先打开调试输出定位是哪一层配置缺失。

## 4. 值文件写了却没生效

确认点：

- `values/sys_value.yml` 里对应的行**已取消注释**——`sys update` 生成的是整份注释模板，保持注释等价于空覆盖
- 优先级：`values/value.yml` > `values/sys_value.yml` > `sys/merged_vars.yml` 的系统默认值
- 在运维项目内执行时，值来自 `<project>/values/<system>/`（依据上层 `ops-prj.yml` 解析），而不是系统自带的 `<sys>/values`

## 5. 日志出现 `unexpanded variable in localize path` 且本地化被跳过

原因：`sys/setting/list.yml` 里的路径模板引用了未设置的变量（常见是 `${GXL_PRJ_ROOT}`）。

说明：

- `GXL_PRJ_ROOT` 由 `gops` 进程**启动时**按当前目录向上查找 `_gal/project.toml` 设置一次
- 路径里仍残留 `${...}` 时会告警并跳过；不会再创建字面量 `${...}` 目录

建议：确认是在系统目录内执行，且该目录（或其上层）存在 `_gal/project.toml`。

## 6. `download/install/start` 等系统命令失败

分两种情况（由 `sys/sys_model.yml` 的 `kind` 决定）：

- `kind: gxl`：最终依赖系统工作流和 `gx`
  - 先确认 `sys/workflows/operators.gxl` 存在
  - 再确认 `gx` 可执行
  - 再检查 `--env` 与 `--mod` 传参是否正确
- `kind: docker-compose`：直接调用本机 `docker compose`
  - 确认 `docker compose` 可用
  - 确认 `.env` 已生成（`gops sys localize`）

## 7. `docker compose` 报变量未定义

确认点：

- 已执行 `gops sys localize` 生成 `.env`
- `.env` 与 `docker-compose.yml` 位于同一目录
- 密钥类变量用 `${SEC_xxx}` 占位，由 `gops sys start` 从 `~/.galaxy/sec_value.yml` 注入；直接用 `docker compose up` 不会自动注入密钥

## 8. 文档和目录树不一致

处理原则：

- 以当前 `gops sys new` 真实生成结果为准
- 以当前仓库代码为准
- 不再使用旧版 `gsys` 文档作为依据
