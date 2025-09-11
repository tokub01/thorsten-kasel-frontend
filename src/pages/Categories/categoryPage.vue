<template>
  <div class="p-5">
    <div class="flex justify-between mb-3">
      <button @click="page = 1" v-if="page===0" class="border p-3 hover:bg-gray-500 hover:cursor-pointer">Neu</button>
    </div>
    <div v-if="page===2">
      <button @click="page = 0" class="border p-3 hover:bg-gray-500 hover:cursor-pointer">Zurück</button>

      <form class="flex flex-col border my-3 p-3">
        <h1 class="text-2xl mb-3">Kategorie  {{ name }} aktualisieren</h1>
        <label for="categoryName">Name der Kategorie</label>
        <input id="categoryName" v-model="categoryName" class="border p-3" placeholder="Bitte Titel der Kategorie eingeben" type="text"/>
      </form>
      <button @click="updateCategory()" class="border p-3 hover:bg-gray-500 hover:cursor-pointer">Kategorie aktualisieren</button>
    </div>
    <div v-if="page===1">
      <button @click="page = 0" class="border p-3 hover:bg-gray-500 hover:cursor-pointer">Zurück</button>

      <form class="flex flex-col border my-3 p-3">
        <h1 class="text-2xl mb-3">Kategorie anlegen</h1>
        <label for="categoryName">Name der Kategorie</label>
        <input id="categoryName" v-model="categoryName" class="border p-3" placeholder="Bitte Titel der Kategorie eingeben" type="text"/>
      </form>
      <button @click="storeCategory()" class="border p-3 hover:bg-gray-500 hover:cursor-pointer">Kategorie anlegen</button>
    </div>
    <div v-if="page===0">
      <table>
        <thead>
        <tr>
          <th class="border p-3">Name</th>
          <th class="border p-3">Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="category in categoryStore.categories" :key="category.id">
          <td class="border p-3">{{category.name}}</td>
          <td class="flex flex-col border p-3">
            <button class="hover:underline hover:cursor-pointer"> Löschen </button>
            <button @click="openEditPage(category.name)" class="hover:underline hover:cursor-pointer"> Bearbeiten </button>
          </td>
        </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

import { useCategoryStore } from '@/stores/Categories'

const categoryStore = useCategoryStore();

let page = ref(0);

let name = ref("");

let categoryName = ref("");

function openEditPage(name){
  this.categoryName = ""
  this.name = name;
  this.page = 2
}
function storeCategory() {
  let formData = new FormData();
  formData.append("name", this.categoryName.value)
  categoryStore.storeProduct(formData)
  name.value = ""
  page.value = 0
}

function updateCategory() {
  let formData = new FormData();
  formData.append("name", this.categoryName.value)
  categoryStore.updateCategory(formData)
  name.value = ""
  page.value = 0
}

onMounted(() => {
  categoryStore.loadAllCategories();
});

function loadCategories() {
  categoryStore.loadAllCategories();
}

watch([name], () => {
  loadCategories();
});
</script>

<style scoped>


</style>