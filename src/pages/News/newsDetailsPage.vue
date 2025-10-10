<template>
  <div class="bg-gray-50 min-h-screen">
    <section class="max-w-4xl mx-auto px-6 py-16">
      <button @click="$router.push('/news')" class="text-gray-700 hover:text-gray-900 mb-6">
        ← Zurück zur News-Übersicht
      </button>

      <div v-if="newsItem" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <img :src="newsItem.image" :alt="newsItem.title" class="w-full h-64 object-cover">
        <div class="p-6">
          <h1 class="text-3xl font-serif font-bold text-gray-800 mb-3">{{ newsItem.title }}</h1>
          <p class="text-gray-400 text-sm mb-4">{{ formatDate(newsItem.date) }}</p>
          <p class="text-gray-600 leading-relaxed">{{ newsItem.description }}</p>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-20">
        News-Eintrag nicht gefunden
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const newsData = [
  {
    id: 1,
    title: 'Neue Ausstellung angekündigt',
    description: 'Thorsten Kasel präsentiert seine neue Ausstellung „Zwischen Linien“ im Kunstverein Leipzig.',
    date: '2025-10-09',
    image: 'https://place-hold.it/800x400',
  },
  {
    id: 2,
    title: 'Künstlergespräch',
    description: 'Einblicke in den kreativen Prozess von Thorsten Kasel bei einem öffentlichen Künstlergespräch.',
    date: '2025-09-25',
    image: 'https://place-hold.it/800x400',
  },
];

const newsItem = ref(null);

onMounted(() => {
  const id = parseInt(route.params.newsId);
  newsItem.value = newsData.find(item => item.id === id) || null;
});

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>
