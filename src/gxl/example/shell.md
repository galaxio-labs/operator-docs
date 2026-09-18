# Shell 示例

对应目录：

- `galaxy-flow/examples/shell`
- 入口：`_gal/work.gxl`
- 常用 flow：`conf`、`do_obj`

这个示例演示：

- `gx.shell(...)` 运行脚本并回填 `out_var`
- `arg_file` 的使用
- 列表、对象遍历中重复执行 shell

示例代码：

```gxl
extern mod os { path = "../../_gal/mods"; }

mod envs {
    env _dev_local {}
    env default : _dev_local;
}

mod main {
    flow conf {
        gx.read_file(file: "./var.yml", name: "VAR");
        gx.echo("what:${VAR.MEMBER.JAVA}");

        gx.shell(
            arg_file: "./var.json",
            shell: "./demo.sh",
            out_var: "SYS_OUT");

        gx.echo("what:${SYS_OUT}");

        gx.read_file(file: "./var_list.yml", name: "DATA");
        for ${CUR} in ${DATA.DEV_LANG} {
            gx.shell(
                shell: "./demo_ex.sh ${CUR}",
                out_var: "SYS_OUT");
            gx.echo("what:${SYS_OUT}");
        }

        gx.read_file(file: "./var_obj.yml", name: "DATA");
        for ${CUR} in ${DATA} {
            gx.shell(
                shell: "./demo_ex.sh ${CUR.SYS.NAME}",
                out_var: "SYS_OUT");
            gx.echo("what:${SYS_OUT}");
        }
    }
    flow do_obj {
        gx.read_file(file: "./var_obj.yml", name: "DATA");
        for ${CUR} in ${DATA} {
            //gx.echo( "CUR:${CUR.SYS.NAME}" );
            gx.shell(
                shell: "./demo_ex.sh ${CUR.SYS.NAME}",
                out_var: "SYS_OUT");
            gx.echo("what:${SYS_OUT}");
        }
    }
}
```

运行方式：

```bash
gx conf
gx do_obj
```
