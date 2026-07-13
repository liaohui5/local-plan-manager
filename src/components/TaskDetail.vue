<script setup lang="ts">
import { ref, watch } from "vue";
import type { Task } from "@/types";
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

const props = defineProps<{
  task: Task | null;
}>();

const emit = defineEmits<{
  (e: "update:content", id: string, content: string): void;
}>();

const editorContent = ref("");

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      editorContent.value = newTask.content;
    }
  },
  { immediate: true },
);

function handleChange(content: string) {
  if (props.task) {
    emit("update:content", props.task.id, content);
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-border">
      <h2 class="text-lg font-semibold text-foreground">任务详情</h2>
    </div>
    <div class="flex-1 overflow-hidden p-4">
      <div v-if="!task" class="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p class="text-sm">选择一个任务查看详情</p>
      </div>
      <div v-else class="h-full flex flex-col">
        <div class="mb-4">
          <h3 class="text-xl font-semibold text-foreground">{{ task.title }}</h3>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-xs text-muted-foreground">
              创建时间: {{ new Date(task.createdAt).toLocaleString("zh-CN") }}
            </span>
            <span class="text-xs text-muted-foreground">
              更新时间: {{ new Date(task.updatedAt).toLocaleString("zh-CN") }}
            </span>
          </div>
        </div>
        <div class="flex-1 min-h-0">
          <MdEditor
            v-model="editorContent"
            language="zh-CN"
            @change="handleChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
