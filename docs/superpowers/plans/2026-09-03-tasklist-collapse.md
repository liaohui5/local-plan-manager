# 任务列表「向左侧收起」实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 为三栏布局的中间栏（任务列表）添加向左侧收起/展开能力：`Ctrl+\` 往返切换，标题行提供收起按钮，收起状态持久化到 localStorage。

**架构：** `PlanLayout` 持有收起状态（`useLocalStorage`）并注册全局快捷键；中间栏外层容器做宽度 0↔320px 的过渡动画，border/背景移到内层固定宽度容器上，避免收起后残留 1px 边框线。`TaskList` 标题行新增收起按钮，点击 emit `toggle`，由父级翻转状态。

**技术栈：** Vue 3（`<script setup>`）、TypeScript、Tailwind CSS v4、`@vueuse/core`（`useLocalStorage`）、`@lucide/vue` 图标。无测试框架——验证以 `vue-tsc -b` 类型检查 + `pnpm dev` 手测为准。

规格：`docs/superpowers/specs/2026-09-03-tasklist-collapse-design.md`

---

## 文件结构与职责

| 文件 | 操作 | 职责 |
|------|------|------|
| `src/components/PlanLayout.vue` | 修改 | 持有 `taskListCollapsed` 状态、注册/注销 `Ctrl+\` 快捷键、中间栏宽度动画容器、接收 TaskList 的 `toggle` 事件 |
| `src/components/TaskList.vue` | 修改 | 标题行右侧新增收起按钮（`ChevronsLeft`，ghost/icon-sm），点击 emit `toggle` |

两个任务各产出独立可交付结果：任务 1 完成后 `Ctrl+\` 已可往返收起/展开；任务 2 追加标题行按钮入口。

---

### 任务 1：PlanLayout 状态、快捷键与布局动画

**文件：**
- 修改：`src/components/PlanLayout.vue`（全文重写 `<script setup>` 与模板，文件很小）

- [ ] **步骤 1：改写 `PlanLayout.vue` 的脚本与模板**

将文件整体替换为：

```vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useLocalStorage } from "@vueuse/core";
import CategoryList from "@/components/CategoryList.vue";
import TaskList from "@/components/TaskList.vue";
import TaskDetail from "@/components/TaskDetail.vue";
import { usePlanManager } from "@/composables/usePlanManager";

const { selectedTask, updateTaskContent } = usePlanManager();

const taskListCollapsed = useLocalStorage("plan-manager-tasklist-collapsed", false);

function toggleTaskList() {
  taskListCollapsed.value = !taskListCollapsed.value;
}

function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey && e.key === "\\") {
    e.preventDefault();
    toggleTaskList();
  }
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <div class="w-64 border-r border-border bg-card shrink-0">
      <CategoryList />
    </div>
    <div
      class="shrink-0 overflow-hidden transition-[width] duration-200 ease-in-out"
      :class="taskListCollapsed ? 'w-0' : 'w-80'"
    >
      <div class="w-80 h-full border-r border-border bg-card">
        <TaskList @toggle="toggleTaskList" />
      </div>
    </div>
    <div class="flex-1 bg-background min-w-0 h-full">
      <TaskDetail :task="selectedTask" @update:content="updateTaskContent" />
    </div>
  </div>
</template>
```

关键点：border 与背景放在内层 `w-80` 容器上，外层只做宽度裁剪——收起动画过程中文字不会被横向挤压，宽度归零时也不会残留 1px 的 `border-r` 细线。

- [ ] **步骤 2：类型检查**

运行：`pnpm exec vue-tsc -b`
预期：通过，无类型错误。（此时模板引用了尚未声明 emit 的 `@toggle`，Vue 的 `vue-tsc` 对模板中未声明事件的监听不报错，可正常通过。）

- [ ] **步骤 3：dev 手测快捷键收起**

运行：`pnpm dev`，打开 http://localhost:8080
预期：
- 页面加载默认展开任务列表（宽 320px）
- 按 `Ctrl+\`：任务列表在约 200ms 内向左侧收起至 0，详情栏铺满右侧剩余空间，收起后无残留竖线
- 再按 `Ctrl+\`：任务列表恢复 320px 宽，任务选中高亮保持
- 在右侧 Markdown 编辑器内输入文字后按 `Ctrl+\`：同样生效，且文字未受影响（无加粗等副作用）
- 刷新页面：保持上一次的收起/展开状态（localStorage key：`plan-manager-tasklist-collapsed`）

- [ ] **步骤 4：Commit**

```bash
git add src/components/PlanLayout.vue
git commit -m "feat: add task list collapse with Ctrl+\\ shortcut"
```

### 任务 2：TaskList 标题行收起按钮

**文件：**
- 修改：`src/components/TaskList.vue`（script 段新增 emit 声明与图标 import；标题行改为 flex 行并加按钮）

- [ ] **步骤 1：script 段声明 emit 并引入图标**

在 `TaskList.vue` 的 `<script setup lang="ts">` 中，将图标 import 行：

```ts
import { Plus, Pencil, Trash2, GripVertical } from "@lucide/vue";
```

改为：

```ts
import { Plus, Pencil, Trash2, GripVertical, ChevronsLeft } from "@lucide/vue";
```

并在 `usePlanManager()` 解构之后（`const localTasks = ref...` 之前）追加：

```ts
const emit = defineEmits<{ (e: "toggle"): void }>();
```

- [ ] **步骤 2：标题行改为 flex 布局并新增收起按钮**

将模板中的标题块：

```vue
<div class="p-4 border-b border-border">
  <h2 class="text-lg font-semibold text-foreground">任务列表</h2>
</div>
```

替换为：

```vue
<div class="p-4 border-b border-border flex items-center justify-between">
  <h2 class="text-lg font-semibold text-foreground">任务列表</h2>
  <Button
    variant="ghost"
    size="icon-sm"
    title="收起任务列表 (Ctrl+\)"
    aria-label="收起任务列表 (Ctrl+\)"
    @click="emit('toggle')"
  >
    <ChevronsLeft :size="18" />
  </Button>
</div>
```

`Button` 与 `emit` 在模板中均直接可用（已有 Button import；`defineEmits` 的 `emit` 可在模板中调用）。

- [ ] **步骤 3：类型检查**

运行：`pnpm exec vue-tsc -b`
预期：通过，无类型错误。

- [ ] **步骤 4：dev 手测按钮**

运行：`pnpm dev`（若已在运行则热更新即可），打开 http://localhost:8080
预期：
- 任务列表标题「任务列表」右侧出现一个 ghost 图标按钮（双左箭头）
- 悬停按钮出现提示"收起任务列表 (Ctrl+\)"
- 点击按钮：任务列表收起；再次按 `Ctrl+\`：可展开
- 收起状态下标题行随整栏隐藏，界面上无按钮残留

- [ ] **步骤 5：完整构建验证**

运行：`pnpm build`
预期：`vue-tsc -b` 与 `vite build` 均通过，无报错。

- [ ] **步骤 6：Commit**

```bash
git add src/components/TaskList.vue
git commit -m "feat: add collapse button to task list header"
```
