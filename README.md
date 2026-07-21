# Local Plan Manager

一款基于 Vue 3 的本地计划管理工具，采用三栏布局，支持分类管理、任务管理和 Markdown 编辑。

## 功能

- **计划列表（左侧栏）** — 管理计划/分类，支持添加、编辑、删除、拖拽排序、图标选择
- **任务列表（中间栏）** — 管理每个计划下的任务，支持添加、编辑（标题/状态/优先级/所属计划）、删除、拖拽排序
- **任务详情（右侧栏）** — 使用 Markdown 编辑器编写任务内容，支持实时保存
- **数据持久化** — 所有数据存储在浏览器 `localStorage` 中，刷新不丢失

## 技术栈

- **框架**: Vue 3（Composition API + `<script setup>` + SFC）
- **语言**: TypeScript
- **构建工具**: Vite
- **CSS**: Tailwind CSS v4（CSS-first 配置）
- **UI 组件**: shadcn-vue（New York 风格），基于 Reka UI 无头原语
- **图标**: Lucide Vue
- **Markdown 编辑器**: md-editor-v3
- **拖拽排序**: vuedraggable + sortablejs
- **本地存储**: @vueuse/core（useLocalStorage）

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 8080）
pnpm dev

# 生产构建
pnpm build

# 预览构建产物
pnpm preview
```

## 项目结构

```
src/
├── components/          # 组件
│   ├── ui/             # shadcn-vue UI 组件
│   │   ├── button/     # 按钮组件
│   │   └── dialog/     # 弹窗组件
│   ├── PlanLayout.vue       # 三栏布局
│   ├── CategoryList.vue     # 分类列表
│   ├── TaskList.vue         # 任务列表
│   ├── TaskDetail.vue       # 任务详情
│   └── ConfirmDialog.vue    # 确认弹窗
├── composables/         # 组合式函数
│   └── usePlanManager.ts    # 核心业务逻辑
├── types/               # TypeScript 类型定义
│   └── index.ts
├── lib/                 # 工具函数
│   └── utils.ts
├── App.vue              # 根组件
├── main.ts              # 应用入口
└── style.css            # 全局样式
```
