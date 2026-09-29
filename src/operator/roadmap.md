# GOps 改进方向

本文给出一份按"性价比"排序的改进清单。**排序原则：高价值 ≠ 功能多，而是"把'靠人记住'的部分交给工具"。** 因此优先做"把事后才发现变成事前就知道"的项，最后才考虑"再多一种后端 / 再多一套模板"。

"对应问题"一列指向 [定位与价值](./overview.md) 中的问题 1 / 2 / 3。每条都附**现状证据**，便于核对。

## Tier 1：直接打痛点、代价低、收益高

| 改进点 | 对应问题 | 现状（代码证据） | 价值 |
| --- | --- | --- | --- |
| ① `gops sys new --model <modelsdt>`（非交互选型） | 采用前置 | `ia_model_std()` 只能交互；自动选型靠 `TEST_MODE=1` 这种 hack | 解锁 CI / 自动化，实现极小 |
| ② `gops sys check` 部署前校验 | 问题 1（后果严重） | `sys localize` 只导出 `.env`（`export_env_file`），**不校验** `sys/docker-compose.yaml` 里的 `${VAR}` 是否都有定义 | 把"上线才炸"提前到"localize 前报错" |
| ③ 密钥缺失 fail-fast | 问题 1（容易遗忘） | `run_compose_cmd` 无脑 `load_sec_dict()` 注入，不校验被引用的 `${SEC_x}` 是否存在 | 挡住"空密码静默上线" |
| ④ `gops sys diff` | 问题 1（容易遗忘） | 有值来源追踪（`_used.json`），但没有"客户值 vs 系统默认"的差异视图 | 一眼看清"改了哪些、哪些还是默认" |

这四条是同一主题：**把"事后才发现"变成"事前就知道"**——正是问题 1 的解药。

## Tier 2：交付闭环与审计

| 改进点 | 对应问题 | 现状（代码证据） | 价值 |
| --- | --- | --- | --- |
| ⑤ 锁文件 / manifest | 问题 1、2（记录保值） | `merged_vars.yml` 已入库，但未记录系统版本 / 模块版本 / 值哈希 | "部署的是哪一版、用了什么值"可复现，回滚有依据 |
| ⑥ 轻量漂移报告 | 问题 1 | `status` / `diagnose` 不比对"值文件改动 vs 已生成的 `.env`" | 报"值变了但没重新 localize"，不必做完整 reconcile |
| ⑦ `values/` 提交检查（`gops prj doctor` 或 CI `--check`） | 问题 1 | 无，全靠 git 纪律（定位页「边界」已承认） | 把"靠纪律"补成"靠工具提醒" |

⑤⑥⑦ 的共同作用：把"记录与保值"从**靠纪律**变成**靠工具提醒**。

## Tier 3：战略级（大投入，决定上限）

| 改进点 | 对应问题 | 现状 | 价值 |
| --- | --- | --- | --- |
| ⑧ 多形态脚手架 `gops sys export --form host / k8s / compose` | 问题 3 | 一个 `System` 只绑一个 `ModelSTD` + `kind` | 降低"同能力写三遍"的成本，哪怕只生成骨架 + 提示 |
| ⑨ 可选收敛（仅 `docker-compose` / k8s 形态） | GitOps 缺口 | 无常驻对账组件 | 只在**能声明终态**的形态引入漂移检测 / 自愈，不放弃多形态 |

⑨ 是关键取舍：它补的正是 [GOps 与 GitOps 的差距](./overview.md) 里那块最短的板，同时不牺牲"覆盖不可收敛的世界"。

## Tier 4：正确性 / 一致性小修（低价值但该修）

| 改进点 | 现状（代码证据） |
| --- | --- |
| `gops mod localize --value / --default` 要么实现要么移除 | `handle_localize` 未读取这两个参数（声明未消费），文档已被迫标注"无效" |
| `gops sys new` 补 `--debug / --log` | `SysNewArgs` 没有 `debug_log`，与其他命令不一致 |
| `docker-compose` 形态支持 `--mod` | `run_compose_cmd` 直接忽略并打印 note；可映射到 `docker compose <service>` |
| 清理 `todo!()` 死代码 | `ModulesList::add_mod` 为 `todo!()`；若干注释、`allow(dead_code)` |

## Tier 1 特性详述

下面把价值最高的四项（①–④）展开成可落地的设计：**目标 / 现状证据 / 期望行为 / 代码落点 / 验收 / 成本**。它们共享同一主题：把"事后才发现"变成"事前就知道"——也就是 [问题 1](./overview.md) 的解药。

