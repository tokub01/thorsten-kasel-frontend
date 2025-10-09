<template>
  <div class="bg-gray-50 min-h-screen py-12 px-6">
    <!-- Titel / Intro -->
    <section class="max-w-4xl mx-auto text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-serif font-bold text-gray-800 mb-4">
        Ausstellungen
      </h1>
      <p class="text-gray-600 text-lg">
        Eine Übersicht über vergangene und aktuelle Ausstellungen von Thorsten Kasel.
      </p>
    </section>

    <!-- Ausstellungen -->
    <section class="max-w-5xl mx-auto grid gap-8">
      <router-link
        v-for="exhibition in exhibitions"
        :key="exhibition.id"
        :to="{ name: 'exhibitionDetailPage', params: { exhibitionsId: exhibition.id } }"
        class="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all"
      >
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ exhibition.title }}</h2>
            <p class="text-gray-500 mb-2">{{ exhibition.date }} | {{ exhibition.location }}</p>
          </div>
          <div class="mt-4 md:mt-0">
            <span class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
              {{ exhibition.type }}
            </span>
          </div>
        </div>
        <p class="text-gray-600 mt-4 line-clamp-3">{{ exhibition.description }}</p>
      </router-link>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const exhibitions = ref([
  {
    id: 1,
    title: "Zwischen Linien",
    date: "2023",
    location: "Galerie Blau, Berlin",
    type: "Einzelausstellung",
    description:
      "Eine visuelle Exploration von Raum und Form, die die Grenzen der Malerei erweitert.",
  },
  {
    id: 2,
    title: "Verlorene Räume",
    date: "2021",
    location: "Kunsthaus Dresden",
    type: "Einzelausstellung",
    description:
      "Installationen und Zeichnungen, die die Vergänglichkeit urbaner Räume reflektieren.",
  },
  {
    id: 3,
    title: "Positionen der Gegenwart",
    date: "2024",
    location: "Kunstverein Leipzig",
    type: "Gruppenausstellung",
    description:
      "Eine Auswahl zeitgenössischer Arbeiten, die aktuelle Themen der Gesellschaft behandeln.",
  },
]);
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
