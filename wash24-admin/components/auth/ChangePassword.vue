<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'


const { updateUserPassword } = useAuth();
const isLoading = ref(false);
const password = ref('');
const confirmPassword = ref('');

async function onSubmit(event: Event) {
  event.preventDefault();
  const username = useState<string>('username');
  const accesstoken = useState<string>('updatePasswordToken');
  isLoading.value = true;
  await updateUserPassword(username.value, password.value, accesstoken.value);
  await navigateTo('/login');
  isLoading.value = false;
}
</script>

<template>
  <form @submit="onSubmit">
    <div class="grid gap-4 mb-4">
      <div class="grid gap-2">
         <PasswordInput 
            id="password" 
            placeholder="Enter your new password"
            v-model="password" 
            :disabled="isLoading"
          />
          <PasswordInput 
            id="confirmPassword" 
            v-model="confirmPassword" 
            placeholder="Confirm your new password"
            :disabled="isLoading"
          />
      </div>
      <Button :disabled="isLoading"type="submit">
        <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
        Change
      </Button>
    </div>
  </form>
</template>

<style scoped>

</style>
