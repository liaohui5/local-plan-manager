<script setup lang="ts">
import { Briefcase, BookOpen, Heart, DollarSign } from "@lucide/vue";
import type { Category } from "@/types";

const iconMap: Record<string, typeof Briefcase> = {
  briefcase: Briefcase,
  "book-open": BookOpen,
  heart: Heart,
  "dollar-sign": DollarSign,
};

defineProps<{
  categories: Category[];
  selectedCategoryId: string | null;
}>();

const emit = defineEmits<{
  (e: "select", id: string): void;
}>();
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-border">
      <h2 class="text-lg font-semibold text-foreground">计划列表</h2>
    </div>
    <div class="flex-1 overflow-y-auto p-2">
      <div
        v-for="category in categories"
        :key="category.id"
        :class="[
          'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
          selectedCategoryId === category.id
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent hover:text-accent-foreground',
        ]"
        @click="emit('select', category.id)"
      >
        <component
          :is="iconMap[category.icon || 'briefcase']"
          :size="18"
          class="shrink-0"
        />
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-medium truncate">{{ category.name }}</span>
          <span
            v-if="category.description"
            :class="[
              'text-xs truncate',
              selectedCategoryId === category.id
                ? 'text-primary-foreground/70'
                : 'text-muted-foreground',
            ]"
          >
            {{ category.description }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
