<template>
  <div class="bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header & Aktionen -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 class="text-4xl font-serif font-bold text-gray-800">Bilder</h1>
        <div class="flex flex-wrap gap-3">
          <button
            v-if="page===0"
            @click="page = 1"
            class="bg-gray-800 text-white px-5 py-2 rounded-lg hover:bg-gray-700 shadow transition"
          >
            + Neues Bild
          </button>
        </div>
      </div>

      <!-- Tabellenansicht -->
      <div v-if="page === 0" class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-x-auto">
        <table class="min-w-full text-left">
          <thead class="bg-gray-100 text-gray-700 uppercase text-sm tracking-wider">
            <tr>
              <th class="px-6 py-3">Titel</th>
              <th class="px-6 py-3">Beschreibung</th>
              <th class="px-6 py-3">Kategorie</th>
              <th class="px-6 py-3 text-center">Aktiv</th>
              <th class="px-6 py-3">Bild</th>
              <th class="px-6 py-3 text-center">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in productStore.products?.data" :key="product.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-3 text-gray-800">{{ product.title }}</td>
              <td class="px-6 py-3 text-gray-600">{{ product.description }}</td>
              <td class="px-6 py-3 text-gray-700">{{ product.category_id.name }}</td>
              <td class="px-6 py-3 text-center">
                <span
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ product.is_active ? 'Ja' : 'Nein' }}
                </span>
              </td>
              <td class="px-6 py-3">
                <img :src="product.image" class="w-24 h-24 object-cover rounded shadow-sm"/>
              </td>
              <td class="px-6 py-3 flex justify-center gap-2">
                <button @click="openEditPage(product)" class="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition">
                  Bearbeiten
                </button>
                <button @click="deleteProduct(product.id)" class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                  Löschen
                </button>
              </td>
            </tr>
            <tr v-if="!productStore.products?.data || productStore.products.data.length === 0">
              <td colspan="6" class="text-center py-6 text-gray-500 italic">Keine Produkte vorhanden.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Neues / Bearbeiten Formular -->
      <transition name="fade">
        <div v-if="page===1 || page===2" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div class="bg-white rounded-xl shadow-md max-w-lg w-full p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-800">
                {{ page===1 ? 'Neues Bild anlegen' : 'Bild bearbeiten' }}
              </h2>
              <button @click="page=0" class="text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
            </div>

            <form @submit.prevent="page===1 ? storeImage() : updateImage()" class="space-y-4">
              <div class="flex flex-col">
                <label for="title" class="text-gray-700 font-medium mb-1">Titel</label>
                <input id="title" v-model="title" type="text" placeholder="Titel eingeben"
                       class="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-gray-400 focus:outline-none" required/>
              </div>

              <div class="flex flex-col">
                <label for="description" class="text-gray-700 font-medium mb-1">Beschreibung</label>
                <input id="description" v-model="description" type="text" placeholder="Beschreibung eingeben"
                       class="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-gray-400 focus:outline-none"/>
              </div>

              <div class="flex flex-col">
                <label for="img_holder" class="text-gray-700 font-medium mb-1">Bild auswählen</label>
                <input @change="handleImage" type="file" class="border border-gray-300 rounded p-3"/>
              </div>

              <div class="flex flex-col">
                <label for="categorySelection" class="text-gray-700 font-medium mb-1">Kategorie</label>
                <select id="categorySelection" v-model="categorySelection" class="border border-gray-300 rounded p-3">
                  <option value="">Bitte wählen...</option>
                  <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </div>

              <div class="flex items-center gap-3">
                <input type="checkbox" id="isActive" v-model="isActive" class="w-4 h-4"/>
                <label for="isActive" class="text-gray-700 font-medium">Aktiv</label>
              </div>

              <div class="flex justify-end gap-3 pt-3 border-t">
                <button type="button" @click="page=0" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition">Abbrechen</button>
                <button type="submit" class="px-5 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition">
                  {{ page===1 ? 'Anlegen' : 'Speichern' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useProductStore } from '@/stores/Products'
import { useCategoryStore } from '@/stores/Categories'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

const page = ref(0)
const title = ref('')
const description = ref('')
const imageSelection = ref(null)
const categorySelection = ref(null)
const isActive = ref(true)
const sort = ref('newest')
const selectedCategory = ref('')
const keyword = ref('')

function handleImage(event) {
  imageSelection.value = event.target.files[0]
}

function openEditPage(product) {
  title.value = product.title
  description.value = product.description
  imageSelection.value = null
  categorySelection.value = product.category_id.id
  isActive.value = product.is_active
  page.value = 2
}

async function storeImage() {
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('image', imageSelection.value)
  formData.append('category_id', categorySelection.value)
  formData.append('is_active', isActive.value)
  await productStore.storeProduct(formData)
  resetForm()
}

async function updateImage() {
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  if(imageSelection.value) formData.append('image', imageSelection.value)
  formData.append('category_id', categorySelection.value)
  formData.append('is_active', isActive.value)
  await productStore.updateProduct(formData)
  resetForm()
}

async function deleteProduct(id) {
  if(!confirm('Produkt wirklich löschen?')) return
  await productStore.deleteProduct(id)
}

function resetForm() {
  title.value = ''
  description.value = ''
  imageSelection.value = null
  categorySelection.value = null
  isActive.value = true
  page.value = 0
  loadProducts()
}

function loadProducts() {
  productStore.loadAllProducts(keyword.value, selectedCategory.value, sort.value)
}

onMounted(() => {
  categoryStore.loadAllCategories()
  loadProducts()
})

watch([keyword, selectedCategory, sort], () => {
  loadProducts()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
