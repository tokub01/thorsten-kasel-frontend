<template>
  <div class="bg-gray-100 min-h-screen">
    <!-- Hero / Slogan -->
    <div class="relative w-full bg-gray-100">
      <div class="mx-auto py-16 text-center px-6">
        <h1 class="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-6">
          Gesichter, Farbe, Identität – Kunst zwischen Realität und Traum
        </h1>
        <img
          src="https://placeholdit.com/800x400/dddddd/999999"
          alt="Beispielbild"
          class="mx-auto rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl transition"
        />
      </div>
    </div>

    <!-- Kategorien -->
    <div class="mx-auto py-12 px-6">
      <h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 text-center mb-10">
        Kategorien
      </h2>

      <div
        v-if="categoryStore.categories && categoryStore.categories.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
      >
        <div
          v-for="category in categoryStore.categories"
          :key="category.id"
          @click="goToCategory(category.id)"
          class="group cursor-pointer rounded-xl overflow-hidden relative shadow-md hover:shadow-lg transition"
        >
          <div class="absolute inset-0 bg-gray-200 group-hover:bg-gray-300 transition-opacity"></div>
          <h3 class="relative text-center text-2xl sm:text-3xl font-medium text-gray-900 group-hover:text-gray-800 py-24">
            {{ category.name }}
          </h3>
        </div>
      </div>

      <div v-else class="text-center text-gray-400 italic py-20">
        Keine Kategorien vorhanden
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoryStore } from '@/stores/Categories'
import { useProductStore } from '@/stores/Products'

const router = useRouter()
const categoryStore = useCategoryStore()
const productStore = useProductStore()

onMounted(() => {
  categoryStore.loadAllCategories()
})

const goToCategory = (categoryId) => {
  productStore.loadAllProducts('', categoryId, '')
  router.push({ name: 'worksDetailPage', params: { categoryId } })
}
</script>

<style scoped>
.group:hover h3 {
  transform: translateY(-4px);
  transition: transform 0.3s ease;
}
</style>
