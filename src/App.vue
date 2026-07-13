<template>
  <div class="w-full h-full flex items-center justify-center">
    <Button @click="handleClick"> click </Button>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";

function handleClick() {
  console.log("clicked");
}
</script>
