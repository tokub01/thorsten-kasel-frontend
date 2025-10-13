<template>
  <div class="bg-gray-300 min-h-screen">
    <section class="mx-auto px-6 py-16 max-w-7xl">
      <h1 class="text-4xl font-serif font-bold text-gray-800 mb-6">Ausstellungen</h1>
      <p class="text-gray-600 mb-12">Eine Übersicht über die bisherigen und kommenden Ausstellungen von Thorsten Kasel.</p>

      <!-- Karten -->
      <div v-if="activeExhibitions.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="exh in activeExhibitions"
          :key="exh.id"
          class="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
          @click="goToDetail(exh.id)"
        >
          <img :src="exh.image" :alt="exh.title" class="w-full h-48 object-cover">
          <div class="p-4">
            <h2 class="text-lg font-semibold text-gray-800 mb-1">{{ exh.title }}</h2>
            <p class="text-gray-500 text-sm mb-2 line-clamp-3">{{ exh.description }}</p>
            <p class="text-gray-400 text-xs">{{ formatDate(exh.date) }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-20">
        Keine Ausstellungen vorhanden
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useExhibitionsStore } from '@/stores/Exhibitions';

const router = useRouter();
const store = useExhibitionsStore();

// Lade die Daten beim Mounten
onMounted(() => {
  store.fetchExhibitions();
});

// Nur aktive Ausstellungen
const activeExhibitions = computed(() =>
  store.exhibitions.filter(exh => exh.isActive)
);

function goToDetail(id) {
  router.push(`/exhibitions/${id}`);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
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
