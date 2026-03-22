<template>
  <div class="bg-gray-300 min-h-screen">
    <div class="relative w-full mt-3">
      <div class="mx-auto py-16 text-center px-6">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
          Gesichter, Farbe, Identität – Kunst zwischen Realität und Traum
        </h1>
        <img
          src="stage_image.jpg"
          alt="Kunstwerk Beispielbild"
          class="mx-auto rounded-2xl shadow-2xl border border-gray-200 hover:shadow-3xl transition-all duration-500 hover:scale-105 max-w-4xl w-full"
        />
      </div>
    </div>

    <div class="mx-auto py-12 px-6 max-w-7xl">
      <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-10">
        Kategorien
      </h2>

      <div v-if="categoryStore.loading" class="flex flex-col items-center justify-center py-20">
        <Loader2 class="w-12 h-12 text-gray-600 animate-spin mb-3" />
        <p class="text-gray-600 font-medium">Lade Kategorien...</p>
      </div>

      <div
        v-else-if="categoryStore.categories && categoryStore.categories.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        <div
          v-for="(category, index) in categoryStore.categories"
          :key="category.id"
          @click="goToCategory(category)"
          class="group cursor-pointer rounded-xl overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-500 h-64"
          :style="`animation: fadeInUp 0.5s ease-out ${index * 0.1}s both`"
        >
          <div class="absolute inset-0 bg-black">
            <img
              v-if="category.image"
              :src="getCategoryImageUrl(category.image)"
              :alt="category.name"
              class="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-80"
            />
            <div v-else class="w-full h-full bg-gray-400 group-hover:bg-gray-500 transition-colors"></div>
          </div>

          <div class="relative h-full flex items-center justify-center">
            <h3 class="text-center text-2xl sm:text-3xl font-bold text-white drop-shadow-lg transition-all duration-300 group-hover:scale-110">
              {{ category.name }}
            </h3>
          </div>
        </div>
      </div>

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
import { Loader2, Package } from 'lucide-vue-next'

const router = useRouter()
const categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.loadAllCategories()
})

const goToCategory = (category) => {
  // Wir übergeben die ID an die URL
  router.push({ name: 'worksDetailPage', params: { categoryId: category.id } })
}

const getCategoryImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  return `${baseUrl}/storage/${imagePath.replace(/^\//, '')}`
}
</script>