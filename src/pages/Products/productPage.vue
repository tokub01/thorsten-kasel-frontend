<template>
  <div class="bg-gray-300 p-6 min-h-screen">
    <div class="max-w-6xl mx-auto">

      <!-- Header & Filter -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 class="text-4xl font-serif font-bold text-gray-800">🖼️ Produkte</h1>
        <div class="flex flex-wrap gap-3">
          <button
            @click="openCreateModal"
            class="bg-gray-800 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus class="w-5 h-5" />
            Neues Produkt
          </button>
          <select v-model="selectedCategory" class="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-gray-400 outline-none">
            <option value="">Alle Kategorien</option>
            <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
          <select v-model="filter" class="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-gray-400 outline-none">
            <option value="all">Alle</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
          </select>
          <input
            type="text"
            v-model="keyword"
            placeholder="🔍 Suche..."
            class="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-gray-400 outline-none"
          />
        </div>
      </div>

      <!-- Lade- / Fehleranzeige -->
      <div v-if="productStore.loading" class="flex flex-col items-center justify-center py-16">
        <Loader2 class="w-12 h-12 text-gray-600 animate-spin mb-3" />
        <p class="text-gray-600 font-medium">Lade Produkte...</p>
      </div>
      <div v-else-if="productStore.error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle class="w-12 h-12 text-red-600 mx-auto mb-3" />
        <p class="text-red-600 font-medium">{{ productStore.error.message || 'Fehler beim Laden' }}</p>
      </div>

      <!-- Kartenansicht -->
      <div v-else-if="filteredProducts.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
        >
          <!-- Bild -->
          <div class="relative h-48 bg-gray-100 overflow-hidden">
            <img :src="product.image" alt="Produktbild" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>

            <!-- isActive Badge -->
            <span
              :class="product.isActive === 1
                ? 'absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg flex items-center gap-1'
                : 'absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg flex items-center gap-1'">
              <component :is="product.isActive === 1 ? CheckCircle : XCircle" class="w-3.5 h-3.5" />
              {{ product.isActive === 1 ? 'Aktiv' : 'Inaktiv' }}
            </span>
          </div>

          <!-- Details -->
          <div class="p-5 space-y-2">
            <h2 class="text-xl font-bold text-gray-800 truncate">{{ product.title }}</h2>
            <p class="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">{{ product.description }}</p>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <Tag class="w-4 h-4" />
              <span>{{ product.category_id?.name || 'Keine Kategorie' }}</span>
            </div>
          </div>

          <!-- Aktionen -->
          <div class="px-5 pb-5 flex gap-2">
            <button
              @click="openEditModal(product)"
              class="flex-1 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Edit2 class="w-4 h-4" />
              Bearbeiten
            </button>
            <button
              @click="confirmDelete(product)"
              class="flex-1 bg-red-50 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Trash2 class="w-4 h-4" />
              Löschen
            </button>
          </div>
        </div>
      </div>

      <!-- Keine Produkte -->
      <div v-else class="bg-white rounded-2xl shadow-sm p-16 text-center">
        <Package class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-lg font-medium">Keine Produkte vorhanden</p>
        <p class="text-gray-400 text-sm mt-2">Erstelle dein erstes Produkt mit dem Button oben</p>
      </div>

      <!-- Create/Edit Modal -->
      <transition name="fade">
        <div v-if="showModal" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" @click.self="closeModal">
          <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <component :is="editMode ? Edit2 : Plus" class="w-6 h-6" />
                {{ editMode ? 'Produkt bearbeiten' : 'Neues Produkt' }}
              </h2>
              <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg">
                <X class="w-6 h-6" />
              </button>
            </div>

            <!-- Bildvorschau -->
            <div v-if="imagePreview || imageSelectionPreview" class="p-6 pb-0">
              <img :src="imageSelectionPreview || imagePreview" class="w-full h-56 object-cover rounded-xl shadow-md"/>
            </div>

            <!-- Form -->
            <form @submit.prevent="editMode ? updateProduct() : storeProduct()" class="p-6 space-y-5">
              <div class="space-y-2">
                <label class="text-gray-700 font-semibold flex items-center gap-2">
                  <FileText class="w-4 h-4" />
                  Titel *
                </label>
                <input
                  v-model="title"
                  type="text"
                  placeholder="Produktname eingeben"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-800 focus:outline-none transition"
                  required
                />
              </div>

              <div class="space-y-2">
                <label class="text-gray-700 font-semibold flex items-center gap-2">
                  <AlignLeft class="w-4 h-4" />
                  Beschreibung
                </label>
                <textarea
                  v-model="description"
                  placeholder="Produktbeschreibung eingeben"
                  rows="3"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-800 focus:outline-none transition resize-none"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label class="text-gray-700 font-semibold flex items-center gap-2">
                  <Image class="w-4 h-4" />
                  Bild auswählen
                </label>
                <input
                  type="file"
                  @change="handleImage"
                  accept="image/*"
                  class="w-full border border-gray-300 rounded-lg p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-800 hover:file:bg-gray-200 file:cursor-pointer cursor-pointer"
                />
              </div>

              <div class="space-y-2">
                <label class="text-gray-700 font-semibold flex items-center gap-2">
                  <Tag class="w-4 h-4" />
                  Kategorie
                </label>
                <select
                  v-model="categorySelection"
                  class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-800 focus:outline-none transition"
                >
                  <option value="">Bitte wählen...</option>
                  <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  :checked="isActive===1"
                  @change="isActive = $event.target.checked ? 1 : 0"
                  class="w-5 h-5 text-gray-800 rounded focus:ring-2 focus:ring-gray-800 cursor-pointer"
                  id="activeCheckbox"
                />
                <label for="activeCheckbox" class="text-gray-700 font-semibold cursor-pointer">Produkt ist aktiv</label>
              </div>

              <!-- Footer Buttons -->
              <div class="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all font-medium"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  class="px-6 py-2.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
                >
                  <Save class="w-4 h-4" />
                  {{ editMode ? 'Änderungen speichern' : 'Produkt erstellen' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>

      <!-- Delete Confirmation Modal -->
      <transition name="fade">
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" @click.self="showDeleteModal = false">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <AlertTriangle class="h-8 w-8 text-red-600" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Produkt löschen?</h3>
              <p class="text-gray-600 mb-6">
                Möchtest du "<span class="font-semibold">{{ productToDelete?.title }}</span>" wirklich löschen?
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div class="flex gap-3">
                <button
                  @click="showDeleteModal = false"
                  class="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all font-medium"
                >
                  Abbrechen
                </button>
                <button
                  @click="deleteProduct"
                  class="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 class="w-4 h-4" />
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Toast Notifications -->
      <div class="fixed top-20 right-6 space-y-2 z-50 max-w-sm">
        <transition-group name="slide-left">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white font-medium',
              toast.type === 'success' ? 'bg-green-600' :
              toast.type === 'error' ? 'bg-red-600' : 'bg-gray-800'
            ]"
          >
            <component :is="toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info" class="w-5 h-5 flex-shrink-0" />
            <span class="flex-1">{{ toast.message }}</span>
            <button @click="removeToast(toast.id)" class="hover:bg-white/20 rounded p-1 transition">
              <X class="w-4 h-4" />
            </button>
          </div>
        </transition-group>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useProductStore } from '@/stores/Products'
