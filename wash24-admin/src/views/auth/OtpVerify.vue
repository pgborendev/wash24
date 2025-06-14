<script setup lang="ts">
import Card from '@/components/ui/card/Card.vue';
import CardHeader from '@/components/ui/card/CardHeader.vue';
import CardTitle from '@/components/ui/card/CardTitle.vue';
import CardDescription from '@/components/ui/card/CardDescription.vue';
import CardContent from '@/components/ui/card/CardContent.vue';

import { ref, onMounted, onUnmounted } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import { Loader2, Minus, UserRound } from 'lucide-vue-next';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import PinInput from '@/components/ui/pin-input/PinInput.vue';
import PinInputGroup from '@/components/ui/pin-input/PinInputGroup.vue';
import PinInputSeparator from '@/components/ui/pin-input/PinInputSeparator.vue';
import { PinInputSlot } from '@/components/ui/pin-input';

const router = useRouter();

const otps = ref<string[]>([])
const errorMessage = ref('')
const isLoading = ref(false)
const resendDisabled = ref(true)
const countdown = ref(60) // 60 seconds = 1 minute
let countdownInterval: number | null = null

// Start countdown timer
const startCountdown = () => {
  resendDisabled.value = true
  countdown.value = 60
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      resendDisabled.value = false
      if (countdownInterval) clearInterval(countdownInterval)
    }
  }, 1000)
}

// Resend OTP function
const resendOtp = async () => {
  try {
    isLoading.value = true
    await useAuth().resendOtp({}) // Assuming you have a resendOtp method in your auth composable
    startCountdown()
    errorMessage.value = '' // Clear any previous errors
  } catch (error: any) {
    errorMessage.value = error.message || 'Failed to resend OTP. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Start countdown when component mounts
onMounted(() => {
  startCountdown()
})

// Clear interval when component unmounts
onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

async function onSubmit(event: Event) {
  event.preventDefault()
  isLoading.value = true
  errorMessage.value = ''
  try {
    await useAuth().verifyOtp({ otp: otps.value.join('') });
    await router.push({ name: 'ChangePassword' })
  } catch (error: any) {
    errorMessage.value = error.message || 'OTP Validation failed. Please try again.'
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
                OTP Verification
              </CardTitle>
              <CardDescription>
                Enter OTP sent to your email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid gap-4">
                <PinInput
                  id="pin-input"
                  v-model="otps"
                  placeholder="○"
                  class="justify-center">
                  <PinInputGroup>
                    <template v-for="(id, index) in 6" :key="id">
                      <PinInputSlot class="rounded-md border" :index="index"/>
                      <template v-if="index !== 5">
                        <PinInputSeparator>
                          <Minus class="w-2"/>
                        </PinInputSeparator>
                      </template>
                    </template>
                  </PinInputGroup>
                </PinInput>

                <div class="text-center text-sm text-muted-foreground">
                  <span v-if="resendDisabled">
                    Resend OTP in {{ countdown }} seconds
                  </span>
                  <button
                    v-else
                    type="button"
                    @click="resendOtp"
                    class="text-primary hover:underline focus:outline-none"
                    :disabled="isLoading"
                  >
                    Resend OTP
                  </button>
                </div>

                <p v-if="errorMessage" class="text-sm text-center font-medium text-destructive">
                  {{ errorMessage }}
                </p>
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