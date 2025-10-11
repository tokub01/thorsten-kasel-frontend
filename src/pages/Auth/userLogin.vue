<template>
  <div class="flex items-center justify-center bg-gray-100 px-4 py-16">
    <div class="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
      <!-- Titel -->
      <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center font-serif">
        Admin Login
      </h1>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- E-Mail -->
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

        <!-- Passwort -->
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

        <!-- Login Button -->
        <button
          type="submit"
          class="hover:cursor-pointer w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition font-semibold shadow-md"
        >
          Anmelden
        </button>

        <!-- Fehlerausgabe -->
        <p v-if="authStore.errors.length > 1" class="text-red-600 text-sm mt-3 text-center">
          {{ authStore.errors }}
        </p>
      </form>

      <!-- Link zur Hauptseite -->
      <div class="mt-6 text-center">
        <router-link
          to="/"
          class="hover:cursor-pointer text-sm text-gray-600 hover:text-gray-900 transition font-medium"
        >
          ← Zurück zur Website
        </router-link>
      </div>
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
/* Sanfte Fokus-Hervorhebung */
input:focus {
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.4);
}
</style>
