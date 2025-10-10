<template>
  <div class="bg-gray-50 p-6">
    <!-- Titel / Intro -->
    <section class="text-center mb-12">
      <h1 class="text-4xl sm:text-5xl font-serif font-bold text-gray-800 mb-4">
        Werke
      </h1>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Eine Auswahl an Arbeiten, die Farbe, Ausdruck und Identität erkunden.
      </p>
    </section>

    <!-- Galerie Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      <div
        v-for="(product, index) in activeProducts"
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

      <div v-if="activeProducts.length === 0" class="text-center text-gray-500 py-20 col-span-full">
        Keine aktiven Werke vorhanden.
      </div>
    </section>

    <!-- Modal -->
    <transition name="fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fadeIn">
          <!-- Close Button über dem Bild -->
          <button
            class="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-70 px-3 py-1 rounded-full text-2xl font-bold transition z-10"
            @click="closeModal"
            aria-label="Schließen"
          >
            ✕
          </button>

          <!-- Inhalt -->
          <div class="flex flex-col md:flex-row">
            <!-- Bild -->
            <div class="md:w-1/2 bg-black flex items-center justify-center p-4 relative">
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

              <div v-if="activeProducts.length > 1" class="flex justify-between mt-8">
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

const productStore = useProductStore();
const isModalOpen = ref(false);
const currentIndex = ref(0);

const activeProducts = computed(() => {
  return productStore.products?.data?.filter(p => p.is_active) || [];
});

const currentImage = computed(() => {
  if (activeProducts.value.length === 0) return {};
  return activeProducts.value[currentIndex.value];
});

const openModal = (index) => {
  currentIndex.value = index;
  isModalOpen.value = true;
};

const closeModal = () => (isModalOpen.value = false);

const prevImage = () => {
  if (activeProducts.value.length <= 1) return;
  currentIndex.value = (currentIndex.value - 1 + activeProducts.value.length) % activeProducts.value.length;
};

const nextImage = () => {
  if (activeProducts.value.length <= 1) return;
  currentIndex.value = (currentIndex.value + 1) % activeProducts.value.length;
};

onMounted(() => {
  productStore.loadAllProducts("", "", "");
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
