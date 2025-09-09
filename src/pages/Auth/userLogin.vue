<template>
  <div class="">
    <div class="flex justify-center items-center">
      <form @submit.prevent="handleLogin" class="border m-4 p-4 flex flex-col justify-center">
        <div class="grid grid-cols-1">
          <div class="text-2xl mb-3">Login</div>
        </div>
        <div class="grid grid-cols-1 mb-3">
          <label for="email_input">E-Mail:</label>
          <input id="email_input" class="border p-1" v-model="email" name="email" type="text" />
          <div v-if="authStore.errors.email" class="text-red-600 text-sm mt-1">
            {{ authStore.errors.email[0] }}
          </div>
        </div>

        <div class="grid grid-cols-1 mb-3">
          <label for="password_input">Passwort:</label>
          <input id="password_input" class="border p-1" v-model="password" name="password" type="password" />
          <div v-if="authStore.errors.password" class="text-red-600 text-sm mt-1">
            {{ authStore.errors.password[0] }}
          </div>
        </div>
        <div v-if="authStore.errors.length > 1" class="text-red-600 text-sm mb-3 mt-1">
          {{ authStore.errors }}
        </div>
        <button type="submit" class="border hover:bg-gray-600">Anmelden</button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useAuthStore } from '@/stores/Auth'

const email = ref("");
const password = ref("");
const authStore = useAuthStore()

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value)
  } catch (error) {
    console.log(error)
  }
}
</script>
