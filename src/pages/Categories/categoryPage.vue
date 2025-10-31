<template>
  <div class="bg-gray-50 min-h-screen p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Tag class="w-8 h-8 text-gray-700" />
          Kategorien
        </h1>
        <button
          @click="openCreateModal"
          class="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2 w-fit font-medium"
        >
          <Plus class="w-5 h-5" />
          Neue Kategorie
        </button>
      </div>

      <!-- Kategorien-Grid -->
      <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-16">
          <Loader2 class="w-10 h-10 text-gray-400 animate-spin mx-auto mb-3" />
          <p class="text-gray-600 font-medium">Lädt Kategorien...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <AlertCircle class="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p class="text-red-600 font-medium">{{ error }}</p>
          <button @click="loadData" class="mt-4 text-sm text-gray-600 hover:text-gray-900 underline">
            Erneut versuchen
          </button>
        </div>

        <!-- Table -->
        <table v-else class="min-w-full divide-y divide-gray-200">
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
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <teleport to="body">
      <transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <!-- Modal Header -->
            <div class="flex items-center justify-between gap-4 p-6 border-b border-gray-200 flex-shrink-0">
              <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <component :is="editMode ? Edit2 : Plus" class="w-6 h-6 text-gray-700" />
                {{ editMode ? 'Kategorie bearbeiten' : 'Neue Kategorie' }}
              </h2>

              <!-- Search Input -->
              <div class="relative flex-1 max-w-sm">
                <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Produkte durchsuchen... (leer = alle)"
                  class="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="handleSubmit" class="flex-1 overflow-hidden flex flex-col">
              <div class="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
                <!-- Left Column: Form -->
                <div class="p-6 border-r border-gray-200 space-y-6 overflow-y-auto">
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
                      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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
                        <p class="font-medium text-gray-900 truncate">
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

                  <!-- Form Actions -->
                  <div class="flex gap-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      @click="closeModal"
                      class="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="submit"
                      :disabled="isSubmitting || !form.name.trim()"
                      class="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
                      <Save v-else class="w-4 h-4" />
                      {{ editMode ? 'Speichern' : 'Erstellen' }}
                    </button>
                  </div>
                </div>

                <!-- Right Column: Product List -->
                <div class="lg:col-span-2 p-6 overflow-y-auto">
                  <!-- Products Header -->
                  <div class="flex items-center justify-between mb-4">
                    <p class="text-sm text-gray-600">
                      {{ displayedProducts.length }}
                      {{ displayedProducts.length === 1 ? 'Produkt' : 'Produkte' }}
                      {{ hasSearchQuery ? '(gefiltert – alle Produkte)' : '(gesamt – alle Produkte)' }}
                    </p>
                  </div>

                  <!-- Products Loading -->
                  <div v-if="productsLoading" class="text-center py-12">
                    <Loader2 class="w-8 h-8 text-gray-400 animate-spin mx-auto mb-3" />
                    <p class="text-gray-600 text-sm">Produkte werden geladen...</p>
                  </div>

                  <!-- Products List -->
                  <div v-else-if="displayedProducts.length > 0" class="space-y-2">
                    <button
                      v-for="product in displayedProducts"
                      :key="getProductId(product)"
                      type="button"
                      @click="toggleProductSelection(product)"
                      class="w-full flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                      :class="{
                        'ring-2 ring-gray-900 bg-gray-50': isProductSelected(product),
                        'hover:border-gray-300': !isProductSelected(product)
                      }"
                    >
                      <div class="h-14 w-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        <img
                          v-if="product.image"
                          :src="product.image"
                          :alt="product.name"
                          class="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div class="flex-1 min-w-0 text-left">
                        <p class="font-medium text-gray-900 truncate">
                          {{ product.name || `Produkt #${getProductId(product)}` }}
                        </p>
                        <p class="text-xs text-gray-500">ID: {{ getProductId(product) }}</p>
                      </div>
                      <div class="flex-shrink-0">
                        <span
                          v-if="isProductSelected(product)"
                          class="px-3 py-1 bg-gray-900 text-white text-xs font-medium rounded-full"
                        >
                          Ausgewählt
                        </span>
                        <span
                          v-else
                          class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          Auswählen
                        </span>
                      </div>
                    </button>
                  </div>

                  <!-- Products Empty State -->
                  <div v-else class="text-center py-12">
                    <Tag class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p class="text-gray-600">
                      {{ hasSearchQuery ? 'Keine Produkte gefunden' : 'Keine Produkte vorhanden' }}
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Toast Notifications -->
    <teleport to="body">
      <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        <transition-group name="toast">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white font-medium',
              toast.type === 'success' ? 'bg-green-600' :
              toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'
            ]"
          >
            <component
              :is="toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : AlertCircle"
              class="w-5 h-5 flex-shrink-0"
            />
            <span class="flex-1">{{ toast.message }}</span>
            <button @click="removeToast(toast.id)" class="hover:bg-white/20 rounded p-1 transition">
              <X class="w-4 h-4" />
            </button>
          </div>
        </transition-group>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/Categories'
