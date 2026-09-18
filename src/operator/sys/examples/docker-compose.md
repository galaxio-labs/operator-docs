# System 示例：纯 docker-compose 系统

纯 compose 系统不组合模块、不使用 GXL 工作流，`gops sys` 直接驱动本机 `docker compose`。

## 1. 创建系统

```bash
gops sys new --name gateway --kind docker-compose
cd gateway
```

生成的是精简结构（无 `_gal/`、`mod_list.yml`、`workflows/`、`setting/list.yml`），见 [目录结构](../structure/directory.md)。

`sys/sys_model.yml`：

```yaml
name: gateway
kind: docker-compose
vender: ''
```

## 2. 编写 compose 与变量定义

`docker-compose.yml` 用 Docker Compose 原生 `${VAR}` 占位（`sys new` 会生成一份可修改的模板）：

```yaml
services:
  app:
    image: ${SERVICE_IMAGE}
    ports:
      - "${SERVICE_PORT}:80"
    deploy:
      replicas: ${REPLICAS}
```

非密钥变量在 `sys/setting/vars.yml` 的 `system:` 段声明（源定义，随系统版本化）：

```yaml
system:
  - name: SERVICE_IMAGE
    value: nginx:alpine
  - name: SERVICE_PORT
    value: 8080
  - name: REPLICAS
    value: 1
```

密钥不要写在这里：在 compose 里用 `${SEC_xxx}` 占位，运行时由 `gops sys start` 从 `~/.galaxy/sec_value.yml` 注入（不落盘）。

```yaml
services:
  db:
    environment:
      POSTGRES_PASSWORD: ${SEC_POSTGRES_PASSWORD}
```

`~/.galaxy/sec_value.yml`（不在项目里、不入库）：

```yaml
postgres_password: "your-secret"
```

key 会归一化为大写并加 `SEC_` 前缀：`postgres_password` → `SEC_POSTGRES_PASSWORD`。

## 3. 生成 `.env`

```bash
gops sys localize        # 缺 merged_vars.yml 时会自动先 update
cat .env
```

规则：

```text
.env = sys/merged_vars.yml 默认值 ⊕ values/sys_value.yml ⊕ values/value.yml
```

- `values/sys_value.yml` 是 `sys update` 生成的**注释模板**：取消注释要覆盖的项即可，其余取默认值。
- `values/value.yml` 是更高优先级的覆盖层。

例如只想改端口与副本数：

```yaml
# values/sys_value.yml
SERVICE_PORT: 9090
REPLICAS: 3
```

`.env` 只包含非密钥配置，随时可以用 `docker compose config` 校验。

## 4. 部署

`kind: docker-compose` 下，部署命令映射到 `docker compose`：

```bash
gops sys diagnose    # docker compose config（密钥以 ******** 掩码注入）
gops sys download    # docker compose pull
gops sys install     # docker compose create
gops sys start       # docker compose up -d（密钥注入子进程环境）
gops sys status      # docker compose ps
gops sys stop        # docker compose stop
gops sys uninstall   # docker compose down
```

## 5. 交付给客户（运维项目）

```bash
gops sys package                          # 先 update 再打包 -> ../gateway-<version>.tar.gz
cd ..
gops prj new --name customer-a
cd customer-a
gops prj import --path ../gateway-0.1.0.tar.gz
cd gateway
gops sys localize                         # 使用 <project>/values/gateway/ 下的客户值
gops sys start
```

客户差异写在 `<project>/values/gateway/`（例如 `value.yml`）。在项目内的系统目录执行 `gops sys localize` / `sys update` 时，会依据上层 `ops-prj.yml` 直接使用该项目值目录。
