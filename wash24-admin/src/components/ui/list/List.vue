<script setup lang="ts">
    defineProps<{
    data: any;
    }>();
    defineEmits(['click']);
</script>

<template>
  <div 
    class="cursor-pointer"
    @click="$emit('click')"
  >
    <slot :item="data"></slot>
  </div>
</template>