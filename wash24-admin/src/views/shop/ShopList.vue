<script setup lang="ts">
import AppViewHeader from '@/components/layout/AppViewHeader.vue';
import ShopListItem from './ShopListItem.vue';
import { Icon } from '@iconify/vue';
import Button from '@/components/ui/button/Button.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import ShopForm from './ShopForm.vue';
import apiEndpoints from '@/config/config';
import ShopService from '@/services/ShopService';
import type ShopModel from '@/models/ShopModel';

const shopService = new ShopService(apiEndpoints);
const router = useRouter();

// State
const shops = ref<ShopModel[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const isFormOpen = ref(false);


// Fetch shops
const fetchShops = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const response = await shopService.list();
    shops.value = response.docs; // Assuming response has data property
  } catch (err) {
    error.value = 'Failed to load shops';
    console.error('Error fetching shops:', err);
  } finally {
    isLoading.value = false;
  }
};

// Form handlers
const openShopSheet = () => {
  isFormOpen.value = true;
};

const closeShopSheet = () => {
  isFormOpen.value = false;
};

const handleSuccess = (response: any) => {
  console.log('Shop created:', response);
  closeShopSheet();
  fetchShops(); // Refresh the shop list after successful creation
};

const handleError = (error: any) => {
  console.error('Error creating shop:', error);
  // You might want to show an error notification here
};

const onAddNewButtonClick = (event: MouseEvent) => {
  openShopSheet();
};

// Lifecycle hook
onMounted(() => {
  fetchShops();
});
</script>

<template>
  <AppViewHeader title="Shops" />
  
  <div class="flex w-full flex-col sm:flex-row gap-4 p-4 pt-2 pb-0">
    <div class="flex-1"></div>
    <Sheet v-model:open="isFormOpen">
      <SheetTrigger as-child>
        <Button 
          variant="ghost" 
          size="sm" 
          class="text-xs"
          @click="onAddNewButtonClick"
        >
          <Icon icon="lucide:plus" class="h-5 w-5" />Add New
        </Button>
      </SheetTrigger>
      <SheetContent class="flex flex-col sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Add New Shop</SheetTitle>
          <SheetDescription>
            Create a new shop account here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div class="m-4">
          <keep-alive>
            <ShopForm @success="handleSuccess" @error="handleError" />
          </keep-alive>
        </div>
      </SheetContent>
    </Sheet>
  </div>

  <!-- Loading and error states -->
  <div v-if="isLoading" class="p-4 text-center">
    <Icon icon="eos-icons:loading" class="h-8 w-8 mx-auto" />
    <p>Loading shops...</p>
  </div>

  <div v-else-if="error" class="p-4 text-center text-destructive">
    <Icon icon="material-symbols:error-outline" class="h-8 w-8 mx-auto" />
    <p>{{ error }}</p>
    <Button variant="outline" size="sm" @click="fetchShops" class="mt-2">
      Retry
    </Button>
  </div>

  <!-- Shop list -->
  <div 
    v-else
    class="
      grid 
      grid-cols-1 
      md:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
      gap-4 
      p-4
      text-foreground"
  >
    <ShopListItem 
      v-for="shop in shops" 
      :key="shop.bakongId" 
      :data="shop" 
    />
    <!-- <div v-if="shops.values.length === 0" class="col-span-full text-center py-8 text-muted-foreground">
      <Icon icon="mdi:store-off-outline" class="h-12 w-12 mx-auto mb-2" />
      <p>No shops found</p>
    </div> -->
  </div>
</template>