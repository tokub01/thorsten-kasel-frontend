<template>
  <div class="flex min-h-dvh">
    <PageHeader>
      <div class="md:ml-60">
        <router-view/>
      </div>
    </PageHeader>

    <main class="flex-grow">
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