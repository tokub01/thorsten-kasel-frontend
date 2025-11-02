<template>
  <div class="bg-gray-300 min-h-screen p-4 md:p-8">

    <!-- Header mit Zeitanzeige -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-3">
            <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <LayoutDashboard class="w-8 h-8 text-white" />
            </div>
            Dashboard
          </h1>
          <p class="text-gray-600 text-lg">{{ greeting }} Hier ist deine Übersicht.</p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <p class="text-2xl font-bold text-gray-800">{{ currentTime }}</p>
          <p class="text-sm text-gray-500">{{ currentDate }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
      <div class="relative">
        <Loader2 class="w-16 h-16 text-blue-600 animate-spin" />
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-12 h-12 bg-blue-100 rounded-full animate-pulse"></div>
        </div>
      </div>
      <p class="text-gray-600 font-semibold mt-6 text-lg">Lade Dashboard...</p>
      <p class="text-gray-400 text-sm mt-2">Daten werden synchronisiert</p>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError" class="bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center">
      <AlertCircle class="w-16 h-16 text-red-600 mx-auto mb-4" />
      <h3 class="text-xl font-bold text-gray-900 mb-2">Fehler beim Laden</h3>
      <p class="text-gray-600 mb-6">Einige Daten konnten nicht geladen werden.</p>
      <button
        @click="reloadData"
        class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl font-medium inline-flex items-center gap-2"
      >
        <RefreshCw class="w-4 h-4" />
        Erneut versuchen
      </button>
    </div>

    <template v-else>
      <!-- Quick Stats Cards mit Animationen -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <!-- Ausstellungen -->
        <div
          class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group transform hover:-translate-y-2"
          style="animation: fadeInUp 0.5s ease-out 0.1s both"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ImageIcon class="w-6 h-6 text-white" />
              </div>
              <router-link to="/admin/exhibitions" class="text-gray-400 hover:text-purple-600 transition-all p-2 hover:bg-purple-50 rounded-lg">
                <ArrowRight class="w-5 h-5" />
              </router-link>
            </div>
            <h2 class="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">Ausstellungen</h2>
            <p class="text-4xl font-bold text-gray-900 mb-1">{{ exhibitionsCount }}</p>
            <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style="width: 100%"></div>
              </div>
              <span class="text-xs text-gray-500 font-medium">Aktiv</span>
            </div>
          </div>
        </div>

        <!-- News -->
        <div
          class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group transform hover:-translate-y-2"
          style="animation: fadeInUp 0.5s ease-out 0.2s both"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Newspaper class="w-6 h-6 text-white" />
              </div>
              <router-link to="/admin/newsPage" class="text-gray-400 hover:text-blue-600 transition-all p-2 hover:bg-blue-50 rounded-lg">
                <ArrowRight class="w-5 h-5" />
              </router-link>
            </div>
            <h2 class="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">News Artikel</h2>
            <p class="text-4xl font-bold text-gray-900 mb-1">{{ newsCount }}</p>
            <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                  :style="`width: ${newsCount > 0 ? (activeNewsCount / newsCount * 100) : 0}%`"
                ></div>
              </div>
              <span class="text-xs text-green-600 font-bold">{{ activeNewsCount }} aktiv</span>
            </div>
          </div>
        </div>

        <!-- Produkte -->
        <div
          class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group transform hover:-translate-y-2"
          style="animation: fadeInUp 0.5s ease-out 0.3s both"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package class="w-6 h-6 text-white" />
              </div>
              <router-link to="/products" class="text-gray-400 hover:text-green-600 transition-all p-2 hover:bg-green-50 rounded-lg">
                <ArrowRight class="w-5 h-5" />
              </router-link>
            </div>
            <h2 class="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">Produkte</h2>
            <p class="text-4xl font-bold text-gray-900 mb-1">{{ productsCount }}</p>
            <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                  :style="`width: ${productsCount > 0 ? (activeProductsCount / productsCount * 100) : 0}%`"
                ></div>
              </div>
              <span class="text-xs text-green-600 font-bold">{{ activeProductsCount }} aktiv</span>
            </div>
          </div>
        </div>

        <!-- Kontaktanfragen mit Puls-Animation -->
        <div
          class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group transform hover:-translate-y-2 relative"
          style="animation: fadeInUp 0.5s ease-out 0.4s both"
        >
          <div v-if="unreadContactRequests > 0" class="absolute top-4 right-4">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-gradient-to-br from-red-400 to-red-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Mail class="w-6 h-6 text-white" />
              </div>
              <router-link to="/contactRequests" class="text-gray-400 hover:text-red-600 transition-all p-2 hover:bg-red-50 rounded-lg">
                <ArrowRight class="w-5 h-5" />
              </router-link>
            </div>
            <h2 class="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-2">Kontaktanfragen</h2>
            <p class="text-4xl font-bold text-gray-900 mb-1">{{ unreadContactRequests }}</p>
            <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <Clock class="w-3.5 h-3.5 text-red-500" />
              <span class="text-xs text-red-600 font-bold">Zu bearbeiten</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistik-Übersicht -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8" style="animation: fadeInUp 0.5s ease-out 0.5s both">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp class="w-6 h-6 text-blue-600" />
            Schnellübersicht
          </h3>
          <button @click="reloadData" class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-50 rounded-lg">
            <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
          </button>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <p class="text-2xl font-bold text-blue-600">{{ totalContent }}</p>
            <p class="text-xs text-gray-600 font-medium mt-1">Inhalte gesamt</p>
          </div>
          <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <p class="text-2xl font-bold text-green-600">{{ totalActive }}</p>
            <p class="text-xs text-gray-600 font-medium mt-1">Aktive Elemente</p>
          </div>
          <div class="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
            <p class="text-2xl font-bold text-yellow-600">{{ totalInactive }}</p>
            <p class="text-xs text-gray-600 font-medium mt-1">Deaktiviert</p>
          </div>
          <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <p class="text-2xl font-bold text-purple-600">{{ categoriesCount }}</p>
            <p class="text-xs text-gray-600 font-medium mt-1">Kategorien</p>
          </div>
        </div>
      </div>

      <!-- Zweite Reihe: Kategorien & Schnellzugriff -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        <!-- Kategorien Übersicht mit Animationen -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden" style="animation: fadeInUp 0.5s ease-out 0.6s both">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold flex items-center gap-2">
                <Tag class="w-6 h-6" />
                Kategorien
              </h3>
              <router-link to="/categories" class="text-white/80 hover:text-white transition flex items-center gap-1 text-sm font-medium hover:bg-white/10 px-3 py-1.5 rounded-lg">
                Verwalten
                <ArrowRight class="w-4 h-4" />
              </router-link>
            </div>
            <p class="text-white/80 text-sm mt-2">{{ categoriesCount }} Kategorien verfügbar</p>
          </div>
          <div class="p-6">
            <div v-if="categoriesCount > 0" class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              <div
                v-for="(category, index) in topCategories"
                :key="category.id"
                class="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group border border-gray-200"
                :style="`animation: slideInRight 0.3s ease-out ${index * 0.1}s both`"
              >
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                  <span class="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition">{{ category.name }}</span>
                </div>
                <span class="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-600 transition">
                  {{ getProductCountByCategory(category.id) }}
                </span>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <Tag class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-sm text-gray-500 italic">Keine Kategorien vorhanden</p>
            </div>
          </div>
        </div>

        <!-- Schnellzugriff mit Icons -->
        <div class="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden" style="animation: fadeInUp 0.5s ease-out 0.7s both">
          <div class="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
            <h3 class="text-xl font-bold flex items-center gap-2">
              <Zap class="w-6 h-6" />
              Schnellzugriff
            </h3>
            <p class="text-white/80 text-sm mt-2">Häufig verwendete Aktionen</p>
          </div>
          <div class="p-6 space-y-3">
            <router-link
              to="/products"
              class="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300 group border border-gray-100 hover:border-green-200 hover:shadow-md"
            >
              <div class="p-3 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <span class="text-sm font-bold text-gray-800 group-hover:text-green-600 transition block">Neues Produkt</span>
                <span class="text-xs text-gray-500">Produkt hinzufügen</span>
              </div>
              <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-green-600 transition" />
            </router-link>

            <router-link
              to="/admin/newsPage"
              class="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 group border border-gray-100 hover:border-blue-200 hover:shadow-md"
            >
              <div class="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <span class="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition block">Neue News</span>
                <span class="text-xs text-gray-500">Artikel verfassen</span>
              </div>
              <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
            </router-link>

            <router-link
              to="/admin/exhibitions"
              class="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group border border-gray-100 hover:border-purple-200 hover:shadow-md"
            >
              <div class="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <span class="text-sm font-bold text-gray-800 group-hover:text-purple-600 transition block">Neue Ausstellung</span>
                <span class="text-xs text-gray-500">Ausstellung erstellen</span>
              </div>
              <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition" />
            </router-link>

            <router-link
              to="/adminBiography"
              class="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group border border-gray-100 hover:border-amber-200 hover:shadow-md"
            >
              <div class="p-3 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Edit2 class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1">
                <span class="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition block">Vita bearbeiten</span>
                <span class="text-xs text-gray-500">Biografie aktualisieren</span>
              </div>
              <ArrowRight class="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- Wichtige Hinweise mit besseren Animationen -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- Warnung bei unbearbeiteten Anfragen -->
        <div
          v-if="unreadContactRequests > 0"
          class="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-2xl p-6 shadow-lg"
          style="animation: fadeInUp 0.5s ease-out 0.8s both"
        >
          <div class="flex items-start gap-4">
            <div class="p-3 bg-red-500 rounded-xl shadow-lg">
              <AlertCircle class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-red-900 mb-2">Unbearbeitete Kontaktanfragen</h3>
              <p class="text-sm text-red-700 mb-4">
                Du hast <span class="font-bold">{{ unreadContactRequests }}</span> unbearbeitete Kontaktanfrage{{ unreadContactRequests === 1 ? '' : 'n' }}.
              </p>
              <router-link
                to="/contactRequests"
                class="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl font-semibold text-sm"
              >
                Jetzt bearbeiten
                <ArrowRight class="w-4 h-4" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- Erfolgs-Badge wenn alles ok -->
        <div
          v-if="unreadContactRequests === 0 && totalInactive === 0"
          class="bg-gradient-to-br from-green-50 to-emerald-100 border-2 border-green-300 rounded-2xl p-6 shadow-lg"
          :class="{ 'lg:col-span-2': unreadContactRequests === 0 && totalInactive === 0 }"
          style="animation: fadeInUp 0.5s ease-out 0.8s both"
        >
          <div class="flex items-center gap-4">
            <div class="p-4 bg-green-500 rounded-2xl shadow-lg">
              <CheckCircle2 class="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 class="text-2xl font-bold text-green-900 mb-1">Alles erledigt! 🎉</h3>
              <p class="text-sm text-green-700">Keine offenen Aufgaben. Dein Admin-Bereich ist auf dem neuesten Stand.</p>
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useExhibitionsStore } from '@/stores/Exhibitions'
import { useNewsStore } from '@/stores/News'
import { useContactStore } from '@/stores/Contact'
import { useProductStore } from '@/stores/Products'
import { useCategoryStore } from '@/stores/Categories'
import {
  LayoutDashboard, ImageIcon, Newspaper, Package, Mail, Tag, Zap,
  Plus, Edit2, AlertCircle, CheckCircle2, ArrowRight, Loader2,
  Clock, TrendingUp, RefreshCw,
} from 'lucide-vue-next'

