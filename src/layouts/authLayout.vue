<template>
  <div class="bg-gray-300 flex flex-col min-h-screen">
    <PageHeader/>

    <main class="flex-grow md:ml-60">
      <router-view/>
    </main>

    <!--<PageFooter/>-->
  </div>
</template>

<script setup>
import PageHeader from '@/components/admin/pageHeader.vue'
//import PageFooter from '@/components/admin/pageFooter.vue'
</script>

<style scoped>
/* Min-height + flex ensures footer is always at bottom */
</style>
