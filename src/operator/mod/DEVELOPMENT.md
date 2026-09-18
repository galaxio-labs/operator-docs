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

先检查 `mod/` 下生成的模型目录，例如：

```text
mod/
├── arm-mac14-host/
└── x86-ubt22-k8s/
```

然后按模型补齐：

- `vars.yml`
- `spec/artifact.yml`
- `spec/depends.yml`
- `setting.yml`
- `workflows/`

### 3. 更新本地引用

```bash
gops mod update
```

需要强覆盖时：

```bash
gops mod update --force 2
```

### 4. 本地化验证

使用默认值：

```bash
gops mod localize --default
```

使用指定值文件：

```bash
gops mod localize --value ./mod/x86-ubt22-k8s/values/dev.yml
```

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

- `gops mod new` 只生成骨架，不会一次性补齐所有业务文件
- `localize` 依赖值文件和变量定义，先补齐 `vars.yml` 再做本地化
- 模块是系统的输入，不是交付终点
- 执行类工作流能力最终仍由 `galaxy-flow` / `gx` 承担