> 约定："现状证据"均以当前 `galaxy-ops` 代码为准；"期望行为"是设计意图，落地前需再确认实现细节。

### ① `gops sys new --model <modelsdt>`：非交互选型

**目标**：让 `sys new` 能在 CI / 脚本中无人值守创建系统，不再只能靠人肉点菜单。

**现状证据**

- `app/gops/commands/sys_cmd.rs::SysCommandHandler::handle_new` 在 `kind = gxl` 分支调用 `Self::ia_model_std()?` 走交互选择。
- `SysNewArgs` 只有 `name` 与 `kind`，**没有** `model`；非交互只能靠 `TEST_MODE` 环境变量（`ia_model_std` / `ia_kind` 内部特判）这种测试后门。

**期望行为**

- `SysNewArgs` 新增 `--model <modelsdt>`（取值须属于 `ModelSTD::support()`，如 `x86-ubt22-k8s`）。
- 给定 `--model` 时跳过 `ia_model_std`，直接 `SysOperator::make_new(&prj, name, model)`；未给定且非 `TEST_MODE` 时保持现有交互。
- `--model` 与 `--kind docker-compose` 互斥：compose 系统没有 `ModelSTD`，组合出现时报错。
- `--model` 非法时立即非 0 退出，并在 stderr 列出支持项。

**代码落点**

- `SysNewArgs` 加字段；`handle_new` 中 `args.model()` 优先于 `ia_model_std()`。
- 顺带补 `--debug / --log`（即 Tier 4 那项），让 `configure_dfx_logging` 与其他命令一致。

**验收**

- 非 TTY 下 `gops sys new --name demo --model x86-ubt22-k8s` 成功生成系统，无 `Select` 提示。
- `--model bogus` 退出码非 0，stderr 含支持列表。
- 回归：无参数 + 真 TTY 时仍弹出交互选择。

**成本 / 风险**：S。低风险；注意 `--model` × `--kind` 的互斥校验。

### ② `gops sys check`：部署前变量校验

**目标**：在 `localize` 之后、`start` 之前，把"上线才炸"的未定义变量提前成一条明确报错。

**现状证据**

- `src/system/operator.rs::SysOperator::localize` 只把合并后的值无条件写入 `<sys>/.env`（`project::export_env_file(options.evaled_value(), env_path)`），**不校验** `sys/docker-compose.yaml` 里引用的 `${VAR}` 是否都有定义。
- 缺失时 `docker compose` 仅打印 `The "X" variable is not set. Defaulting to a blank string.` 然后带空值继续——正是"后果严重"的典型现场。

**期望行为**

- 新增只读命令 `gops sys check`：扫描系统内 compose 文件（`sys/docker-compose.{yaml,yml}` 等）的插值占位
  - 形态：`${VAR}`、`${VAR:-default}`、`${VAR-default}`、`$VAR`；带 `:-` / `-` 默认值的视为可选；
  - 其余必须在"合并值字典（∪ 生成的 `.env`）"中存在；
  - 输出缺失清单（`文件:行号  变量名`），有缺失即非 0 退出。
- 同逻辑以**软校验**接入 `sys localize`（默认仅告警；`--strict` 时失败），避免破坏既有流程。
- `kind: gxl` 系统跳过变量校验。

**代码落点**

- 直接复用 `SysOperator::localize` 里已算出的 `options.evaled_value()`（合并后的 `OriginDict`），无需另建变量解析。
- 只需一个轻量 compose 插值扫描器（正则即可），与 `src/project.rs::export_env_file` 同族。
- 与 `diagnose`（`compose_subcommand` → `docker compose config`）的区别：`check` 是**不依赖 docker** 的静态校验，能在无 docker 的 CI 机器上运行。

**验收**

- 造一个引用 `${UNDEFINED}` 的 compose：`check` 非 0 并指名到该行；在 `values/sys_value.yml` 补上后 `check` 通过。
- `${OPTIONAL:-1}` 不被判为缺失。

**成本 / 风险**：S–M。风险在 compose 插值语法细节（`$$` 转义、`.env` 与 shell 语义差异）——须对照官方文档，**宁可漏报不可误报**。

### ③ 密钥缺失 fail-fast

**目标**：挡住"空密码静默上线"。

**现状证据**

