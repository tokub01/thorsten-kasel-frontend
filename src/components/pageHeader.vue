<template>
  <header v-if="route.meta.requiresAuth === false" class="text-gray-800">
    <!-- Name -->
    <div class="text-6xl flex justify-center items-center border-b py-5 font-bold">
      Thorsten Kasel
    </div>

    <!-- Desktop-Menü (ab md) -->
    <nav v-if="route.name !== 'Login'" class="hidden md:flex justify-center space-x-12 mt-12 text-4xl font-semibold">
      <router-link to="/works" class="hover:underline">Arbeiten</router-link>
      <router-link to="/biography" class="hover:underline">Biographie</router-link>
    </nav>

    <!-- Mobil: Burger-Button -->
    <div v-if="route.name !== 'Login'"  class="flex justify-end px-6 mt-4 md:hidden">
      <button
          @click="toggleMenu"
          class="text-6xl focus:outline-none"
          aria-label="Menü öffnen"
      >
        <span v-if="!isOpen">☰</span>
        <span v-else>✖</span>
      </button>
    </div>

    <!-- Overlay für Mobil -->
    <div
        v-if="isOpen && route.name !== 'login'"
        class="fixed inset-0 md:hidden"
        @click="closeMenu"
        aria-hidden="true"
    ></div>

    <!-- Slide-in Menü für Mobil -->
    <transition name="slide">
      <nav
          v-if="isOpen && route.name !== 'login'"
          class="fixed top-0 right-0 w-2/3 max-w-xs h-full bg-gray-100 z-40 flex flex-col items-center justify-center space-y-12 text-3xl md:hidden"
          @click.stop
      >
        <button
            @click="closeMenu"
            class="absolute top-6 right-6 text-4xl focus:outline-none"
            aria-label="Menü schließen"
        >
          X
        </button>
        <router-link to="/works" @click="closeMenu" class="hover:underline">Arbeiten</router-link>
        <router-link to="/biography" @click="closeMenu" class="hover:underline">Biographie</router-link>
      </nav>
    </transition>
  </header>
  <header v-if="route.meta.requiresAuth === true" class="bg-gray-400 text-gray-800 min-h-screen">
    <!-- Titel -->
    <div class="text-6xl flex justify-center items-center border-b py-5 font-bold">
      Thorsten Kasel
    </div>

    <!-- 🔒 Desktop: Sidebar wenn eingeloggt -->

    <div
        v-if="route.meta.requiresAuth === true"
        class="hidden md:flex [height:calc(100vh-6.5rem)] border-r flex-col justify-between items-center w-60 absolute left-0  space-y-6 text-xl"
    >
      <div class="text-center w-full">
        <div class="w-full border-b w-full">
          <router-link to="/categories" class="hover:underline ">Kategorien</router-link>
        </div>
        <div class="w-full border-b">
          <router-link to="/products" class="hover:underline">Bilder</router-link>
        </div>
        <div class="w-full border-b">
          <router-link to="/adminBiography" class="hover:underline">Biografie</router-link>
        </div>
        <div class="w-full border-b">
          <router-link to="/contactRequests" class="hover:underline">Kontaktanfragen</router-link>
        </div>
      </div>
      <div class="xl:flex xl:items-end">
        <button @click="handleLogout" class="hover:underline">Logout</button>
      </div>
    </div>

    <!-- 🔓 Desktop: Kein Menü wenn nicht eingeloggt -->
    <!-- 📱 Mobil: Burger-Menü -->
    <div class="flex justify-end px-6 mt-4 md:hidden">
      <button
          v-if="route.meta.requiresAuth === true"
          @click="toggleMenu"
          class="text-6xl focus:outline-none"
          aria-label="Menü öffnen"
      >
        <span v-if="!isOpen">☰</span>
        <span v-else>X</span>
      </button>
    </div>
    <slot/>

    <!-- 📱 Mobil: Overlay -->
    <div
        v-if="isOpen"
        class="fixed inset-0 bg-opacity-30 z-30 md:hidden"
        @click="closeMenu"
    ></div>

    <!-- 📱 Mobil: Slide-in Menü -->
    <transition name="slide">
      <nav
          v-if="isOpen"
          class="fixed top-0 right-0 w-2/3 max-w-xs h-full bg-gray-100 z-40 flex flex-col items-center justify-center space-y-10 text-3xl md:hidden"
          @click.stop
      >
        <button
            @click="closeMenu"
            class="absolute top-6 right-6 text-4xl focus:outline-none"
            aria-label="Menü schließen"
        >
          X
        </button>
        <router-link to="/products" class="hover:underline">Bilder</router-link>
        <router-link to="/adminBiography" @click="closeMenu" class="hover:underline">Biografie</router-link>
        <router-link to="/categories" class="hover:underline ">Kategorien</router-link>
        <router-link to="/contactRequests" class="hover:underline">Kontaktanfragen</router-link>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/Auth'
const authStore = useAuthStore()

const isOpen = ref(false)

const route = useRoute();
async function handleLogout() {
  try {
    authStore.logout()
  } catch (error) {
    console.log(error)
  }
}
function toggleMenu() {
  isOpen.value = !isOpen.value
}
function closeMenu() {
  isOpen.value = false
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-enter-to {
  transform: translateX(0);
}
.slide-leave-from {
  transform: translateX(0);
}
.slide-leave-to {
  transform: translateX(100%);
}
</style>
