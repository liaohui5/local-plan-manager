# plan-manager 项目知识库

## 项目概述

- **项目名称**: plan-manager（计划管理器）
- **版本**: 0.0.1
- **包管理器**: pnpm（`pnpm-workspace.yaml` 中配置了 `vue-demi` 的 `allowBuilds`）
- **项目类型**: 本地单页应用（SPA），纯前端，无后端服务
- **数据持久化**: 所有数据存储在浏览器 `localStorage` 中，通过 `@vueuse/core` 的 `useLocalStorage` 实现
- **开发命令**:
  - `pnpm dev` — 启动 Vite 开发服务器，端口 8080，支持 HMR
  - `pnpm build` — 先执行 `vue-tsc -b` 项目引用式类型检查，再执行 `vite build` 构建
  - `pnpm preview` — 预览构建产物
- **项目阶段**: 已具备完整的三栏式布局、分类管理、任务管理、Markdown 编辑器等核心功能

## 技术栈

| 层面 | 技术选型 | 版本 |
|------|----------|------|
| 前端框架 | Vue 3（Composition API + `<script setup>` + SFC） | ^3.5.39 |
| 语言 | TypeScript（项目引用模式） | ~6.0.2 |
| 构建工具 | Vite | ^8.1.1 |
| CSS 框架 | Tailwind CSS v4（CSS-first 配置，无 tailwind.config.js） | ^4.3.2 |
| UI 组件体系 | shadcn-vue（New York 风格），基于 Reka UI 无头原语 | — |
| 图标库 | Lucide Vue | ^1.23.0 |
| CSS 动画 | tw-animate-css | ^1.4.0 |
| 代码格式化 | Oxfmt（Rust 实现的 JS 格式化器） | — |
| 编辑器配置 | EditorConfig | — |

## 新增依赖（相对 shadcn-vue 模板）

| 依赖 | 用途 |
|------|------|
| `@vueuse/core` ^14.3.0 | Vue 实用工具库，用于 `useLocalStorage` 实现数据持久化 |
| `md-editor-v3` ^6.5.3 | Markdown 编辑器组件，用于任务详情编辑 |
| `sortablejs` ^1.15.7 | 底层拖拽排序库 |
| `vuedraggable` ^4.1.0 | Vue 3 的 SortableJS 封装，用于分类和任务的拖拽排序 |
| `@types/node` ^24.13.3（dev） | Node.js 类型定义，用于 `vite.config.ts` 中的 `path` 模块 |

## 代码格式化

- **Oxfmt**（`.oxfmtrc.json`）: 不使用 Tab、分号结尾、双引号、尾随逗号、强制圆括号、括号内留空格、bracketSameLine 为 false
- **EditorConfig**（`.editorconfig`）: UTF-8 编码、LF 换行、最大行宽 120、JS/TS/Vue/CSS 使用 2 空格缩进、JSON/YAML 使用 2 空格缩进、Python 最大行宽 88

## 项目目录结构

