# System 示例：多模块系统

这里给出一个和当前实现一致的最小示例流程，用来说明 `System` 如何组合多个模块。

## 1. 创建模块

```bash
gops mod new --name gateway
gops mod new --name user-service
gops mod new --name postgres
```

## 2. 创建系统

```bash
gops sys new --name microservice-stack
cd microservice-stack
```

## 3. 维护系统模块列表

在 `sys/mod_list.yml` 中把需要的模块加入系统。

## 4. 初始化系统设置（可选）

```bash
gops sys setting --init
```

## 5. 解析变量并本地化

```bash
gops sys update      # 解析变量 -> sys/merged_vars.yml，并生成 values/sys_value.yml（注释模板）
gops sys localize    # 生成 .env（缺 merged_vars.yml 时会自动先 update）
```

如果只想处理某个模块：

```bash
gops sys localize --mod gateway
```

值文件采用“只写差异”的风格：

```yaml
# values/sys_value.yml —— 整份默认是注释，取消注释即覆盖
HTTP_PORT: 8081
```

也可以在同目录放 `values/value.yml` 作为额外覆盖层（优先级最高，适合入库的客户覆盖）。

## 6. 打包交付

```bash
gops sys package     # -> ../microservice-stack-<version>.tar.gz
```

## 7. 在运维项目中使用（客户差异）

```bash
cd ..
gops prj new --name customer-a
cd customer-a
gops prj import --path ../microservice-stack-0.1.0.tar.gz
cd microservice-stack
gops sys localize    # 值取自 <project>/values/microservice-stack/
```

## 8. 执行系统操作

```bash
gops sys download --env default
gops sys install --env default
gops sys start --env default
gops sys status --env default
```

## 说明

这个示例强调的是当前实现中的责任边界：

- 模块定义在 `gops mod`
- 系统组合在 `gops sys`
- 客户导入和交付在 `gops prj`
