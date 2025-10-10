<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Titel / Intro -->
    <section class="px-6 py-16 text-center">
      <h1 class="text-4xl sm:text-5xl font-serif font-bold text-gray-800 mb-4">Werke</h1>
      <p class="text-gray-600 mb-8">Eine Auswahl von Arbeiten, die Farbe, Ausdruck und Identität neu entdecken.</p>
    </section>

    <!-- Galerie Grid -->
    <section class="px-6 pb-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div
        v-for="(product, index) in productStore.products?.data"
        :key="product.id"
        class="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition transform hover:-translate-y-1"
        @click="openModal(index)"
      >
        <img
          :src="product.image"
          :alt="product.title"
          class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div class="p-4 bg-white">
          <h2 class="font-semibold text-gray-800 mb-1">{{ product.title }}</h2>
          <p class="text-gray-500 text-sm line-clamp-2">{{ product.description }}</p>
          <p class="text-gray-400 text-xs mt-1">Kategorie: {{ product.category_id.name }}</p>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <transition name="fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex justify-center items-center p-4"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="closeModal"
        ></div>

        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-fadeIn z-10">
          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold transition"
            @click="closeModal"
            aria-label="Schließen"
          >
            ✕
          </button>

          <div class="flex flex-col md:flex-row">
            <!-- Bild -->
            <div class="md:w-1/2 bg-gray-100 flex items-center justify-center p-6 rounded-l-3xl">
              <img
                :src="currentImage.image"
                :alt="currentImage.title"
                class="object-contain max-h-[80vh] w-full rounded-xl shadow-lg"
              />
            </div>

            <!-- Beschreibung -->
            <div class="md:w-1/2 p-6 flex flex-col justify-between">
              <div>
                <h2 class="text-3xl font-bold text-gray-800 mb-3">{{ currentImage.title }}</h2>
                <p class="text-gray-600 leading-relaxed mb-2">{{ currentImage.description }}</p>
                <p class="text-gray-400 text-sm">Kategorie: {{ currentImage.category_id.name }}</p>
              </div>

              <!-- Navigation -->
              <div v-if="productStore.products?.data.length > 1" class="flex justify-between mt-6">
                <button
                  class="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
                  @click.stop="prevImage"
                >
                  ◀ Vorheriges
                </button>
                <button
                  class="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
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
import { useRoute } from "vue-router";

const route = useRoute();
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

onMounted(() => {
  productStore.loadAllProducts("", route.params.categoryId, "");
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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
