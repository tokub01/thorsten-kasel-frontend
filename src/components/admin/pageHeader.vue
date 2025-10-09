<template>
  <!-- Desktop Sidebar -->
  <aside
    class="hidden md:flex flex-col justify-between fixed left-0 top-0 bottom-0 w-60 bg-gray-100 border-r shadow-sm"
  >
    <!-- Logo / Titel -->
    <div class="px-6 py-8 border-b text-center">
      <h1
        class="text-2xl font-serif font-bold cursor-pointer hover:text-gray-700 transition"
        @click="router.push('/')"
      >
        Thorsten Kasel
      </h1>
    </div>

    <!-- Navigation Links -->
    <nav class="flex flex-col flex-1 px-6 py-6 space-y-2 overflow-y-auto text-lg">
      <router-link
        v-for="link in adminLinks"
        :key="link.to"
        :to="link.to"
        class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200"
        :class="isActive(link.to)
                  ? 'bg-gray-300 text-gray-900 font-semibold'
                  : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'"
      >
        {{ link.label }}
      </router-link>
    </nav>

    <!-- Logout -->
    <div class="border-t p-6">
      <button
        @click="handleLogout"
        class="w-full px-4 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  </aside>

  <!-- Mobile Header -->
  <header class="md:hidden w-full bg-gray-100 flex justify-between items-center px-4 py-4 border-b shadow-sm">
    <h1 class="text-xl font-serif font-bold text-gray-800">Thorsten Kasel</h1>
    <button
      @click="toggleMenu"
      class="text-3xl text-gray-700 focus:outline-none"
      aria-label="Menü öffnen"
    >
      <span v-if="!isOpen">☰</span>
      <span v-else>✖</span>
    </button>
  </header>

  <!-- Mobile Overlay -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-30 z-30"
      @click="closeMenu"
    ></div>
  </transition>

  <!-- Mobile Sidebar -->
  <transition name="slide">
    <aside
      v-if="isOpen"
      class="fixed inset-y-0 left-0 w-64 bg-gray-100 z-40 p-6 flex flex-col justify-between shadow-lg"
    >
      <div>
        <nav class="flex flex-col space-y-6 text-lg mt-10">
          <router-link
            v-for="link in adminLinks"
            :key="link.to + '-mobile'"
            :to="link.to"
            @click="closeMenu"
            class="text-gray-700 hover:text-gray-900"
          >
            {{ link.label }}
          </router-link>
        </nav>
      </div>

      <button
        @click="handleLogout"
        class="text-gray-700 hover:text-red-600 mt-6"
      >
        Logout
      </button>
    </aside>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isOpen = ref(false);

const adminLinks = [
  { to: '/categories', label: 'Kategorien' },
  { to: '/products', label: 'Bilder' },
  { to: '/adminBiography', label: 'Vita' },
  { to: '/contactRequests', label: 'Kontaktanfragen' },
];

function toggleMenu() { isOpen.value = !isOpen.value; }
function closeMenu() { isOpen.value = false; }
function isActive(path) { return route.path.startsWith(path); }

async function handleLogout() {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (err) {
    console.error(err);
  }
}
</script>

<style scoped>
/* Slide-in Animation */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from { transform: translateX(-100%); }
.slide-enter-to { transform: translateX(0); }
.slide-leave-from { transform: translateX(0); }
.slide-leave-to { transform: translateX(-100%); }
</style>