import { useProductStore } from '@/stores/Products'
import { Plus, Edit2, Trash2, X, Save, Tag, Loader2, AlertCircle, XCircle, CheckCircle2, Search } from 'lucide-vue-next'

/* STORES */
const categoryStore = useCategoryStore()
const productStore = useProductStore()

/* CATEGORIES */
const categories = computed(() => categoryStore.categories ?? [])
const isLoading = computed(() => categoryStore.loading)
const error = computed(() => {
  const errors = categoryStore.errors
  return Array.isArray(errors) && errors.length ? errors[0] : null
})

/* PRODUCTS */
const productsLoading = ref(false)
const products = computed(() => {
  const raw = productStore.products
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  if (Array.isArray(raw?.data)) return raw.data
  if (Array.isArray(raw?.data?.data)) return raw.data.data
  return []
})

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

/* ALLE Produkte anzeigen; bei Suche über ALLE filtern (Name ODER ID) */
const displayedProducts = computed(() => {
  const list = Array.isArray(products.value) ? products.value : []
  if (!hasSearchQuery.value) return list

  const q = searchQuery.value.trim().toLowerCase()
  return list.filter(p => {
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
  return product?.id ?? product?.product_id ?? product?.data?.id ?? null
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

/* MODAL FUNCS */
function openCreateModal() {
  editMode.value = false
  form.value = { name: '', selectedProduct: null, categoryToEdit: null }
  searchQuery.value = ''
  showModal.value = true
}
function openEditModal(category) {
  editMode.value = true
  form.value = { name: category.name, selectedProduct: category.product || null, categoryToEdit: category }
  searchQuery.value = ''
  showModal.value = true
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
    const productId = form.value.selectedProduct ? getProductId(form.value.selectedProduct) : undefined
    if (editMode.value && form.value.categoryToEdit?.id) {
      await categoryStore.updateCategory(productId, form.value.categoryToEdit.id, form.value.name)
      showToast('Kategorie erfolgreich aktualisiert', 'success')
    } else {
      await categoryStore.storeCategory(form.value.name, productId)
      showToast('Kategorie erfolgreich erstellt', 'success')
    }
    closeModal()
  } catch {
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
    await categoryStore.removeCategory(category.id) /* <- Store-Action heißt removeCategory */
    showToast('Kategorie erfolgreich gelöscht', 'success')
  } catch {
    showToast('Fehler beim Löschen', 'error')
  } finally {
    deletingIds.value.delete(category.id)
  }
}

/* INIT */
async function loadData() {
  try {
    productsLoading.value = true
    await categoryStore.loadAllCategories()
    await productStore.loadAllProducts(null, null, null) // lädt alle Produkte (ungefiltert)
  } catch (err) {
    showToast('Fehler beim Laden der Daten', 'error')
  } finally {
    productsLoading.value = false
  }
}
onMounted(loadData)
</script>

<style scoped>
/* Modal Transitions */
.modal-enter-active,
.modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-active .bg-white,
.modal-leave-active .bg-white { transition: transform 0.3s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .bg-white { transform: scale(0.95) translateY(-20px); }
.modal-leave-to .bg-white { transform: scale(0.95) translateY(20px); }

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { transform: translateX(100%); opacity: 0; }
.toast-leave-to { transform: translateX(50px); opacity: 0; }
.toast-move { transition: transform 0.3s ease; }
</style>
