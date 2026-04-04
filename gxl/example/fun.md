# Function 示例

对应目录：

- `galaxy-flow/examples/fun`
- 入口：`_gal/work.gxl`
- 常用 flow：`conf`

这个示例演示：

- `fn` 定义与模块内调用
- 默认参数与可变参数
- 函数中继续调用其他函数与 `for`

示例代码：

```gxl
extern mod os { path = "../../_gal/mods"; }

mod sys {
    fn echo( *value ) {
        gx.echo ( "${value}");
    }
    fn echo_obj( *value , msg = "object") {
        gx.echo ( "${value}:${msg}");
    }
    fn echo_list( *value , list_msg  ) {
      prefix = "galaxy";
      sys.echo_obj("sys.echo_obj");
      echo_obj("echo_obj");
      for ${item} in ${list_msg}  {
          gx.echo ( "${prefix}-${value}-${item}");
      }
    }
}
```

运行方式：

```bash
gx conf
```
