# 工程说明

这一个 mdbook 的文档工程，用于 Galaxy-Flow 的文档组织

## 文档编写规则
-  文档要以 mdbook 的格式编写
-  文档文件与summary.md 对应


## 任务规则
- 完成任务，要把结构反馈到 work.md 中。

# 工作任务 

[x] 调整文档结构
    [x] 把当前文件与GXL相关的内容移动到 gxl 目录下。
    [x] 将 inner 目录（gxl的内键能力）移动到 gxl 目录下。
    [x] 清理原有位置的文件
    [x] 将 example 目录移动到 gxl 目录下
    
    完成结果：
    - 已将 gxl.md、var_def.md、env.md、flow.md、fun.md 移动到 gxl/ 目录下
    - 已将 inner/ 目录移动到 gxl/inner/ 目录下
    - 已清理根目录下的 inner/ 目录
    - 已更新 SUMMARY.md 中的路径引用（包括inner相关路径）
    - 已验证 mdbook build 构建成功
[x]  更新了文档， 更新相应的SUMMARY.md
    
    完成结果：
    - 优化了SUMMARY.md的结构，使用清晰的章节层次
    - 将文档按主题分组：命令行工具、维护器、GXL语言
    - 在GXL语言下细分：介绍、语言基础、流程控制、函数定义、语法说明
    - 添加了示例教程和内置指令的独立章节
    - 将syntax.md移动到gxl目录下
    - 添加了图表可视化高级功能章节
    - 将工作任务移动到附录部分
    - 补充了所有缺失的markdown文件链接：
    * 命令行工具：gx.md, gops.md, buildin.md
      * 配置：net-access-ctrl-guide.md
      * 模块维护器详细文档：DEVELOPMENT.md, CONFIGURATION.md, REFERENCE.md, TROUBLESHOOTING.md
[]  更新operator/sys下的文档， 更新相应的SUMMARY.md
