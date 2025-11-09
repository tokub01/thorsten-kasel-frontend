<template>
  <div class="bg-gray-300 p-4 md:p-8 min-h-screen">
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
        <div class="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-100">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                v-model="keyword"
                @input="debouncedSearch"
                placeholder="Produkt suchen..."
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>
            <select
              v-model="selectedCategory"
              @change="loadProducts"
              class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
            >
              <option value="">📁 Alle Kategorien</option>
              <option
                v-for="category in categoryStore.categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <select
              v-model="filter"
              class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
            >
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

      <!-- LOADING -->
      <div v-if="productStore.loading && !productStore.products?.data?.length" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <Loader2 class="w-16 h-16 text-green-600 animate-spin" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 bg-green-100 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p class="text-gray-600 font-semibold mt-6 text-lg">Lade Produkte...</p>
      </div>

      <!-- ERROR -->
      <div
        v-else-if="productStore.error && !productStore.products?.data?.length"
        class="bg-white rounded-2xl shadow-md border-2 border-red-200 p-8 text-center"
      >
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <p class="text-red-600 font-semibold text-lg">
          {{ productStore.error?.message || 'Fehler beim Laden' }}
        </p>
        <button
          @click="loadProducts"
          class="mt-4 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl transition font-semibold"
        >
          Erneut versuchen
        </button>
      </div>

      <!-- Kartenansicht -->
      <div
        v-else-if="filteredProducts.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
        <article
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
          :style="`animation: fadeInUp 0.5s ease-out ${index * 0.05}s both`"
        >
          <!-- Bild -->
          <div class="relative h-48 sm:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              v-if="product.image"
              :src="getImageUrl(product.image)"
              :alt="product.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              @error="handleImageError"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <Package class="w-12 h-12" />
            </div>

            <!-- Status Badge -->
            <div class="absolute top-3 right-3">
              <span
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-sm',
                  product.isActive === 1 || product.isActive === '1' || product.isActive === true
                    ? 'bg-green-500/90 text-white'
                    : 'bg-red-500/90 text-white'
                ]"
              >
                <component
                  :is="product.isActive === 1 || product.isActive === '1' || product.isActive === true ? CheckCircle : XCircle"
                  class="w-3.5 h-3.5"
                />
                {{ product.isActive === 1 || product.isActive === '1' || product.isActive === true ? 'Aktiv' : 'Inaktiv' }}
              </span>
            </div>

            <!-- Quick Actions Overlay (Desktop) -->
            <div class="hidden sm:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-3">
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
                {{ getCategoryName(product.category_id) }}
              </span>
            </div>
          </div>

          <!-- Mobile Action Buttons -->
          <div class="px-4 pb-4 flex gap-2 sm:hidden">
            <button
              @click="openEditModal(product)"
              class="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-4 py-2.5 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md"
            >
              <Edit2 class="w-4 h-4" />
              Bearbeiten
            </button>
            <button
              @click="confirmDelete(product)"
              class="flex-1 bg-gradient-to-r from-red-50 to-red-100 text-red-600 px-4 py-2.5 rounded-xl hover:from-red-100 hover:to-red-200 transition-all flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md"
            >
              <Trash2 class="w-4 h-4" />
              Löschen
            </button>
          </div>
        </article>
      </div>

      <!-- Keine Produkte -->
      <div v-else class="bg-white rounded-2xl shadow-md p-12 md:p-20 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-500 text-xl font-semibold mb-2">
          {{ keyword || selectedCategory ? 'Keine Ergebnisse gefunden' : 'Keine Produkte vorhanden' }}
        </p>
        <p class="text-gray-400 text-sm mb-6">
          {{ keyword || selectedCategory ? 'Versuche andere Filter' : 'Erstelle dein erstes Produkt mit dem Button oben' }}
        </p>
        <button
          v-if="!keyword && !selectedCategory"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
        >
          <Plus class="w-5 h-5" />
          Erstes Produkt erstellen
        </button>
        <button
          v-else
          @click="clearFilters"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
        >
          <X class="w-5 h-5" />
          Filter zurücksetzen
        </button>
      </div>

      <!-- Create/Edit Modal -->
      <teleport to="body">
        <transition name="modal">
          <div
            v-if="showModal"
            @click="closeModal"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
          >
            <div
              @click.stop
              class="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col"
            >
              <!-- Header -->
              <div class="sticky top-0 flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100 z-10 rounded-t-2xl">
                <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div class="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <component :is="editMode ? Edit2 : Plus" class="w-5 h-5 text-white" />
                  </div>
                  {{ editMode ? 'Produkt bearbeiten' : 'Neues Produkt' }}
                </h2>
                <button
                  @click="closeModal"
                  class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-white rounded-xl"
                >
                  <X class="w-6 h-6" />
                </button>
              </div>

              <!-- Scrollable Content -->
              <div class="overflow-y-auto flex-1">
                <!-- Bildvorschau -->
                <div v-if="imageSelectionPreview || imagePreview" class="p-6 pb-0">
                  <div class="relative rounded-xl overflow-hidden shadow-lg group">
                    <img
                      :src="imageSelectionPreview || imagePreview"
                      class="w-full h-64 object-cover"
                      alt="Produktvorschau"
                    />
                    <button
                      @click="removeSelectedImage"
                      class="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                    >
                      <X class="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <!-- Form -->
                <form @submit.prevent="editMode ? updateProduct() : storeProduct()" class="p-6 space-y-5">
                  <div class="space-y-2">
                    <label class="text-gray-700 font-bold flex items-center gap-2">
                      <FileText class="w-4 h-4 text-green-600" />
                      Titel <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="title"
                      type="text"
                      placeholder="z.B. Landschaftsmalerei"
                      required
                      maxlength="255"
                      class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="text-gray-700 font-bold flex items-center gap-2">
                      <AlignLeft class="w-4 h-4 text-green-600" />
                      Beschreibung
                    </label>
                    <textarea
                      v-model="description"
                      placeholder="Beschreibe dein Produkt..."
                      rows="4"
                      maxlength="2000"
                      class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition resize-none"
                    ></textarea>
                    <p class="text-xs text-gray-500">{{ description?.length || 0 }} / 2000 Zeichen</p>
                  </div>

                  <div class="space-y-2">
                    <label class="text-gray-700 font-bold flex items-center gap-2">
                      <ImageIcon class="w-4 h-4 text-green-600" />
                      Bild hochladen
                    </label>
                    <input
                      type="file"
                      ref="fileInput"
                      @change="handleImage"
                      accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                      class="w-full border-2 border-gray-200 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-green-500 file:to-green-600 file:text-white hover:file:shadow-lg file:cursor-pointer cursor-pointer file:font-semibold transition"
                    />
                    <p class="text-xs text-gray-500 flex items-center gap-1.5">
                      <Info class="w-3.5 h-3.5" />
                      Empfohlen: 1200x800px, max. 5MB (JPG, PNG, GIF, WebP)
                    </p>
                  </div>

                  <div class="space-y-2">
                    <label class="text-gray-700 font-bold flex items-center gap-2">
                      <Tag class="w-4 h-4 text-green-600" />
                      Kategorie
                    </label>
                    <select
                      v-model="categorySelection"
                      class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
                    >
                      <option value="">Keine Kategorie</option>
                      <option
                        v-for="category in categoryStore.categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <div class="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <input
                      type="checkbox"
                      v-model="isActive"
                      id="activeCheckbox"
                      class="w-5 h-5 text-green-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                    />
                    <label for="activeCheckbox" class="text-gray-800 font-bold cursor-pointer flex-1 flex items-center gap-2">
                      <CheckCircle class="w-5 h-5 text-green-600" />
                      Produkt ist aktiv und sichtbar
                    </label>
                  </div>

                  <!-- Footer Buttons -->
                  <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <button
                      type="button"
                      @click="closeModal"
                      :disabled="isSubmitting"
                      class="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="submit"
                      :disabled="isSubmitting || !title.trim()"
                      class="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                    >
                      <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                      <Save v-else class="w-5 h-5" />
                      {{ editMode ? 'Änderungen speichern' : 'Produkt erstellen' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </transition>
      </teleport>

      <!-- Delete Confirmation Modal -->
      <teleport to="body">
        <transition name="modal">
          <div
            v-if="showDeleteModal"
            @click="showDeleteModal = false"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
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
                    :disabled="isDeleting"
                    class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Abbrechen
                  </button>
                  <button
                    @click="deleteProduct"
                    :disabled="isDeleting"
                    class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Loader2 v-if="isDeleting" class="w-5 h-5 animate-spin" />
                    <Trash2 v-else class="w-5 h-5" />
                    Endgültig löschen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </teleport>

      <!-- Toast Notifications -->
      <teleport to="body">
        <div class="fixed top-4 right-4 md:top-6 md:right-6 space-y-2 z-[60] max-w-sm">
          <transition-group name="toast">
            <div
              v-for="toast in toasts"
              :key="toast.id"
              :class="[
                'flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white font-semibold backdrop-blur-sm',
                toast.type === 'success' ? 'bg-green-600/95' :
                toast.type === 'error' ? 'bg-red-600/95' : 'bg-gray-800/95'
              ]"
            >
              <component
                :is="toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info"
                class="w-5 h-5 flex-shrink-0"
              />
              <span class="flex-1">{{ toast.message }}</span>
              <button @click="removeToast(toast.id)" class="hover:bg-white/20 rounded-lg p-1.5 transition">
                <X class="w-4 h-4" />
              </button>
            </div>
          </transition-group>
        </div>
      </teleport>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useProductStore } from '@/stores/Products';
