<script setup lang="ts">
import { ref, watch } from "vue";
import draggable from "vuedraggable";
import { Plus, Pencil, Trash2, X, Check, GripVertical } from "@lucide/vue";
import type { Task } from "@/types";
import { usePlanManager } from "@/composables/usePlanManager";
import Button from "@/components/ui/button/Button.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import Dialog from "@/components/ui/dialog/Dialog.vue";

const {
  categories,
  filteredTasks,
  selectedTaskId,
  addTask,
  deleteTask,
  updateTask,
  selectedCategoryId,
  selectTask,
  tasks,
} = usePlanManager();

const localTasks = ref<Task[]>([]);

watch(
  () => filteredTasks.value,
  (newTasks) => {
    localTasks.value = [...newTasks];
  },
  { immediate: true },
);

const showAddForm = ref(false);
const newTaskTitle = ref("");
const deletingTaskId = ref<string | null>(null);
const showDeleteDialog = ref(false);

const editingTask = ref<Task | null>(null);
const showEditDialog = ref(false);
const editForm = ref({
  title: "",
  status: "pending" as Task["status"],
  priority: "medium" as Task["priority"],
  categoryId: "",
});

function handleAdd() {
  if (newTaskTitle.value.trim() && selectedCategoryId.value) {
    const newTask = addTask(selectedCategoryId.value, newTaskTitle.value.trim());
    newTaskTitle.value = "";
    showAddForm.value = false;
    selectTask(newTask.id);
  }
}

function openEditDialog(task: Task) {
  editingTask.value = task;
  editForm.value = {
    title: task.title,
    status: task.status,
    priority: task.priority,
    categoryId: task.categoryId,
  };
  showEditDialog.value = true;
}

function handleSaveEdit() {
  if (editingTask.value && editForm.value.title.trim()) {
    updateTask(editingTask.value.id, {
      title: editForm.value.title.trim(),
      status: editForm.value.status,
      priority: editForm.value.priority,
      categoryId: editForm.value.categoryId,
    });
  }
  showEditDialog.value = false;
  editingTask.value = null;
}

function handleDeleteClick(id: string) {
  deletingTaskId.value = id;
  showDeleteDialog.value = true;
}

function handleDeleteConfirm() {
  if (deletingTaskId.value) {
    deleteTask(deletingTaskId.value);
  }
  showDeleteDialog.value = false;
  deletingTaskId.value = null;
}

function syncTaskOrder() {
  if (!selectedCategoryId.value) return;
  const categoryId = selectedCategoryId.value;
  const newOrderIds = localTasks.value.map((t) => t.id);
  const otherTasks = tasks.value.filter((t) => t.categoryId !== categoryId);
  const categoryTasks = tasks.value.filter((t) => t.categoryId === categoryId);
  const taskMap = new Map(categoryTasks.map((t) => [t.id, t]));
  const reordered = newOrderIds.map((id) => taskMap.get(id)).filter(Boolean) as Task[];
  tasks.value.splice(0, tasks.value.length, ...otherTasks, ...reordered);
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
      <div v-if="localTasks.length === 0" class="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p class="text-sm">选择一个计划查看任务</p>
      </div>
      <draggable
        v-model="localTasks"
        item-key="id"
        handle=".drag-handle"
        animation="150"
        @end="syncTaskOrder"
      >
        <template #item="{ element: task }">
          <div
            :class="[
              'flex flex-col gap-1 px-3 py-3 rounded-lg cursor-pointer transition-colors group',
              selectedTaskId === task.id
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'hover:bg-accent hover:text-accent-foreground',
            ]"
            @click="selectTask(task.id)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span :class="['drag-handle cursor-grab active:cursor-grabbing transition-colors', selectedTaskId === task.id ? 'text-white' : 'text-muted-foreground hover:text-foreground']">
                  <GripVertical :size="14" />
                </span>
                <span class="text-sm font-medium truncate">{{ task.title }}</span>
              </div>
              <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon-sm" variant="ghost" @click.stop="openEditDialog(task)">
                  <Pencil :size="14" />
                </Button>
                <Button size="icon-sm" variant="ghost" @click.stop="handleDeleteClick(task.id)">
                  <Trash2 :size="14" />
                </Button>
              </div>
            </div>
            <div class="flex items-center gap-2">
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
        </template>
      </draggable>
    </div>
  </div>

  <Dialog v-model:open="showEditDialog" title="编辑任务" description="修改任务信息">
    <template #default>
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">任务标题</label>
          <input
            v-model="editForm.title"
            type="text"
            class="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">所属计划</label>
          <select
            v-model="editForm.categoryId"
            class="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">状态</label>
          <select
            v-model="editForm.status"
            class="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="pending">待处理</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
          </select>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">优先级</label>
          <select
            v-model="editForm.priority"
            class="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <Button variant="outline" @click="showEditDialog = false">取消</Button>
          <Button @click="handleSaveEdit">保存</Button>
        </div>
      </div>
    </template>
  </Dialog>

  <ConfirmDialog
    v-model:open="showDeleteDialog"
    title="删除任务"
    description="确定要删除这个任务吗？"
    confirm-text="删除"
    @confirm="handleDeleteConfirm"
  >
    <Button size="icon-sm" variant="ghost" style="display: none" />
  </ConfirmDialog>
</template>
