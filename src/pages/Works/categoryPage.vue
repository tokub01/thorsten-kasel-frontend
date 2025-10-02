<template>
  <div class="">
    <div>

    </div>
    <div class="px-6 my-10 items-center flex flex-col">
      <div>
        <div class="flex justify-center items-center mt-3 text-2xl sm:text-3xl text-center  text-white my-10">
          Gesichter, Farbe, Identität - Kunst zwischen Realität und Traum
        </div>
        <div class="flex justify-center my-5 overflow-hidden rounded-lg mt-3">
          <img src="https://place-hold.it/300x300" alt="" class="border border-gray-300 hover:border-white shadow-md hover:shadow-2xl transition-all duration-300 object-cover" />
        </div>
      </div>
    </div>
      <div class="text-white text-3xl flex justify-center mt-3">
        Kategorien
      </div>
    <div
      v-if="categoryStore.categories && categoryStore.categories.length > 0"
      class="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-6xl mx-auto px-6 py-5"
    >

      <!-- Kategorie -->
      <div
        v-for="category in categoryStore.categories"
        :key="category.id"
        @click="goToCategory(category.id)"
        class="group cursor-pointer h-[28rem] flex items-center justify-center border border-gray-300 hover:border-white shadow-md hover:shadow-2xl transition-all duration-300"
      >
        <h2
          class="text-2xl md:text-3xl font-light text-gray-100 group-hover:text-white text-center"
        >
          {{ category.name }}
        </h2>
      </div>
    </div>

    <div v-else class="text-center text-xl text-gray-200 italic py-20">
      Keine Kategorien vorhanden
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCategoryStore } from "@/stores/Categories";
import { useProductStore } from "@/stores/Products"

const router = useRouter();
const categoryStore = useCategoryStore();
const productStore = useProductStore();

onMounted(() => {
  categoryStore.loadAllCategories();
});

const goToCategory = (categoryId) => {
  productStore.loadAllProducts("", categoryId, "");
  router.push({ name: "worksDetailPage", params: { categoryId } });

};
</script>
