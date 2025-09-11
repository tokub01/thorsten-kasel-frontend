<template>
  <div class="p-5">
    <div class="flex justify-between mb-3">
      <button @click="page = 1" v-if="page===0" class="border p-3 hover:bg-gray-500 hover:cursor-pointer">Neu</button>
      <form v-if="page===0">
        <select v-model="sort" class="border p-3 mr-2">
          <option value="">Bitte wählen...</option>
          <option value="newest">
            Neuester zuerst...
          </option>
          <option value="oldest">
            Älteste zuerst...
          </option>
        </select>
        <select v-model="selectedCategory" class="border p-3 mr-2">
          <option value="">Bitte wählen...</option>
          <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
        <input v-model="keyword" class="border p-3" placeholder="Suche nach Titel" type="text"/>
      </form>
    </div>
    <div v-if="page===2">
      <button @click="page = 0" class="border p-3 hover:bg-gray-500 hover:cursor-pointer">Zurück</button>
      <form class="border p-3 my-3">
        <div class="text-3xl mb-3">
          Bild bearbeiten
        </div>
        <div class="flex flex-col mt-3">
          <label class="" for="title">Titel:</label>
          <input id="title" v-model="title" placeholder="Bitte Titel eingeben " class="border p-3" type="text"/>
        </div>
        <div class="flex flex-col mt-3">
          <label class="" for="description">Beschreibung:</label>
          <input id="description" v-model="description" placeholder="Bitte Beschreibung eingeben: " class="border p-3" type="text"/>
        </div>
        <div class="flex flex-col mt-3">
          <label class="" for="img_holder">Bilder:</label>
          <input @change="handleImage" class="border p-3" type="file"/>
        </div>
        <div class="flex flex-col mt-3 mb-3">
          <label for="categorySelection">Kategorien: </label>
          <select id="categorySelection" v-model="categorySelection" class="border p-3 mr-2">
            <option value="">Bitte wählen...</option>
            <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <button type="button" @click="storeImage" class="border p-3 mt-3 hover:bg-gray-500 hover:cursor-pointer">Senden</button>

      </form>
    </div>
    <div v-if="page===1">
      <div class="mb-3">
        <button @click="page = 0" class="border p-3 hover:bg-gray-500 hover:cursor-pointer">Zurück</button>
        <form class="border p-3 my-3">
          <div class="text-3xl mb-3">
            Neues Bild anlegen
          </div>
          <div class="flex flex-col mt-3">
            <label class="" for="title">Titel:</label>
            <input id="title" v-model="title" placeholder="Bitte Titel eingeben " class="border p-3" type="text"/>
          </div>
          <div class="flex flex-col mt-3">
            <label class="" for="description">Beschreibung:</label>
            <input id="description" v-model="description" placeholder="Bitte Beschreibung eingeben: " class="border p-3" type="text"/>
          </div>
          <div class="flex flex-col mt-3">
            <label class="" for="img_holder">Bilder:</label>
            <input @change="handleImage" class="border p-3" type="file"/>
          </div>
          <div class="flex flex-col mt-3 mb-3">
            <label for="categorySelection">Kategorien: </label>
            <select id="categorySelection" v-model="categorySelection" class="border p-3 mr-2">
              <option value="">Bitte wählen...</option>
              <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <button type="button" @click="storeImage" class="border p-3 mt-3 hover:bg-gray-500 hover:cursor-pointer">Senden</button>

        </form>
      </div>
    </div>
    <div v-if="page===0">
      <table>
        <thead>
          <tr>
            <th class="border p-3">Titel</th>
            <th class="border p-3">Beschreibung</th>
            <th class="border p-3">Kategorie</th>
            <th class="border p-3">Bild</th>
            <th class="border p-3">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.products?.data" :key="product.id">
            <td class="border p-3">{{product.title}}</td>
            <td class="border p-3">{{product.description}}</td>
            <td class="border p-3">{{product.category_id.name}}</td>
            <td class="border p-3"><img :src="product.image"/></td>
            <td class="border p-3">
              <button class="hover:underline hover:cursor-pointer"> Löschen </button>
              <button @click="openEditPage(product.title, product.description, product.image, product.category_id)" class="hover:underline hover:cursor-pointer"> Bearbeiten </button>
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

  import { useProductStore } from '@/stores/Products'
  import { useCategoryStore } from '@/stores/Categories'

  const productStore = useProductStore();
  const categoryStore = useCategoryStore();
  
  let page = ref(0);
  let keyword = ref("");

  let sort = ref("newest");
  let selectedCategory = ref("");
  let title = ref("")
  let description = ref("")
  let imageSelection = ref(null)
  let categorySelection = ref(null)

  function openEditPage(title, description, image, category_id){
    this.title = title;
    this.description = description;
    this.image = image;
    console.log(category_id)
    this.categorySelection = category_id.id;
    this.page = 2
  }
  function storeImage() {
    let formData = new FormData();
    formData.append("title", title.value)
    formData.append("description", description.value)
    formData.append("image", imageSelection.value)
    formData.append("category_id", categorySelection.value)
    productStore.storeProduct(formData)
    title.value = ""
    description.value = ""
    imageSelection.value = ""
    categorySelection.value = ""
    page.value = 0
  }
  function handleImage(event) {
    imageSelection.value = event.target.files[0];
  }

  onMounted(() => {
    categoryStore.loadAllCategories();
    loadProducts();
  });

  function loadProducts() {
    productStore.loadAllProducts(keyword.value, selectedCategory.value, sort.value);
  }

  watch([keyword, selectedCategory, sort], () => {
    loadProducts();
  });
</script>

<style scoped>


</style>