```
plan-manager/
├── .editorconfig             # EditorConfig 格式化规范
├── .gitignore                # Git 忽略规则
├── .oxfmtrc.json             # Oxfmt 代码格式化配置
├── components.json           # shadcn-vue 配置文件
├── index.html                # Vite HTML 入口
├── package.json              # 项目依赖与脚本
├── pnpm-lock.yaml            # pnpm 依赖锁文件
├── pnpm-workspace.yaml       # pnpm 工作区配置
├── README.md                 # 项目说明（仍为默认模板内容，未自定义）
├── tsconfig.json             # TS 项目引用入口（files 为空，引用 app + node）
├── tsconfig.app.json         # 应用代码 TS 配置（继承 @vue/tsconfig/tsconfig.dom.json）
├── tsconfig.node.json        # Node/构建工具 TS 配置
├── vite.config.ts            # Vite 配置（Vue + Tailwind 插件，@ 别名）
├── public/                   # 公共静态资源
│   ├── favicon.svg           # 浏览器标签页图标（紫色抽象几何图形）
│   └── icons.svg             # SVG Symbol Sprite（Bluesky、Discord、GitHub、X 等图标）
├── src/                      # 源代码目录
│   ├── assets/               # 图片等静态资源
│   │   ├── hero.png          # 项目主视觉图（343×361 像素）
│   │   ├── vite.svg          # Vite 官方 logo
│   │   └── vue.svg           # Vue.js 官方 logo
│   ├── components/           # 组件目录
│   │   ├── ui/               # shadcn-vue UI 组件
│   │   │   ├── button/       # Button 组件
│   │   │   │   ├── Button.vue    # 按钮组件（基于 Reka UI Primitive + CVA 变体）
│   │   │   │   └── index.ts      # CVA 变体定义 + 导出
│   │   │   └── dialog/       # Dialog 组件（任务编辑弹窗）
│   │   │       └── Dialog.vue    # 基于 Reka UI DialogRoot 的通用弹窗
│   │   ├── PlanLayout.vue    # 三栏布局容器组件
│   │   ├── CategoryList.vue  # 分类列表（左侧栏），含 CRUD + 拖拽排序
│   │   ├── TaskList.vue      # 任务列表（中间栏），含 CRUD + 拖拽排序 + 编辑弹窗
│   │   ├── TaskDetail.vue    # 任务详情（右侧栏），含 Markdown 编辑器
│   │   └── ConfirmDialog.vue # 确认删除对话框（基于 Reka UI AlertDialog）
│   ├── composables/          # 组合式函数
│   │   └── usePlanManager.ts # 核心业务逻辑（数据管理、增删改查）
│   ├── types/                # TypeScript 类型定义
│   │   └── index.ts          # Category、Task 接口定义
│   ├── lib/
│   │   └── utils.ts          # 工具函数（cn() —— clsx + tailwind-merge）
│   ├── App.vue               # 根组件（引入 PlanLayout）
│   ├── main.ts               # 应用入口（createApp + 挂载 #app）
│   └── style.css             # 全局样式（Tailwind v4 + 主题变量 + 暗色模式）
```

## 数据模型

### Category（分类）

```typescript
interface Category {
  id: string;              // 唯一标识，格式如 "cat-{timestamp}"
  name: string;            // 分类名称
  description?: string;    // 可选描述
  icon?: string;           // 可选图标名称，对应 Lucide 图标
}
```

支持 16 种图标：`briefcase`、`book-open`、`heart`、`dollar-sign`、`home`、`star`、`flag`、`target`、`check-square`、`settings`、`user`、`calendar`、`clock`、`tag`、`folder-open`、`file-text`

内置 4 个示例分类：工作、学习、健康、财务

### Task（任务）

```typescript
interface Task {
  id: string;                      // 唯一标识，格式如 "task-{timestamp}"
  categoryId: string;              // 所属分类 ID
  title: string;                   // 任务标题
  content: string;                 // Markdown 格式的任务内容
  createdAt: string;               // ISO 8601 创建时间
  updatedAt: string;               // ISO 8601 更新时间
  status: "pending" | "in_progress" | "completed";  // 任务状态
  priority: "low" | "medium" | "high";              // 优先级
  tags?: string[];                 // 可选标签列表
}
```

内置 5 个示例任务，分布在不同的分类下

### 状态管理（`usePlanManager` composable）

- 使用 `@vueuse/core` 的 `useLocalStorage` 实现状态持久化
- 4 个 localStorage key：`plan-manager-categories`、`plan-manager-tasks`、`plan-manager-selected-category`、`plan-manager-selected-task`
- 导出的计算属性：`categories`、`tasks`、`selectedCategoryId`、`selectedTaskId`、`selectedCategory`（基于 selectedCategoryId 计算）、`filteredTasks`（基于 selectedCategoryId 过滤）、`selectedTask`（基于 selectedTaskId 计算）
- 导出的操作方法：`selectCategory`、`selectTask`、`updateTaskContent`、`addCategory`、`updateCategory`、`deleteCategory`、`addTask`、`updateTask`、`deleteTask`
- 选择分类时会自动清空选中的任务（`selectCategory` 中设置 `selectedTaskId.value = null`）
- 删除分类时会同时删除该分类下所有任务
- 所有数组操作均通过创建新数组（不可变更新）来触发 `useLocalStorage` 的响应式更新

