<script setup lang="ts">
import { ref } from "vue";
import draggable from "vuedraggable";
import {
  Briefcase,
  BookOpen,
  Heart,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Home,
  Star,
  Flag,
  Target,
  CheckSquare,
  Settings,
  User,
  Calendar,
  Clock,
  Tag,
  FolderOpen,
  FileText,
  ChevronsLeft,
} from "@lucide/vue";
import type { Category } from "@/types";
import { usePlanManager } from "@/composables/usePlanManager";
import Button from "@/components/ui/button/Button.vue";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Dialog from "@/components/ui/dialog/Dialog.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

const {
  // composables
  categories,
  selectedCategoryId,
  addCategory,
  updateCategory,
  deleteCategory,
  selectCategory,
} = usePlanManager();

const deletingCategoryId = ref<string | null>(null);
const showDeleteDialog = ref(false);

const showAddDialog = ref(false);
const showEditDialog = ref(false);
const editingCategory = ref<Category | null>(null);
const addForm = ref({ name: "", description: "", icon: "briefcase" });
const editForm = ref({ name: "", description: "", icon: "briefcase" });

const iconMap: Record<string, typeof Briefcase> = {
  briefcase: Briefcase,
  "book-open": BookOpen,
  heart: Heart,
  "dollar-sign": DollarSign,
  home: Home,
  star: Star,
  flag: Flag,
  target: Target,
  "check-square": CheckSquare,
  settings: Settings,
  user: User,
  calendar: Calendar,
  clock: Clock,
  tag: Tag,
  "folder-open": FolderOpen,
  "file-text": FileText,
};

const availableIcons = Object.keys(iconMap);

function openAddDialog() {
  addForm.value = { name: "", description: "", icon: "briefcase" };
  showAddDialog.value = true;
}

function handleAddConfirm() {
  if (addForm.value.name.trim()) {
    addCategory(addForm.value.name.trim(), addForm.value.description.trim(), addForm.value.icon);
    showAddDialog.value = false;
  }
}

function openEditDialog(category: Category) {
  editingCategory.value = category;
  editForm.value = {
    name: category.name,
    description: category.description || "",
    icon: category.icon || "briefcase",
  };
  showEditDialog.value = true;
}

function handleEditConfirm() {
  if (editingCategory.value && editForm.value.name.trim()) {
    updateCategory(editingCategory.value.id, {
      name: editForm.value.name.trim(),
      description: editForm.value.description.trim(),
      icon: editForm.value.icon,
    });
  }
  showEditDialog.value = false;
  editingCategory.value = null;
}

function handleDeleteClick(id: string) {
  deletingCategoryId.value = id;
  showDeleteDialog.value = true;
}

function handleDeleteConfirm() {
  if (deletingCategoryId.value) {
    deleteCategory(deletingCategoryId.value);
  }
  showDeleteDialog.value = false;
  deletingCategoryId.value = null;
}

const emit = defineEmits<{ (e: "toggle"): void }>();

function handleSelect(id: string) {
  selectCategory(id);
}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-border flex items-center justify-between">
      <h2 class="text-lg font-semibold text-foreground">计划列表</h2>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button class="hover:cursor-pointer" variant="ghost" size="icon-sm" @click="emit('toggle')">
              <ChevronsLeft :size="18" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>收起计划列表 (Ctrl+\)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    <div class="p-2 border-b border-border">
      <Button variant="outline" size="sm" class="w-full" @click="openAddDialog">
        <Plus :size="16" class="mr-1" />
        添加计划
      </Button>
    </div>
    <div class="flex-1 overflow-y-auto p-2">
      <draggable :list="categories" item-key="id" handle=".drag-handle" animation="150">
        <template #item="{ element: category }">
          <div
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group',
              selectedCategoryId === category.id
                ? 'bg-blue-600 text-white dark:bg-blue-500'
                : 'hover:bg-accent hover:text-accent-foreground',
            ]"
            @click="handleSelect(category.id)"
          >
            <span
              :class="[
                'drag-handle cursor-grab active:cursor-grabbing transition-colors',
                selectedCategoryId === category.id ? 'text-white' : 'text-muted-foreground hover:text-foreground',
              ]"
            >
              <GripVertical :size="14" />
            </span>
            <component :is="iconMap[category.icon || 'briefcase']" :size="18" class="shrink-0" />
            <div class="flex-1 min-w-0">
              <span class="text-sm font-medium truncate block">{{ category.name }}</span>
              <span
                v-if="category.description"
                :class="[
                  'text-xs truncate block',
                  selectedCategoryId === category.id ? 'text-white/70' : 'text-muted-foreground',
                ]"
              >
                {{ category.description }}
              </span>
            </div>
            <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="icon-sm" variant="ghost" @click.stop="openEditDialog(category)">
                <Pencil :size="14" />
              </Button>
              <Button size="icon-sm" variant="ghost" @click.stop="handleDeleteClick(category.id)">
                <Trash2 :size="14" />
              </Button>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <Dialog v-model:open="showAddDialog" title="添加计划" description="创建新计划">
      <template #default>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">标题</label>
            <input
              v-model="addForm.name"
              type="text"
              placeholder="计划名称"
              class="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">描述</label>
            <textarea
              v-model="addForm.description"
              rows="3"
              placeholder="计划描述（可选）"
              class="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">图标</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="iconName in availableIcons"
                :key="iconName"
                :class="[
                  'p-1.5 rounded border transition-colors',
                  addForm.icon === iconName
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-border hover:bg-accent',
                ]"
                @click="addForm.icon = iconName"
              >
                <component :is="iconMap[iconName]" :size="16" />
              </button>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <Button variant="outline" @click="showAddDialog = false">取消</Button>
            <Button @click="handleAddConfirm">创建</Button>
          </div>
        </div>
      </template>
    </Dialog>

    <Dialog v-model:open="showEditDialog" title="编辑计划" description="修改计划信息">
      <template #default>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">标题</label>
            <input
              v-model="editForm.name"
              type="text"
              class="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">描述</label>
            <textarea
              v-model="editForm.description"
              rows="3"
              class="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">图标</label>
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="iconName in availableIcons"
                :key="iconName"
                :class="[
                  'p-1.5 rounded border transition-colors',
                  editForm.icon === iconName
                    ? 'border-primary bg-primary/10 ring-1 ring-primary'
                    : 'border-border hover:bg-accent',
                ]"
                @click="editForm.icon = iconName"
              >
                <component :is="iconMap[iconName]" :size="16" />
              </button>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <Button variant="outline" @click="showEditDialog = false">取消</Button>
            <Button @click="handleEditConfirm">保存</Button>
          </div>
        </div>
      </template>
    </Dialog>

    <ConfirmDialog
      v-model:open="showDeleteDialog"
      title="删除计划"
      description="确定要删除这个计划吗？相关的任务也会被删除。"
      confirm-text="删除"
      @confirm="handleDeleteConfirm"
    >
      <Button size="icon-sm" variant="ghost" style="display: none" />
    </ConfirmDialog>
  </div>
</template>