import { useCategoryStore } from '@/stores/Categories'
import {
  Plus, Edit2, Trash2, X, Save, CheckCircle, XCircle, Tag, Image,
  FileText, AlignLeft, Package, Loader2, AlertCircle, AlertTriangle,
  CheckCircle2, Info
} from 'lucide-vue-next'

const productStore = useProductStore()
const categoryStore = useCategoryStore()

// State
const showModal = ref(false)
const showDeleteModal = ref(false)
const editMode = ref(false)
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
const productToDelete = ref(null)

// Toasts
let toastId = 0
const toasts = ref([])
const showToast = (message, type = 'success') => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => toasts.value = toasts.value.filter(t => t.id !== id), 4000)
}
const removeToast = (id) => toasts.value = toasts.value.filter(t => t.id !== id)

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

// Modal Functions
const openCreateModal = () => {
  editMode.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (product) => {
  editMode.value = true
  showModal.value = true
  id.value = product.id
  title.value = product.title
  description.value = product.description
  imageSelection.value = null
  imageSelectionPreview.value = null
  imagePreview.value = product.image
  categorySelection.value = product.category_id.id
  isActive.value = product.isActive ? 1 : 0
}

const closeModal = () => {
  showModal.value = false
  setTimeout(resetForm, 300)
}

const confirmDelete = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

// CRUD Functions
const storeProduct = async () => {
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('category_id', categorySelection.value)
  formData.append('isActive', isActive.value)
  if(imageSelection.value) formData.append('image', imageSelection.value)

  try {
    await productStore.storeProduct(formData)
    closeModal()
    showToast('Produkt erfolgreich erstellt!', 'success')
    loadProducts()
  } catch(e) {
    showToast('Fehler beim Erstellen', 'error')
  }
}

const updateProduct = async () => {
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('category_id', categorySelection.value)
  formData.append('isActive', isActive.value)
  if(imageSelection.value) formData.append('image', imageSelection.value)

  try {
    await productStore.updateProduct(id.value, formData)
    closeModal()
    showToast('Produkt erfolgreich aktualisiert!', 'success')
    loadProducts()
  } catch(e) {
    showToast('Fehler beim Aktualisieren', 'error')
  }
}

const deleteProduct = async () => {
  try {
    await productStore.removeProduct(productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
    showToast('Produkt erfolgreich gelöscht!', 'success')
    loadProducts()
  } catch(e) {
    showToast('Fehler beim Löschen', 'error')
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
  id.value = ''
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

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>