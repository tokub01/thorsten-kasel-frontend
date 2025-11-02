<template>
  <section class="bg-gray-300 py-12 px-6 mt-3">
    <div class="max-w-5xl mx-auto">

      <!-- Titel -->
      <h1 class="text-4xl font-serif font-bold text-gray-800 mb-10 text-center">
        Neuigkeiten
      </h1>

      <!-- Ladeanzeige -->
      <div v-if="newsStore.loading" class="text-center text-gray-500 py-8">
        Lade Neuigkeiten...
      </div>

      <!-- Fehleranzeige -->
      <div v-else-if="newsStore.error" class="text-center text-red-600 py-8">
        {{ newsStore.error.message || 'Fehler beim Laden der Neuigkeiten.' }}
      </div>

      <!-- Detailansicht -->
      <div v-else-if="selectedNews" class="bg-white shadow rounded-xl overflow-hidden">
        <img
          v-if="selectedNews.image"
          :src="selectedNews.image"
          alt="News Bild"
          class="w-full h-96 object-cover"
        />
        <div class="p-8">
          <h1 class="text-4xl font-bold font-serif text-gray-800 mb-4">{{ selectedNews.title }}</h1>
          <p class="text-gray-500 mb-6">{{ formatDate(selectedNews.created_at) }}</p>
          <p class="text-lg text-gray-700 mb-6">{{ selectedNews.description }}</p>
          <div class="text-gray-800 whitespace-pre-line leading-relaxed">
            {{ selectedNews.text }}
          </div>
          <button
            @click="selectedNews = null"
            class="inline-block mt-10 text-gray-700 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg transition"
          >
            ← Zurück zu allen News
          </button>
        </div>
      </div>

      <!-- Übersicht aller News -->
      <div v-else-if="filteredNews.length" class="grid md:grid-cols-2 gap-8">
        <article
          v-for="news in filteredNews"
          :key="news.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
          @click="showDetails(news.id)"
        >
          <img
            :src="news.image"
            alt="News Bild"
            class="w-full h-56 object-cover"
          />
          <div class="p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              {{ news.title }}
            </h2>
            <p class="text-gray-600 mb-3">{{ news.description }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(news.created_at) }}</p>
          </div>
        </article>
      </div>

      <!-- Keine News -->
      <p v-else class="text-center text-gray-500 mt-8">
        Keine aktuellen Neuigkeiten verfügbar.
      </p>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useNewsStore } from "@/stores/News";

const newsStore = useNewsStore();
const selectedNews = ref(null);

onMounted(() => {
  newsStore.fetchNews();
});

const filteredNews = computed(() =>
  newsStore.news.filter(item => item.isActive === 1)
);

// Detailansicht anzeigen
const showDetails = async (id) => {
  const data = await newsStore.fetchNewsById(id);
  selectedNews.value = data;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
</script>
