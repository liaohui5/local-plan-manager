<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useLocalStorage } from "@vueuse/core";
import CategoryList from "@/components/CategoryList.vue";
import TaskList from "@/components/TaskList.vue";
import TaskDetail from "@/components/TaskDetail.vue";
import { usePlanManager } from "@/composables/usePlanManager";

const { selectedTask, updateTaskContent } = usePlanManager();

const categoryListCollapsed = useLocalStorage("plan-manager-categorylist-collapsed", false);

function toggleCategoryList() {
  categoryListCollapsed.value = !categoryListCollapsed.value;
}

function onKeydown(e: KeyboardEvent) {
  if (e.repeat) return;
  if (e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey && e.key === "\\") {
    e.preventDefault();
    toggleCategoryList();
  }
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden">
    <div
      class="shrink-0 overflow-hidden transition-[width] duration-200 ease-in-out"
      :class="categoryListCollapsed ? 'w-0' : 'w-64'"
      :inert="categoryListCollapsed"
    >
      <div class="w-64 h-full border-r border-border bg-card">
        <CategoryList @toggle="toggleCategoryList" />
      </div>
    </div>
    <div class="w-80 shrink-0 border-r border-border bg-card h-full overflow-hidden">
      <TaskList />
    </div>
    <div class="flex-1 bg-background min-w-0 h-full">
      <TaskDetail :task="selectedTask" @update:content="updateTaskContent" />
    </div>
  </div>
</template>
