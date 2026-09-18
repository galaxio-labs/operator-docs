# galaxio-labs Operator Ecosystem

## 核心流程

1. `gops mod` 创建模块维护器，用 GXL 编写维护器的 workflow
2. `gops sys` 创建系统维护器，组合多个模块维护器，用 GXL 编写 workflow
3. 系统维护器保存到配置管理库中，待发布到客户环境
4. 在客户环境中，使用 `gops prj` 创建维护工程，并加载系统维护器
5. 在客户环境中，使用 `gx` 执行维护器的 workflow
6. 保存维护工程到配置管理库中

## GXL 文档的来源

`gxl/` 下的页面大部分是 [galaxy-flow](https://github.com/galaxio-labs/galaxy-flow) 仓库 `docs/gxl/` 的**镜像**，
单一真源在 galaxy-flow，请不要在这里直接改这些页面（改动会在下次同步时被覆盖）。

例外：`gxl/example/*.md` 是**本仓库自有**的运维向改写（补充“对应目录 / 运行方式 / 这个示例验证了什么”等），
不属于镜像，不会被同步覆盖。

同步与校验：

```bash
# 在 galaxy-flow 仓库执行同步（默认写入 ../operator-docs/gxl）
scripts/sync-gxl-docs.sh sync --dest <operator-docs>/gxl

# 只校验是否已同步
scripts/sync-gxl-docs.sh check --dest <operator-docs>/gxl
```

本仓库的 `GXL docs sync check` workflow 会每天定时、以及在 push / PR 时
用 galaxy-flow `main` 的 `docs/gxl/` 校验上述镜像是否已同步。
新增镜像页面后，记得同时把条目加进 `SUMMARY.md`，否则该页不会出现在侧边栏。

> 上线前提：该 workflow 调用的是 galaxy-flow 仓库里的 `scripts/sync-gxl-docs.sh`。
> 在它并入 galaxy-flow `main` 之前，workflow 会给出 warning 并跳过校验（不会误报红）。
