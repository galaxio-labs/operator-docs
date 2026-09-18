# Dryrun 示例

对应目录：

- `galaxy-flow/examples/dryrun`
- 入口：`_gal/work.gxl`
- 常用 flow：`start`

这个示例演示：

- `#[dryrun(_step3)]` 在 dryrun 模式下替换目标 flow
- 非 dryrun 时原 flow 继续执行，且断言失败

示例代码：

```gxl
mod main {

env default {}

flow _step1 {
    gx.echo ("step1");
}

#[dryrun(_step3)]
flow _step2 {
    gx.echo ("step2");
    gx.assert ( value : "true" , expect : "false" );
}

flow _step3 {
    gx.echo ("dryrun setp2");
}

flow start | _step1 | _step2 ;

}
```

运行方式：

```bash
gx start --dryrun
gx start
```
