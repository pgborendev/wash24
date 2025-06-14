<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardContent from '@/components/ui/card/CardContent.vue';
import { ref } from 'vue';
import PasswordInput from '@/components/PasswordInput.vue';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import { Loader2 } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

async function onSubmit(event: Event) {
  event.preventDefault()

  if (!password.value) {
    errorMessage.value = 'Username and password are required'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  try {
    
    await router.push({ name: 'Dashboard' })
  } catch (error: any) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

</script>
<template>

  <div class="flex flex-col items-center justify-center gap-6 bg-muted p-6 min-h-svh md:p-10">
    <div class="max-w-sm w-full flex flex-col gap-6">
      <div class="flex items-center self-center gap-2 font-medium">
        <img src="/logo.png" alt="Logo" class="h-10" />
      </div>
      <div class="flex flex-col gap-6">
        <form class="grid gap-6" @submit="onSubmit">
          <Card>
            <CardHeader class="text-center">
              <CardTitle class="text-xl">
                Change Password
              </CardTitle>
              <CardDescription>
                Enter your new password and confirm password.
              </CardDescription>
            </CardHeader>
            <CardContent>

              <div v-if="errorMessage" class="text-sm font-medium text-destructive">
                {{ errorMessage }}
              </div>

              <div class="grid gap-2">
                <Label for="password">Password</Label>
                <PasswordInput id="password" v-model="password" :disabled="isLoading" />
              </div>
              <div class="grid gap-2">
                <Label for="confirmPassword">Cofirm Password</Label>
                <PasswordInput id="confirm-password" v-model="confirmPassword" :disabled="isLoading" />
              </div>

            </CardContent>
            <CardFooter class="flex justify-between px-6 pb-6">
              <Button type="submit" variant="outline" class="w-full" :disabled="isLoading">
                <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                Change
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  </div>
</template>