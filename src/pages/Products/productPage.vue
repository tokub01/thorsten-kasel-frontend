<template>
  <div class="bg-gray-300 p-6 min-h-screen">
    <div class="max-w-6xl mx-auto">

      <!-- Header & Filter -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 class="text-4xl font-serif font-bold text-gray-800">Produkte</h1>
        <div class="flex flex-wrap gap-3">
          <button
            @click="page=1"
            class="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 shadow transition"
          >
            + Neues Produkt
          </button>
          <select v-model="selectedCategory" class="border border-gray-300 rounded-lg px-3 py-2">
            <option value="">Alle Kategorien</option>
            <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
          <select v-model="filter" class="border border-gray-300 rounded-lg px-3 py-2">
            <option value="all">Alle</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
          </select>
          <input type="text" v-model="keyword" placeholder="Suche..." class="border border-gray-300 rounded-lg px-3 py-2"/>
        </div>
      </div>

      <!-- Lade- / Fehleranzeige -->
      <div v-if="productStore.loading" class="text-center text-gray-500 py-8">Lade Produkte...</div>
      <div v-else-if="productStore.error" class="text-center text-red-600 py-8">{{ productStore.error.message || 'Fehler beim Laden' }}</div>

      <!-- Kartenansicht -->
      <div v-else-if="filteredProducts.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in filteredProducts" :key="product.id" class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition relative">

          <!-- Bild & Details -->
          <img :src="product.image" alt="Produktbild" class="w-full h-48 object-cover"/>
          <div class="p-4 space-y-2">
            <h2 class="text-xl font-semibold text-gray-800">{{ product.title }}</h2>
            <p class="text-gray-600">{{ product.description }}</p>
            <p class="text-sm text-gray-500">{{ product.category_id?.name }}</p>
          </div>

          <!-- isActive Badge -->
          <span
            :class="product.isActive === 1
              ? 'absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700'
              : 'absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700'">
            {{ product.isActive === 1 ? 'Aktiv' : 'Inaktiv' }}
          </span>

          <!-- Aktionen -->
          <div class="absolute bottom-3 right-3 flex gap-2">
            <button @click.stop="openEditPage(product)" class="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition">Bearbeiten</button>
            <button @click.stop="deleteProduct(product.id, product.image)" class="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition">Löschen</button>
          </div>
        </div>
      </div>

      <!-- Keine Produkte -->
      <p v-else class="text-center text-gray-500 py-8">Keine Produkte vorhanden.</p>

      <!-- Neues / Bearbeiten Modal -->
      <transition name="fade">
        <div v-if="page===1 || page===2" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-800">{{ page===1 ? 'Neues Produkt' : 'Produkt bearbeiten' }}</h2>
              <button @click="page=0" class="text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
            </div>

            <!-- Bildvorschau -->
            <img v-if="imagePreview || imageSelectionPreview" :src="imageSelectionPreview || imagePreview" class="w-full h-48 object-cover rounded-lg mb-4"/>

            <form @submit.prevent="page===1 ? storeProduct() : updateProduct()" class="space-y-4">
              <div class="flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Titel</label>
                <input v-model="title" type="text" placeholder="Titel eingeben"
                       class="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-gray-300 focus:outline-none" required/>
              </div>

              <div class="flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Beschreibung</label>
                <input v-model="description" type="text" placeholder="Beschreibung eingeben"
                       class="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-gray-300 focus:outline-none"/>
              </div>

              <div class="flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Bild auswählen</label>
                <input type="file" @change="handleImage" class="border border-gray-300 rounded p-3"/>
              </div>

              <div class="flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Kategorie</label>
                <select v-model="categorySelection" class="border border-gray-300 rounded p-3">
                  <option value="">Bitte wählen...</option>
                  <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </div>

              <div class="flex items-center gap-3">
                <input type="checkbox" :checked="isActive===1" @change="isActive = $event.target.checked ? 1 : 0" class="w-4 h-4"/>
                <label class="text-gray-700 font-medium">Aktiv</label>
              </div>

              <div class="flex justify-end gap-3 pt-3 border-t">
                <button type="button" @click="page=0" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition">Abbrechen</button>
                <button type="submit" class="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">{{ page===1 ? 'Anlegen' : 'Speichern' }}</button>
              </div>
            </form>
          </div>
        </div>
      </transition>

      <!-- Toast Notifications -->
      <div class="fixed bottom-6 right-6 space-y-2 z-50">
        <div
          v-for="(toast, index) in toasts"
          :key="index"
          class="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow flex items-center justify-between min-w-[200px] transition-opacity"
        >
          {{ toast.message }}
          <button @click="removeToast(index)" class="ml-2 text-gray-800 font-bold">×</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useProductStore } from '@/stores/Products'
