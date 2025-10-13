<template>
  <div class="bg-gray-300 min-h-screen p-6 md:p-10">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <h1 class="text-3xl font-serif font-bold text-gray-800">Dashboard</h1>
      <p class="text-gray-600">Übersicht über aktuelle Statistiken und Social Media Interaktionen.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Ausstellungen</h2>
        <p class="text-3xl font-bold text-gray-700">{{ exhibitionsStore.exhibitions.length }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">News Artikel</h2>
        <p class="text-3xl font-bold text-gray-700">{{ newsStore.news.length }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Kontaktanfragen</h2>
        <p class="text-3xl font-bold text-gray-700">{{ contactStore.successMessageCount }}</p>
      </div>
      <div class="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center">
        <h2 class="text-xl font-semibold text-gray-800 mb-2">Social Media Likes</h2>
        <p class="text-3xl font-bold text-gray-700">{{ socialLikes }}</p>
      </div>
    </div>

    <!-- Charts / Example Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Example Chart 1 -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Neuanmeldungen pro Monat</h3>
        <div class="h-64 flex items-center justify-center text-gray-400">
          Diagramm Placeholder
        </div>
      </div>

      <!-- Example Chart 2 -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Social Media Interaktionen</h3>
        <div class="h-64 flex items-center justify-center text-gray-400">
          Diagramm Placeholder
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useExhibitionsStore } from '@/stores/Exhibitions'
import { useNewsStore } from '@/stores/News'
import { useContactStore } from '@/stores/Contact'

const exhibitionsStore = useExhibitionsStore()
const newsStore = useNewsStore()
const contactStore = useContactStore()

// Beispielhafte Social Likes
const socialLikes = ref(1254)

// Optional: Anzahl der Kontaktanfragen simulieren
contactStore.successMessageCount = contactStore.successMessageCount || 7

// Daten beim Laden abrufen
onMounted(async () => {
  await exhibitionsStore.fetchExhibitions()
  await newsStore.fetchNews()
})
</script>

<style scoped>
/* Optional: kleine Anpassungen für Tailwind */
</style>
