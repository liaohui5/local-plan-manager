<script setup lang="ts">
import CategoryList from "@/components/CategoryList.vue";
import TaskList from "@/components/TaskList.vue";
import TaskDetail from "@/components/TaskDetail.vue";
import { usePlanManager } from "@/composables/usePlanManager";

const { selectedTask, updateTaskContent } = usePlanManager();
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <div class="w-64 border-r border-border bg-card shrink-0">
      <CategoryList />
    </div>
    <div class="w-80 border-r border-border bg-card shrink-0">
      <TaskList />
    </div>
    <div class="flex-1 bg-background min-w-0 h-full">
      <TaskDetail :task="selectedTask" @update:content="updateTaskContent" />
    </div>
  </div>
</template>
