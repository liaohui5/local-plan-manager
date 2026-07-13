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
    <div class="flex-1 min-h-0 h-full">
      <div v-if="!task" class="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p class="text-sm">选择一个任务查看详情</p>
      </div>
      <template v-else>
        <MdEditor class="!h-full" v-model="editorContent" language="zh-CN" @change="handleChange" />
      </template>
    </div>
  </div>
</template>
