<template>
  <section class="bg-gray-300 p-4 md:p-8 min-h-screen">
    <div class="max-w-7xl mx-auto">

      <!-- Header & Filter -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Newspaper class="w-8 h-8 text-white" />
              </div>
              Neuigkeiten
            </h1>
            <p class="text-gray-600">Verwalte deine News und Artikel</p>
          </div>
          <button
            @click="openCreateModal"
            class="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 font-semibold shadow-lg"
          >
            <Plus class="w-5 h-5" />
            <span>Neue News</span>
          </button>
        </div>

        <!-- Filter Bar -->
        <div class="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="relative md:col-span-2">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="keyword"
                @input="debouncedSearch"
                placeholder="News durchsuchen..."
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <select
              v-model="filter"
              class="border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="all">🔄 Alle Status</option>
              <option value="active">✅ Nur Aktive</option>
              <option value="inactive">❌ Nur Inaktive</option>
            </select>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-6 bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-100">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p class="text-3xl font-bold text-blue-600">{{ totalNews }}</p>
              <p class="text-sm text-gray-600 font-medium mt-1">News gesamt</p>
            </div>
            <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <p class="text-3xl font-bold text-green-600">{{ activeNewsCount }}</p>
              <p class="text-sm text-gray-600 font-medium mt-1">Aktiv</p>
            </div>
            <div class="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl col-span-2 md:col-span-1">
              <p class="text-3xl font-bold text-red-600">{{ inactiveNewsCount }}</p>
              <p class="text-sm text-gray-600 font-medium mt-1">Inaktiv</p>
            </div>
          </div>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="newsStore.loading && !newsStore.news.length" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <Loader2 class="w-16 h-16 text-blue-600 animate-spin" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p class="text-gray-600 font-semibold mt-6 text-lg">Lade Neuigkeiten...</p>
      </div>

      <!-- ERROR -->
      <div
        v-else-if="newsStore.error && !newsStore.news.length"
        class="bg-white rounded-2xl shadow-md border-2 border-red-200 p-8 text-center"
      >
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <p class="text-red-600 font-semibold text-lg mb-4">
          {{ newsStore.error?.message || 'Fehler beim Laden' }}
        </p>
        <button
          @click="loadNews"
          class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl transition font-semibold"
        >
          Erneut versuchen
        </button>
      </div>

      <!-- Kartenansicht -->
      <div
        v-else-if="filteredNews.length"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
      >
        <article
          v-for="(news, index) in filteredNews"
          :key="news.id"
          class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
          :style="`animation: fadeInUp 0.5s ease-out ${index * 0.05}s both`"
        >
          <!-- Bild -->
          <div class="relative h-48 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              v-if="news.image"
              :src="getImageUrl(news.image)"
              :alt="news.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              @error="handleImageError"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <Newspaper class="w-12 h-12" />
            </div>

            <!-- isActive Toggle Button -->
            <button
              @click.stop="toggleActive(news.id)"
              :disabled="isToggling"
              :class="[
                'absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 transition-all backdrop-blur-sm',
                news.isActive === 1 || news.isActive === '1' || news.isActive === true
                  ? 'bg-green-500/90 text-white hover:bg-green-600'
                  : 'bg-red-500/90 text-white hover:bg-red-600',
                isToggling && 'opacity-50 cursor-not-allowed'
              ]"
            >
              <component
                :is="news.isActive === 1 || news.isActive === '1' || news.isActive === true ? CheckCircle : XCircle"
                class="w-3.5 h-3.5"
              />
              {{ news.isActive === 1 || news.isActive === '1' || news.isActive === true ? 'Aktiv' : 'Inaktiv' }}
            </button>

            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span class="text-white text-sm font-bold flex items-center gap-2">
                <Eye class="w-4 h-4" />
                Details ansehen
              </span>
            </div>
          </div>

          <!-- Details -->
          <div class="p-5 space-y-2">
            <h2 class="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">
              {{ news.title }}
            </h2>
            <p class="text-gray-600 line-clamp-2 text-sm min-h-[2.5rem]">
              {{ news.description || 'Keine Beschreibung verfügbar' }}
            </p>
            <div class="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
              <Calendar class="w-3.5 h-3.5" />
              <span>{{ formatDate(news.created_at) }}</span>
            </div>
          </div>

          <!-- Aktionen -->
          <div class="px-5 pb-5 flex gap-2">
            <button
              @click="openEditModal(news)"
              class="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-4 py-2.5 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md"
            >
              <Edit2 class="w-4 h-4" />
              Bearbeiten
            </button>
            <button
              @click="confirmDelete(news)"
              class="flex-1 bg-gradient-to-r from-red-50 to-red-100 text-red-600 px-4 py-2.5 rounded-xl hover:from-red-100 hover:to-red-200 transition-all flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md"
            >
              <Trash2 class="w-4 h-4" />
              Löschen
            </button>
          </div>
        </article>
      </div>

      <!-- Keine News -->
      <div v-else class="bg-white rounded-2xl shadow-md p-12 md:p-20 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Newspaper class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-500 text-xl font-semibold mb-2">
          {{ keyword ? 'Keine Ergebnisse gefunden' : 'Keine Neuigkeiten vorhanden' }}
        </p>
        <p class="text-gray-400 text-sm mb-6">
          {{ keyword ? 'Versuche einen anderen Suchbegriff' : 'Erstelle deine erste News mit dem Button oben' }}
        </p>
        <button
          v-if="!keyword"
          @click="openCreateModal"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
        >
          <Plus class="w-5 h-5" />
          Erste News erstellen
        </button>
        <button
          v-else
          @click="clearSearch"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
        >
          <X class="w-5 h-5" />
          Suche zurücksetzen
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
            <div @click.stop class="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
              <!-- Header -->
              <div class="sticky top-0 flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100 z-10 rounded-t-2xl">
                <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div class="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                    <component :is="editMode ? Edit2 : Plus" class="w-5 h-5 text-blue-600" />
                  </div>
                  {{ editMode ? 'News bearbeiten' : 'Neue News' }}
                </h2>
                <button
                  @click="closeModal"
                  class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-white rounded-xl"
                >
                  <X class="w-6 h-6" />
                </button>
              </div>

              <!-- Bildvorschau -->
              <div v-if="imageSelectionPreview || imagePreview" class="p-6 pb-0">
                <div class="relative group">
                  <img
                    :src="imageSelectionPreview || imagePreview"
                    class="w-full h-56 md:h-64 object-cover rounded-xl shadow-lg border-2 border-gray-200"
                    alt="Vorschau"
                  />
                  <button
                    @click="removeImage"
                    type="button"
                    class="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                  >
                    <X class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <!-- Form -->
              <form @submit.prevent="editMode ? updateNews() : storeNews()" class="p-6 space-y-5">
                <div class="space-y-2">
                  <label class="text-gray-700 font-bold flex items-center gap-2">
                    <FileText class="w-4 h-4 text-blue-600" />
                    Titel <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="title"
                    type="text"
                    placeholder="z.B. Neue Ausstellung eröffnet"
                    required
                    maxlength="255"
                    class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-gray-700 font-bold flex items-center gap-2">
                    <AlignLeft class="w-4 h-4 text-blue-600" />
                    Kurzbeschreibung
                  </label>
                  <input
                    v-model="description"
                    type="text"
                    placeholder="Kurze Zusammenfassung..."
                    maxlength="500"
                    class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div class="space-y-2">
                  <label class="text-gray-700 font-bold flex items-center gap-2">
                    <ImageIcon class="w-4 h-4 text-blue-600" />
                    Bild hochladen
                  </label>
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleImage"
                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                    class="w-full border-2 border-gray-200 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 file:text-white hover:file:shadow-lg file:cursor-pointer cursor-pointer file:font-semibold transition"
                  />
                  <p class="text-xs text-gray-500 flex items-center gap-1.5">
                    <Info class="w-3.5 h-3.5" />
                    Empfohlen: 1200x800px, max. 5MB (JPG, PNG, GIF, WebP)
                  </p>
                </div>

                <div class="space-y-2">
                  <label class="text-gray-700 font-bold flex items-center gap-2">
                    <FileText class="w-4 h-4 text-blue-600" />
                    Vollständiger Text
                  </label>
                  <textarea
                    v-model="text"
                    rows="6"
                    placeholder="Ausführlicher Newstext..."
                    class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  ></textarea>
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
                    News ist aktiv und sichtbar
                  </label>
                </div>

                <!-- Footer Buttons -->
                <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <button
                    type="button"
                    @click="closeModal"
                    :disabled="isSubmitting"
                    class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    :disabled="isSubmitting || !title.trim()"
                    class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                    <Save v-else class="w-5 h-5" />
                    {{ editMode ? 'Änderungen speichern' : 'News erstellen' }}
                  </button>
                </div>
              </form>
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
                <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">News löschen?</h3>
                <p class="text-gray-600 mb-2">
                  Möchtest du wirklich löschen:
                </p>
                <p class="font-bold text-gray-900 mb-6 text-lg">
                  "{{ newsToDelete?.title }}"
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
                    @click="deleteNews"
                    :disabled="isDeleting"
                    class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Loader2 v-if="isDeleting" class="w-5 h-5 animate-spin" />
                    <Trash2 v-else class="w-5 h-5" />
                    Löschen
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
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useNewsStore } from '@/stores/News';
import {
  Plus, Edit2, Trash2, X, Save, CheckCircle, XCircle, ImageIcon,
  FileText, AlignLeft, Newspaper, Loader2, AlertCircle, AlertTriangle,
  CheckCircle2, Info, Calendar, Search, Eye
} from 'lucide-vue-next';

