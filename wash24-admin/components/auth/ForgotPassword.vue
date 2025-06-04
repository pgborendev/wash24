<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
const identity = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const { sendForgetPasswordRequest } = useAuth()

async function onSubmit(event: Event) {
   try {
    event.preventDefault()
    isLoading.value = true
    if (!identity.value) {
      errorMessage.value = 'Please enter email or phone number'
      return
    }
    const response: any = await sendForgetPasswordRequest(identity.value)
    if (response.token) {
      useState('username', () => identity.value);
      useState('otpvalidatetoken', () => response.token);
      console.log('OT Validate Token=' + response.token);
      await navigateTo('/otp-validation');
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <form @submit="onSubmit">
    <div class="grid gap-4">
      <div class="grid gap-2">
        <Input
          id="identity"
          placeholder="Enter email or phone number"
          type="text"
          v-model="identity" 
          auto-capitalize="none"
          auto-complete="email"
          auto-correct="off"
          :disabled="isLoading"
        />
      </div>
      <Button :disabled="isLoading">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Submit
      </Button>
    </div>
  </form>
</template>

<style scoped>

</style>
