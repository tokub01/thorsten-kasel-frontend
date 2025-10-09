<template>
  <div class="flex items-center justify-center bg-gray-100 px-4">
    <div class="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
      <!-- Titel -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="flex flex-col">
          <label for="email" class="text-gray-700 font-semibold mb-1">E-Mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@domain.com"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
          <p v-if="authStore.errors.email" class="text-red-600 text-sm mt-1">
            {{ authStore.errors.email[0] }}
          </p>
        </div>

        <div class="flex flex-col">
          <label for="password" class="text-gray-700 font-semibold mb-1">Passwort</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            required
          />
          <p v-if="authStore.errors.password" class="text-red-600 text-sm mt-1">
            {{ authStore.errors.password[0] }}
          </p>
        </div>

        <button
          type="submit"
          class="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
        >
          Anmelden
        </button>

        <p v-if="authStore.errors.length > 1" class="text-red-600 text-sm mt-2 text-center">
          {{ authStore.errors }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/Auth";

const authStore = useAuthStore();
const email = ref("");
const password = ref("");

const handleLogin = async () => {
  try {
    await authStore.login(email.value, password.value);
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped>
/* Optional: leichtes Animation beim Fokus */
input:focus {
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.5); /* Tailwind gray-400 */
}
</style>
