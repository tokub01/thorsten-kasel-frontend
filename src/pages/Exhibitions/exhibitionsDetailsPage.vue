<template>
  <div class="bg-gray-50 min-h-screen py-12 px-6">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
      <button @click="$router.back()" class="text-gray-700 hover:text-gray-900 mb-6 flex items-center gap-2">
        ← Zurück
      </button>

      <h1 class="text-4xl font-serif font-bold text-gray-800 mb-4">{{ exhibition.title }}</h1>
      <p class="text-gray-500 mb-2">{{ exhibition.date }} | {{ exhibition.location }}</p>
      <span class="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm mb-6">
        {{ exhibition.type }}
      </span>

      <p class="text-gray-600 leading-relaxed mb-6">{{ exhibition.description }}</p>

      <div v-if="exhibition.images && exhibition.images.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <img
          v-for="(img, index) in exhibition.images"
          :key="index"
          :src="img"
          class="rounded-lg shadow hover:shadow-lg transition-all object-cover w-full h-64"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const exhibitionId = route.params.exhibitionsId;

const exhibition = ref({
  id: 0,
  title: '',
  date: '',
  location: '',
  type: '',
  description: '',
  images: [],
});

// Beispielhafte Daten - in der Praxis per API laden
const allExhibitions = [
  {
    id: 1,
    title: "Zwischen Linien",
    date: "2023",
    location: "Galerie Blau, Berlin",
    type: "Einzelausstellung",
    description:
      "Eine visuelle Exploration von Raum und Form, die die Grenzen der Malerei erweitert.",
    images: ["https://place-hold.it/600x400", "https://place-hold.it/600x401"],
  },
  {
    id: 2,
    title: "Verlorene Räume",
    date: "2021",
    location: "Kunsthaus Dresden",
    type: "Einzelausstellung",
    description:
      "Installationen und Zeichnungen, die die Vergänglichkeit urbaner Räume reflektieren.",
    images: ["https://place-hold.it/600x402"],
  },
  {
    id: 3,
    title: "Positionen der Gegenwart",
    date: "2024",
    location: "Kunstverein Leipzig",
    type: "Gruppenausstellung",
    description:
      "Eine Auswahl zeitgenössischer Arbeiten, die aktuelle Themen der Gesellschaft behandeln.",
    images: [],
  },
];

onMounted(() => {
  const data = allExhibitions.find(e => e.id === parseInt(exhibitionId));
  if (data) exhibition.value = data;
});
</script>
