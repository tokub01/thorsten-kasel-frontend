<template>
  <div class="p-6">
    <button
      @click="goBack"
      class="flex items-center text-white border border-white mb-5 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-600 hover:cursora-pointer transition-colors"
    >
      <!-- Pfeil Icon -->
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path>
      </svg>
      Zurück
    </button>
    <!-- Galerie Grid -->
    <div v-if="productStore.products" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div v-for="(product, index) in productStore.products" :key="product.id" class="cursor-pointer overflow-hidden rounded-lg" @click="openModal(index)">
        <img :src="product[0].image" alt="" class="w-full border border-gray-300 hover:border-white shadow-md hover:shadow-2xl transition-all duration-300 h-48 object-cover hover:scale-105" />
      </div>
    </div>

    <div v-else class="text-gray-500">Keine Bilder vorhanden</div>

    <!-- Modal -->
    <transition name="fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-xl max-w-3xl w-full p-6 relative flex flex-col items-center">
          <button
            class="hover:cursor-pointer absolute top-3 right-3 text-white bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 shadow-lg text-3xl font-bold z-50"
            @click="closeModal"
          >
            ✕
          </button>

          <div class="relative w-full flex items-center justify-center">
            <img
              :src="currentImage.image"
              alt=""
              class="max-h-[60vh] object-contain rounded"
            />

            <template v-if="productStore.products.length > 1">
              <button
                class=" absolute left-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 text-2xl"
                @click.stop="prevImage"
              >
                ◀
              </button>

              <button
                class="absolute right-0 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 text-2xl"
                @click.stop="nextImage"
              >
                ▶
              </button>
            </template>
          </div>

          <h2 class="text-xl font-bold mt-4 text-center">{{ currentImage.title }}</h2>
          <p class="text-gray-700 mt-2 text-center">{{ currentImage.description }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useProductStore } from "@/stores/Products";
import { useRouter } from "vue-router"

const productStore = useProductStore();
const router = useRouter();
const isModalOpen = ref(false);
const currentIndex = ref(0);

// Aktuelles Bild (Produkt) aus products
const currentImage = computed(() => {
  if (!productStore.products || productStore.products.length === 0) return {};
  return productStore.products[currentIndex.value][0];
});

const openModal = (index) => {
  currentIndex.value = index;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

// Carousel-Funktionalität: Looping durch Bilder
const prevImage = () => {
  if (!productStore.products || productStore.products.length <= 1) return;
  currentIndex.value =
    (currentIndex.value - 1 + productStore.products.length) % productStore.products.length;
};

const goBack = ()  => {
    router.push("/")
}

const nextImage = () => {
  if (!productStore.products || productStore.products.length <= 1) return;
  currentIndex.value = (currentIndex.value + 1) % productStore.products.length;
};

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
