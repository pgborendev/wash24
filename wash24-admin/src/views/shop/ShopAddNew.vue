<script setup lang="ts">
  import AppViewHeader from '@/components/layout/AppViewHeader.vue'
  import type ShopModel from '@/models/ShopModel';
  import ShopForm from '@/views/shop/ShopForm.vue'

  defineProps<{
    data: ShopModel;
  }>();

</script>
<template>
  <AppViewHeader title="Add New Shop" />
  <ShopForm :data="data"/>
</template>
