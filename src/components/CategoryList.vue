<script setup lang="ts">
import { ref } from "vue";
import { Briefcase, BookOpen, Heart, DollarSign, Plus, Pencil, Trash2, X, Check } from "@lucide/vue";
import type { Category } from "@/types";
import { usePlanManager } from "@/composables/usePlanManager";
import Button from "@/components/ui/button/Button.vue";

const {
  categories,
  selectedCategoryId,
  addCategory,
  updateCategory,
  deleteCategory,
  selectCategory,
} = usePlanManager();

const showAddForm = ref(false);
const newCategoryName = ref("");
const editingCategoryId = ref<string | null>(null);
const editingName = ref("");

const iconMap: Record<string, typeof Briefcase> = {
  briefcase: Briefcase,
  "book-open": BookOpen,
  heart: Heart,
  "dollar-sign": DollarSign,
};

function handleAdd() {
  if (newCategoryName.value.trim()) {
    addCategory(newCategoryName.value.trim(), "", "briefcase");
    newCategoryName.value = "";
    showAddForm.value = false;
  }
}

function startEdit(category: Category) {
  editingCategoryId.value = category.id;
  editingName.value = category.name;
}

function saveEdit(id: string) {
  if (editingName.value.trim()) {
    updateCategory(id, { name: editingName.value.trim() });
  }
  editingCategoryId.value = null;
}

function handleDelete(id: string) {
  if (confirm("确定要删除这个计划吗？相关的任务也会被删除。")) {
    deleteCategory(id);
  }
}

function handleSelect(id: string) {
  selectCategory(id);
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-border">
      <h2 class="text-lg font-semibold text-foreground">计划列表</h2>
    </div>
    <div class="p-2 border-b border-border">
      <Button v-if="!showAddForm" variant="outline" size="sm" class="w-full" @click="showAddForm = true">
        <Plus :size="16" class="mr-1" />
        添加计划
      </Button>
      <div v-else class="flex gap-1">
        <input
          v-model="newCategoryName"
          type="text"
          placeholder="计划名称"
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
      <div
        v-for="category in categories"
        :key="category.id"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group',
          selectedCategoryId === category.id
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent hover:text-accent-foreground',
        ]"
        @click="handleSelect(category.id)"
      >
        <component
          :is="iconMap[category.icon || 'briefcase']"
          :size="18"
          class="shrink-0"
        />
        <div class="flex-1 min-w-0">
          <template v-if="editingCategoryId === category.id">
            <input
              v-model="editingName"
              type="text"
              class="w-full px-1 py-0.5 text-sm bg-background text-foreground border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
              @keyup.enter="saveEdit(category.id)"
              @keyup.escape="editingCategoryId = null"
              @click.stop
            />
          </template>
          <template v-else>
            <span class="text-sm font-medium truncate block">{{ category.name }}</span>
            <span
              v-if="category.description"
              :class="[
                'text-xs truncate block',
                selectedCategoryId === category.id
                  ? 'text-primary-foreground/70'
                  : 'text-muted-foreground',
              ]"
            >
              {{ category.description }}
            </span>
          </template>
        </div>
        <div v-if="editingCategoryId !== category.id" class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon-sm" variant="ghost" @click.stop="startEdit(category)">
            <Pencil :size="14" />
          </Button>
          <Button size="icon-sm" variant="ghost" @click.stop="handleDelete(category.id)">
            <Trash2 :size="14" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
