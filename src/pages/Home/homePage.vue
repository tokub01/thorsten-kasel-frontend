<template>
  <div class="bg-gray-300 min-h-screen p-6 md:p-10">

    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-serif font-bold text-gray-800 mb-2 flex items-center gap-3">
        <LayoutDashboard class="w-10 h-10" />
        Dashboard
      </h1>
      <p class="text-gray-600">Willkommen zurück! Hier ist deine Übersicht.</p>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Ausstellungen -->
      <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div class="flex items-start justify-between mb-3">
          <div class="p-3 bg-purple-100 rounded-xl">
            <ImageIcon class="w-6 h-6 text-purple-600" />
          </div>
          <router-link to="/admin/exhibitions" class="text-gray-400 hover:text-gray-600 transition">
            <ArrowRight class="w-5 h-5" />
          </router-link>
        </div>
        <h2 class="text-gray-600 text-sm font-medium mb-1">Ausstellungen</h2>
        <p class="text-3xl font-bold text-gray-800">{{ exhibitionsStore.exhibitions?.length || 0 }}</p>
        <p class="text-xs text-gray-500 mt-2">Insgesamt veröffentlicht</p>
      </div>

      <!-- News -->
      <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div class="flex items-start justify-between mb-3">
          <div class="p-3 bg-blue-100 rounded-xl">
            <Newspaper class="w-6 h-6 text-blue-600" />
          </div>
          <router-link to="/admin/newsPage" class="text-gray-400 hover:text-gray-600 transition">
            <ArrowRight class="w-5 h-5" />
          </router-link>
        </div>
        <h2 class="text-gray-600 text-sm font-medium mb-1">News Artikel</h2>
        <p class="text-3xl font-bold text-gray-800">{{ newsStore.news?.length || 0 }}</p>
        <p class="text-xs text-gray-500 mt-2">
          <span class="text-green-600 font-semibold">{{ activeNews }}</span> aktiv
        </p>
      </div>

      <!-- Produkte -->
      <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div class="flex items-start justify-between mb-3">
          <div class="p-3 bg-green-100 rounded-xl">
            <Package class="w-6 h-6 text-green-600" />
          </div>
          <router-link to="/products" class="text-gray-400 hover:text-gray-600 transition">
            <ArrowRight class="w-5 h-5" />
          </router-link>
        </div>
        <h2 class="text-gray-600 text-sm font-medium mb-1">Produkte</h2>
        <p class="text-3xl font-bold text-gray-800">{{ productStore.products?.data?.length || 0 }}</p>
        <p class="text-xs text-gray-500 mt-2">
          <span class="text-green-600 font-semibold">{{ activeProducts }}</span> aktiv
        </p>
      </div>

      <!-- Kontaktanfragen -->
      <div class="bg-white rounded-2xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
        <div class="flex items-start justify-between mb-3">
          <div class="p-3 bg-red-100 rounded-xl">
            <Mail class="w-6 h-6 text-red-600" />
          </div>
          <router-link to="/contactRequests" class="text-gray-400 hover:text-gray-600 transition">
            <ArrowRight class="w-5 h-5" />
          </router-link>
        </div>
        <h2 class="text-gray-600 text-sm font-medium mb-1">Kontaktanfragen</h2>
        <p class="text-3xl font-bold text-gray-800">{{ contactStore.errors?.length || 0 }}</p>
        <p class="text-xs text-red-600 mt-2 font-semibold">Zu bearbeiten</p>
      </div>
    </div>

    <!-- Zweite Reihe: Kategorien & Schnellzugriff -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

      <!-- Kategorien Übersicht -->
      <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Tag class="w-5 h-5 text-gray-600" />
            Kategorien
          </h3>
          <router-link to="/categories" class="text-sm text-gray-600 hover:text-gray-800 transition flex items-center gap-1">
            Verwalten
            <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>
        <div class="space-y-2">
          <div v-if="categoryStore.categories?.length" class="max-h-40 overflow-y-auto">
            <div v-for="category in categoryStore.categories.slice(0, 5)" :key="category.id"
                 class="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <span class="text-sm text-gray-700">{{ category.name }}</span>
              <span class="text-xs text-gray-500">{{ getProductCountByCategory(category.id) }} Produkte</span>
            </div>
          </div>
          <p v-else class="text-sm text-gray-500 italic text-center py-4">Keine Kategorien vorhanden</p>
        </div>
        <div class="mt-4 pt-4 border-t">
          <p class="text-sm text-gray-600">
            Insgesamt: <span class="font-semibold">{{ categoryStore.categories?.length || 0 }}</span> Kategorien
          </p>
        </div>
      </div>

      <!-- Schnellzugriff -->
      <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Zap class="w-5 h-5 text-gray-600" />
          Schnellzugriff
        </h3>
        <div class="space-y-2">
          <router-link
            to="/products"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
          >
            <div class="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition">
              <Plus class="w-4 h-4 text-gray-600" />
            </div>
            <span class="text-sm text-gray-700 font-medium">Neues Produkt</span>
          </router-link>
          <router-link
            to="/admin/newsPage"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
          >
            <div class="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition">
              <Plus class="w-4 h-4 text-gray-600" />
            </div>
            <span class="text-sm text-gray-700 font-medium">Neue News</span>
          </router-link>
          <router-link
            to="/admin/exhibitions"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
          >
            <div class="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition">
              <Plus class="w-4 h-4 text-gray-600" />
            </div>
            <span class="text-sm text-gray-700 font-medium">Neue Ausstellung</span>
          </router-link>
          <router-link
            to="/adminBiography"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition group"
          >
            <div class="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition">
              <Edit2 class="w-4 h-4 text-gray-600" />
            </div>
            <span class="text-sm text-gray-700 font-medium">Vita bearbeiten</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Wichtige Hinweise -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

      <!-- Warnung bei unbearbeiteten Anfragen -->
      <div v-if="contactStore.errors?.length > 0" class="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div class="flex items-start gap-3">
          <div class="p-2 bg-red-100 rounded-lg">
            <AlertCircle class="w-5 h-5 text-red-600" />
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-red-900 mb-1">Unbearbeitete Kontaktanfragen</h3>
            <p class="text-sm text-red-700 mb-3">
              Du hast {{ contactStore.errors.length }} unbearbeitete Kontaktanfrage{{ contactStore.errors.length === 1 ? '' : 'n' }}.
            </p>
            <router-link
              to="/contactRequests"
              class="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              Jetzt bearbeiten
              <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- Erfolgs-Badge wenn alles ok -->
      <div v-if="contactStore.errors?.length === 0 && inactiveCount === 0" class="bg-green-50 border border-green-200 rounded-2xl p-6 lg:col-span-2">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-green-100 rounded-xl">
            <CheckCircle2 class="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-green-900 mb-1">Alles erledigt! 🎉</h3>
            <p class="text-sm text-green-700">Keine offenen Aufgaben. Dein Admin-Bereich ist auf dem neuesten Stand.</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useExhibitionsStore } from '@/stores/Exhibitions'
