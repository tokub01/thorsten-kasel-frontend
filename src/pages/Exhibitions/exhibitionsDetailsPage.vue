<template>
  <div class="bg-gray-300 mt-3">
    <section class="max-w-4xl mx-auto px-6 py-16">
      <button @click="$router.push('/exhibitions')" class="text-gray-700 hover:text-gray-900 mb-6">
        ← Zurück zur Ausstellungsübersicht
      </button>

      <div v-if="exhibition && exhibition.isActive" class="bg-white rounded-lg shadow-lg overflow-hidden">
        <img :src="exhibition.image" :alt="exhibition.title" class="w-full h-64 object-cover">
        <div class="p-6">
          <h1 class="text-3xl font-serif font-bold text-gray-800 mb-3">{{ exhibition.title }}</h1>
          <p class="text-gray-400 text-sm mb-4">{{ formatDate(exhibition.date) }}</p>
          <p class="text-gray-600 leading-relaxed">{{ exhibition.description }}</p>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-20">
        Ausstellung nicht gefunden oder nicht aktiv
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useExhibitionsStore } from '@/stores/Exhibitions';

const route = useRoute();
const store = useExhibitionsStore();

const exhibition = ref(null);

onMounted(async () => {
  // Stelle sicher, dass die Liste geladen ist
  if (!store.exhibitions.length) {
    await store.fetchExhibitions();
  }

  const id = parseInt(route.params.exhibitionsId);
  exhibition.value = store.exhibitions.find(item => item.id === id) || null;
});

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
</script>