// ===== STORE & STATE =====
const newsStore = useNewsStore();

const showModal = ref(false);
const showDeleteModal = ref(false);
const editMode = ref(false);
const newsId = ref('');
const title = ref('');
const description = ref('');
const text = ref('');
const imageSelection = ref(null);
const imageSelectionPreview = ref(null);
const imagePreview = ref(null);
const isActive = ref(true);
const keyword = ref('');
const filter = ref('all');
const newsToDelete = ref(null);
const fileInput = ref(null);
const isSubmitting = ref(false);
const isDeleting = ref(false);
const isToggling = ref(false);

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
const loadNews = async () => {
  try {
    await newsStore.fetchNews(keyword.value);
  } catch (error) {
    console.error('Fehler beim Laden:', error);
  }
};

onMounted(loadNews);

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
    loadNews();
  }, 300);
};

// ===== COMPUTED =====
const totalNews = computed(() =>
  Array.isArray(newsStore.news) ? newsStore.news.length : 0
);

const activeNewsCount = computed(() => {
  if (!Array.isArray(newsStore.news)) return 0;
  return newsStore.news.filter(n =>
    n.isActive === 1 ||
    n.isActive === '1' ||
    n.isActive === true
  ).length;
});

const inactiveNewsCount = computed(() => {
  if (!Array.isArray(newsStore.news)) return 0;
  return newsStore.news.filter(n =>
    n.isActive === 0 ||
    n.isActive === '0' ||
    n.isActive === false
  ).length;
});

