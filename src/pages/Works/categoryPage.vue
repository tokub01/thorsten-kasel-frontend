<template>
  <div class="bg-gray-300">
    <!-- Hero / Slogan -->
    <div class="relative w-full mt-3">
      <div class="mx-auto py-16 text-center px-6">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
          Gesichter, Farbe, Identität – Kunst zwischen Realität und Traum
        </h1>
        <img
          src="/thorsten-kasel_uni.png"
          width="800"
          height="auto"
          alt="Kunstwerk Beispielbild"
          class="mx-auto rounded-2xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500 hover:scale-105 max-w-4xl w-full"
        />
      </div>
    </div>

    <!-- Kategorien -->
    <div class="mx-auto py-12 px-6 max-w-7xl">
      <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-10">
        Kategorien
      </h2>

      <!-- Loading State -->
      <div v-if="categoryStore.loading" class="flex flex-col items-center justify-center py-20">
        <Loader2 class="w-12 h-12 text-gray-600 animate-spin mb-3" />
        <p class="text-gray-600 font-medium">Lade Kategorien...</p>
      </div>

      <!-- Kategorien Grid -->
      <div
        v-else-if="categoryStore.categories && categoryStore.categories.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        <div
          v-for="(category, index) in categoryStore.categories"
          :key="category.id"
          @click="goToCategory(category.id)"
          class="group cursor-pointer rounded-xl overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-500"
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
              class="w-full h-full bg-gray-200 group-hover:bg-gray-300 transition-opacity"
            ></div>
          </div>

          <!-- Content -->
          <div class="relative">
            <h3
              class="text-center text-2xl sm:text-3xl font-medium py-24 transition-all duration-300 group-hover:translate-y-[-4px]"
              :class="category.image ? 'text-white' : 'text-gray-900 group-hover:text-gray-800'"
            >
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Keine Kategorien -->
      <div v-else class="text-center py-20">
        <div class="bg-white rounded-2xl shadow-md p-12 max-w-md mx-auto">
          <Package class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-400 italic text-lg">Keine Kategorien vorhanden</p>
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
</style>