import { useCategoryStore } from '@/stores/Categories';
import {
  Plus, Edit2, Trash2, X, Save, CheckCircle, XCircle, Tag, Image as ImageIcon,
  FileText, AlignLeft, Package, Loader2, AlertCircle, AlertTriangle,
  CheckCircle2, Info, Search
} from 'lucide-vue-next';

// ===== STORES =====
const productStore = useProductStore();
const categoryStore = useCategoryStore();

// ===== STATE =====
const showModal = ref(false);
const showDeleteModal = ref(false);
const editMode = ref(false);
const id = ref('');
const title = ref('');
const description = ref('');
const imageSelection = ref(null);
const imageSelectionPreview = ref(null);
const imagePreview = ref(null);
const categorySelection = ref('');
const isActive = ref(true);
const selectedCategory = ref('');
const keyword = ref('');
const filter = ref('all');
const productToDelete = ref(null);
const fileInput = ref(null);
const isSubmitting = ref(false);
const isDeleting = ref(false);

// ===== TOASTS =====
let toastId = 0;
const toasts = ref([]);

const showToast = (message, type = 'success') => {
  const id = ++toastId;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 4000);
};

const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id);
};

// ===== LIFECYCLE =====
const loadProducts = async () => {
  try {
    await productStore.loadAllProducts(keyword.value, selectedCategory.value);
  } catch (error) {
    console.error('Fehler beim Laden:', error);
  }
};

