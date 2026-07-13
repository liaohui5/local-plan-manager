<script setup lang="ts">
import { ref } from "vue";
import { Plus, Pencil, Trash2, X, Check } from "@lucide/vue";
import type { Task } from "@/types";
import { usePlanManager } from "@/composables/usePlanManager";
import Button from "@/components/ui/button/Button.vue";

const {
  filteredTasks,
  selectedTaskId,
  addTask,
  deleteTask,
  updateTask,
  selectedCategoryId,
  selectTask,
} = usePlanManager();

const showAddForm = ref(false);
const newTaskTitle = ref("");
const editingTaskId = ref<string | null>(null);
const editingTitle = ref("");

function handleAdd() {
  if (newTaskTitle.value.trim() && selectedCategoryId.value) {
    const newTask = addTask(selectedCategoryId.value, newTaskTitle.value.trim());
    newTaskTitle.value = "";
    showAddForm.value = false;
    selectTask(newTask.id);
  }
}

function startEdit(task: Task) {
  editingTaskId.value = task.id;
  editingTitle.value = task.title;
}

function saveEdit(id: string) {
  if (editingTitle.value.trim()) {
    updateTask(id, { title: editingTitle.value.trim() });
  }
  editingTaskId.value = null;
}

function handleDelete(id: string) {
  if (confirm("确定要删除这个任务吗？")) {
    deleteTask(id);
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-border">
      <h2 class="text-lg font-semibold text-foreground">任务列表</h2>
    </div>
    <div class="p-2 border-b border-border">
      <Button
        v-if="!showAddForm"
        variant="outline"
        size="sm"
        class="w-full"
        @click="showAddForm = true"
        :disabled="!selectedCategoryId"
      >
        <Plus :size="16" class="mr-1" />
        添加任务
      </Button>
      <div v-else class="flex gap-1">
        <input
          v-model="newTaskTitle"
          type="text"
          placeholder="任务标题"
          class="flex-1 px-2 py-1 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          @keyup.enter="handleAdd"
          @keyup.escape="showAddForm = false"
        />
        <Button size="icon-sm" variant="ghost" @click="handleAdd">
          <Check :size="16" />
        </Button>
        <Button size="icon-sm" variant="ghost" @click="showAddForm = false">
          <X :size="16" />
        </Button>
      </div>
    </div>
    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="filteredTasks.length === 0" class="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p class="text-sm">选择一个计划查看任务</p>
      </div>
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        :class="[
          'flex flex-col gap-1 px-3 py-3 rounded-lg cursor-pointer transition-colors group',
          selectedTaskId === task.id
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent hover:text-accent-foreground',
        ]"
        @click="selectTask(task.id)"
      >
        <div class="flex items-center justify-between">
          <template v-if="editingTaskId === task.id">
            <input
              v-model="editingTitle"
              type="text"
              class="flex-1 px-1 py-0.5 text-sm bg-background text-foreground border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring mr-2"
              @keyup.enter="saveEdit(task.id)"
              @keyup.escape="editingTaskId = null"
              @click.stop
            />
            <Button size="icon-sm" variant="ghost" @click.stop="saveEdit(task.id)">
              <Check :size="14" />
            </Button>
            <Button size="icon-sm" variant="ghost" @click.stop="editingTaskId = null">
              <X :size="14" />
            </Button>
          </template>
          <template v-else>
            <span class="text-sm font-medium truncate flex-1">{{ task.title }}</span>
            <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon-sm" variant="ghost" @click.stop="startEdit(task)">
                <Pencil :size="14" />
              </Button>
              <Button size="icon-sm" variant="ghost" @click.stop="handleDelete(task.id)">
                <Trash2 :size="14" />
              </Button>
            </div>
          </template>
        </div>
        <div v-if="editingTaskId !== task.id" class="flex items-center gap-2">
          <span
            :class="[
              'text-xs px-1.5 py-0.5 rounded-full',
              task.status === 'completed'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : task.status === 'in_progress'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
            ]"
          >
            {{ task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '进行中' : '待处理' }}
          </span>
          <span
            :class="[
              'text-xs px-1.5 py-0.5 rounded-full',
              task.priority === 'high'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : task.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
            ]"
          >
            {{ task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
