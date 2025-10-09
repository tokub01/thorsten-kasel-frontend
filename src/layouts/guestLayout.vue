<template>
  <div class="flex flex-col min-h-screen bg-gray-100 text-gray-800">
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
/* Basis-Setup, damit min-h-screen funktioniert */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