import { useCategoryStore } from '@/stores/Categories'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

// State
const page = ref(0)
const id = ref('')
const title = ref('')
const description = ref('')
const imageSelection = ref(null)
const imageSelectionPreview = ref(null)
const imagePreview = ref(null)
const categorySelection = ref(null)
const isActive = ref(1)
const selectedCategory = ref('')
const keyword = ref('')
const filter = ref('all')

// Toasts
const toasts = ref([])
const showToast = (message) => {
  toasts.value.push({ message })
  setTimeout(() => toasts.value.shift(), 3000)
}
const removeToast = (index) => toasts.value.splice(index, 1)

// Load data
const loadProducts = () => productStore.loadAllProducts(keyword.value, selectedCategory.value)
onMounted(() => {
  categoryStore.loadAllCategories()
  loadProducts()
})

// Watchers
watch([keyword, selectedCategory], loadProducts)

// Filtered Products
const filteredProducts = ref([])
watch([() => productStore.products, filter], () => {
  if (!productStore.products?.data) return
  filteredProducts.value = productStore.products.data.filter(p => {
    if (filter.value === 'active') return p.isActive === 1
    if (filter.value === 'inactive') return p.isActive === 0
    return true
  })
}, { immediate: true })

// Image handler
const handleImage = e => {
  const file = e.target.files[0]
  if (file) {
    imageSelection.value = file
    imageSelectionPreview.value = URL.createObjectURL(file)
  }
}

// Open Edit Modal
const openEditPage = (product) => {
  page.value = 2
  id.value = product.id
  title.value = product.title
  description.value = product.description
  imageSelection.value = null
  imageSelectionPreview.value = null
  imagePreview.value = product.image
  categorySelection.value = product.category_id.id
  isActive.value = product.isActive ? 1 : 0
}

// CRUD Functions
const storeProduct = async () => {
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('category_id', categorySelection.value)
  formData.append('isActive', isActive.value)
  if(imageSelection.value) formData.append('image', imageSelection.value)
  await productStore.storeProduct(formData)
  resetForm()
  showToast('Produkt erfolgreich angelegt!')
}

const updateProduct = async () => {
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('category_id', categorySelection.value)
  formData.append('isActive', isActive.value)
  if(imageSelection.value) formData.append('image', imageSelection.value)
  await productStore.updateProduct(id.value, formData)
  resetForm()
  showToast('Produkt erfolgreich aktualisiert!')
}

// Delete Product inklusive Bild
const deleteProduct = async (productId) => {
  if(!confirm('Produkt wirklich löschen?')) return
  try {
    await productStore.removeProduct(productId)
    showToast('Produkt gelöscht!')
  } catch(e) {
    console.error(e)
    showToast('Fehler beim Löschen!')
  }
}

const resetForm = () => {
  title.value = ''
  description.value = ''
  imageSelection.value = null
  imageSelectionPreview.value = null
  imagePreview.value = null
  categorySelection.value = null
  isActive.value = 1
  page.value = 0
  loadProducts()
}
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
