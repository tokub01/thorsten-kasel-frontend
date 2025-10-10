<template>
  <header class="bg-gray-100 shadow-sm">
    <div class=" mx-auto flex justify-between items-center px-6 py-6 md:py-8">
      <!-- Künstlername -->
      <div
        @click="router.push('/')"
        class="text-4xl sm:text-5xl font-serif font-bold cursor-pointer text-gray-900 hover:text-gray-700 transition"
      >
        Thorsten Kasel
      </div>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex space-x-10 text-lg font-medium text-gray-800 tracking-wide">
        <router-link to="/works" class="hover:text-gray-600 transition">Arbeiten</router-link>
        <router-link to="/news" class="hover:text-gray-600 transition">News</router-link>
        <router-link to="/exhibitions" class="hover:text-gray-600 transition">Ausstellungen</router-link>
        <router-link to="/biography" class="hover:text-gray-600 transition">Vita</router-link>
        <router-link to="/contact" class="hover:text-gray-600 transition">Kontakt</router-link>
      </nav>

      <!-- Mobile Burger -->
      <button
        @click="toggleMenu"
        class="md:hidden text-3xl p-2 text-gray-800 focus:outline-none hover:text-gray-600 transition"
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
          <router-link @click="closeMenu" to="/works" class="hover:text-gray-900 transition">Arbeiten</router-link>
          <router-link @click="closeMenu" to="/news" class="hover:text-gray-900 transition">News</router-link>
          <router-link @click="closeMenu" to="/exhibitions" class="hover:text-gray-900 transition">Ausstellungen</router-link>
          <router-link @click="closeMenu" to="/biography" class="hover:text-gray-900 transition">Vita</router-link>
          <router-link @click="closeMenu" to="/contact" class="hover:text-gray-900 transition">Kontakt</router-link>
        </nav>

        <!-- Footer Bereich -->
        <div class="border-t border-gray-200 px-8 py-6 text-sm text-gray-500">
          © {{ new Date().getFullYear() }} Thorsten Kasel
        </div>
      </aside>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
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