// Stores
const exhibitionsStore = useExhibitionsStore()
const newsStore = useNewsStore()
const contactStore = useContactStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// State
const isLoading = ref(true)
const hasError = ref(false)
const currentTime = ref('')
const currentDate = ref('')

// Zeitanzeige
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  currentDate.value = now.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Guten Morgen!'
  if (hour < 18) return 'Guten Tag!'
  return 'Guten Abend!'
})

// Computed - Exhibitions
const exhibitionsCount = computed(() =>
  Array.isArray(exhibitionsStore.exhibitions) ? exhibitionsStore.exhibitions.length : 0
)

// Computed - News
const newsCount = computed(() =>
  Array.isArray(newsStore.news) ? newsStore.news.length : 0
)

const activeNewsCount = computed(() => {
  if (!Array.isArray(newsStore.news)) return 0
  return newsStore.news.filter(n => n.isActive === 1 || n.isActive === "1" || n.isActive === true).length
})

const inactiveNewsCount = computed(() => {
  if (!Array.isArray(newsStore.news)) return 0
  return newsStore.news.filter(n => n.isActive === 0 || n.isActive === "0" || n.isActive === false).length
})

// Computed - Products
const productsCount = computed(() =>
  productStore.products?.data?.length || 0
)

const activeProductsCount = computed(() => {
  if (!productStore.products?.data) return 0
  return productStore.products.data.filter(p => p.isActive === 1 || p.isActive === "1" || p.isActive === true).length
})

