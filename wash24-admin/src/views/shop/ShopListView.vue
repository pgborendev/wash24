<script setup lang="ts">
import AppViewHeader from '@/components/layout/AppViewHeader.vue';
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
} from '@/components/ui/sheet'
import ShopForm from './ShopForm.vue';
import apiEndpoints from '@/config/config';
import ShopService from '@/services/ShopService';
import type ShopModel from '@/models/ShopModel';
import { useResponsive } from '@/composables/useResponsive';
import List from '@/components/ui/list/List.vue';
import ShopListItemTemplate from './ShopListItemTemplate.vue';

  const docs = ref<ShopModel[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const isFormOpen = ref(false);
  const router = useRouter();
  const { isMobile } = useResponsive();
  const shopService = new ShopService(apiEndpoints);

  const shopData = ref<ShopModel>();

  const fetchDocs = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const response = await shopService.list();
      docs.value = response.docs; // Assuming response has data property
    } catch (err) {
      error.value = 'Failed to load shops';
      console.error('Error fetching shops:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const openSheet = () => {
    isFormOpen.value = true;
  };

  const closeSheet = () => {
    isFormOpen.value = false;
  };

  const handleSuccess = (response: any) => {
    console.log('Shop created:', response);
    closeSheet();
    fetchDocs();
  };

  const handleError = (error: any) => {
    console.error('Error creating shop:', error);
  };

  const onAddNewButtonClick = (event: MouseEvent) => {
    if (isMobile.value) {
      router.push({ name: 'SHOP_ADD_NEW' });
    }
    else {
      openSheet();
    }
  };

  const handleViewItemClick = (doc: ShopModel) => {
    router.push({ 
      name: 'SHOP_DETAIL_VIEW', // Make sure this route exists
      params: { id: doc.id }
    });
  };

  const handleEditItemClick = (doc: ShopModel) => {
    shopData.value = doc;
    openSheet();
  };

  const handleDeleteItemClick = (doc: ShopModel) => {
    // Implement your delete logic here
    console.log('Delete clicked for:', doc);
  };

  const breadcrumb: any[] = [];
  
  onMounted(() => {
    fetchDocs();
  });

</script>

<template>

  <AppViewHeader title="Shops" :breadcrumbItems="breadcrumb"/>

  <div class="flex w-full flex-col sm:flex-row gap-4 p-4 pt-2 pb-0">
    <div class="flex-1"></div>
      <Button variant="ghost" size="sm" class="text-xs" @click="onAddNewButtonClick">
        <Icon icon="lucide:plus" class="h-5 w-5" />Add New
      </Button>
  </div>

  <!-- Loading and error states -->
  <div v-if="isLoading" class="p-4 text-center">
    <Icon icon="eos-icons:loading" class="h-8 w-8 mx-auto" />
    <p>Loading shops...</p>
  </div>

  <div v-else-if="error" class="p-4 text-center text-destructive">
    <Icon icon="material-symbols:error-outline" class="h-8 w-8 mx-auto" />
    <p>{{ error }}</p>
    <Button variant="outline" size="sm" @click="fetchDocs" class="mt-2">
      Retry
    </Button>
  </div>

  <!-- Shop list -->
  <div v-else class="
      grid 
      grid-cols-1 
      md:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-5
      gap-4 
      p-4
      text-foreground">
      <List v-for="doc in docs" :key="doc.id" :data="doc">
        <ShopListItemTemplate :data="doc" @view="handleViewItemClick" @edit="handleEditItemClick" @delete="handleDeleteItemClick" />
      </List>
    <div v-if="docs.length === 0" class="col-span-full text-center py-8 text-muted-foreground">
      <Icon icon="mdi:store-off-outline" class="h-12 w-12 mx-auto mb-2" />
      <p>No shops found</p>
    </div>
  </div>

  <Sheet v-model:open="isFormOpen">
    <SheetContent class="flex flex-col sm:max-w-[500px]">
      <SheetHeader>
        <SheetTitle>Add New Shop</SheetTitle>
        <SheetDescription>
          Create a new shop account here. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <div class="m-4">
        <keep-alive>
          <ShopForm v-model="shopData" @success="handleSuccess" @error="handleError" />
        </keep-alive>
      </div>
    </SheetContent>
  </Sheet>
  
</template>