onMounted(async () => {
  try {
    await categoryStore.loadAllCategories();
    await loadProducts();
  } catch (error) {
    console.error('Fehler beim initialen Laden:', error);
  }
});

onUnmounted(() => {
  // Cleanup blob URLs
  if (imageSelectionPreview.value && imageSelectionPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imageSelectionPreview.value);
  }
});

// ===== DEBOUNCE SEARCH =====
let searchTimeout = null;
const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadProducts();
  }, 300);
};

// ===== COMPUTED =====
const filteredProducts = computed(() => {
  const products = productStore.products?.data || [];

  return products.filter(p => {
    if (filter.value === 'active') {
      return p.isActive === 1 || p.isActive === '1' || p.isActive === true;
    }
    if (filter.value === 'inactive') {
      return p.isActive === 0 || p.isActive === '0' || p.isActive === false;
    }
    return true;
  });
});

// ===== HELPERS =====
function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  if (image.startsWith('blob:')) {
    return image;
  }

  return `${process.env.VUE_APP_API_URL}/storage/${image}`;
}

function handleImageError(event) {
  console.error("Fehler beim Laden des Bildes:", event.target.src);
  event.target.src = '';
}

function getCategoryName(categoryId) {
  if (!categoryId) return 'Keine Kategorie';

  // Wenn categoryId ein Objekt ist (von relationship)
  if (typeof categoryId === 'object' && categoryId !== null) {
    return categoryId.name || 'Keine Kategorie';
  }

  // Wenn categoryId eine ID ist
  const category = categoryStore.categories?.find(c => c.id === categoryId);
  return category?.name || 'Keine Kategorie';
}

function clearFilters() {
  keyword.value = '';
  selectedCategory.value = '';
  loadProducts();
}

// ===== IMAGE HANDLING =====
const handleImage = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast('Bild ist zu groß (max. 5MB)', 'error');
    if (fileInput.value) fileInput.value.value = '';
    return;
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showToast('Ungültiges Bildformat', 'error');
    if (fileInput.value) fileInput.value.value = '';
    return;
  }

  // Cleanup old blob URL
  if (imageSelectionPreview.value && imageSelectionPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imageSelectionPreview.value);
  }

  imageSelection.value = file;
  imageSelectionPreview.value = URL.createObjectURL(file);
};