const filteredNews = computed(() => {
  if (!Array.isArray(newsStore.news)) return [];

  return newsStore.news.filter(n => {
    if (filter.value === 'active') {
      return n.isActive === 1 || n.isActive === '1' || n.isActive === true;
    }
    if (filter.value === 'inactive') {
      return n.isActive === 0 || n.isActive === '0' || n.isActive === false;
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

function clearSearch() {
  keyword.value = "";
  loadNews();
}

function formatDate(dateString) {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return '';
  }
}

// ===== IMAGE HANDLING =====
const handleImage = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast("Bild ist zu groß (max. 5MB)", "error");
    if (fileInput.value) fileInput.value.value = '';
    return;
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showToast("Ungültiges Bildformat", "error");
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

const removeImage = () => {
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

const openEditModal = (news) => {
  editMode.value = true;
  showModal.value = true;
  newsId.value = news.id;
  title.value = news.title || '';
  description.value = news.description || '';
  text.value = news.text || '';
  imageSelection.value = null;
  imageSelectionPreview.value = null;
  imagePreview.value = news.image ? getImageUrl(news.image) : null;
  isActive.value = news.isActive === 1 || news.isActive === '1' || news.isActive === true;
};

const closeModal = () => {
  showModal.value = false;
  setTimeout(resetForm, 300);
};

const confirmDelete = (news) => {
  newsToDelete.value = news;
  showDeleteModal.value = true;
};

const resetForm = () => {
  title.value = '';
  description.value = '';
  text.value = '';
  imageSelection.value = null;

  if (imageSelectionPreview.value && imageSelectionPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imageSelectionPreview.value);
  }

  imageSelectionPreview.value = null;
  imagePreview.value = null;
  isActive.value = true;
  newsId.value = '';

  if (fileInput.value) {
    fileInput.value.value = '';
  }

  isSubmitting.value = false;
};

// ===== CRUD FUNCTIONS =====
const storeNews = async () => {
  if (!title.value.trim()) {
    showToast('Titel ist erforderlich', 'error');
    return;
  }

  if (isSubmitting.value) return;
  isSubmitting.value = true;

  const formData = new FormData();
  formData.append('title', title.value.trim());
  formData.append('description', description.value.trim() || '');
  formData.append('text', text.value.trim() || '');
  formData.append('isActive', isActive.value ? '1' : '0');

  if (imageSelection.value instanceof File) {
    formData.append('image', imageSelection.value);
  }

  try {
    await newsStore.createNews(formData);
    closeModal();
    showToast('News erfolgreich erstellt!', 'success');
    await loadNews();
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

const updateNews = async () => {
  if (!title.value.trim()) {
    showToast('Titel ist erforderlich', 'error');
    return;
  }

  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    await newsStore.updateNews(
      newsId.value,
      title.value.trim(),
      description.value.trim() || '',
      imageSelection.value, // File oder null
      text.value.trim() || '',
      isActive.value
    );
    closeModal();
    showToast('News erfolgreich aktualisiert!', 'success');
    await loadNews();
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

const deleteNews = async () => {
  if (isDeleting.value || !newsToDelete.value) return;

  isDeleting.value = true;

  try {
    await newsStore.deleteNews(newsToDelete.value.id);
    showDeleteModal.value = false;
    newsToDelete.value = null;
    showToast('News erfolgreich gelöscht!', 'success');
    await loadNews();
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

const toggleActive = async (id) => {
  if (isToggling.value) return;

  isToggling.value = true;

  try {
    await newsStore.toggleActive(id);
    showToast('Status geändert!', 'success');
    await loadNews();
  } catch (error) {
    console.error('Fehler beim Ändern:', error);
    showToast('Fehler beim Ändern des Status', 'error');
  } finally {
    isToggling.value = false;
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
.line-clamp-1,
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-1 {
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  -webkit-line-clamp: 2;
}
</style>