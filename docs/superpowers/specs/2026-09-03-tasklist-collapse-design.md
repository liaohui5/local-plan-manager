# 任务列表「向左侧收起」功能设计

日期：2026-09-03

## 背景与目标

应用为三栏固定布局 `[w-64 分类 | w-80 任务列表 | flex-1 详情]`。用户在编辑任务详情时希望获得更多横向空间，因此为中间栏（任务列表）增加一个「向左侧收起」的能力：整栏向左收起至宽度 0，右侧详情栏自动占满剩余宽度；再次展开时恢复原宽度与选中高亮。

主要入口为键盘快捷键，界面上在任务列表标题行提供对应的收起按钮。

## 决策记录（已与用户确认）

- 收起方向：任务列表整栏向左收起，宽度 0 时内容完全隐藏
- 展开入口：快捷键为主，标题行只放收起按钮，不在屏幕残留悬浮拉手（不增设屏幕常驻展开入口）
- 快捷键：`Ctrl+\`（避开 md-editor 在编辑器内占用的 `Ctrl+B` 加粗 / `Ctrl+I` 斜体）
- 收起状态：持久化到 `localStorage`，刷新后保持上次状态
- 状态归属：`PlanLayout` 持有收起状态与快捷键；`TaskList` 仅接收 props 展示按钮并向上 emit（方案一）

## 状态与数据流

- 新增 `taskListCollapsed = useLocalStorage("plan-manager-tasklist-collapsed", false)`，置于 `PlanLayout` 内
- key 命名遵循既有 `plan-manager-*` 前缀惯例；组件内持久化先例见 `TaskDetail` 的 `__isPreviewOnly__`
- 数据流：`PlanLayout` 持有状态 → `TaskList` 标题行按钮点击 emit `toggle` → `PlanLayout` 翻转状态。`TaskList` 无需感知当前收起值（收起时整栏含标题行一并隐藏，按钮仅展开态可见），故不传无用 prop

## 布局与动画

中间栏外层容器改动（`PlanLayout.vue` 第二个子 div）：

- 宽度在 `w-80` 与 `w-0` 间切换
- 加 `transition-[width] duration-200 ease-in-out overflow-hidden` 使收起有平滑动画
- 内容层内再包一层 `w-80 shrink-0`（或等价固定宽度），避免动画过程中文字横向挤压
- 收起时右侧 `border-r` 随宽度一起消失；详情栏 `flex-1` 天然铺满剩余空间

## 快捷键

- 在 `PlanLayout` 的 `onMounted` 注册 `window` `keydown` 监听，`onBeforeUnmount` 移除
- 判定条件：`e.ctrlKey && e.key === "\\"`，命中后翻转 `taskListCollapsed`
- 编辑器获得焦点时按下亦生效（该键不与 md-editor 冲突），无需额外焦点判断

## 触发按钮（TaskList）

- 位于标题行「任务列表」文字右侧，`size="icon-sm"`、ghost 变体，与现有按钮体系一致
- 图标：`@lucide/vue` 的 `ChevronsLeft`（收起语义）
- 附加 `title` 与 `aria-label`：提示文案包含快捷键说明（如「收起任务列表 (Ctrl+\)」）

## 边界情形

- 无选中分类 / 列表为空：收起功能无依赖，照常可用
- 收起后唯一展开入口为 `Ctrl+\`（已按用户选择，不增设屏幕悬浮入口）
- 收起状态下在分类栏切换分类：不自动展开（克制，YAGNI）
- 展开后任务列表选中高亮、滚动位置等由现有内部状态自然恢复，无额外逻辑

## 验证方式

1. `pnpm dev` 手测：收起动画、`Ctrl+\` 往返切换、按钮切换、刷新后状态保持、详情栏铺满
2. `pnpm build`：通过 `vue-tsc -b` 类型检查与 `vite build`

## 涉及文件

- `src/components/PlanLayout.vue`：持有状态 + 快捷键 + 宽度动画 + props/事件接线
- `src/components/TaskList.vue`：标题行新增收起按钮并 emit `toggle`
