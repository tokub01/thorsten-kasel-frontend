<template>
  <div class="bg-gray-400 flex flex-col h-screen">
    <header>
      <PageHeader />
    </header>

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