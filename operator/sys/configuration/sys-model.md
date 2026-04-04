# sys_model.yml 说明

`sys_model.yml` 是 `System` 对象的核心定义文件，位于：

```text
sys/sys_model.yml
```

## 当前定位

它负责描述系统模型本身，而不是客户项目值文件，也不是模块明细列表。

和它配合的两个文件通常是：

- `sys/mod_list.yml`
- `sys/setting/vars.yml`

## 在流程中的作用

- `gops sys new` 会初始化它
- `gops sys localize` 会读取它
- 系统级工作流会通过它理解当前系统模型

## 当前文档边界

因为 `sys_model.yml` 的内部字段可能随着代码演进变化，这里只保留稳定结论：

- 它属于系统定义层
- 它和 `mod_list.yml` 分工不同
- 它是当前系统目录中必须存在的核心文件之一

如果要核对字段细节，优先以当前仓库代码和生成结果为准，而不是旧版文档示例。
