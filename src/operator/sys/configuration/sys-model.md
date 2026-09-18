# sys_model.yml 说明

`sys_model.yml` 是 `System` 对象的核心定义文件，位于：

```text
sys/sys_model.yml
```

## 字段

```yaml
name: web-stack          # 系统名（必填）
kind: gxl                # 部署类型：gxl（默认）| docker-compose
model: arm-mac14-host    # 目标型号（kind=gxl 必填；docker-compose 无型号）
vender: ''               # 供应商标记（可选）
```

纯 docker-compose 系统的实际内容示例：

```yaml
name: gateway
kind: docker-compose
vender: ''
```

## `kind`

`kind` 决定 `gops sys` 的行为：

| `kind` | 说明 |
| --- | --- |
| `gxl`（默认） | 模块式系统，部署命令委托外部 `gx` 执行 |
| `docker-compose` | 声明式 compose 系统，部署命令直接映射到 `docker compose`（无需 `gx`） |

- `kind` 缺省时按 `gxl` 处理（兼容 1.2.0 及更早的系统）
- `kind` 只在此文件里声明，不要写进 `sys-prj.yml`

## 与其它文件的关系

- `sys/mod_list.yml`：模块列表（仅 `gxl` 需要）
- `sys/setting/vars.yml`：系统设置变量定义（源）
- `sys/merged_vars.yml`：`gops sys update` 解析出的聚合变量（需入库）

## 在流程中的作用

- `gops sys new` 会初始化它；`--kind docker-compose` 会写入 `kind: docker-compose` 且不生成 GXL 骨架
- `gops sys` 的部署命令按 `kind` 分派
- `gops prj import` / `prj reimport` 用它确定系统名与类型

如果要核对字段细节，优先以当前仓库代码和 `gops sys new` 的生成结果为准，而不是旧版文档示例。
