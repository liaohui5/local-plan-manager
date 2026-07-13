<script setup lang="ts">
import CategoryList from "@/components/CategoryList.vue";
import TaskList from "@/components/TaskList.vue";
import TaskDetail from "@/components/TaskDetail.vue";
import { usePlanManager } from "@/composables/usePlanManager";

const {
  categories,
  filteredTasks,
  selectedTask,
  selectedCategoryId,
  selectCategory,
  selectTask,
  updateTaskContent,
} = usePlanManager();
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <div class="w-64 border-r border-border bg-card shrink-0">
      <CategoryList
        :categories="categories"
        :selected-category-id="selectedCategoryId"
        @select="selectCategory"
      />
    </div>
    <div class="w-80 border-r border-border bg-card shrink-0">
      <TaskList
        :tasks="filteredTasks"
        :selected-task-id="selectedTask?.id || null"
        @select="selectTask"
      />
    </div>
    <div class="flex-1 bg-background min-w-0">
      <TaskDetail
        :task="selectedTask"
        @update:content="updateTaskContent"
      />
    </div>
  </div>
</template>
