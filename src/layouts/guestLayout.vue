<template>
  <div class="flex flex-col min-h-screen bg-gray-300 text-gray-800">
    <!-- Header -->
    <PageHeader />

    <!-- Hauptinhalt -->
    <main class="flex-grow">
      <router-view />
    </main>

    <!-- Footer -->
    <PageFooter />
  </div>
</template>

<script setup>
import PageHeader from '@/components/guest/pageHeader.vue'
import PageFooter from '@/components/guest/pageFooter.vue'
</script>

<style scoped>
/* Stellt sicher, dass der gesamte Viewport verwendet wird */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
