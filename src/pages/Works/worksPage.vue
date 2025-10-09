<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Titel / Intro -->
    <section class="max-w-6xl mx-auto px-6 py-16 text-center">
      <h1 class="text-4xl sm:text-5xl font-serif font-bold text-gray-800 mb-4">
        Werke von Thorsten Kasel
      </h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Eine Auswahl von Arbeiten, die Farbe, Ausdruck und Identität neu entdecken.
      </p>
    </section>

    <!-- Galerie Grid -->
    <section class="max-w-6xl mx-auto px-6 pb-16">
      <div
        v-if="productStore.products?.data && productStore.products.data.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        <div
          v-for="(product, index) in productStore.products.data"
          :key="product.id"
          class="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
          @click="openModal(index)"
        >
          <img
            :src="product.image"
            :alt="product.title"
            class="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
          />
          <div class="p-4 bg-white">
            <h2 class="font-semibold text-gray-800 text-lg mb-1">{{ product.title }}</h2>
            <p class="text-gray-500 text-sm line-clamp-2">{{ product.description }}</p>
            <p class="text-gray-400 text-xs mt-1">Kategorie: {{ product.category_id.name }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 py-20">
        Keine Werke vorhanden
      </div>
    </section>

    <!-- Modal -->
    <transition name="fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        @click.self="closeModal"
      >
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fadeIn"
        >
          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold transition"
            @click="closeModal"
            aria-label="Schließen"
          >
            ✕
          </button>

          <!-- Inhalt -->
          <div class="flex flex-col md:flex-row">
            <!-- Bild -->
            <div class="md:w-1/2 bg-black flex items-center justify-center p-4">
              <img
                :src="currentImage.image"
                :alt="currentImage.title"
                class="object-contain max-h-[80vh] w-full rounded-lg"
              />
            </div>

            <!-- Beschreibung -->
            <div class="md:w-1/2 p-6 flex flex-col justify-center">
              <h2 class="text-2xl font-bold text-gray-800 mb-3">{{ currentImage.title }}</h2>
              <p class="text-gray-600 leading-relaxed">{{ currentImage.description }}</p>
              <p class="text-gray-400 mt-2">Kategorie: {{ currentImage.category_id.name }}</p>

              <div v-if="productStore.products?.data.length > 1" class="flex justify-between mt-8">
                <button
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  @click.stop="prevImage"
                >
                  ◀ Vorheriges
                </button>
                <button
                  class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  @click.stop="nextImage"
                >
                  Nächstes ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/stores/Products";
import { useRoute } from "vue-router"

const route = useRoute()
const productStore = useProductStore();
const isModalOpen = ref(false);
const currentIndex = ref(0);

const currentImage = computed(() => {
  if (!productStore.products?.data || productStore.products.data.length === 0) return {};
  return productStore.products.data[currentIndex.value];
});

const openModal = (index) => {
  currentIndex.value = index;
  isModalOpen.value = true;
};
const closeModal = () => (isModalOpen.value = false);

const prevImage = () => {
  if (!productStore.products?.data || productStore.products.data.length <= 1) return;
  currentIndex.value =
    (currentIndex.value - 1 + productStore.products.data.length) %
    productStore.products.data.length;
};
const nextImage = () => {
  if (!productStore.products?.data || productStore.products.data.length <= 1) return;
  currentIndex.value = (currentIndex.value + 1) % productStore.products.data.length;
};

// Produkte beim Mount laden
onMounted(() => {
  productStore.loadAllProducts("", route.params.categoryId, "");
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-fadeIn {
  animation: fadeIn 0.35s ease-out;
}
@keyframes fadeIn {
  from {
    transform: translateY(15px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