const removeSelectedImage = () => {
  imageSelection.value = null;

  if (imageSelectionPreview.value && imageSelectionPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imageSelectionPreview.value);
  }

  imageSelectionPreview.value = null;
  imagePreview.value = null;

  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// ===== MODAL FUNCTIONS =====
const openCreateModal = () => {
  editMode.value = false;
  resetForm();
  showModal.value = true;
};

const openEditModal = (product) => {
  editMode.value = true;
  showModal.value = true;
  id.value = product.id;
  title.value = product.title || '';
  description.value = product.description || '';
  imageSelection.value = null;
  imageSelectionPreview.value = null;
  imagePreview.value = product.image ? getImageUrl(product.image) : null;

  // Category ID extrahieren
  if (typeof product.category_id === 'object' && product.category_id !== null) {
    categorySelection.value = product.category_id.id || '';
  } else {
    categorySelection.value = product.category_id || '';
  }

  isActive.value = product.isActive === 1 || product.isActive === '1' || product.isActive === true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(resetForm, 300);
};

const confirmDelete = (product) => {
  productToDelete.value = product;
  showDeleteModal.value = true;
};

const resetForm = () => {
  title.value = '';
  description.value = '';

  if (imageSelectionPreview.value && imageSelectionPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imageSelectionPreview.value);
  }

  imageSelection.value = null;
  imageSelectionPreview.value = null;
  imagePreview.value = null;
  categorySelection.value = '';
  isActive.value = true;
  id.value = '';

  if (fileInput.value) {
    fileInput.value.value = '';
  }

  isSubmitting.value = false;
};

// ===== CRUD FUNCTIONS =====
const storeProduct = async () => {
  if (!title.value.trim()) {
    showToast('Titel ist erforderlich', 'error');
    return;
  }

  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const formData = new FormData();
  formData.append('title', title.value.trim());
  formData.append('description', description.value.trim() || '');
  formData.append('category_id', categorySelection.value || '');
  formData.append('isActive', isActive.value ? '1' : '0');
  formData.append('price', '0.00');

  if (imageSelection.value instanceof File) {
    formData.append('image', imageSelection.value);
  }

  try {
    await productStore.storeProduct(formData);
    closeModal();
    showToast('Produkt erfolgreich erstellt!', 'success');
    await loadProducts();
  } catch (error) {
    console.error('Fehler beim Erstellen:', error);
    const errorMsg = error?.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()[0]
      : error?.response?.data?.message || 'Fehler beim Erstellen';
    showToast(errorMsg, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const updateProduct = async () => {
  if (!title.value.trim()) {
    showToast('Titel ist erforderlich', 'error');
    return;
  }

  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const formData = new FormData();
  formData.append('title', title.value.trim());
  formData.append('description', description.value.trim() || '');
  formData.append('category_id', categorySelection.value || '');
  formData.append('isActive', isActive.value ? '1' : '0');
  formData.append('price', '0.00');

  if (imageSelection.value instanceof File) {
    formData.append('image', imageSelection.value);
  }

  try {
    await productStore.updateProduct(id.value, formData);
    closeModal();
    showToast('Produkt erfolgreich aktualisiert!', 'success');
    await loadProducts();
  } catch (error) {
    console.error('Fehler beim Aktualisieren:', error);
    const errorMsg = error?.response?.data?.errors
      ? Object.values(error.response.data.errors).flat()[0]
      : error?.response?.data?.message || 'Fehler beim Aktualisieren';
    showToast(errorMsg, 'error');
  } finally {
    isSubmitting.value = false;
  }
};

const deleteProduct = async () => {
  if (isDeleting.value || !productToDelete.value) return;

  isDeleting.value = true;

  try {
    await productStore.removeProduct(productToDelete.value.id);
    showDeleteModal.value = false;
    productToDelete.value = null;
    showToast('Produkt erfolgreich gelöscht!', 'success');
    await loadProducts();
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
    showToast(
      error?.response?.data?.message || 'Fehler beim Löschen',
      'error'
    );
  } finally {
    isDeleting.value = false;
  }
};
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

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div {
  transform: scale(0.95) translateY(20px);
}

.modal-leave-to > div {
  transform: scale(0.95) translateY(20px);
}

/* Mobile Modal - slide up */
@media (max-width: 768px) {
  .modal-enter-from > div {
    transform: translateY(100%);
  }
  .modal-leave-to > div {
    transform: translateY(100%);
  }
}

/* Toast Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Line Clamp */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>