import { useNewsStore } from '@/stores/News'
import { useContactStore } from '@/stores/Contact'
import { useProductStore } from '@/stores/Products'
import { useCategoryStore } from '@/stores/Categories'
import {
  LayoutDashboard, ImageIcon, Newspaper, Package, Mail, Tag, Zap,
  Plus, Edit2, AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-vue-next'

const exhibitionsStore = useExhibitionsStore()
const newsStore = useNewsStore()
const contactStore = useContactStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// Computed Properties
const activeNews = computed(() => {
  return newsStore.news?.filter(n => n.isActive === 1).length || 0
})

const activeProducts = computed(() => {
  return productStore.products?.data?.filter(p => p.isActive === 1).length || 0
})

const inactiveProducts = computed(() => {
  return productStore.products?.data?.filter(p => p.isActive === 0).length || 0
})

const inactiveNewsCount = computed(() => {
  return newsStore.news?.filter(n => n.isActive !== 1).length || 0
})

const inactiveCount = computed(() => {
  return inactiveProducts.value + inactiveNewsCount.value
})


// Methoden
function getProductCountByCategory(categoryId) {
  return productStore.products?.data?.filter(p => p.category_id?.id === categoryId).length || 0
}

// Daten beim Laden abrufen
onMounted(async () => {
  await Promise.all([
    exhibitionsStore.fetchExhibitions(),
    newsStore.fetchNews(),
    productStore.loadAllProducts(),
    categoryStore.loadAllCategories()
  ])
})
</script>