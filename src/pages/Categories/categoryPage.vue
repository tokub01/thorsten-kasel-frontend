<template>
  <div class="bg-gray-300 min-h-screen p-3 sm:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
          <Tag class="w-6 h-6 sm:w-8 sm:h-8 text-gray-700" />
          Kategorien
        </h1>
        <button
          @click="openCreateModal"
          class="bg-gray-900 hover:bg-gray-800 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 w-full sm:w-fit font-medium text-sm sm:text-base"
        >
          <Plus class="w-4 h-4 sm:w-5 sm:h-5" />
          Neue Kategorie
        </button>
      </div>

      <!-- Kategorien-Grid/Cards -->
      <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-12 sm:py-16">
          <Loader2 class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 animate-spin mx-auto mb-3" />
          <p class="text-gray-600 font-medium text-sm sm:text-base">Lädt Kategorien...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-12 sm:py-16 px-4">
          <AlertCircle class="w-8 h-8 sm:w-10 sm:h-10 text-red-500 mx-auto mb-3" />
          <p class="text-red-600 font-medium text-sm sm:text-base">{{ error }}</p>
          <button @click="loadData" class="mt-4 text-xs sm:text-sm text-gray-600 hover:text-gray-900 underline">
            Erneut versuchen
          </button>
        </div>

        <!-- Desktop Table (hidden on mobile) -->
        <table v-else class="hidden md:table min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Bild
              </th>
              <th scope="col" class="px-6 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3.5 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-64">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="category in categories"
              :key="category.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <!-- Bild -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="h-14 w-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                  <img
                    v-if="getCategoryImage(category)"
                    :src="getCategoryImage(category)"
                    :alt="category.name"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div v-else class="h-full w-full flex items-center justify-center text-xs text-gray-400 font-medium">
                    N/A
                  </div>
                </div>
              </td>

              <!-- Name & Produkt Info -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <Tag class="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <span class="font-medium text-gray-900">{{ category.name }}</span>
                </div>
                <p v-if="category.product?.name || category.product_id" class="text-sm text-gray-500 mt-1 ml-6">
                  Produkt: {{ category.product?.name || `#${category.product_id}` }}
                </p>
              </td>

              <!-- Aktionen -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex justify-center gap-2">
                  <button
                    @click="openEditModal(category)"
                    class="inline-flex items-center gap-2 px-3.5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    <Edit2 class="w-4 h-4" />
                    Bearbeiten
                  </button>
                  <button
                    @click="handleDelete(category)"
                    :disabled="deletingIds.has(category.id)"
                    class="inline-flex items-center gap-2 px-3.5 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Loader2 v-if="deletingIds.has(category.id)" class="w-4 h-4 animate-spin" />
                    <Trash2 v-else class="w-4 h-4" />
                    Löschen
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="categories.length === 0">
              <td colspan="3" class="text-center py-20">
                <Tag class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p class="text-gray-600 text-lg font-medium mb-2">Noch keine Kategorien vorhanden</p>
                <p class="text-gray-400 text-sm">Erstelle deine erste Kategorie mit dem Button oben</p>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Mobile Cards (visible only on mobile) -->
        <div v-if="!isLoading && !error" class="md:hidden divide-y divide-gray-200">
          <div
            v-for="category in categories"
            :key="category.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start gap-3 mb-3">
              <!-- Bild -->
              <div class="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-sm flex-shrink-0">
                <img
                  v-if="getCategoryImage(category)"
                  :src="getCategoryImage(category)"
                  :alt="category.name"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
                <div v-else class="h-full w-full flex items-center justify-center text-xs text-gray-400 font-medium">
                  N/A
                </div>
              </div>

              <!-- Name & Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <Tag class="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <h3 class="font-semibold text-gray-900 truncate">{{ category.name }}</h3>
                </div>
                <p v-if="category.product?.name || category.product_id" class="text-xs text-gray-500 ml-6">
                  Produkt: {{ category.product?.name || `#${category.product_id}` }}
                </p>
              </div>
            </div>

            <!-- Aktionen -->
            <div class="flex gap-2">
              <button
                @click="openEditModal(category)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <Edit2 class="w-4 h-4" />
                Bearbeiten
              </button>
              <button
                @click="handleDelete(category)"
                :disabled="deletingIds.has(category.id)"
                class="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="deletingIds.has(category.id)" class="w-4 h-4 animate-spin" />
                <Trash2 v-else class="w-4 h-4" />
                Löschen
              </button>
            </div>
          </div>

          <!-- Empty State Mobile -->
          <div v-if="categories.length === 0" class="text-center py-16 px-4">
            <Tag class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
            <p class="text-gray-600 text-base sm:text-lg font-medium mb-2">Noch keine Kategorien vorhanden</p>
            <p class="text-gray-400 text-xs sm:text-sm">Erstelle deine erste Kategorie mit dem Button oben</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <teleport to="body">
      <transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
              <h2 class="text-lg sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                <component :is="editMode ? Edit2 : Plus" class="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                <span class="hidden sm:inline">{{ editMode ? 'Kategorie bearbeiten' : 'Neue Kategorie' }}</span>
                <span class="sm:hidden">{{ editMode ? 'Bearbeiten' : 'Neu' }}</span>
              </h2>

              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="handleSubmit" class="flex-1 overflow-hidden flex flex-col">
              <div class="flex-1 overflow-y-auto">
                <!-- Form Section -->
                <div class="p-4 sm:p-6 space-y-4 sm:space-y-6 border-b border-gray-200">
                  <!-- Category Name -->
                  <div>
                    <label for="categoryName" class="block text-sm font-semibold text-gray-700 mb-2">
                      Kategoriename *
                    </label>
                    <input
                      id="categoryName"
                      v-model="form.name"
                      type="text"
                      placeholder="z.B. Landschaften, Porträts..."
                      class="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>

                  <!-- Selected Product Preview -->
                  <div v-if="form.selectedProduct" class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Ausgewähltes Produkt
                    </label>
                    <div class="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div class="h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          v-if="form.selectedProduct.image"
                          :src="form.selectedProduct.image"
                          :alt="form.selectedProduct.name"
                          class="h-full w-full object-cover"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="font-medium text-gray-900 truncate text-sm">
                          {{ form.selectedProduct.name || `Produkt #${getProductId(form.selectedProduct)}` }}
                        </p>
                        <p class="text-xs text-gray-500">ID: {{ getProductId(form.selectedProduct) }}</p>
                      </div>
                      <button
                        type="button"
                        @click="form.selectedProduct = null"
                        class="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-white rounded transition"
                      >
                        <X class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Products Section -->
                <div class="p-4 sm:p-6">
                  <!-- Search & Header -->
                  <div class="space-y-3 mb-4">
                    <div class="flex items-center justify-between">
                      <label class="block text-sm font-semibold text-gray-700">
                        Produkt auswählen
                      </label>
                      <button
                        type="button"
                        @click="loadProducts"
                        class="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Neu laden
                      </button>
                    </div>

                    <!-- Search Input -->
                    <div class="relative">
                      <Search class="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        v-model="searchQuery"
                        type="text"
                        placeholder="Produkte durchsuchen..."
                        class="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                      />
                      <button
                        v-if="searchQuery"
                        @click="searchQuery = ''"
                        type="button"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X class="w-4 h-4" />
                      </button>
                    </div>

                    <p class="text-xs sm:text-sm text-gray-600">
                      {{ displayedProducts.length }}
                      {{ displayedProducts.length === 1 ? 'Produkt' : 'Produkte' }}
                      {{ hasSearchQuery ? '(gefiltert)' : '(gesamt)' }}
                    </p>
                  </div>

                  <!-- Products Loading -->
                  <div v-if="productsLoading" class="text-center py-8 sm:py-12">
                    <Loader2 class="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 animate-spin mx-auto mb-3" />
                    <p class="text-gray-600 text-xs sm:text-sm">Produkte werden geladen...</p>
                  </div>

                  <!-- Products Error -->
                  <div v-else-if="productsError" class="text-center py-8 sm:py-12">
                    <AlertCircle class="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mx-auto mb-3" />
                    <p class="text-red-600 text-xs sm:text-sm mb-2">{{ productsError }}</p>
                    <button
                      type="button"
                      @click="loadProducts"
                      class="text-xs text-gray-600 hover:text-gray-900 underline"
                    >
                      Erneut versuchen
                    </button>
                  </div>

                  <!-- Products List -->
                  <div v-else-if="displayedProducts.length > 0" class="space-y-2">
                    <button
                      v-for="product in displayedProducts"
                      :key="getProductId(product)"
                      type="button"
                      @click="toggleProductSelection(product)"
                      class="w-full flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                      :class="{
                        'ring-2 ring-gray-900 bg-gray-50': isProductSelected(product),
                        'hover:border-gray-300': !isProductSelected(product)
                      }"
                    >
                      <div class="h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        <img
                          v-if="product.image"
                          :src="product.image"
                          :alt="product.name"
                          class="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div class="flex-1 min-w-0 text-left">
                        <p class="font-medium text-gray-900 truncate text-sm">
                          {{ product.name || `Produkt #${getProductId(product)}` }}
                        </p>
                        <p class="text-xs text-gray-500">ID: {{ getProductId(product) }}</p>
                      </div>
                      <div class="flex-shrink-0">
                        <span
                          v-if="isProductSelected(product)"
                          class="px-2 sm:px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full"
                        >
                          ✓
                        </span>
                        <span
                          v-else
                          class="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          <span class="hidden sm:inline">Auswählen</span>
                          <span class="sm:hidden">+</span>
                        </span>
                      </div>
                    </button>
                  </div>

                  <!-- Products Empty State -->
                  <div v-else class="text-center py-8 sm:py-12">
                    <Tag class="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                    <p class="text-gray-600 text-sm">
                      {{ hasSearchQuery ? 'Keine Produkte gefunden' : 'Keine Produkte vorhanden' }}
                    </p>
                    <p class="text-gray-400 text-xs mt-2">
                      Bitte überprüfe deine Produktdatenbank
                    </p>
                  </div>
                </div>
              </div>

              <!-- Form Actions (sticky bottom) -->
              <div class="flex gap-2 sm:gap-3 p-4 sm:p-6 border-t border-gray-200 bg-white flex-shrink-0">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium text-sm sm:text-base"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting || !form.name.trim()"
                  class="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                  <Save v-else class="w-4 h-4" />
                  {{ editMode ? 'Speichern' : 'Erstellen' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Toast Notifications -->
    <teleport to="body">
      <div class="fixed top-4 right-4 left-4 sm:left-auto z-50 space-y-2 sm:max-w-sm">
        <transition-group name="toast">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-lg text-white font-medium text-sm sm:text-base',
              toast.type === 'success' ? 'bg-green-600' :
              toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'
            ]"
          >
            <component
              :is="toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : AlertCircle"
              class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
            />
            <span class="flex-1">{{ toast.message }}</span>
            <button @click="removeToast(toast.id)" class="hover:bg-white/20 rounded p-1 transition">
              <X class="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </transition-group>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useCategoryStore } from '@/stores/Categories'
import { useProductStore } from '@/stores/Products'
import { Plus, Edit2, Trash2, X, Save, Tag, Loader2, AlertCircle, XCircle, CheckCircle2, Search } from 'lucide-vue-next'

/* STORES */
const categoryStore = useCategoryStore()
const productStore = useProductStore()

/* DEBUG MODE */
const debugMode = ref(false)

/* CATEGORIES */
const categories = computed(() => categoryStore.categories ?? [])
const isLoading = computed(() => categoryStore.loading)
const error = computed(() => {
  const errors = categoryStore.errors
  return Array.isArray(errors) && errors.length ? errors[0] : null
})

/* PRODUCTS */
const productsLoading = ref(false)
const productsError = ref(null)
const allProducts = ref([])

/* MODAL STATE */
const showModal = ref(false)
const editMode = ref(false)
const isSubmitting = ref(false)
const searchQuery = ref('')

const form = ref({
  name: '',
  selectedProduct: null,
  categoryToEdit: null
})

/* SEARCH */
const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0)

