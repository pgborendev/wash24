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
  import { computed, ref, watch } from 'vue'
  import DragDropImageInput from '@/components/ui/dragdrop/DragDropImageInput.vue'
  import ShopModel from '@/models/ShopModel'

  const props = defineProps({
    modelValue: {
      type: Object as () => ShopModel,
      default: () => ({}),
    }
  })

   const isImagePath = (value: any): boolean => {
    return typeof value === 'string' && 
           !value.startsWith('data:image/') && 
           (value.startsWith('/') || value.startsWith('http'));
  };

  const logoPreviewUrl = computed(() => {
    const logo = props.modelValue.logo
    return (logo && isImagePath(logo)) ? logo : undefined
  })

   const formSchema = z.object({
    name: z.string().min(2),
    bakongId: z.string().optional(),
    phone: z.string().min(6),
    email: z.string().email(),
    address: z.string().min(10),
    logo: z.union([z.string(), z.instanceof(File)]).optional()
      .refine(val => !val || 
        typeof val === 'string' || 
        val instanceof File, {
        message: 'Must be a valid image path, data URL, or file'
      })
  });

  const emit = defineEmits<{
    (e: 'success', response: any): void
    (e: 'error', error: any): void
    (e: 'update:modelValue', value: any): void
  }>()

  const shopService = new ShopService(apiEndpoints);

   const form = useForm({
    validationSchema: toTypedSchema(formSchema),
    initialValues: {
      name: props.modelValue.name || '',
      bakongId: props.modelValue.bakongId || '',
      phone: props.modelValue.phone || '',
      email: props.modelValue.email || '',
      address: props.modelValue.address || '',
      logo: props.modelValue.logo || ''
    }
  })
  
  // Watch for changes in modelValue and update form values
  watch(() => props.modelValue, (newValue) => {
    form.setValues({
      name: newValue.name || '',
      bakongId: newValue.bakongId || '',
      phone: newValue.phone || '',
      email: newValue.email || '',
      address: newValue.address || '',
      logo: newValue.logo || ''
    })
  }, { deep: true })

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  const isLoading = ref(false)
  const errorMessage = ref('')
  const onSubmit = form.handleSubmit(async (values: any) => {
    isLoading.value = true
    errorMessage.value = ''
    
    try {
      let logoValue = values.logo;
      
      // If logo is a File object, convert to base64
      if (values.logo instanceof File) {
        logoValue = await fileToBase64(values.logo);
      }
      // If logo is a server path, keep it as is
      else if (isImagePath(values.logo)) {
        logoValue = values.logo;
      }

      const shopData = new ShopModel({
        ...values,
        id: props.modelValue.id,
        logo: logoValue
      });
    
      const response = await shopService.save(shopData)

      form.resetForm()
      emit('success', response);
      emit('update:modelValue', shopData);
    } catch (error: any) {
      errorMessage.value = error.message || 'Failed to create shop'
      emit('error', error);
    } finally {
      isLoading.value = false
    }
  })

</script>


<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
      <div class="mx-auto max-w-lg p-4 h-full grid gap-4">
         <FormField v-slot="{ componentField, value }" name="logo" class="grid gap-2">
          <FormItem>
            <FormLabel>Logo</FormLabel>
            <FormControl>
                <DragDropImageInput
                id="logo"
                placeholder="Drag and drop logo here"
                v-bind="componentField"
                :previewUrl="logoPreviewUrl as string | undefined"
                :modelValue="value"
                width="120px" 
                height="120px"/>
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
          <Button variant="outline" size="sm" type="submit" class="font-medium" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            Save Changes
          </Button>
        </div>
      </div>
  </form>  
</template>