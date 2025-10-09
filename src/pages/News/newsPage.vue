<template>
  <div class="bg-gray-50 min-h-screen py-12 px-6">
    <!-- Titel / Intro -->
    <section class="max-w-4xl mx-auto text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-serif font-bold text-gray-800 mb-4">
        Aktuelles & News
      </h1>
      <p class="text-gray-600 text-lg">
        Bleibe auf dem Laufenden über Ausstellungen, Veröffentlichungen und Projekte.
      </p>
    </section>

    <!-- News List -->
    <section class="max-w-5xl mx-auto grid gap-8">
      <router-link
        v-for="newsItem in news"
        :key="newsItem.id"
        :to="{ name: 'newsDetailsPage', params: { newsId: newsItem.id } }"
        class="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ newsItem.title }}</h2>
            <p class="text-gray-500 mb-2">{{ newsItem.date }}</p>
          </div>
        </div>
        <p class="text-gray-600 mt-4 line-clamp-3">{{ newsItem.excerpt }}</p>
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const news = ref([
  {
    id: 1,
    title: "Neue Einzelausstellung in Berlin",
    date: "2025-09-15",
    excerpt: "Thorsten Kasel präsentiert seine neuesten Werke in der Galerie Blau...",
  },
  {
    id: 2,
    title: "Kunstmesse Leipzig 2025",
    date: "2025-08-01",
    excerpt: "Teilnahme an der Kunstmesse Leipzig mit Fokus auf zeitgenössische Malerei...",
  },
  {
    id: 3,
    title: "Auszeichnung für innovative Arbeiten",
    date: "2025-07-20",
    excerpt: "Verleihung des Kunstförderpreises für experimentelle Malerei und Installation...",
  },
]);
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
