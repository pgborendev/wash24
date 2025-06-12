<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardContent from '@/components/ui/card/CardContent.vue';

import { ref } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import { Loader2, UserRound } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';


const router = useRouter();
const username = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function onSubmit(event: Event) {
  event.preventDefault()
  if (!username.value) {
    errorMessage.value = 'Username is required'
    return
  }
  isLoading.value = true
  errorMessage.value = ''
  try {
    await useAuth().forgotPassword({ username: username.value })
    await router.push({ name: 'OtpVerify' })
    
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
                Forgot Password
              </CardTitle>
              <CardDescription>
                Enter your email or phonenumber to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-2">
                <Input id="identity" placeholder="Enter email or phone number" type="text" v-model="username"
                  auto-capitalize="none" auto-complete="email" auto-correct="off" :disabled="isLoading" />
              </div>
            </CardContent>
            <CardFooter class="flex justify-between px-6 pb-6">
              <Button type="submit" variant="outline" class="w-full" :disabled="isLoading">
                <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
                Submit
              </Button>
            </CardFooter>
          </Card>
          <div class="text-center text-balance text-muted-foreground [&_a]:hover:text-primary">
            <router-link :to="{ name: 'LOGIN' }">Go Back</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