## 应用架构

### 三栏布局

```
┌─────────┬──────────┬──────────────────────────┐
│ 分类列表 │ 任务列表  │    任务详情              │
│         │          │  (Markdown Editor)       │
│ w-64    │ w-80     │  flex-1                  │
│ bg-card │ bg-card  │  bg-background           │
└─────────┴──────────┴──────────────────────────┘
```

- **左侧栏（CategoryList）**: 显示所有分类，支持添加、编辑、删除、拖拽排序
- **中间栏（TaskList）**: 显示当前选中分类下的任务，支持添加、编辑、删除、拖拽排序
- **右侧栏（TaskDetail）**: 使用 `md-editor-v3` Markdown 编辑器，实时编辑任务内容

### 组件树

```
App.vue
└── PlanLayout.vue
    ├── CategoryList.vue       # 左侧分类列表
    │   ├── Button.vue         # shadcn-vue 按钮
    │   ├── ConfirmDialog.vue  # 删除确认弹窗
    │   └── vuedraggable       # 拖拽排序
    ├── TaskList.vue           # 中间任务列表
    │   ├── Button.vue
    │   ├── Dialog.vue         # 编辑任务弹窗（任务标题/状态/优先级）
    │   ├── ConfirmDialog.vue  # 删除确认弹窗
    │   └── vuedraggable       # 拖拽排序
    └── TaskDetail.vue         # 右侧任务详情
        └── MdEditor           # md-editor-v3 Markdown 编辑器
```

### 功能详情

#### 分类管理
- **添加**: 点击「添加计划」按钮，输入名称后确认
- **编辑**: 鼠标悬停显示编辑按钮，可修改名称和图标（16 种 Lucide 图标可选）
- **删除**: 需经 ConfirmDialog 确认，级联删除该分类下所有任务
- **排序**: 拖拽拖拽手柄（GripVertical 图标）调整顺序
- **选择**: 点击分类项，选中后以蓝色高亮（`bg-blue-600`），同时清空任务选中状态

#### 任务管理
- **添加**: 选中分类后点击「添加任务」按钮，输入标题后确认，自动选中新任务
- **编辑**: 通过 Dialog 弹窗编辑任务标题、状态（待处理/进行中/已完成）和优先级（低/中/高）
- **删除**: 需经 ConfirmDialog 确认
- **排序**: 拖拽拖拽手柄调整顺序，拖拽结束后通过 `syncTaskOrder` 将排序同步回全局任务列表
- **选中**: 点击任务项，选中后以蓝色高亮，右侧栏显示任务详情
- **状态/优先级标签**: 使用彩色圆角标签显示（状态：绿-已完成/蓝-进行中/灰-待处理；优先级：红-高/黄-中/灰-低）

#### 任务详情编辑
- 使用 `md-editor-v3` Markdown 编辑器，中文界面（`language="zh-CN"`）
- 输入内容实时触发 `update:content` 事件，更新到全局状态
- 切换任务时，编辑器内容自动跟随

## TypeScript 配置要点

- 采用**项目引用（Project References）**模式：`tsconfig.json` 作为入口，引用 `tsconfig.app.json` 和 `tsconfig.node.json`
- `tsconfig.app.json` 继承 `@vue/tsconfig/tsconfig.dom.json`，包含 `src/**/*.ts`、`src/**/*.tsx`、`src/**/*.vue`
- 开启严格 lint 选项：`noUnusedLocals`、`noUnusedParameters`、`erasableSyntaxOnly`、`noFallthroughCasesInSwitch`
- 路径别名 `@/*` → `./src/*`，在 tsconfig 和 vite.config 中保持一致的配置
- `tsconfig.node.json` 仅包含 `vite.config.ts`，`noEmit: true`，启用 `verbatimModuleSyntax` 和 `skipLibCheck`
- 使用 `vue-tsc -b` 进行项目引用式构建时类型检查，`types` 包含 `vite/client` 以支持 Vite API 类型

## 关键约定与模式