- `app/gops/commands/run_cmd.rs::RunCommandHandler::run_compose_cmd` 无脑 `orion_sec::load_sec_dict()` 后 `sec_env_pairs_for(cmd_name, &dict)` 全量注入子进程环境，**不检查** compose 文件里实际引用的 `${SEC_xxx}` 是否都在 `sec_dict` 中。
- `sec_env_pairs_for` 已知 `diagnose` 需要掩码（`SECRET_MASK`），说明"密钥注入"这一层已成型，只差一个"存在性"前置校验。

**期望行为**

- 启动前交集校验：扫描 compose 的 `${SEC_*}` 占位，逐一确认存在于 `sec_dict`；缺失则在**真正启动之前**报错，列出变量名与来源文件（**不回显值**）。
- 提示语指向 `~/.galaxy/sec_value.yml`（或 `./.galaxy/sec_value.yml`）补键，但**不得**回显文件内容或密钥值。
- `diagnose` 保持只读可运行：缺密钥时仅告警（不阻断诊断）。

**代码落点**

- 与 ② 共用占位扫描器，仅筛选 `SEC_` 前缀。
- 在 `run_compose_cmd` 注入密钥之前插入 `ensure_secrets_present(compose_files, &sec_dict)` 即可。

**验收**

- compose 引用 `${SEC_DB_PASSWORD}` 而 `sec_value.yml` 无该键：`start` 非 0，且未真正执行 `docker compose up`。
- 补键后 `start` 正常；`diagnose` 全程掩码。

**成本 / 风险**：S。风险：与 ② 共用扫描器，需保证只读、零副作用。

### ④ `gops sys diff`：客户值 vs 系统默认

**目标**：直打"容易遗忘"——一眼看清"改了哪些、哪些还是默认"。

**现状证据**

- 已有值来源追踪：本地化写出 `_used.json`（`const_vars.rs::USED_JSON`）与可读版 `.used_value.yml`（`USED_READABLE_FILE`）；`src/project.rs::mix_used_value` 会把 used ⊕ mod ⊕ global 合并。
- 但**没有**"客户值 vs 系统默认"的差异视图；操作员只能肉眼比对 `values/` 与 `sys/merged_vars.yml`。

**期望行为**

- `gops sys diff [--format table|yaml] [--only-changed]`：以 `sys/merged_vars.yml` 的 `system:` 段为基线，逐项对 `values/sys_value.yml` ⊕ `values/value.yml` ⊕ 实际 `.env` 做对比，标注：
  - `=` 未改（取默认）、`!` 已覆盖、`+` 客户新增键、`-` 系统已删但客户仍写、`~` 类型/格式变化；
  - 每项附来源层（优先级 `value.yml` > `sys_value.yml` > `merged_vars`）。
- 可选 `--since <git-ref>`：展示相对某提交的值变化（借 git 历史）。
- 纯读命令，不改任何文件。

**代码落点**

- 基线取 `merged_vars.yml` 的 `system:` 段 + 模块默认；覆盖层取 `values/`。
- 若当前合并（`mix_used_value`）未保留"哪一层给的"信息，需要先让合并结果**带上来源**（不改变落盘格式）。

**验收**

- 默认值 + 一处覆盖：`diff` 仅把该一处标为 `!`，其余标 `=`。
- 删除一个客户键：显示 `-`（已回落默认），而非静默。

**成本 / 风险**：M。风险：需要"默认层"与"覆盖层"同时可见，可能触及值的合并表示（但不动落盘格式）。

### 后续（Tier 2 / 3）

⑤ 锁文件 / manifest、⑥ 轻量漂移报告、⑦ `values/` 提交检查、⑧ 多形态脚手架、⑨ 可选收敛，留待下一轮展开。其中 ⑧ 的一部分已兑现：`gops mod new` 现已为 `x86-ubt22-k8s` 生成 Helm chart 脚手架（见 [模块维护器](./mod/README.md)）。

## 如果只做三件事

1. **`gops sys new --model`** —— 解锁 CI / 自动化，门槛最低。
2. **`gops sys check` 部署前校验** —— 变量 + 密钥占位双校验，直打"后果严重"。
3. **`gops sys diff`** —— 直打"容易遗忘"，且能作为对外卖点。

这三条合起来，正好把问题 1 的三个症状（**时常修改 / 容易遗忘 / 后果严重**）各自对应上一个可交付的功能，且都不动核心架构。

## 一个判断

按定位页的逻辑，**高价值 ≠ 覆盖更多**。所以 ①–⑦ 排在前面，把"再多一种部署后端""再写一套模板"这类排在最后——后者只会扩大覆盖，不会降低遗忘与事故。

> 说明：本文是改进建议，不是当前能力的描述；每条"现状"以现有代码为准，落地前需再次确认实现细节。
