<script setup lang="ts">
  import Button from '@/components/ui/button/Button.vue';
  import Dialog from '@/components/ui/dialog/Dialog.vue';
  import DialogContent from '@/components/ui/dialog/DialogContent.vue';
  import DialogDescription from '@/components/ui/dialog/DialogDescription.vue';
  import DialogFooter from '@/components/ui/dialog/DialogFooter.vue';
  import DialogHeader from '@/components/ui/dialog/DialogHeader.vue';
  import DialogTitle from '@/components/ui/dialog/DialogTitle.vue';
  import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue';
  import DropdownMenu from '@/components/ui/dropdown-menu/DropdownMenu.vue';
  import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue';
  import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue';
  import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue';
  import { Icon } from '@iconify/vue';
  withDefaults(defineProps<{
    shop: any
  }>(), {
    shop: {}
  })

</script>

<template>
  <div class="flex flex-col h-full">
    <!-- View Header -->
    <div class="flex w-full flex-col sm:flex-row gap-4 p-4 pt-2 pb-0 items-center">
      <h1 class="text-lg font-semibold">Devices</h1>
      <div class="flex-1"></div>
    </div>

    <!-- Device Grid -->
    <div v-if="shop.devices && shop.devices.length > 0" 
         class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 overflow-y-auto">
      <div v-for="device in shop.devices" :key="device._id" 
           class="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
        <div class="flex items-start gap-3">
          <div class="p-2 rounded-lg bg-primary/10 text-primary">
            <Icon icon="lucide:smartphone" class="h-5 w-5" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-medium truncate">{{ device.name || 'Unnamed Device' }}</h3>
            <p class="text-sm text-muted-foreground truncate">ID: {{ device._id.toString().slice(-6) }}</p>
            <p class="text-xs text-muted-foreground mt-1">Last active: 2 hours ago</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" class="h-8 w-8 text-muted-foreground">
                <Icon icon="lucide:more-horizontal" class="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-40">
              <DropdownMenuItem>
                <Icon icon="lucide:settings" class="h-4 w-4 mr-2" />
                Configure
              </DropdownMenuItem>
              <DropdownMenuItem class="text-red-500">
                <Icon icon="lucide:trash-2" class="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center h-full p-8 text-center">
      <div class="p-4 rounded-full bg-muted mb-4">
        <Icon icon="lucide:washing-machine" class="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-medium mb-2">No Devices Connected</h3>
      <p class="text-muted-foreground mb-6 max-w-md">
        Connect devices to enable payments and manage your shop operations
      </p>

      <Dialog>
      <DialogTrigger>
        <Button>
          <Icon icon="lucide:plus" class="h-4 w-4 mr-2" />
          Add First Device
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          Save changes
        </DialogFooter>
      </DialogContent>
    </Dialog>

  
    </div>
  </div>
</template>

