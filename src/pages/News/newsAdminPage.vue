<template>
  <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
    <!-- Seitenüberschrift & Neuer Eintrag -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <h1 class="text-3xl font-bold text-gray-800">News Übersicht</h1>
      <button
        @click="createNews"
        class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Neue News erstellen
      </button>
    </div>

    <!-- Grid mit News -->
    <div v-if="newsList.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="news in newsList"
        :key="news.id"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
      >
        <img
          :src="news.image"
          :alt="news.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h2 class="font-semibold text-gray-800 text-lg mb-1 line-clamp-2">{{ news.title }}</h2>
          <p class="text-gray-500 text-sm line-clamp-3">{{ news.description }}</p>
          <p class="text-gray-400 text-xs mt-2">{{ formatDate(news.date) }}</p>
        </div>
        <div class="flex justify-end gap-2 p-4 border-t">
          <button
            @click="editNews(news.id)"
            class="px-3 py-1 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Bearbeiten
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-20">
      Keine News vorhanden.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Beispielhafte News-Daten
const newsList = ref([
  {
    id: 1,
    title: "Neue Ausstellung eröffnet",
    description: "Eine spannende Ausstellung über zeitgenössische Kunst in urbanen Räumen.",
    date: "2025-10-01",
    image: "https://place-hold.it/600x400",
  },
  {
    id: 2,
    title: "Künstlergespräch am 15. Oktober",
    description: "Interaktives Gespräch mit mehreren Künstlern über aktuelle Trends.",
    date: "2025-09-20",
    image: "https://place-hold.it/600x400",
  },
  {
    id: 3,
    title: "Workshop Farbexperimente",
    description: "Ein Workshop für junge Künstler, um Farbe und Material zu erforschen.",
    date: "2025-08-15",
    image: "https://place-hold.it/600x400",
  },
]);

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function editNews(id) {
  router.push(`/admin/newsPage/${id}`);
}

function createNews() {
  router.push(`/admin/newsPage/new`);
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
