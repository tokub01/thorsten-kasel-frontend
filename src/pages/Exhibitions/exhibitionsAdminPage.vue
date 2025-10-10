<template>
  <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-3xl font-serif font-bold text-gray-800">Ausstellungen</h1>
      <button
        class="px-5 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
        @click="createExhibition"
      >
        Neue Ausstellung
      </button>
    </div>

    <!-- Grid der Ausstellungen -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="exhibition in exhibitions"
        :key="exhibition.id"
        class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
        @click="viewExhibition(exhibition.id)"
      >
        <img
          :src="exhibition.image"
          :alt="exhibition.title"
          class="w-full h-48 object-cover"
        />
        <div class="p-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-1">{{ exhibition.title }}</h2>
          <p class="text-gray-600 text-sm mb-2">{{ formatDate(exhibition.date) }}</p>
          <p class="text-gray-500 text-sm line-clamp-2">{{ exhibition.description }}</p>
        </div>
      </div>
    </div>

    <div v-if="exhibitions.length === 0" class="text-center text-gray-500 py-20">
      Keine Ausstellungen vorhanden
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Beispiel-Daten
const exhibitions = ref([
  {
    id: 1,
    title: "Farbwelten 2025",
    date: "2025-11-05",
    description: "Eine immersive Ausstellung über die Wirkung von Farben in urbanen Räumen.",
    image: "https://place-hold.it/600x400",
  },
  {
    id: 2,
    title: "Raum & Licht",
    date: "2025-09-18",
    description: "Installationen und Malerei zur Interaktion von Raum, Licht und Wahrnehmung.",
    image: "https://place-hold.it/600x400",
  },
  {
    id: 3,
    title: "Strukturen der Erinnerung",
    date: "2025-07-12",
    description: "Künstlerische Auseinandersetzung mit Erinnerungsspuren in der modernen Stadt.",
    image: "https://place-hold.it/600x400",
  },
]);

function formatDate(date) {
  return new Date(date).toLocaleDateString("de-DE");
}

function viewExhibition(id) {
  router.push(`/admin/exhibitions/${id}`);
}

function createExhibition() {
  router.push('/admin/exhibitions/create');
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
