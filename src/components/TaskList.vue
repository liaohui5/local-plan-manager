<script setup lang="ts">
import type { Task } from "@/types";

defineProps<{
  tasks: Task[];
  selectedTaskId: string | null;
}>();

const emit = defineEmits<{
  (e: "select", id: string): void;
}>();
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-border">
      <h2 class="text-lg font-semibold text-foreground">任务列表</h2>
    </div>
    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="tasks.length === 0" class="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p class="text-sm">选择一个计划查看任务</p>
      </div>
      <div
        v-for="task in tasks"
        :key="task.id"
        :class="[
          'flex flex-col gap-1 px-3 py-3 rounded-lg cursor-pointer transition-colors',
          selectedTaskId === task.id
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent hover:text-accent-foreground',
        ]"
        @click="emit('select', task.id)"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium truncate">{{ task.title }}</span>
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
    </div>
  </div>
</template>
