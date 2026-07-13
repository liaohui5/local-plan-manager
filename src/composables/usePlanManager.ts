import { computed } from "vue";
import { useLocalStorage } from "@vueuse/core";
import type { Category, Task } from "@/types";

const sampleCategories: Category[] = [
  {
    id: "cat-1",
    name: "工作",
    description: "工作任务计划",
    icon: "briefcase",
  },
  {
    id: "cat-2",
    name: "学习",
    description: "学习成长计划",
    icon: "book-open",
  },
  {
    id: "cat-3",
    name: "健康",
    description: "健康管理计划",
    icon: "heart",
  },
  {
    id: "cat-4",
    name: "财务",
    description: "财务管理计划",
    icon: "dollar-sign",
  },
];

const sampleTasks: Task[] = [
  {
    id: "task-1",
    categoryId: "cat-1",
    title: "完成季度报告",
    content: "# 季度报告\n\n## 目标\n\n完成 Q3 季度工作总结报告。\n\n## 待办事项\n\n- [ ] 收集各部门数据\n- [ ] 整理数据分析\n- [ ] 撰写报告初稿\n- [ ] 提交审核\n\n## 备注\n\n需要与各部门负责人确认数据准确性。",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
    status: "in_progress",
    priority: "high",
    tags: ["工作", "报告"],
  },
  {
    id: "task-2",
    categoryId: "cat-1",
    title: "团队周会",
    content: "# 团队周会\n\n每周一上午 10 点举行团队周会。\n\n## 议程\n\n1. 上周工作总结\n2. 本周计划安排\n3. 问题讨论\n\n## 相关链接\n\n- [会议文档]",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    status: "completed",
    priority: "medium",
    tags: ["工作", "会议"],
  },
  {
    id: "task-3",
    categoryId: "cat-2",
    title: "阅读《深入理解 Vue.js》",
    content: "# 阅读计划\n\n## 书籍信息\n\n- **书名**: 深入理解 Vue.js\n- **作者**: 梁灏\n\n## 阅读进度\n\n- [x] 第 1 章：Vue.js 简介\n- [x] 第 2 章：实例和模板\n- [ ] 第 3 章：计算属性和侦听器\n- [ ] 第 4 章：Class 与 Style 绑定\n\n## 笔记\n\n记录学习过程中的关键知识点。",
    createdAt: "2024-01-12T08:00:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
    status: "in_progress",
    priority: "high",
    tags: ["学习", "Vue.js"],
  },
  {
    id: "task-4",
    categoryId: "cat-2",
    title: "学习 TypeScript 高级类型",
    content: "# TypeScript 学习\n\n## 学习目标\n\n掌握 TypeScript 高级类型特性。\n\n## 内容大纲\n\n1. 泛型编程\n2. 条件类型\n3. 映射类型\n4. 模板字面量类型\n\n## 练习代码\n\n```typescript\ninterface ApiResponse<T> {\n  data: T;\n  status: number;\n  message: string;\n}\n```",
    createdAt: "2024-01-13T11:00:00Z",
    updatedAt: "2024-01-13T11:00:00Z",
    status: "pending",
    priority: "medium",
    tags: ["学习", "TypeScript"],
  },
  {
    id: "task-5",
    categoryId: "cat-3",
    title: "制定健身计划",
    content: "# 健身计划\n\n## 目标\n\n每周运动 3-4 次，保持健康体魄。\n\n## 运动安排\n\n- 周一：跑步 5 公里\n- 周三：力量训练\n- 周五：游泳\n- 周日：瑜伽\n\n## 饮食建议\n\n- 增加蛋白质摄入\n- 减少糖分\n- 多喝水",
    createdAt: "2024-01-14T07:00:00Z",
    updatedAt: "2024-01-14T07:00:00Z",
    status: "pending",
    priority: "high",
    tags: ["健康", "健身"],
  },
];

const categories = useLocalStorage<Category[]>("plan-manager-categories", sampleCategories);
const tasks = useLocalStorage<Task[]>("plan-manager-tasks", sampleTasks);
const selectedCategoryId = useLocalStorage<string | null>("plan-manager-selected-category", null);
const selectedTaskId = useLocalStorage<string | null>("plan-manager-selected-task", null);

const selectedCategory = computed(() => {
  if (!selectedCategoryId.value) return null;
  return categories.value.find((c) => c.id === selectedCategoryId.value) || null;
});

const filteredTasks = computed(() => {
  if (!selectedCategoryId.value) return [];
  return tasks.value.filter((t) => t.categoryId === selectedCategoryId.value);
});

const selectedTask = computed(() => {
  if (!selectedTaskId.value) return null;
  return tasks.value.find((t) => t.id === selectedTaskId.value) || null;
});

function selectCategory(id: string) {
  selectedCategoryId.value = id;
  selectedTaskId.value = null;
}

function selectTask(id: string) {
  selectedTaskId.value = id;
}

function updateTaskContent(id: string, content: string) {
  const task = tasks.value.find((t) => t.id === id);
  if (task) {
    task.content = content;
    task.updatedAt = new Date().toISOString();
  }
}

function addCategory(name: string, description = "", icon = "briefcase") {
  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    name,
    description,
    icon,
  };
  categories.value = [...categories.value, newCategory];
}

function updateCategory(id: string, updates: Partial<Category>) {
  const index = categories.value.findIndex((c) => c.id === id);
  if (index !== -1) {
    const updated = [...categories.value];
    updated[index] = { ...updated[index], ...updates };
    categories.value = updated;
  }
}

function deleteCategory(id: string) {
  categories.value = categories.value.filter((c) => c.id !== id);
  tasks.value = tasks.value.filter((t) => t.categoryId !== id);
  if (selectedCategoryId.value === id) {
    selectedCategoryId.value = null;
    selectedTaskId.value = null;
  }
}

function addTask(categoryId: string, title: string) {
  const newTask: Task = {
    id: `task-${Date.now()}`,
    categoryId,
    title,
    content: `# ${title}\n\n`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "pending",
    priority: "medium",
    tags: [],
  };
  tasks.value = [...tasks.value, newTask];
  return newTask;
}

function updateTask(id: string, updates: Partial<Task>) {
  const index = tasks.value.findIndex((t) => t.id === id);
  if (index !== -1) {
    const updated = [...tasks.value];
    updated[index] = { ...updated[index], ...updates };
    tasks.value = updated;
  }
}

function deleteTask(id: string) {
  tasks.value = tasks.value.filter((t) => t.id !== id);
  if (selectedTaskId.value === id) {
    selectedTaskId.value = null;
  }
}

export function usePlanManager() {
  return {
    categories,
    tasks,
    selectedCategoryId,
    selectedTaskId,
    selectedCategory,
    filteredTasks,
    selectedTask,
    selectCategory,
    selectTask,
    updateTaskContent,
    addCategory,
    updateCategory,
    deleteCategory,
    addTask,
    updateTask,
    deleteTask,
  };
}
