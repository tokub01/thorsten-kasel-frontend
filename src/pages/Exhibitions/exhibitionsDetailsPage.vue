<template>
  <div class="bg-gray-50 min-h-screen">
    <section class="max-w-4xl mx-auto px-6 py-16">
      <button @click="$router.push('/exhibitions')" class="text-gray-700 hover:text-gray-900 mb-6">
        ← Zurück zur Ausstellungsübersicht
      </button>

      <div v-if="exhibition" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <img :src="exhibition.image" :alt="exhibition.title" class="w-full h-64 object-cover">
        <div class="p-6">
          <h1 class="text-3xl font-serif font-bold text-gray-800 mb-3">{{ exhibition.title }}</h1>
          <p class="text-gray-400 text-sm mb-4">{{ formatDate(exhibition.date) }}</p>
          <p class="text-gray-600 leading-relaxed">{{ exhibition.description }}</p>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-20">
        Ausstellung nicht gefunden
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Beispielhafte Ausstellungen
const exhibitionsData = [
  {
    id: 1,
    title: 'Zwischen Linien',
    description: 'Einzelausstellung im Kunstverein Leipzig mit Werken aus den Jahren 2024–2025.',
    date: '2025-10-15',
    image: 'https://place-hold.it/800x400',
  },
  {
    id: 2,
    title: 'Fokus Farbe',
    description: 'Gruppenausstellung mit Fokus auf experimentelle Farbkonzepte.',
    date: '2025-09-10',
    image: 'https://place-hold.it/800x400',
  },
];

const exhibition = ref(null);

onMounted(() => {
  const id = parseInt(route.params.exhibitionsId);
  exhibition.value = exhibitionsData.find(item => item.id === id) || null;
});

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>
