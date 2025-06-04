<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

const otps = ref<string[]>([]);
const isLoading = ref(false);
const { validateOtp } = useAuth();

async function onSubmit(event: Event) {
  event.preventDefault()
  const username = useState<string>('username');
  const accesstoken = useState<string>('otpvalidatetoken');
  const otpValue = otps.value.join('');
  isLoading.value = true;
  const response: any = await validateOtp(username.value, otpValue, accesstoken.value);
  if (response.token) {
      useState('updatePasswordToken', () => response.token);
      console.log('Update Password Token=' + response.token);
      await navigateTo('/change-password');
  }
  isLoading.value = false;
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="grid gap-4">
      <div class="place-items-center">
        <PinInput
          id="pin-input"
          v-model="otps"
          placeholder="○">
          <PinInputGroup>
            <template v-for="(id, index) in 6" :key="id">
              <PinInputInput
                class="rounded-md border"
                :index="index"/>
              <template v-if="index !== 5">
                <PinInputSeparator />
              </template>
            </template>
          </PinInputGroup>
        </PinInput>
      </div>
      <Button :disabled="isLoading">
        <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
        Submit
      </Button>
    </div>
  </form>

</template>
