# Template 示例

对应目录：

- `galaxy-flow/examples/template`
- 入口：`_gal/work.gxl`
- 常用 flow：`conf`

这个示例演示：

- `gx.tpl(...)` 渲染模板目录
- 先用 `gx.cmd(...)` 准备输出目录
- `cmd` 代码块的写法

示例代码：

```gxl
extern mod os { path = "../../_gal/mods"; }

mod base_env {
    env _common {
        gx.vars {
            DOMAIN = "domain";
            SOCK_FILE = "socket";
            GXL_PRJ_ROOT = "./";
        }
    }
    env cli : _common {
        ROOT = "./";
    }
    env unit_test : _common {
        ROOT = "./example";
    }
}

mod envs : base_env {
    #[usage(desp = "default")]
    env default : cli;
    env empty {}
    env ut : unit_test;
}

mod main {
    conf = "${ENV_ROOT}/conf";
    flow conf {
        os.path(dst: "${MAIN_CONF}/used", keep: "true");
        gx.tpl(
            tpl: "${MAIN_CONF}/tpls/",
            dst: "${MAIN_CONF}/used/",
            file: "${MAIN_CONF}/value.json");

        ```cmd
        echo "hello";
        cp ./conf/value.json ./conf/used/back.json;
        ```
    }
}
```

运行方式：

```bash
gx conf
```
