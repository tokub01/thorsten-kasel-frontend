<template>
  <footer class="bg-gray-100 border-t">
    <div class="mx-auto px-6 py-10 flex flex-col md:flex-row justify-between gap-8">
      <!-- Rechtliches -->
      <div class="space-y-2">
        <h2 class="font-semibold text-gray-800">Rechtliches</h2>
        <router-link to="/dataprivacy" class="block text-gray-600 hover:text-gray-900 transition">Datenschutz</router-link>
        <router-link to="/imprint" class="block text-gray-600 hover:text-gray-900 transition">Impressum</router-link>
      </div>

      <!-- Kontakt / Info -->
      <div class="space-y-2">
        <h2 class="font-semibold text-gray-800">Kontakt</h2>
        <p class="text-gray-600">info@thorstenkasel.de</p>
        <p class="text-gray-600">+49 123 456789</p>
      </div>

      <!-- Social Media -->
      <div class="space-y-2">
        <h2 class="font-semibold text-gray-800">Folge mir</h2>
        <div class="flex gap-4 mt-1">
          <a href="https://www.instagram.com/thorstenkasel" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-900 transition">
            Instagram
          </a>
          <a href="https://www.facebook.com/thorstenkasel" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-900 transition">
            Facebook
          </a>
          <a href="https://www.linkedin.com/in/thorstenkasel" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-gray-900 transition">
            LinkedIn
          </a>
        </div>
      </div>
    </div>

    <div class="mt-8 text-center text-gray-500 text-sm pb-6">
      &copy; {{ new Date().getFullYear() }} Thorsten Kasel. Alle Rechte vorbehalten.
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
footer a {
  transition: color 0.3s ease;
}
</style>