const displayedProducts = computed(() => {
  if (!hasSearchQuery.value) return allProducts.value

  const q = searchQuery.value.trim().toLowerCase()
  return allProducts.value.filter(p => {
    const name = (p?.name || '').toLowerCase()
    const idStr = String(getProductId(p) ?? '').toLowerCase()
    return name.includes(q) || idStr.includes(q)
  })
})

/* TOASTS */
let toastCounter = 0
const toasts = ref([])
function showToast(message, type = 'success') {
  const id = ++toastCounter
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 4000)
}
function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

/* DELETE STATE */
const deletingIds = ref(new Set())

/* HELPERS */
function getProductId(product) {
  return product?.id ?? product?.product_id ?? null
}

function getCategoryImage(category) {
  return category.image || category.product?.image || null
}

function isProductSelected(product) {
  return form.value.selectedProduct &&
         getProductId(form.value.selectedProduct) === getProductId(product)
}

function toggleProductSelection(product) {
  if (isProductSelected(product)) {
    form.value.selectedProduct = null
  } else {
    form.value.selectedProduct = product
  }
}

/* PRODUCTS LADEN */
async function loadProducts() {
  productsLoading.value = true
  productsError.value = null

  try {
    await productStore.loadAllProducts("", "", "")

    const rawProducts = productStore.products

    console.log('Raw Products vom Store:', rawProducts)

    if (!rawProducts) {
      allProducts.value = []
      console.warn('Keine Produkte im Store gefunden (rawProducts ist null/undefined)')
      showToast('Store hat keine Produkte zurückgegeben', 'error')
      return
    }

    let extractedProducts = []

    if (Array.isArray(rawProducts)) {
      extractedProducts = rawProducts
      console.log('Produkte sind direktes Array')
    } else if (Array.isArray(rawProducts.data)) {
      extractedProducts = rawProducts.data
      console.log('Produkte in rawProducts.data gefunden')
    } else if (rawProducts.data && Array.isArray(rawProducts.data.data)) {
      extractedProducts = rawProducts.data.data
      console.log('Produkte in rawProducts.data.data gefunden')
    } else if (typeof rawProducts === 'object') {
      const possibleKeys = ['products', 'items', 'results', 'product']
      for (const key of possibleKeys) {
        if (Array.isArray(rawProducts[key])) {
          extractedProducts = rawProducts[key]
          console.log(`Produkte in rawProducts.${key} gefunden`)
          break
        }
      }

      if (extractedProducts.length === 0) {
        console.warn('Keine Produkte gefunden. Verfügbare Keys:', Object.keys(rawProducts))
      }
    }

    allProducts.value = extractedProducts

    console.log('Extrahierte Produkte:', {
      count: extractedProducts.length,
      first: extractedProducts[0] || null
    })

    if (extractedProducts.length === 0) {
      showToast('Keine Produkte in der Datenbank gefunden', 'info')
    } else {
      console.log(`✅ ${extractedProducts.length} Produkte erfolgreich geladen`)
    }

  } catch (error) {
    console.error('❌ Fehler beim Laden der Produkte:', error)
    console.error('Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    productsError.value = 'Fehler beim Laden der Produkte: ' + (error.message || 'Unbekannter Fehler')
    showToast('Fehler beim Laden der Produkte', 'error')
  } finally {
    productsLoading.value = false
  }
}

/* MODAL FUNCS */
function openCreateModal() {
  editMode.value = false
  form.value = { name: '', selectedProduct: null, categoryToEdit: null }
  searchQuery.value = ''
  showModal.value = true

  if (allProducts.value.length === 0) {
    loadProducts()
  }
}

function openEditModal(category) {
  editMode.value = true

  let selectedProduct = null
  if (category.product_id) {
    selectedProduct = allProducts.value.find(p =>
      getProductId(p) === category.product_id
    ) || category.product || null
  }

  form.value = {
    name: category.name,
    selectedProduct,
    categoryToEdit: category
  }
  searchQuery.value = ''
  showModal.value = true

  if (allProducts.value.length === 0) {
    loadProducts()
  }
}

function closeModal() {
  showModal.value = false
  setTimeout(() => {
    form.value = { name: '', selectedProduct: null, categoryToEdit: null }
    searchQuery.value = ''
  }, 300)
}

/* CRUD */
async function handleSubmit() {
  if (isSubmitting.value || !form.value.name.trim()) return

  isSubmitting.value = true
  try {
    const productId = form.value.selectedProduct ? getProductId(form.value.selectedProduct) : null

    if (editMode.value && form.value.categoryToEdit?.id) {
      await categoryStore.updateCategory(productId, form.value.categoryToEdit.id, form.value.name)
      showToast('Kategorie erfolgreich aktualisiert', 'success')
    } else {
      await categoryStore.storeCategory(form.value.name, productId)
      showToast('Kategorie erfolgreich erstellt', 'success')
    }

    await categoryStore.loadAllCategories()
    closeModal()
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
    showToast(editMode.value ? 'Fehler beim Aktualisieren' : 'Fehler beim Erstellen', 'error')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(category) {
  if (deletingIds.value.has(category.id)) return
  if (!confirm(`Möchten Sie die Kategorie "${category.name}" wirklich löschen?`)) return

  deletingIds.value.add(category.id)
  try {
    await categoryStore.removeCategory(category.id)
    await categoryStore.loadAllCategories()
    showToast('Kategorie erfolgreich gelöscht', 'success')
  } catch (error) {
    console.error('Fehler beim Löschen:', error)
    showToast('Fehler beim Löschen', 'error')
  } finally {
    deletingIds.value.delete(category.id)
  }
}

/* INIT */
async function loadData() {
  try {
    await categoryStore.loadAllCategories()
  } catch (err) {
    console.error('Fehler beim Laden der Daten:', err)
    showToast('Fehler beim Laden der Daten', 'error')
  }
}

onMounted(() => {
  loadData()
})

watch(() => productStore.products, (newVal) => {
  if (debugMode.value) {
    console.log('ProductStore geändert:', newVal)
  }
}, { deep: true })
</script>

<style scoped>
/* Modal Transitions */
.modal-enter-active,
.modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-active .bg-white,
.modal-leave-active .bg-white { transition: transform 0.3s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .bg-white { transform: scale(0.95) translateY(20px); }
.modal-leave-to .bg-white { transform: scale(0.95) translateY(20px); }

/* Mobile Modal - slide up */
@media (max-width: 640px) {
  .modal-enter-from .bg-white { transform: translateY(100%); }
  .modal-leave-to .bg-white { transform: translateY(100%); }
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { transform: translateX(100%); opacity: 0; }
.toast-leave-to { transform: translateX(50px); opacity: 0; }
.toast-move { transition: transform 0.3s ease; }
</style>