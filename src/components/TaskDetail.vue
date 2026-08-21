<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { Task } from "@/types";
import { MdEditor, config } from "md-editor-v3";
import { useLocalStorage } from "@vueuse/core";
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

// editorRef
let editorRef = ref<InstanceType<typeof MdEditor>>();
const setMdEditorPreviewOnly = (onlyPreview: boolean) => {
  // @ts-ignore
  editorRef.value?.togglePreviewOnly(onlyPreview);
};

let isPreviewOnly = useLocalStorage("__isPreviewOnly__", false);
function togglePreviewOnly(e: KeyboardEvent) {
  if (editorRef.value && e.ctrlKey && e.key == "e") {
    console.log(editorRef.value);
    isPreviewOnly.value = !isPreviewOnly.value;
    setMdEditorPreviewOnly(isPreviewOnly.value);
  }
}

onMounted(() => {
  setMdEditorPreviewOnly(isPreviewOnly.value);
  window.addEventListener("keyup", togglePreviewOnly);
});

config({
  codeMirrorExtensions(extensions) {
    // disabled short link
    return extensions.map((item) => {
      if (item.type === "linkShortener") {
        return {
          ...item,
          options: {
            maxLength: 100,
            shortenText: (url: string) => url,
          },
        };
      }
      return item;
    });
  },
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 min-h-0 h-full">
      <div v-if="!task" class="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p class="text-sm">选择一个任务查看详情</p>
      </div>
      <template v-else>
        <MdEditor
          ref="editorRef"
          :completions="[]"
          class="h-full!"
          v-model="editorContent"
          language="zh-CN"
          @change="handleChange"
        />
      </template>
    </div>
  </div>
</template>
