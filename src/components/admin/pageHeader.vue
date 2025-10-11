<template>
  <!-- Desktop Sidebar -->
  <aside
    class="hidden md:flex flex-col justify-between fixed left-0 top-0 bottom-0 w-60 bg-gray-100 border-r shadow-sm"
  >
    <!-- Logo / Titel -->
    <div class="px-6 py-8 border-b text-center">
      <h1
        class="text-2xl font-serif font-bold cursor-pointer hover:text-gray-700 transition"
        @click="router.push('/admin')"
      >
        Admin Dashboard
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
        class="hover:cursor-pointer w-full px-4 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors"
      >
        Logout
      </button>
    </div>
  </aside>

  <!-- Mobile Header -->
  <header class="md:hidden bg-gray-100 shadow-sm">
    <div class="flex justify-between items-center px-6 py-6">
      <h1
        class="text-2xl font-serif font-bold cursor-pointer text-gray-900 hover:text-gray-700 transition"
        @click="router.push('/admin')"
      >
        Admin Dashboard
      </h1>

      <button
        @click="toggleMenu"
        class="text-3xl p-2 text-gray-800 focus:outline-none hover:text-gray-600 transition"
        aria-label="Menü öffnen"
      >
        <span v-if="!isOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>

    <!-- Overlay -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        @click="closeMenu"
      ></div>
    </transition>

    <!-- Sidebar Menü -->
    <transition name="slide">
      <aside
        v-if="isOpen"
        class="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white/95 backdrop-blur-md z-50 shadow-xl flex flex-col justify-between"
        @click.stop
      >
        <!-- Header der Sidebar -->
        <div class="flex justify-between items-center px-6 py-5 border-b border-gray-200">
          <h2 class="text-2xl font-serif font-semibold text-gray-800">Menü</h2>
          <button
            @click="closeMenu"
            class="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-2xl transition"
            aria-label="Menü schließen"
          >
            ×
          </button>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col space-y-6 text-lg font-medium text-gray-700 px-8 mt-8">
          <router-link
            v-for="link in adminLinks"
            :key="link.to + '-mobile'"
            :to="link.to"
            @click="closeMenu"
            class="hover:text-gray-900 transition"
          >
            {{ link.label }}
          </router-link>
        </nav>

        <!-- Logout -->
        <div class="border-t border-gray-200 px-8 py-6 text-sm text-gray-500">
          <button @click="handleLogout" class="text-gray-700 hover:text-red-600 transition">
            Logout
          </button>
        </div>
      </aside>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isOpen = ref(false);

// Admin Links
const adminLinks = [
  { to: '/categories', label: 'Kategorien' },
  { to: '/products', label: 'Bilder' },
  { to: '/adminBiography', label: 'Vita' },
  { to: '/contactRequests', label: 'Kontaktanfragen' },
  { to: '/admin/exhibitions', label: 'Ausstellungen' },
  { to: '/admin/newsPage', label: 'News' },
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
/* Slide Animation */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}
.slide-enter-from {
  transform: translateX(100%);
}
.slide-leave-to {
  transform: translateX(100%);
}

/* Fade Overlay Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
