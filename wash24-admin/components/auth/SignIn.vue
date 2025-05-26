<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import PasswordInput from '~/components/PasswordInput.vue'

const username = ref('admin')
const password = ref('adminadmin')
const isLoading = ref(false)
const errorMessage = ref('')

const { login } = useAuth()

async function onSubmit(event: Event) {
  event.preventDefault()
  
  if (!username.value || !password.value) {
    errorMessage.value = 'Username and password are required'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    await login({
      username: username.value,
      password: password.value,
      system: 'WASH24_WEB_POS',
      deviceType: 'DESKTOP',
      deviceId: 'device123' // You might want to generate this dynamically
    })
    await navigateTo('/')
  } catch (error: any) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form class="grid gap-6" @submit="onSubmit">
    <div v-if="errorMessage" class="text-sm font-medium text-destructive">
      {{ errorMessage }}
    </div>
    
    <div class="grid gap-2">
      <Label for="username">Username</Label>
      <Input
        id="username"
        v-model="username"
        type="text"
        placeholder="Enter username"
        :disabled="isLoading"
        auto-complete="username"
      />
    </div>
    
    <div class="grid gap-2">
      <Label for="password">Password</Label>
      <PasswordInput 
        id="password" 
        v-model="password" 
        :disabled="isLoading"
      />
    </div>
    
    <Button type="submit" class="w-full" :disabled="isLoading">
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      Login
    </Button>
  </form>
</template>