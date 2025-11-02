<template>
  <div class="bg-gray-300 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">

      <!-- Header & Filter -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Package class="w-8 h-8 text-white" />
              </div>
              Produkte
            </h1>
            <p class="text-gray-600">Verwalte deine Produkte und Kategorien</p>
          </div>
          <button
            @click="openCreateModal"
            class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 font-semibold shadow-lg"
          >
            <Plus class="w-5 h-5" />
            <span class="hidden sm:inline">Neues Produkt</span>
            <span class="sm:hidden">Neu</span>
          </button>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white rounded-2xl shadow-md p-4 md:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                v-model="keyword"
                placeholder="Produkt suchen..."
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>
            <select v-model="selectedCategory" class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white">
              <option value="">📁 Alle Kategorien</option>
              <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <select v-model="filter" class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white">
              <option value="all">🔄 Alle Status</option>
              <option value="active">✅ Nur Aktive</option>
              <option value="inactive">❌ Nur Inaktive</option>
            </select>
            <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-3 flex items-center justify-between">
              <span class="text-sm text-gray-600 font-medium">Gesamt:</span>
              <span class="text-lg font-bold text-gray-900">{{ filteredProducts.length }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lade- / Fehleranzeige -->
      <div v-if="productStore.loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <Loader2 class="w-16 h-16 text-green-600 animate-spin" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 bg-green-100 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p class="text-gray-600 font-semibold mt-6 text-lg">Lade Produkte...</p>
      </div>

      <div v-else-if="productStore.error" class="bg-white rounded-2xl shadow-md border-2 border-red-200 p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <p class="text-red-600 font-semibold text-lg">{{ productStore.error.message || 'Fehler beim Laden' }}</p>
        <button @click="loadProducts" class="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">
          Erneut versuchen
        </button>
      </div>

      <!-- Kartenansicht -->
      <div v-else-if="filteredProducts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
          :style="`animation: fadeInUp 0.5s ease-out ${index * 0.05}s both`"
        >
          <!-- Bild -->
          <div class="relative h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              :src="product.image"
              alt="Produktbild"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />

            <!-- Status Badge -->
            <div class="absolute top-3 right-3">
              <span
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-sm',
                  product.isActive === 1
                    ? 'bg-green-500/90 text-white'
                    : 'bg-red-500/90 text-white'
                ]"
              >
                <component :is="product.isActive === 1 ? CheckCircle : XCircle" class="w-3.5 h-3.5" />
                {{ product.isActive === 1 ? 'Aktiv' : 'Inaktiv' }}
              </span>
            </div>

            <!-- Quick Actions Overlay -->
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
              <button
                @click="openEditModal(product)"
                class="p-3 bg-white/90 hover:bg-white rounded-full transition-all transform hover:scale-110 shadow-lg"
                title="Bearbeiten"
              >
                <Edit2 class="w-5 h-5 text-gray-800" />
              </button>
              <button
                @click="confirmDelete(product)"
                class="p-3 bg-red-500/90 hover:bg-red-500 rounded-full transition-all transform hover:scale-110 shadow-lg"
                title="Löschen"
              >
                <Trash2 class="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <!-- Details -->
          <div class="p-4 space-y-3">
            <h2 class="text-lg font-bold text-gray-900 truncate">{{ product.title }}</h2>
            <p class="text-gray-600 text-sm line-clamp-2 min-h-[2.5rem]">
              {{ product.description || 'Keine Beschreibung' }}
            </p>

            <!-- Category Badge -->
            <div class="flex items-center gap-2 pt-2 border-t border-gray-100">
              <div class="p-1.5 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                <Tag class="w-3.5 h-3.5 text-purple-600" />
              </div>
              <span class="text-sm text-gray-700 font-medium truncate">
                {{ product.category_id?.name || 'Keine Kategorie' }}
              </span>
            </div>
          </div>

          <!-- Mobile Action Buttons -->
          <div class="px-4 pb-4 flex gap-2 sm:hidden">
            <button
              @click="openEditModal(product)"
              class="flex-1 bg-gray-100 text-gray-800 px-4 py-2.5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Edit2 class="w-4 h-4" />
              Bearbeiten
            </button>
            <button
              @click="confirmDelete(product)"
              class="flex-1 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2 font-medium"
            >
              <Trash2 class="w-4 h-4" />
              Löschen
            </button>
          </div>
        </div>
      </div>

      <!-- Keine Produkte -->
      <div v-else class="bg-white rounded-2xl shadow-md p-12 md:p-20 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-500 text-xl font-semibold mb-2">Keine Produkte vorhanden</p>
        <p class="text-gray-400 text-sm mb-6">Erstelle dein erstes Produkt mit dem Button oben</p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
        >
          <Plus class="w-5 h-5" />
          Erstes Produkt erstellen
        </button>
      </div>

      <!-- Create/Edit Modal -->
      <teleport to="body">
        <transition name="fade">
          <div v-if="showModal" @click="closeModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div @click.stop class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <!-- Header -->
              <div class="flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div class="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <component :is="editMode ? Edit2 : Plus" class="w-5 h-5 text-white" />
                  </div>
                  {{ editMode ? 'Produkt bearbeiten' : 'Neues Produkt' }}
                </h2>
                <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-200 rounded-xl">
                  <X class="w-6 h-6" />
                </button>
              </div>

              <!-- Scrollable Content -->
              <div class="overflow-y-auto flex-1">
                <!-- Bildvorschau -->
                <div v-if="imagePreview || imageSelectionPreview" class="p-6 pb-0">
                  <div class="relative rounded-xl overflow-hidden shadow-lg">
                    <img
                      :src="imageSelectionPreview || imagePreview"
                      class="w-full h-64 object-cover"
                      alt="Produktvorschau"
                    />
                    <button
                      v-if="imageSelectionPreview"
                      @click="removeSelectedImage"
                      class="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Form -->
                <div class="p-6 space-y-5">
                  <div class="space-y-2">
                    <label class="text-gray-700 font-semibold flex items-center gap-2">
                      <FileText class="w-4 h-4 text-green-600" />
                      Titel <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="title"
                      type="text"
                      placeholder="z.B. Landschaftsmalerei"
                      class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                      required
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="text-gray-700 font-semibold flex items-center gap-2">
                      <AlignLeft class="w-4 h-4 text-green-600" />
                      Beschreibung
                    </label>
                    <textarea
                      v-model="description"
                      placeholder="Beschreibe dein Produkt..."
                      rows="4"
                      class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                    ></textarea>
                  </div>

                  <div class="space-y-2">
                    <label class="text-gray-700 font-semibold flex items-center gap-2">
                      <ImageIcon class="w-4 h-4 text-green-600" />
                      Bild hochladen
                    </label>
                    <div class="relative">
                      <input
                        type="file"
                        @change="handleImage"
                        accept="image/*"
                        class="w-full border-2 border-gray-200 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-green-500 file:to-green-600 file:text-white hover:file:shadow-lg file:cursor-pointer cursor-pointer file:font-semibold transition"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="text-gray-700 font-semibold flex items-center gap-2">
                      <Tag class="w-4 h-4 text-green-600" />
                      Kategorie
                    </label>
                    <select
                      v-model="categorySelection"
                      class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="">Bitte wählen...</option>
                      <option v-for="category in categoryStore.categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                    <label class="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        :checked="isActive===1"
                        @change="isActive = $event.target.checked ? 1 : 0"
                        class="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                        id="activeCheckbox"
                      />
                      <span class="text-gray-800 font-semibold flex items-center gap-2">
                        <CheckCircle class="w-5 h-5 text-green-600" />
                        Produkt ist aktiv und sichtbar
                      </span>
                    </label>
                  </div>

                  <!-- Footer Buttons -->
                  <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold order-2 sm:order-1"
                    >
                      Abbrechen
                    </button>
                    <button
                      @click="editMode ? updateProduct() : storeProduct()"
                      class="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 order-1 sm:order-2"
                    >
                      <Save class="w-5 h-5" />
                      {{ editMode ? 'Änderungen speichern' : 'Produkt erstellen' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </teleport>

      <!-- Delete Confirmation Modal -->
      <teleport to="body">
        <transition name="fade">
          <div v-if="showDeleteModal" @click="showDeleteModal = false" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div @click.stop class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
              <div class="text-center">
                <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-4">
                  <AlertTriangle class="h-8 w-8 text-red-600" />
                </div>
                <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">Produkt löschen?</h3>
                <p class="text-gray-600 mb-2">
                  Möchtest du wirklich löschen:
                </p>
                <p class="font-bold text-gray-900 mb-6 text-lg">
                  "{{ productToDelete?.title }}"
                </p>
                <p class="text-sm text-gray-500 mb-6">
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                <div class="flex flex-col sm:flex-row gap-3">
                  <button
                    @click="showDeleteModal = false"
                    class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold"
                  >
                    Abbrechen
                  </button>
                  <button
                    @click="deleteProduct"
                    class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    <Trash2 class="w-5 h-5" />
                    Endgültig löschen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </teleport>

      <!-- Toast Notifications -->
      <div class="fixed top-4 right-4 md:top-6 md:right-6 space-y-2 z-[60] max-w-sm">
        <transition-group name="slide-left">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white font-semibold backdrop-blur-sm',
              toast.type === 'success' ? 'bg-green-600/95' :
              toast.type === 'error' ? 'bg-red-600/95' : 'bg-gray-800/95'
            ]"
          >
            <component :is="toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info" class="w-5 h-5 flex-shrink-0" />
            <span class="flex-1">{{ toast.message }}</span>
            <button @click="removeToast(toast.id)" class="hover:bg-white/20 rounded-lg p-1.5 transition">
              <X class="w-4 h-4" />
            </button>
          </div>
        </transition-group>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useProductStore } from '@/stores/Products'
