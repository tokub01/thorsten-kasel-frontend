
<template>
  <footer class="bg-gray-300 border-t shadow-sm mt-auto w-full">
    <div class="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-gray-700">
      <!-- Rechtliches / Links -->
      <div class="flex flex-col md:flex-row gap-4 items-center text-sm">
        <router-link to="/dataprivacy" class="hover:underline transition">Datenschutz</router-link>
        <router-link to="/imprint" class="hover:underline transition">Impressum</router-link>
      </div>

      <!-- Copyright -->
      <div class="text-sm mt-3 md:mt-0">
        &copy; {{ new Date().getFullYear() }} Thorsten Kasel. Alle Rechte vorbehalten.
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
/* Footer hat fixen Padding, Höhe bleibt immer gleich */
</style>
