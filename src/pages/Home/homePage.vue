<template>
  <div class="bg-gray-300 min-h-screen p-4 md:p-8">

    <!-- Header mit Zeitanzeige -->
    <div class="mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <div class="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
              <LayoutDashboard class="w-8 h-8 text-white" />
            </div>
            Dashboard
          </h1>
          <p class="text-gray-600 text-lg">{{ greeting }} {{ currentUserName }}</p>
        </div>
        <div class="flex flex-col items-end gap-1">
          <div class="flex items-center gap-3">
            <button
              @click="reloadData"
              :disabled="isLoading"
              class="p-2 hover:bg-white rounded-xl transition-all"
              :class="{ 'animate-spin': isLoading }"
            >
              <RefreshCw class="w-5 h-5 text-gray-600" />
            </button>
            <div class="text-right">
              <p class="text-2xl font-bold text-gray-900">{{ currentTime }}</p>
              <p class="text-sm text-gray-500">{{ currentDate }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && !hasLoadedOnce" class="flex flex-col items-center justify-center py-24">
      <div class="relative">
        <Loader2 class="w-16 h-16 text-indigo-600 animate-spin" />
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-12 h-12 bg-indigo-100 rounded-full animate-pulse"></div>
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
      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">

        <!-- Produkte -->
        <div
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 overflow-hidden group transform hover:-translate-y-1"
          style="animation: fadeInUp 0.5s ease-out 0.1s both"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg">
                <Package class="w-6 h-6 text-white" />
              </div>
              <router-link to="/products" class="text-gray-400 hover:text-emerald-600 transition-all p-2 hover:bg-emerald-50 rounded-lg">
                <ArrowRight class="w-5 h-5" />
              </router-link>
            </div>
            <h2 class="text-gray-500 text-sm font-bold uppercase tracking-wide mb-2">Produkte</h2>
            <div class="flex items-baseline gap-2 mb-3">
              <p class="text-4xl font-bold text-gray-900">{{ productsCount }}</p>
              <span class="text-sm text-gray-500">gesamt</span>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 flex items-center gap-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  Aktiv
                </span>
                <span class="font-bold text-green-600">{{ activeProductsCount }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 flex items-center gap-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Inaktiv
                </span>
                <span class="font-bold text-gray-500">{{ inactiveProductsCount }}</span>
              </div>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
        </div>

        <!-- Kategorien -->
        <div
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 overflow-hidden group transform hover:-translate-y-1"
          style="animation: fadeInUp 0.5s ease-out 0.2s both"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl shadow-lg">
                <Tag class="w-6 h-6 text-white" />
              </div>
              <router-link to="/categories" class="text-gray-400 hover:text-indigo-600 transition-all p-2 hover:bg-indigo-50 rounded-lg">
                <ArrowRight class="w-5 h-5" />
              </router-link>
            </div>
            <h2 class="text-gray-500 text-sm font-bold uppercase tracking-wide mb-2">Kategorien</h2>
            <div class="flex items-baseline gap-2 mb-3">
              <p class="text-4xl font-bold text-gray-900">{{ categoriesCount }}</p>
              <span class="text-sm text-gray-500">verfügbar</span>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 flex items-center gap-1">
                  <div class="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Mit Produkten
                </span>
                <span class="font-bold text-indigo-600">{{ categoriesWithProducts }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 flex items-center gap-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Leer
                </span>
                <span class="font-bold text-gray-500">{{ categoriesWithoutProducts }}</span>
              </div>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-indigo-400 to-indigo-600"></div>
        </div>

        <!-- News -->
        <div
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 overflow-hidden group transform hover:-translate-y-1"
          style="animation: fadeInUp 0.5s ease-out 0.3s both"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg">
                <Newspaper class="w-6 h-6 text-white" />
              </div>
              <router-link to="/admin/newsPage" class="text-gray-400 hover:text-blue-600 transition-all p-2 hover:bg-blue-50 rounded-lg">
                <ArrowRight class="w-5 h-5" />
              </router-link>
            </div>
            <h2 class="text-gray-500 text-sm font-bold uppercase tracking-wide mb-2">News</h2>
            <div class="flex items-baseline gap-2 mb-3">
              <p class="text-4xl font-bold text-gray-900">{{ newsCount }}</p>
              <span class="text-sm text-gray-500">Artikel</span>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 flex items-center gap-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  Veröffentlicht
                </span>
                <span class="font-bold text-green-600">{{ activeNewsCount }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 flex items-center gap-1">
                  <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Entwürfe
                </span>
                <span class="font-bold text-gray-500">{{ inactiveNewsCount }}</span>
              </div>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        </div>

        <!-- Ausstellungen -->
        <div
          class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 overflow-hidden group transform hover:-translate-y-1"
          style="animation: fadeInUp 0.5s ease-out 0.4s both"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg">
                <ImageIcon class="w-6 h-6 text-white" />
              </div>
              <router-link to="/admin/exhibitions" class="text-gray-400 hover:text-purple-600 transition-all p-2 hover:bg-purple-50 rounded-lg">
                <ArrowRight class="w-5 h-5" />
              </router-link>
            </div>
            <h2 class="text-gray-500 text-sm font-bold uppercase tracking-wide mb-2">Ausstellungen</h2>
            <div class="flex items-baseline gap-2 mb-3">
              <p class="text-4xl font-bold text-gray-900">{{ exhibitionsCount }}</p>
              <span class="text-sm text-gray-500">aktiv</span>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 flex items-center gap-1">
                  <Calendar class="w-3 h-3" />
                  Geplant
                </span>
                <span class="font-bold text-purple-600">{{ upcomingExhibitions }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 flex items-center gap-1">
                  <Clock class="w-3 h-3" />
                  Vergangen
                </span>
                <span class="font-bold text-gray-500">{{ pastExhibitions }}</span>
              </div>
            </div>
          </div>
          <div class="h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
        </div>
      </div>

      <!-- Kontaktanfragen Banner -->
      <div
        v-if="unreadContactRequests > 0"
        class="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-2xl p-6 mb-8 text-white"
        style="animation: fadeInUp 0.5s ease-out 0.5s both"
      >
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="relative">
              <div class="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Mail class="w-8 h-8 text-white" />
              </div>
              <span class="absolute -top-2 -right-2 flex h-6 w-6">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span class="relative inline-flex rounded-full h-6 w-6 bg-white items-center justify-center text-xs font-bold text-red-600">
                  {{ unreadContactRequests }}
                </span>
              </span>
            </div>
            <div>
              <h3 class="text-xl md:text-2xl font-bold mb-1">
                {{ unreadContactRequests }} unbearbeitete Kontaktanfrage{{ unreadContactRequests === 1 ? '' : 'n' }}
              </h3>
              <p class="text-white/90 text-sm">Neue Nachrichten warten auf deine Antwort</p>
            </div>
          </div>
          <router-link
            to="/contactRequests"
            class="bg-white text-red-600 px-6 py-3 rounded-xl hover:shadow-2xl transition-all font-bold flex items-center gap-2 whitespace-nowrap"
          >
            Jetzt bearbeiten
            <ArrowRight class="w-5 h-5" />
          </router-link>
        </div>
      </div>

      <!-- Haupt-Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        <!-- Statistik-Übersicht -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6" style="animation: fadeInUp 0.5s ease-out 0.6s both">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp class="w-6 h-6 text-indigo-600" />
              Inhaltsübersicht
            </h3>
            <div class="text-right">
              <p class="text-3xl font-bold text-gray-900">{{ totalContent }}</p>
              <p class="text-xs text-gray-500">Einträge gesamt</p>
            </div>
          </div>

          <!-- Chart Alternative: Balken -->
          <div class="space-y-4">
            <!-- Produkte -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Package class="w-4 h-4 text-emerald-600" />
                  Produkte
                </span>
                <span class="text-sm font-bold text-gray-900">{{ productsCount }}</span>
              </div>
              <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
                  :style="`width: ${totalContent > 0 ? (productsCount / totalContent * 100) : 0}%`"
                ></div>
              </div>
            </div>

            <!-- News -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Newspaper class="w-4 h-4 text-blue-600" />
                  News
                </span>
                <span class="text-sm font-bold text-gray-900">{{ newsCount }}</span>
              </div>
              <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                  :style="`width: ${totalContent > 0 ? (newsCount / totalContent * 100) : 0}%`"
                ></div>
              </div>
            </div>

            <!-- Ausstellungen -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ImageIcon class="w-4 h-4 text-purple-600" />
                  Ausstellungen
                </span>
                <span class="text-sm font-bold text-gray-900">{{ exhibitionsCount }}</span>
              </div>
              <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-1000"
                  :style="`width: ${totalContent > 0 ? (exhibitionsCount / totalContent * 100) : 0}%`"
                ></div>
              </div>
            </div>

            <!-- Kategorien -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Tag class="w-4 h-4 text-indigo-600" />
                  Kategorien
                </span>
                <span class="text-sm font-bold text-gray-900">{{ categoriesCount }}</span>
              </div>
              <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-1000"
                  :style="`width: ${totalContent > 0 ? (categoriesCount / (totalContent + categoriesCount) * 100) : 0}%`"
                ></div>
              </div>
            </div>
          </div>

          <!-- Status Grid -->
          <div class="grid grid-cols-3 gap-4 mt-6 pt-6 border-t-2 border-gray-100">
            <div class="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <p class="text-2xl font-bold text-green-600">{{ totalActive }}</p>
              <p class="text-xs text-gray-600 font-semibold mt-1">Aktiv</p>
            </div>
            <div class="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
              <p class="text-2xl font-bold text-gray-600">{{ totalInactive }}</p>
              <p class="text-xs text-gray-600 font-semibold mt-1">Inaktiv</p>
            </div>
            <div class="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
              <p class="text-2xl font-bold text-indigo-600">{{ totalContent }}</p>
              <p class="text-xs text-gray-600 font-semibold mt-1">Gesamt</p>
            </div>
          </div>
        </div>

        <!-- Top Kategorien -->
        <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden" style="animation: fadeInUp 0.5s ease-out 0.7s both">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
            <h3 class="text-xl font-bold flex items-center gap-2">
              <Tag class="w-6 h-6" />
              Top Kategorien
            </h3>
            <p class="text-white/80 text-sm mt-1">Nach Produktanzahl</p>
          </div>
          <div class="p-6">
            <div v-if="categoriesCount > 0" class="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              <div
                v-for="(category, index) in topCategoriesByProducts"
                :key="category.id"
                class="flex items-center justify-between py-3 px-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group border border-gray-200 hover:border-indigo-300"
                :style="`animation: slideInRight 0.3s ease-out ${index * 0.05}s both`"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white font-bold text-sm flex-shrink-0">
                    {{ index + 1 }}
                  </div>
                  <span class="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition truncate">
                    {{ category.name }}
                  </span>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <Package class="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500 transition" />
                  <span class="text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-600 transition">
                    {{ category.productCount }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-12">
              <Tag class="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p class="text-sm text-gray-500">Keine Kategorien vorhanden</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Schnellzugriff -->
      <div class="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden" style="animation: fadeInUp 0.5s ease-out 0.8s both">
        <div class="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 text-white">
          <h3 class="text-xl font-bold flex items-center gap-2">
            <Zap class="w-6 h-6" />
            Schnellzugriff
          </h3>
          <p class="text-white/80 text-sm mt-1">Häufig verwendete Aktionen</p>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <router-link
              to="/products"
              class="flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 transition-all duration-300 group border-2 border-gray-100 hover:border-emerald-300 hover:shadow-lg"
            >
              <div class="p-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus class="w-6 h-6 text-white" />
              </div>
              <div class="text-center">
                <span class="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition block">Neues Produkt</span>
                <span class="text-xs text-gray-500">Produkt erstellen</span>
              </div>
            </router-link>

            <router-link
              to="/admin/newsPage"
              class="flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 group border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg"
            >
              <div class="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus class="w-6 h-6 text-white" />
              </div>
              <div class="text-center">
                <span class="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition block">News Artikel</span>
                <span class="text-xs text-gray-500">Artikel verfassen</span>
              </div>
            </router-link>

            <router-link
              to="/admin/exhibitions"
              class="flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group border-2 border-gray-100 hover:border-purple-300 hover:shadow-lg"
            >
              <div class="p-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus class="w-6 h-6 text-white" />
              </div>
              <div class="text-center">
                <span class="text-sm font-bold text-gray-800 group-hover:text-purple-600 transition block">Ausstellung</span>
                <span class="text-xs text-gray-500">Neu erstellen</span>
              </div>
            </router-link>

            <router-link
              to="/adminBiography"
              class="flex flex-col items-center gap-3 p-6 rounded-xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 transition-all duration-300 group border-2 border-gray-100 hover:border-amber-300 hover:shadow-lg"
            >
              <div class="p-4 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Edit2 class="w-6 h-6 text-white" />
              </div>
              <div class="text-center">
                <span class="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition block">Vita</span>
                <span class="text-xs text-gray-500">Bearbeiten</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Erfolgs-Badge -->
      <div
        v-if="unreadContactRequests === 0 && totalInactive === 0"
        class="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-8 text-white text-center"
        style="animation: fadeInUp 0.5s ease-out 0.9s both"
      >
        <CheckCircle2 class="w-16 h-16 mx-auto mb-4" />
        <h3 class="text-3xl font-bold mb-2">Perfekt! 🎉</h3>
        <p class="text-white/90 text-lg">Alle Aufgaben erledigt. Dein Admin-Bereich ist vollständig aktuell.</p>
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
  Clock, TrendingUp, RefreshCw, Calendar
} from 'lucide-vue-next'

// Stores
const exhibitionsStore = useExhibitionsStore()
const newsStore = useNewsStore()
const contactStore = useContactStore()
const productStore = useProductStore()
const categoryStore = useCategoryStore()

// State
const isLoading = ref(true)
const hasLoadedOnce = ref(false)
const hasError = ref(false)
const currentTime = ref('')
const currentDate = ref('')
const currentUserName = ref('Administrator')

// Zeitanzeige
const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  currentDate.value = now.toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Guten Morgen,'
  if (hour < 18) return 'Guten Tag,'
  return 'Guten Abend,'
})

// Computed - Products
const productsCount = computed(() => {
  const products = productStore.products?.data || productStore.products
  return Array.isArray(products) ? products.length : 0
})

const activeProductsCount = computed(() => {
  const products = productStore.products?.data || productStore.products
  if (!Array.isArray(products)) return 0
  return products.filter(p => p.isActive === 1 || p.isActive === "1" || p.isActive === true).length
})

const inactiveProductsCount = computed(() => {
  const products = productStore.products?.data || productStore.products
  if (!Array.isArray(products)) return 0
  return products.filter(p => p.isActive === 0 || p.isActive === "0" || p.isActive === false).length
})

// Computed - Categories
const categoriesCount = computed(() => {
  const cats = categoryStore.categories
  return Array.isArray(cats) ? cats.length : 0
})

const categoriesWithProducts = computed(() => {
  const products = productStore.products?.data || productStore.products
  const categories = categoryStore.categories
  if (!Array.isArray(categories) || !Array.isArray(products)) return 0

  const categoriesWithProds = new Set()
  products.forEach(p => {
    if (p.category_id) {
      const catId = typeof p.category_id === 'object' ? p.category_id.id : p.category_id
      categoriesWithProds.add(catId)
    }
  })
  return categoriesWithProds.size
})

const categoriesWithoutProducts = computed(() => {
  return categoriesCount.value - categoriesWithProducts.value
})

const topCategoriesByProducts = computed(() => {
  const categories = categoryStore.categories
  const products = productStore.products?.data || productStore.products

  if (!Array.isArray(categories) || !Array.isArray(products)) return []

  // Zähle Produkte pro Kategorie
  const categoryProductCount = {}
  categories.forEach(cat => {
    categoryProductCount[cat.id] = 0
  })

  products.forEach(p => {
    if (p.category_id) {
      const catId = typeof p.category_id === 'object' ? p.category_id.id : p.category_id
      if (categoryProductCount[catId] !== undefined) {
        categoryProductCount[catId]++
      }
    }
  })

  // Sortiere Kategorien nach Produktanzahl
  return categories
    .map(cat => ({
      ...cat,
      productCount: categoryProductCount[cat.id] || 0
    }))
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, 10)
})

// Computed - News
const newsCount = computed(() => {
  const news = newsStore.news
  return Array.isArray(news) ? news.length : 0
})

const activeNewsCount = computed(() => {
  const news = newsStore.news
  if (!Array.isArray(news)) return 0
  return news.filter(n => n.isActive === 1 || n.isActive === "1" || n.isActive === true).length
})

const inactiveNewsCount = computed(() => {
  const news = newsStore.news
  if (!Array.isArray(news)) return 0
  return news.filter(n => n.isActive === 0 || n.isActive === "0" || n.isActive === false).length
})

// Computed - Exhibitions
const exhibitionsCount = computed(() => {
  const exhibitions = exhibitionsStore.exhibitions
  return Array.isArray(exhibitions) ? exhibitions.length : 0
})

const upcomingExhibitions = computed(() => {
  const exhibitions = exhibitionsStore.exhibitions
  if (!Array.isArray(exhibitions)) return 0
  const now = new Date()
  return exhibitions.filter(e => {
    if (!e.start_date) return false
    return new Date(e.start_date) > now
  }).length
})

const pastExhibitions = computed(() => {
  const exhibitions = exhibitionsStore.exhibitions
  if (!Array.isArray(exhibitions)) return 0
  const now = new Date()
  return exhibitions.filter(e => {
    if (!e.end_date) return false
    return new Date(e.end_date) < now
  }).length
})

// Computed - Contact
const unreadContactRequests = computed(() => {
  const requests = contactStore.contactRequests
  if (!Array.isArray(requests)) return 0
  return requests.filter(
    req => req.isRead === false || req.isRead === 0 || req.isRead === "0"
  ).length
})

// Computed - Totals
const totalContent = computed(() => {
  return productsCount.value + newsCount.value + exhibitionsCount.value
})

const totalActive = computed(() => {
  return activeProductsCount.value + activeNewsCount.value + exhibitionsCount.value
})

const totalInactive = computed(() => {
  return inactiveProductsCount.value + inactiveNewsCount.value
})

// Methods
async function loadData() {
  isLoading.value = true
  hasError.value = false

  try {
    await Promise.all([
      exhibitionsStore.fetchExhibitions().catch(e => console.error('Exhibitions error:', e)),
      newsStore.fetchNews().catch(e => console.error('News error:', e)),
      contactStore.getContactRequests().catch(e => console.error('Contact error:', e)),
      productStore.loadAllProducts().catch(e => console.error('Products error:', e)),
      categoryStore.loadAllCategories().catch(e => console.error('Categories error:', e))
    ])

    hasLoadedOnce.value = true

    console.log('✅ Dashboard geladen:', {
      produkte: productsCount.value,
      aktiv: activeProductsCount.value,
      inaktiv: inactiveProductsCount.value,
      kategorien: categoriesCount.value,
      news: newsCount.value,
      ausstellungen: exhibitionsCount.value,
      ungelesen: unreadContactRequests.value
    })
  } catch (error) {
    console.error('❌ Dashboard Fehler:', error)
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