<template>
  <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
    <!-- Header / Aktionen -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-3xl font-serif font-bold text-gray-800">{{ exhibition.title }}</h1>
      <div class="flex gap-2 flex-wrap">
        <button
          class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
          @click="editExhibition"
        >
          Bearbeiten
        </button>
        <button
          class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          @click="deleteExhibition"
        >
          Löschen
        </button>
        <button
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          @click="backToList"
        >
          Zurück zur Übersicht
        </button>
      </div>
    </div>

    <!-- Bild -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <img
        :src="exhibition.image"
        :alt="exhibition.title"
        class="w-full max-h-[400px] object-cover"
      />
    </div>

    <!-- Details -->
    <div class="bg-white rounded-xl shadow-md p-6 space-y-4">
      <p><strong>Datum:</strong> {{ formatDate(exhibition.date) }}</p>
      <p><strong>Beschreibung:</strong></p>
      <p class="text-gray-600 leading-relaxed">{{ exhibition.description }}</p>
      <p v-if="exhibition.category"><strong>Kategorie:</strong> {{ exhibition.category }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const exhibition = ref({
  id: null,
  title: "",
  description: "",
  date: "",
  image: "",
  category: "",
});

// Beispielhafte Daten, später mit Backend verbinden
const mockData = [
  {
    id: 1,
    title: "Farbwelten 2025",
    date: "2025-11-05",
    description: "Eine immersive Ausstellung über die Wirkung von Farben in urbanen Räumen.",
    image: "https://place-hold.it/800x400",
    category: "Malerei",
  },
  {
    id: 2,
    title: "Raum & Licht",
    date: "2025-09-18",
    description: "Installationen und Malerei zur Interaktion von Raum, Licht und Wahrnehmung.",
    image: "https://place-hold.it/800x400",
    category: "Installation",
  },
];

function formatDate(date) {
  return new Date(date).toLocaleDateString("de-DE");
}

function backToList() {
  router.push('/admin/exhibitions');
}

function editExhibition() {
  // Beispiel: Weiterleitung zur Edit-Seite
  router.push(`/admin/exhibitions/${exhibition.value.id}/edit`);
}

function deleteExhibition() {
  if (confirm("Möchten Sie diese Ausstellung wirklich löschen?")) {
    alert("Gelöscht! (Beispiel, hier später Backend-Call)");
    backToList();
  }
}

onMounted(() => {
  const id = Number(route.params.exhibitionsId);
  const found = mockData.find(item => item.id === id);
  if (found) exhibition.value = found;
  else router.push('/admin/exhibitions'); // fallback
});
</script>

<style scoped>
/* Optional: leichte Animation beim Laden */
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.02);
}
</style>
