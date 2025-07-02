<template>
  <Dialog>
    <DialogTrigger asChild>
      <slot />
    </DialogTrigger>
    
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Connect New Device</DialogTitle>
        <DialogDescription>
          Register a new device to {{ shopName }}
        </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4 py-4">
          <!-- Device Name -->
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">
              Device Name
            </Label>
            <Input
              id="name"
              v-model="form.name"
              class="col-span-3"
              placeholder="e.g. POS-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" @click="close">
            Cancel
          </Button>
          <Button type="submit" :disabled="isLoading">
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup>
import Button from '@/components/ui/button/Button.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import Select from '@/components/ui/select/Select.vue'
import SelectContent from '@/components/ui/select/SelectContent.vue'
import SelectItem from '@/components/ui/select/SelectItem.vue'
import SelectTrigger from '@/components/ui/select/SelectTrigger.vue'
import SelectValue from '@/components/ui/select/SelectValue.vue'
import { ref } from 'vue'

const props = defineProps({
  shopName: {
    type: String,
    required: true
  },
  shopId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['device-added'])

const form = ref({
  name: '',
  type: 'pos'
})

const isLoading = ref(false)

const handleSubmit = async () => {
  try {
    isLoading.value = true
    // Call your API here
    const newDevice = await api.addDeviceToShop({
      shopId: props.shopId,
      ...form.value
    })
    
    emit('device-added', newDevice)
  } catch (error) {
    console.error('Error adding device:', error)
  } finally {
    isLoading.value = false
  }
}
</script>