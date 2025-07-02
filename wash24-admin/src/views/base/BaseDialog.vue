<template>
  <Dialog>
    <DialogTrigger asChild>
      <!-- This slot will be filled by parent component -->
      <slot />
    </DialogTrigger>
    
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>
          Register a new device to {{ shopName }}
        </DialogDescription>
      </DialogHeader>

    </DialogContent>
  </Dialog>
</template>

<script setup>
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})


</script>