const inactiveProductsCount = computed(() => {
  if (!productStore.products?.data) return 0
  return productStore.products.data.filter(p => p.isActive === 0 || p.isActive === "0" || p.isActive === false).length
})

// Computed - Contact
const unreadContactRequests = computed(() => {
  if (!Array.isArray(contactStore.contactRequests)) return 0
  return contactStore.contactRequests.filter(
    req => req.isRead === false || req.isRead === 0 || req.isRead === "0"
  ).length
})

// Computed - Categories
const categoriesCount = computed(() =>
  Array.isArray(categoryStore.categories) ? categoryStore.categories.length : 0
)

const topCategories = computed(() => {
  if (!Array.isArray(categoryStore.categories)) return []
  return categoryStore.categories.slice(0, 8)
})

// Computed - Totals
const totalContent = computed(() =>
  exhibitionsCount.value + newsCount.value + productsCount.value
)

const totalActive = computed(() =>
  activeNewsCount.value + activeProductsCount.value + exhibitionsCount.value
)

const totalInactive = computed(() =>
  inactiveProductsCount.value + inactiveNewsCount.value
)

// Methods
function getProductCountByCategory(categoryId) {
  if (!productStore.products?.data) return 0
  return productStore.products.data.filter(p => p.category_id?.id === categoryId).length
}

async function loadData() {
  isLoading.value = true
  hasError.value = false

  try {
    await Promise.all([
      exhibitionsStore.fetchExhibitions(),
      newsStore.fetchNews(),
      contactStore.getContactRequests(),
      productStore.loadAllProducts(),
      categoryStore.loadAllCategories()
    ])

    console.log('✅ Dashboard Daten geladen:', {
      exhibitions: exhibitionsCount.value,
      news: newsCount.value,
      products: productsCount.value,
      categories: categoriesCount.value,
      unreadRequests: unreadContactRequests.value,
      totalContent: totalContent.value,
      activeContent: totalActive.value,
      inactiveContent: totalInactive.value
    })
  } catch (error) {
    console.error('❌ Fehler beim Laden des Dashboards:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

function reloadData() {
  loadData()
}

// Lifecycle
let timeInterval

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  loadData()
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #6366f1, #8b5cf6);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #4f46e5, #7c3aed);
}
</style>