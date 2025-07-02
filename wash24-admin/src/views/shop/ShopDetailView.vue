<script setup lang="ts">
import AppViewHeader from '@/components/layout/AppViewHeader.vue';
import { Icon } from '@iconify/vue';
import { Button } from '@/components/ui/button';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import apiEndpoints from '@/config/config';
import ShopService from '@/services/ShopService';
import type ShopModel from '@/models/ShopModel';

import ShopInfoView from './ShopInfoView.vue';
import ShopDeviceView from './ShopDeviceView.vue';
import DetailViewMenu from '../base/DetailViewMenu.vue';



interface BreadcrumbItem {
  name: string
  href: string
  icon?: string,
  menus?: any[]
}

const route = useRoute();
const router = useRouter();
const shopService = new ShopService(apiEndpoints);
const shop = ref<ShopModel | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);
const breadcrumbItems: any[] = [];

onMounted(async () => {
  try {
    const response = await shopService.list();
    const shopData = await shopService.get(route.params.id as string);
    shop.value = shopData;
    var menus: any[] = [];

    for (const doc of response.docs) {
      menus.push({
        name: doc.name,
        href: `/${doc.id}`,
        active: doc.id == shopData.id,
        icon: 'lucide:store'
      });
    }
    breadcrumbItems.push({
      name: shopData.name,
      href: `/${shopData.id}`,
      icon: 'lucide:store',
      menus: menus
    });

  } catch (err) {
    error.value = 'Failed to load shop details';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});



</script>

<template>
  <AppViewHeader :title="`Shop: ${shop?.name || 'Loading...'}`" :breadcrumbItems="[...breadcrumbItems]">
    <template #actions>
    </template>
  </AppViewHeader>

  <!-- h-[calc(100vh-3.5rem)]  -->
  <div class="flex flex-col p-1 h-[calc(100vh-3.5rem)]"> 
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex justify-center items-center">
      <Icon icon="eos-icons:loading" class="h-12 w-12 text-primary" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex-1 flex flex-col justify-center items-center py-8 text-destructive">
      <Icon icon="material-symbols:error-outline" class="h-12 w-12 mx-auto" />
      <p class="mt-4">{{ error }}</p>
      <Button variant="outline" class="mt-4" @click="router.go(0)">
        Retry
      </Button>
    </div>

    <!-- Shop Details -->
    <div v-else-if="shop" class="flex flex-1 bg-background overflow-y-auto relative">
      <ShopInfoView :shop="shop"/>
      <ShopDeviceView :shop="shop" class="flex-1 overflow-y-auto" />
    </div>
  </div>
</template>