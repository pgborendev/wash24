<script setup lang="ts">
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-vue-next'
import ShopService from '@/services/ShopService'
import apiEndpoints from '@/config/config'
import { ref } from 'vue'
import DragDropImageInput from '@/components/ui/dragdrop/DragDropImageInput.vue'
import AppViewHeader from '@/components/layout/AppViewHeader.vue'
import ShopModel from '@/models/ShopModel'

const shopService = new ShopService(apiEndpoints);
// Define validation schema
const formSchema = z.object({
  name: z.string().min(2),
  bakongId: z.string().optional(),
  phone: z.string().min(6),
  email: z.string().email(),
  address: z.string().min(10),
  logo: z.string().optional() // Now expecting base64 string
    .refine(val => !val || val.startsWith('data:image/'), {
      message: 'Must be a valid image data URL'
    })
});

const form = useForm({
  validationSchema: toTypedSchema(formSchema),
})

const isLoading = ref(false)
const errorMessage = ref('')

const onSubmit = form.handleSubmit(async (values:any) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
     const shopData = new ShopModel({...values,logo: values.logo});
    await shopService.create(shopData)
    form.resetForm()
  } catch (error:any) {
    errorMessage.value = error.message || 'Failed to create shop'
  } finally {
    isLoading.value = false
  }
})

</script>
<template>
  <AppViewHeader title="Add New Shop" />
  <form @submit.prevent="onSubmit" class="space-y-4">
      <div class="mx-auto max-w-lg p-4 h-full grid gap-4">
         <FormField v-slot="{ componentField }" name="logo" class="grid gap-2">
          <FormItem>
            <FormLabel>Logo</FormLabel>
            <FormControl>
              <DragDropImageInput
              id="logo" 
              v-bind="componentField"
              width="120px" 
              height="120px" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

         <FormField v-slot="{ componentField }" name="name" class="grid gap-2">
          <FormItem>
            <FormLabel>Shop Name</FormLabel>
            <FormControl>
              <Input id="name" type="text" v-bind="componentField" placeholder="Name"/>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="bakongId" class="grid gap-2">
          <FormItem>
            <FormLabel>Bakong Account ID</FormLabel>
            <FormControl>
              <Input type="text" placeholder="Optional" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

          <!-- Phone Field -->
        <FormField v-slot="{ componentField }" name="phone" class="grid gap-2">
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input type="tel" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Email Field -->
        <FormField v-slot="{ componentField }" name="email" class="grid gap-2">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="shop@example.com" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <!-- Address Field -->
        <FormField v-slot="{ componentField }" name="address" class="grid gap-2">
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea placeholder="Full shop address" v-bind="componentField" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

            <!-- Error Message -->
        <div v-if="errorMessage" class="text-sm font-medium text-destructive">
          {{ errorMessage }}
        </div>

        <div class="grid gap-2 pt-5">
          <Button variant="secondary" type="submit" class="font-medium" >
            <!-- :disabled="isLoading" -->
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Save Changes
          </Button>
        </div>
      </div>
</form>  
</template>
