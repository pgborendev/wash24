<script setup lang="ts">
  import OtpVerification from '~/components/auth/OtpVerification.vue';
  definePageMeta({
    layout: 'blank',
  })
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-6 bg-muted p-6 min-h-svh md:p-10">
    <div class="max-w-sm w-full flex flex-col gap-6">
      <div class="flex items-center self-center gap-2 font-medium">
        <img src="/logo.png" alt="Logo" class="h-10" />
      </div>
      <Card>
        <CardHeader class="text-center">
          <CardTitle class="text-xl">
            OTP Verification
          </CardTitle>
          <CardDescription>
            Input the OTP sent to your email or phone number.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid mx-auto max-w-sm gap-6">
              <OtpVerification />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<style scoped>

</style>