import { useCategoryStore } from '@/stores/Categories'
import {
  Plus, Edit2, Trash2, X, Save, CheckCircle, XCircle, Tag, Image as ImageIcon,
  FileText, AlignLeft, Package, Loader2, AlertCircle, AlertTriangle,
  CheckCircle2, Info, Search
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
const filteredProducts = computed(() => {
  if (!productStore.products?.data) return []
  return productStore.products.data.filter(p => {
    if (filter.value === 'active') return p.isActive === 1
    if (filter.value === 'inactive') return p.isActive === 0
    return true
  })
})

// Image handler
const handleImage = e => {
  const file = e.target.files[0]
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Bild ist zu groß. Maximal 5MB erlaubt.', 'error')
      return
    }
    imageSelection.value = file
    imageSelectionPreview.value = URL.createObjectURL(file)
  }
}

const removeSelectedImage = () => {
  imageSelection.value = null
  if (imageSelectionPreview.value) {
    URL.revokeObjectURL(imageSelectionPreview.value)
  }
  imageSelectionPreview.value = null
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
  categorySelection.value = product.category_id?.id || null  // ← FIX: Optional chaining
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
  if (imageSelectionPreview.value) {
    URL.revokeObjectURL(imageSelectionPreview.value)
  }
  imageSelection.value = null
  imageSelectionPreview.value = null
  imagePreview.value = null
  categorySelection.value = null
  isActive.value = 1
  id.value = ''
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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