<template>
  <div class="bg-gray-300 min-h-screen">
    <!-- Hero / Slogan -->
    <div class="relative w-full">
      <div class="mx-auto py-8 sm:py-12 text-center px-4 sm:px-6 max-w-6xl">
        <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 sm:mb-8 leading-tight px-4">
          Gesichter, Farbe, Identität – Kunst zwischen Realität und Traum
        </h1>
        <div class="relative max-w-4xl mx-auto">
          <img
            src="/thorsten-kasel_uni.jpg"
            alt="Thorsten Kasel bei der Arbeit an einem großformatigen Gemälde"
            class="mx-auto rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] w-full h-[400px] object-cover"
          />
        </div>
      </div>
    </div>

    <!-- Kategorien -->
    <div class="mx-auto py-8 sm:py-12 px-4 sm:px-6 max-w-7xl">
      <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 text-center mb-8 sm:mb-10">
        Kategorien
      </h2>

      <!-- Loading State -->
      <div v-if="categoryStore.loading" class="flex flex-col items-center justify-center py-16 sm:py-20">
        <Loader2 class="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 animate-spin mb-3" />
        <p class="text-gray-600 font-medium text-sm sm:text-base">Lade Kategorien...</p>
      </div>

      <!-- Kategorien Grid -->
      <div
        v-else-if="categoryStore.categories && categoryStore.categories.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        <div
          v-for="(category, index) in categoryStore.categories"
          :key="category.id"
          @click="goToCategory(category.id)"
          class="group cursor-pointer rounded-xl overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[200px] sm:min-h-[240px]"
          :style="`animation: fadeInUp 0.5s ease-out ${index * 0.1}s both`"
        >
          <!-- Hintergrundbild -->
          <div class="absolute inset-0">
            <!-- Kategorie-Bild als Hintergrund -->
            <img
              v-if="category.image"
              :src="getCategoryImageUrl(category.image)"
              :alt="category.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              @error="handleImageError"
            />
            <!-- Fallback Grau wenn kein Bild -->
            <div
              v-else
              class="w-full h-full bg-gray-200 group-hover:bg-gray-300 transition-colors"
            ></div>

            <!-- Overlay für bessere Lesbarkeit -->
            <div
              v-if="category.image"
              class="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"
            ></div>
          </div>

          <!-- Content -->
          <div class="relative flex items-center justify-center h-full min-h-[200px] sm:min-h-[240px]">
            <h3
              class="text-center text-xl sm:text-2xl md:text-3xl font-medium px-6 py-8 transition-all duration-300 group-hover:translate-y-[-4px] drop-shadow-lg"
              :class="category.image ? 'text-white' : 'text-gray-900 group-hover:text-gray-800'"
            >
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Keine Kategorien -->
      <div v-else class="text-center py-16 sm:py-20">
        <div class="bg-white rounded-2xl shadow-md p-8 sm:p-12 max-w-md mx-auto">
          <Package class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-400 italic text-base sm:text-lg">Keine Kategorien vorhanden</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/Categories'
import { useProductStore } from '@/stores/Products'
import { Loader2, Package } from 'lucide-vue-next'

const router = useRouter()
const categoryStore = useCategoryStore()
const productStore = useProductStore()

// Mounted
onMounted(() => {
  categoryStore.loadAllCategories()
})

// Methoden
const goToCategory = (categoryId) => {
  productStore.loadAllProducts('', categoryId, '')
  router.push({ name: 'worksDetailPage', params: { categoryId } })
}

const getCategoryImageUrl = (imagePath) => {
  if (!imagePath) return ''

  // Falls bereits vollständige URL
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // Falls relativer Pfad vom Backend
  // Passe den Base-Path an deine API-Struktur an
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

  // Entferne führenden Slash falls vorhanden
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath

  return `${baseUrl}/storage/${cleanPath}`
}

const handleImageError = (event) => {
  // Bei Fehler: Zeige Fallback-Gradient
  event.target.style.display = 'none'
  console.warn('Kategorie-Bild konnte nicht geladen werden:', event.target.src)
}
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

/* Hover-Effekt für Kategorien */
.group:hover h3 {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
}

/* Smooth Scroll */
html {
  scroll-behavior: smooth;
}
</style>