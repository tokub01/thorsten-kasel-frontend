<template>
  <div class="bg-gray-50 min-h-screen py-12 px-6">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
      <button @click="$router.back()" class="text-gray-700 hover:text-gray-900 mb-6 flex items-center gap-2">
        ← Zurück
      </button>

      <h1 class="text-4xl font-serif font-bold text-gray-800 mb-4">{{ newsItem.title }}</h1>
      <p class="text-gray-500 mb-6">{{ newsItem.date }}</p>

      <div class="prose max-w-full">
        <p>{{ newsItem.content }}</p>
        <img v-if="newsItem.image" :src="newsItem.image" class="mt-6 rounded-lg shadow-md" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const newsId = route.params.newsId;

const newsItem = ref({
  id: 0,
  title: '',
  date: '',
  content: '',
  image: '',
});

// Beispielhafte Daten - in der Praxis per API laden
const allNews = [
  {
    id: 1,
    title: "Neue Einzelausstellung in Berlin",
    date: "2025-09-15",
    content:
      "Thorsten Kasel präsentiert seine neuesten Werke in der Galerie Blau. Die Ausstellung zeigt eine Reihe großformatiger Malereien, die sich mit urbaner Landschaft und menschlicher Wahrnehmung auseinandersetzen.",
    image: "https://place-hold.it/800x400",
  },
  {
    id: 2,
    title: "Kunstmesse Leipzig 2025",
    date: "2025-08-01",
    content:
      "Teilnahme an der Kunstmesse Leipzig mit Fokus auf zeitgenössische Malerei. Thorsten Kasels Arbeiten wurden von internationalen Sammlern und Kuratoren hervorgehoben.",
    image: "https://place-hold.it/800x401",
  },
  {
    id: 3,
    title: "Auszeichnung für innovative Arbeiten",
    date: "2025-07-20",
    content:
      "Verleihung des Kunstförderpreises für experimentelle Malerei und Installation. Die Jury lobte die einzigartige Handschrift und die künstlerische Forschung in der Arbeit von Thorsten Kasel.",
    image: "",
  },
];

onMounted(() => {
  const data = allNews.find(n => n.id === parseInt(newsId));
  if (data) newsItem.value = data;
});
</script>
