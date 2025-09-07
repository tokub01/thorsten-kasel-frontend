<template>
  <div class="p-8 mt-12 text-sm border-t">
    <div class="mx-auto flex flex-col md:flex-row md:justify-between gap-8">
      <!-- Rechtliches -->
      <div class="space-y-2">
        <h2 class="font-semibold mb-2 ">Rechtliches</h2>
        <router-link to="/dataprivacy" class="hover:underline block">Datenschutz</router-link>
        <router-link to="/imprint" class="hover:underline block">Impressum</router-link>
      </div>
    </div>

    <div class="mt-8 text-center text-gray-400">
      &copy; {{ new Date().getFullYear() }} Thorsten Kasel. Alle Rechte vorbehalten.
    </div>
  </div>
</template>
<script setup lang="ts">
</script>