<template>
  <div class="flex flex-col min-h-screen">
      <PageHeader />

    <main class="flex-grow">
      <router-view />
    </main>

    <footer>
      <PageFooter />
    </footer>
  </div>
</template>

<script setup>
import PageHeader from '@/components/pageHeader.vue'
import PageFooter from '@/components/pageFooter.vue'
</script>