<script setup lang="ts">
import AppViewHeader from '@/components/layout/AppViewHeader.vue';
import ShopListItem from './ShopListItem.vue';
import { Icon } from '@iconify/vue';
import Button from '@/components/ui/button/Button.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const shops = [
  {
    name: "Shop Name1",
    address: "123 Street, Phnom Penh",
    phone: "012 345 678",
    email: "shop@example.com",
    bakongId: "1",
    logo: "logo.png"
  },
  {
    name: "Shop Name2",
    address: "123 Street, Phnom Penh",
    phone: "012 345 678",
    email: "shop@example.com",
    bakongId: "2",
    logo: "shop-logo-placeholder.jpg"
  },
  {
    name: "Shop Name2",
    address: "123 Street, Phnom Penh",
    phone: "012 345 678",
    email: "shop@example.com",
    bakongId: "3",
    logo: "shop-logo-placeholder.jpg"
  },
  {
    name: "Shop Name2",
    address: "123 Street, Phnom Penh",
    phone: "012 345 678",
    email: "shop@example.com",
    bakongId: "4",
    logo: "shop-logo-placeholder.jpg"
  },
];

const onAddNewButtonClick = (event: MouseEvent) => {
  router.push({ name: 'SHOP_ADD_NEW' })
};

</script>

<template>
  <AppViewHeader title="Shops" />

  <div class="flex w-full flex-col sm:flex-row gap-4 p-4 pt-2 pb-0">
    <div class="flex-1"></div>
    <Button variant="ghost" size="sm" class="text-xs" @click="onAddNewButtonClick">
      <Icon icon="lucide:plus" class="h-5 w-5" />Add New
    </Button>
  </div>

  <div class="
    grid 
    grid-cols-1 
    md:grid-cols-2      /* 2 columns for smaller tablets */
    lg:grid-cols-3      /* 3 columns for iPad Pro (1024px+) */
    xl:grid-cols-4      /* 4 columns for desktop (1280px+) */
    gap-4 
    p-4
    text-foreground">
    <ShopListItem v-for="shop in shops" :key="shop.bakongId" :data="shop" />
  </div>

</template>
