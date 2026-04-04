# Read 示例

对应目录：

- `galaxy-flow/examples/read`
- 入口：`_gal/work.gxl`
- 常用 flow：`conf`

这个示例演示：

- `gx.read_file(...)` 把 ini 文件读入变量空间
- `gx.read_cmd(...)` 捕获命令输出
- 读取命名对象后用 `for` 遍历

示例代码：

```gxl
extern mod os { path= "../../_gal/mods"; }
mod envs {
    env _dev_local {
        gx.read_file ( file : "./var.ini" );
    }
    env default : _dev_local ;
}
mod main   {
  flow conf  {
    gx.echo (  "${RUST}" );
    gx.echo (  "${JAVA}" );
    gx.assert ( value : "${JAVA}" , expect : "90"  );

    gx.read_cmd (
        //fail!
        //cmd  : r#"git branch --show-current |  sed -E "s/(feature|develop|ver-dev|release|master|issue)(\/\.*)?/_branch_\1/g" "# ,
        //suc!
        cmd  : "git branch --show-current | sed -E 's/release/rls/g'" ,
        name : "GIT_BRANCH" );

    gx.echo ( "what:${GIT_BRANCH}" );

    gx.read_file ( file : "./var2.ini" , name : "DATA");

    for ${CUR} in ${DATA} {
        gx.echo ( value : "${CUR}" );
    }
  }



}
```

运行方式：

```bash
gx conf
```
