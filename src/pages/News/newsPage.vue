<template>
  <div class="bg-gray-50 min-h-screen">
    <section class="mx-auto px-6 py-16">
      <h1 class="text-4xl font-serif font-bold text-gray-800 mb-6">News & Updates</h1>
      <p class="text-gray-600 mb-12">Hier findest du aktuelle Neuigkeiten und Ankündigungen von Thorsten Kasel.</p>

      <div v-if="news.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="item in news" :key="item.id" class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer" @click="goToDetail(item.id)">
          <img :src="item.image" :alt="item.title" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-lg font-semibold text-gray-800 mb-1">{{ item.title }}</h2>
            <p class="text-gray-500 text-sm mb-2 line-clamp-3">{{ item.description }}</p>
            <p class="text-gray-400 text-xs">{{ formatDate(item.date) }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-20">
        Keine News vorhanden
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Beispielhafte Daten
const news = ref([
  {
    id: 1,
    title: 'Neue Ausstellung angekündigt',
    description: 'Thorsten Kasel präsentiert seine neue Ausstellung „Zwischen Linien“ im Kunstverein Leipzig.',
    date: '2025-10-09',
    image: 'https://place-hold.it/600x400',
  },
  {
    id: 2,
    title: 'Künstlergespräch',
    description: 'Einblicke in den kreativen Prozess von Thorsten Kasel bei einem öffentlichen Künstlergespräch.',
    date: '2025-09-25',
    image: 'https://place-hold.it/600x400',
  },
]);

function goToDetail(id) {
  router.push(`/news/${id}`);
}

// Datum nach deutschem Format
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
