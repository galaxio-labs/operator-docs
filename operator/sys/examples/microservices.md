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

## 4. 初始化系统设置

```bash
gops sys setting --init
```

## 5. 本地化系统

```bash
gops sys localize
```

如果只想处理某个模块：

```bash
gops sys localize --mod gateway
```

## 6. 执行系统操作

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
