# plan-manager 项目知识库

## 项目概述

- **项目名称**: plan-manager（计划管理器）
- **版本**: 0.0.1
- **包管理器**: pnpm（`pnpm-workspace.yaml` 中配置了 `vue-demi` 的 `allowBuilds`）
- **项目阶段**: 极早期阶段，从 shadcn-vue 模板起步，目前仅有 Button 组件和演示用 App.vue
- **开发命令**:
  - `pnpm dev` — 启动 Vite 开发服务器，端口 8080
  - `pnpm build` — 先执行 `vue-tsc -b` 项目引用式类型检查，再执行 `vite build` 构建
  - `pnpm preview` — 预览构建产物

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
├── pnpm-workspace.yaml       # pnpm 工作区配置（允许 vue-demi build）
├── README.md                 # 项目说明（默认模板内容，未自定义）
├── tsconfig.json             # TS 项目引用入口（files 为空，引用 app + node）
├── tsconfig.app.json         # 应用代码 TS 配置（继承 @vue/tsconfig/tsconfig.dom.json）
├── tsconfig.node.json        # Node/构建工具 TS 配置
├── vite.config.ts            # Vite 配置（Vue + Tailwind 插件，@ 别名）
├── public/                   # 公共静态资源
│   ├── favicon.svg           # 浏览器标签页图标（紫色抽象几何图形）
│   └── icons.svg             # SVG Symbol Sprite（Bluesky、Discord、GitHub、X 等图标）
├── src/                      # 源代码目录
│   ├── assets/               # 图片等静态资源
│   │   ├── vite.svg          # Vite 官方 logo（紫色，带 prefers-color-scheme 适配）
│   │   ├── vue.svg           # Vue.js 官方 logo（绿色 + 深蓝三斜线）
│   │   └── hero.png          # 项目主视觉图（343×361 像素）
│   ├── components/ui/        # shadcn-vue UI 组件目录
│   │   └── button/           # Button 组件
│   │       ├── Button.vue    # 按钮组件（基于 Reka UI Primitive + CVA 变体）
│   │       └── index.ts      # 导出 + CVA 变体定义
│   ├── lib/
│   │   └── utils.ts          # 工具函数（cn() —— clsx + tailwind-merge）
│   ├── App.vue               # 根组件（全屏居中，包含演示 Button）
│   ├── main.ts               # 应用入口（createApp + 挂载 #app）
│   └── style.css             # 全局样式（Tailwind v4 + 主题变量 + 暗色模式）
```

## 关键依赖与作用

| 依赖 | 用途 |
|------|------|
| `vue` ^3.5.39 | Vue 3 框架 |
| `reka-ui` ^2.10.1 | 无头 UI 原语库（`Primitive` 组件），提供无障碍支持和多态渲染能力 |
| `class-variance-authority` ^0.7.1 | 通过 `cva()` 定义组件变体（variant/size）样式 |
| `clsx` ^2.1.1 | 条件性 class 拼接 |
| `tailwind-merge` ^3.6.0 | 智能合并 Tailwind class，解决冲突 |
| `@lucide/vue` ^1.23.0 | Lucide 图标库的 Vue 封装 |
| `tw-animate-css` ^1.4.0 | Tailwind 动画 CSS 库，为 shadcn 动画提供支持 |
| `@tailwindcss/vite` ^4.3.2 | Vite 插件，用于 Tailwind CSS v4 的 JIT 编译 |

## TypeScript 配置要点

- 采用**项目引用（Project References）**模式：`tsconfig.json` 作为入口，引用 `tsconfig.app.json` 和 `tsconfig.node.json`
- `tsconfig.app.json` 继承 `@vue/tsconfig/tsconfig.dom.json`，包含 `src/**/*.ts`、`src/**/*.tsx`、`src/**/*.vue`
- 开启严格 lint 选项：`noUnusedLocals`、`noUnusedParameters`、`erasableSyntaxOnly`、`noFallthroughCasesInSwitch`
- 路径别名 `@/*` → `./src/*`，在 tsconfig 和 vite.config 中保持一致的配置
- `tsconfig.node.json` 仅包含 `vite.config.ts`，`noEmit: true`，启用 `verbatimModuleSyntax` 和 `skipLibCheck`
- 使用 `vue-tsc -b` 进行项目引用式构建时类型检查，`types` 包含 `vite/client` 以支持 API 类型

## 关键约定与模式

### 路径别名
- `@` 映射到 `./src`，在 `vite.config.ts`（Vite `resolve.alias`）和 `tsconfig.json`（`compilerOptions.paths`）中同时配置，保持一致性。

### 样式方案
- 全局样式定义在 `src/style.css`，通过 `@import "tailwindcss"` 和 `@import "tw-animate-css"` 引入 Tailwind v4 和动画库（无需独立 tailwind.config.js）
- 暗色模式机制：通过 `@custom-variant dark (&:is(.dark *))` 定义，即通过 `.dark` 类名切换，而非 `prefers-color-scheme` 媒体查询
- 使用 `@theme inline` 指令将 CSS 变量映射为 Tailwind 主题令牌（shadcn-vue 标准做法）
- 所有颜色 token 使用现代 `oklch()` 色彩空间（Tailwind v4 推荐格式）
- 支持亮/暗主题：`:root` 定义亮色主题变量，`.dark` 定义暗色主题变量（完整的颜色系统覆盖）
- shadcn-vue 主题变量在 `:root` 和 `.dark` 中分别定义，包括 `--background`、`--foreground`、`--card`、`--popover`、`--primary`、`--secondary`、`--muted`、`--accent`、`--destructive`、`--border`、`--input`、`--ring`、`--chart-1~5`、`--sidebar` 系列
- 圆角系统：`--radius: 0.625rem`，通过 `calc()` 派生出 `--radius-sm/md/lg/xl`
- `@layer base`：全局基础样式——`*` 元素默认 `border-border outline-ring/50`，`body` 默认 `bg-background text-foreground`
- 字体：从 Google Fonts CDN 加载 `JetBrains Mono`（400/500/600/700 权重），通过 `--font-heading: var(--font-mono)` 映射为 Tailwind 主题令牌

### 工具函数
- `cn()`（`src/lib/utils.ts`）: 合并 class 的标准工具函数，组合了 `clsx`（条件类名合并）和 `tailwind-merge`（智能解决 Tailwind 类名冲突），所有 UI 组件都应通过它来合并 class

### 组件开发模式
- UI 组件使用 Reka UI 的 `Primitive` 组件作为底层，以实现无障碍（ARIA）支持和多态渲染（polymorphic `as` prop）
- 变体样式通过 `cva()` 定义（`class-variance-authority`），支持 `variant` 和 `size` 等多维度变体
- 组件通过 `data-slot`、`data-variant`、`data-size` 属性暴露语义化标识（用于 CSS 样式钩子和开发者工具调试）
- 每个 UI 组件目录包含 `.vue` 文件（模板 + 逻辑）和 `index.ts`（导出 + CVA 变体定义 + 类型导出）
- Button 组件 Props 继承 `PrimitiveProps`（来自 reka-ui），额外定义 `variant`、`size`、`class`，默认 `as` 为 `"button"`

### 暗色模式实现细节
- 切换方式：通过向 DOM 元素添加/移除 `.dark` 类名实现
- 自定义变体：`@custom-variant dark (&:is(.dark *))`，使 Tailwind 的 `dark:` 前缀在 `.dark` 类存在时生效
- 颜色差异：暗色模式下 `destructive` 色值不同，`border` 和 `input` 使用透明度（`oklch(1 0 0 / 10%)`、`oklch(1 0 0 / 15%)`）

### shadcn-vue 配置
- `components.json` 风格：`new-york`，字体：`jetbrains-mono`，基础色：`neutral`，图标库：`lucide`，RTL 关闭，pointer 关闭
- 路径别名约定：`components` → `@/components`，`utils` → `@/lib/utils`，`ui` → `@/components/ui`，`lib` → `@/lib`，`composables` → `@/composables`

## 构建流程

1. `pnpm dev`：启动 Vite 开发服务器，默认端口 8080，支持 HMR
2. `pnpm build`：先执行 `vue-tsc -b`（项目引用式类型检查，覆盖所有 TS/Vue 文件），通过后再执行 `vite build`（生产构建）
3. `pnpm preview`：使用 Vite 预览构建产物
