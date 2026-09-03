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
