<template>
  <div class="bg-gray-300 min-h-screen font-sans selection:bg-gray-800 selection:text-white">
    <nav class="max-w-7xl mx-auto px-6 py-10">
      <button
        @click="router.push({ name: 'categories' })"
        class="group flex items-center text-xs font-bold tracking-[0.2em] text-gray-600 hover:text-gray-900 transition-all uppercase"
      >
        <span class="mr-3 transform group-hover:-translate-x-2 transition-transform duration-300">←</span>
        Zurück zur Übersicht
      </button>
    </nav>

    <header class="max-w-7xl mx-auto px-6 mb-20">
      <div class="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-400 pb-10">
        <div class="space-y-2">
          <span class="text-gray-500 font-medium tracking-[0.3em] text-[10px] uppercase block">Portfolio</span>
          <h1 class="text-5xl md:text-8xl font-serif font-bold text-gray-800 leading-none">
            {{ currentCategoryName }}
          </h1>
        </div>
        <div class="mt-6 md:mt-0 text-left md:text-right">
          <p class="text-gray-600 max-w-sm font-light leading-relaxed italic">
            "Kunst gibt nicht das Sichtbare wieder, sondern macht sichtbar."
          </p>
          <div class="h-1 w-20 bg-gray-800 mt-4 ml-auto hidden md:block"></div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 pb-32">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
        <div
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          class="group cursor-pointer relative"
          @click="openModal(index)"
        >
          <div class="aspect-[3/4] overflow-hidden relative bg-gray-400 shadow-xl transition-all duration-700 ease-in-out group-hover:shadow-2xl group-hover:-translate-y-2">
            <img
              :src="product.image"
              :alt="product.title"
              class="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.2, 1, 0.2, 1) group-hover:scale-110"
            />

            <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div class="absolute inset-4 border border-white/20 pointer-events-none transition-transform duration-700 scale-95 group-hover:scale-100"></div>

              <div class="absolute bottom-0 left-0 right-0 p-8 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 backdrop-blur-md bg-black/30 border-t border-white/10">
                <p class="text-white font-serif text-2xl mb-1 tracking-wide">{{ product.title }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-white/60 text-[10px] tracking-[0.3em] uppercase">Werk Details</span>
                  <span class="text-white/30 font-mono text-[10px]">/ 0{{ index + 1 }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-5 flex justify-between items-center transition-opacity duration-300 group-hover:opacity-0">
            <h3 class="text-gray-800 font-bold text-lg tracking-tight">{{ product.title }}</h3>
            <div class="h-[1px] flex-grow mx-4 bg-gray-400"></div>
            <span class="text-gray-500 font-mono text-xs">0{{ index + 1 }}</span>
          </div>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0" class="text-center py-40 border-2 border-dashed border-gray-400 rounded-sm">
        <p class="text-gray-500 font-light tracking-widest uppercase text-sm">Diese Galerie wird zurzeit kuratiert.</p>
      </div>
    </main>

    <transition name="gallery-fade">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 bg-gray-900/98 z-[100] flex flex-col md:flex-row overflow-hidden backdrop-blur-xl"
        @click.self="closeModal"
      >
        <button
          @click="closeModal"
          class="absolute top-8 right-8 z-[110] text-white/50 hover:text-white hover:rotate-90 transition-all duration-500"
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div class="w-full md:w-3/4 h-[55vh] md:h-full flex items-center justify-center p-6 md:p-20">
          <div class="relative group/modal">
            <img
              :src="currentImage.image"
              :alt="currentImage.title"
              class="max-w-full max-h-[85vh] object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] animate-image-in border border-white/5"
            />
          </div>
        </div>

        <div class="w-full md:w-1/4 h-full flex flex-col justify-center p-10 md:p-16 bg-zinc-900 text-white border-l border-white/5">
          <div class="space-y-8">
            <div>
              <span class="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block">Ausstellung</span>
              <h2 class="text-4xl md:text-5xl font-serif font-bold leading-tight mb-6">{{ currentImage.title }}</h2>
              <div class="h-1 w-12 bg-white/20"></div>
            </div>

            <p class="text-gray-400 leading-relaxed font-light text-lg italic">
              "{{ currentImage.description }}"
            </p>

            <div class="pt-10">
               <span class="text-[10px] text-gray-600 uppercase tracking-widest block mb-1">Kategorie</span>
               <span class="text-sm text-gray-300">{{ currentImage.category_id?.name }}</span>
            </div>

            <div v-if="filteredProducts.length > 1" class="flex items-center justify-between pt-12 mt-12 border-t border-white/10">
              <button @click="prevImage" class="group flex items-center gap-4 text-[10px] font-black tracking-[0.2em] hover:text-white transition text-gray-600">
                <span class="group-hover:-translate-x-2 transition-transform duration-300">PREV</span>
              </button>
              <span class="font-mono text-[10px] text-gray-700">{{ currentIndex + 1 }} / {{ filteredProducts.length }}</span>
              <button @click="nextImage" class="group flex items-center gap-4 text-[10px] font-black tracking-[0.2em] hover:text-white transition text-gray-600">
                <span class="group-hover:translate-x-2 transition-transform duration-300">NEXT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "@/stores/Products";
import { useCategoryStore } from "@/stores/Categories";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const categoryStore = useCategoryStore();

const isModalOpen = ref(false);
const currentIndex = ref(0);

// Filterung der Produkte nach der Kategorie-ID aus der URL
const filteredProducts = computed(() => {
  const catId = route.params.categoryId;
  return productStore.products?.data?.filter(p =>
    p.isActive && String(p.category_id.id) === String(catId)
  ) || [];
});

// Namen der Kategorie für das Header-Design
const currentCategoryName = computed(() => {
  const category = categoryStore.categories.find(c => String(c.id) === String(route.params.categoryId));
  return category ? category.name : "Galerie";
});

const currentImage = computed(() => filteredProducts.value[currentIndex.value] || {});

const openModal = (index) => {
  currentIndex.value = index;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = 'auto';
};

const prevImage = () => {
  currentIndex.value = (currentIndex.value - 1 + filteredProducts.value.length) % filteredProducts.value.length;
};

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % filteredProducts.value.length;
};

onMounted(() => {
  // Daten laden, falls der Store leer ist
  productStore.loadAllProducts("", "", "");
  if (categoryStore.categories.length === 0) {
    categoryStore.loadAllCategories();
  }
});
</script>

<style scoped>
/* Gallery Modal Transitions */
.gallery-fade-enter-active, .gallery-fade-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.gallery-fade-enter-from, .gallery-fade-leave-to {
  opacity: 0;
}

/* Spezial-Reveal Animation für das Bild im Modal */
.animate-image-in {
  animation: artReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes artReveal {
  from {
    opacity: 0;
    transform: translateY(40px) scale(1.05);
    filter: blur(15px) grayscale(0.5);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0) grayscale(0);
  }
}

/* Typography */
.font-serif {
  font-family: 'Playfair Display', 'Georgia', serif;
}

/* Smooth Scrolling für das Modal-Paneel auf Mobile */
.overflow-y-auto {
  -webkit-overflow-scrolling: touch;
}
</style>