### 路径别名
- `@` 映射到 `./src`，在 `vite.config.ts`（Vite `resolve.alias`）和 `tsconfig.json`（`compilerOptions.paths`）中同时配置，保持一致性

### 样式方案
- 全局样式定义在 `src/style.css`，通过 `@import "tailwindcss"` 和 `@import "tw-animate-css"` 引入 Tailwind v4 和动画库（无需独立 tailwind.config.js）
- 暗色模式机制：通过 `@custom-variant dark (&:is(.dark *))` 定义，即通过 `.dark` 类名切换，而非 `prefers-color-scheme` 媒体查询
- 使用 `@theme inline` 指令将 CSS 变量映射为 Tailwind 主题令牌（shadcn-vue 标准做法）
- 所有颜色 token 使用现代 `oklch()` 色彩空间（Tailwind v4 推荐格式）
- 支持亮/暗主题：`:root` 定义亮色主题变量，`.dark` 定义暗色主题变量（完整的颜色系统覆盖）
- shadcn-vue 主题变量在 `:root` 和 `.dark` 中分别定义，包括 `--background`、`--foreground`、`--card`、`--popover`、`--primary`、`--secondary`、`--muted`、`--accent`、`--destructive`、`--border`、`--input`、`--ring`、`--chart-1~5`、`--sidebar` 系列
- 圆角系统：`--radius: 0.625rem`，通过 `calc()` 派生 `--radius-sm/md/lg/xl`
- `@layer base`：全局基础样式——`*` 元素默认 `border-border outline-ring/50`，`body` 默认 `bg-background text-foreground`
- 字体：从 Google Fonts CDN 加载 `JetBrains Mono`（400/500/600/700 权重），通过 `--font-heading: var(--font-mono)` 映射为 Tailwind 主题令牌

### 工具函数
- `cn()`（`src/lib/utils.ts`）: 合并 class 的标准工具函数，组合了 `clsx`（条件类名合并）和 `tailwind-merge`（智能解决 Tailwind 类名冲突），所有 UI 组件都应通过它来合并 class

### 组件开发模式
- **UI 组件**: 使用 Reka UI 的 `Primitive` 组件作为底层，以实现无障碍（ARIA）支持和多态渲染（polymorphic `as` prop）
- **变体样式**: 通过 `cva()` 定义（`class-variance-authority`），支持 `variant` 和 `size` 等多维度变体
- **语义化属性**: 组件通过 `data-slot`、`data-variant`、`data-size` 属性暴露语义化标识（用于 CSS 样式钩子和开发者工具调试）
- **组件结构**: 每个 UI 组件目录包含 `.vue` 文件（模板 + 逻辑）和 `index.ts`（导出 + CVA 变体定义 + 类型导出）
- **Button 组件**: Props 继承 `PrimitiveProps`（来自 reka-ui），额外定义 `variant`、`size`、`class`，默认 `as` 为 `"button"`
- **Dialog 组件**: 基于 Reka UI 的 `DialogRoot`，统一封装了遮罩层（Overlay）、内容区域（Content）、标题（Title）、描述（Description）和关闭按钮（Close），通过 `v-model:open` 双向绑定
- **ConfirmDialog 组件**: 基于 Reka UI 的 `AlertDialogRoot`，封装了确认/取消操作的标准弹窗，用于删除操作前的二次确认

### 暗色模式实现细节
- 切换方式：通过向 DOM 元素添加/移除 `.dark` 类名实现
- 自定义变体：`@custom-variant dark (&:is(.dark *))`，使 Tailwind 的 `dark:` 前缀在 `.dark` 类存在时生效
- 颜色差异：暗色模式下 `destructive` 色值不同，`border` 和 `input` 使用透明度（`oklch(1 0 0 / 10%)`、`oklch(1 0 0 / 15%)`）

## 构建流程

1. `pnpm dev`：启动 Vite 开发服务器，默认端口 8080，支持 HMR
2. `pnpm build`：先执行 `vue-tsc -b`（项目引用式类型检查，覆盖所有 TS/Vue 文件），通过后再执行 `vite build`（生产构建）
3. `pnpm preview`：使用 Vite 预览构建产物
