# System 命名约定

## 系统目录

系统通过下面命令创建：

```bash
gops sys new --name <name> [--kind gxl|docker-compose]
```

建议：

- 使用小写字母
- 单词之间使用连字符
- 避免空格和中文目录名

示例：

- `web-stack`
- `customer-edge`
- `db-core`

## 文件名

当前实现里关键文件名是固定的：

- `sys-prj.yml`
- `docker-compose.yml`
- `sys_model.yml`
- `mod_list.yml`
- `merged_vars.yml`
- `operators.gxl`
- `list.yml`
- `vars.yml`
- `values/sys_value.yml`、`values/value.yml`

这些名字最好不要随意改动，否则会影响 `gops sys` 的加载逻辑。

> `sys_vars.yml` 是 `merged_vars.yml` 的旧名（1.2.0 及更早），当前仅作读取兼容。

## `kind` 取值

`sys/sys_model.yml` 的 `kind` 只使用这两个值（省略时按 `gxl`）：

- `gxl`
- `docker-compose`

## 模块名

系统命令里如果使用：

```bash
gops sys localize --mod <module>
gops sys start --mod <module>
```

这里的 `<module>` 应与 `mod_list.yml` 中声明的模块名一致。

## 环境名

系统操作命令支持：

```bash
--env <env>
```

当前默认值是：

```text
default
```

建议环境名保持简单稳定，例如：

- `default`
- `dev`
- `staging`
- `prod`
