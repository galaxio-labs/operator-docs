# Vars 示例

对应目录：

- `galaxy-flow/examples/vars`
- 入口：`_gal/work.gxl`
- 常用 flow：`array_do`、`obj_do`

这个示例演示：

- env 中定义列表与对象变量
- `for` 遍历数组和对象
- `if` 条件判断与变量比较

示例代码：

```gxl
mod envs {
    env default {
        data_list = [
            "JAVA",
            "RUST",
            "PYTHON",
        ];
        data_obj = {
            JAVA: { NAME: "JAVA", SCORE: 80 },
            RUST: { NAME: "RUST", SCORE: 100 },
            PYTHON: { NAME: "PYTHON", SCORE: 200 },
        };
    }
}

mod main {
    flow array_do {
        for ${CUR} in ${ENV.DATA_LIST} {
            gx.echo("CUR:${CUR}");
        }
    }
    flow obj_do {
        for ${CUR} in ${ENV.DATA_OBJ} {
            gx.echo("CUR:${CUR.NAME} : ${CUR.SCORE}");
        }
    }
}
```

运行方式：

```bash
gx array_do
gx obj_do
```
