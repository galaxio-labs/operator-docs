# theme/

本目录是 operator-docs 的 mdBook 主题资源，**移植自 wp-docs**，让两个站点的页面风格保持一致。

来源：`warp-fusion/wp-docs`（`user-wp/wp-docs`）的 `theme/`。

## 文件

| 文件 | 说明 |
|---|---|
| `site.css` | VitePress 风格主题。**与上游逐字节一致**，未做修改。它定义了一组 `--wp-*` 设计变量，并映射到 mdBook 的 `--bg` / `--fg` / `--sidebar-*` 等变量 |
| `site.js` | 交互增强，基于上游 `site.js` 裁剪（见下） |
| `head.hbs` | 首屏前恢复侧栏宽度，避免闪烁。mdBook 会自动识别 `theme/head.hbs` 并注入 `<head>` |
| `favicon.svg` | 站点图标。mdBook 只从 `theme/` 取 favicon（`[output.html] favicon` 并不是合法配置项）；`src/favicon.svg` 是同一份内容的副本，**生效的是 `theme/` 这份** |

由 `book.toml` 的 `additional-css` / `additional-js` 引用；mdBook 会把 `theme/` 原样拷贝到构建产物。

## 相对上游的改动

`site.js` 去掉了 wp-docs 专有、对本站无意义的部分：

- 顶部 `Warp Parse` 标牌（`.wp-topbar`）
- 中英语言切换（`.lang-switcher`，本站为单语言）
- alpha/beta/stable 版本横幅与 `wp-version.txt` 拉取（`.version-banner`）

保留的通用能力：可折叠侧栏（含状态持久化）、侧栏宽度持久化、本页目录（≥4 个 h2/h3 时出现）、简化主题菜单、mermaid 主题联动重载。

`head.hbs` 与 `site.js` 里的 localStorage key 已由 `wp-docs-*` 改名为 `operator-docs-*`，两处必须保持一致：

- `operator-docs-sidebar-width`（`head.hbs` + `initSidebarWidthPersistence`）
- `operator-docs-sidebar-state`（`initCollapsibleSidebar`）

## mermaid

主题的 `loadMermaidIfNeeded()` 会在页面**确实出现 `.mermaid` 块**时才去拉 `mermaid.min.js`（从产物根目录）。
因此 `book.toml` 的 `additional-js` **不再**包含 `mermaid.min.js`：

- 当前 operator-docs 的源码里没有任何 mermaid 图，eager 加载等于每页白搭 2.9MB；
- 以后真有图时，懒加载会自动生效（`mermaid.min.js` 在站点源 `src/` 下，mdBook 会把它拷进产物根目录）。

`[preprocessor.mermaid]`（mdbook-mermaid）保留，它负责把 ` ```mermaid ` 块转成 `.mermaid` 元素。

## 与主题相关的 book.toml 设置

本目录按 mdBook 约定放在 `book.toml` 同级（即仓库根）；站点源在 `src/`。
这样 `.git/` / `.github/` 落在站点源之外，不会被 mdBook 当作站点资源拷进 `book/` 产物。

主题依赖以下设置（详见 `book.toml`）：`default-theme = "light"`、`preferred-dark-theme = "navy"`。
`site.css` 只为 `light` / `rust` 与 `ayu` / `navy` / `coal` 提供变量，`site.js` 的
`simplifyThemeMenu()` 会把菜单压成 Auto / Light / Dark 三项。

## 从上游同步

`site.css` 可直接整体覆盖。`site.js` 因为做了裁剪，**不能**整体覆盖——需要手工把上游
`site.js` 的通用部分改动挑进来，并保留上面两处 key 改名与 wp 专有代码的删除。
