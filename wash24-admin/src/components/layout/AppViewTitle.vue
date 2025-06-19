<script lang="ts" setup>
withDefaults(defineProps<{
  text?: string
  }>(), {
    text: ''
  })
</script>

<template>
  <h1 class="text-md font-semibold tracking-tight">
    <slot>
      {{ text }}
    </slot>
  </h1>
</template>