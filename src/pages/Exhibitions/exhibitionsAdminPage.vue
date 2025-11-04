<template>
  <section class="bg-gray-300 to-gray-300 p-4 md:p-8 min-h-screen">
    <div class="max-w-7xl mx-auto">

      <!-- HEADER -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <ImageIcon class="w-8 h-8 text-white" />
              </div>
              Ausstellungen
            </h1>
            <p class="text-gray-600">Verwalte deine Ausstellungen und Galerien</p>
          </div>
          <button
            @click="openCreateModal"
            class="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2 font-semibold shadow-lg"
          >
            <Plus class="w-5 h-5" />
            <span>Neue Ausstellung</span>
          </button>
        </div>

        <!-- FILTERS -->
        <div class="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="relative md:col-span-2">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="keyword"
                placeholder="Ausstellungen durchsuchen..."
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div class="flex gap-3">
              <select
                v-model="sort"
                class="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              >
                <option value="desc">📅 Neueste zuerst</option>
                <option value="asc">📅 Älteste zuerst</option>
              </select>
              <button
                @click="store.fetchExhibitions(keyword, sort)"
                class="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all flex items-center gap-2 font-semibold shadow-sm hover:shadow-md"
              >
                <RefreshCw class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-6 bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-100">
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <p class="text-3xl font-bold text-purple-600">{{ totalExhibitions }}</p>
              <p class="text-sm text-gray-600 font-medium mt-1">Ausstellungen</p>
            </div>
            <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p class="text-3xl font-bold text-blue-600">{{ filteredExhibitions.length }}</p>
              <p class="text-sm text-gray-600 font-medium mt-1">Gefiltert</p>
            </div>
            <div class="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl col-span-2 md:col-span-1">
              <p class="text-3xl font-bold text-pink-600">{{ exhibitionsWithImages }}</p>
              <p class="text-sm text-gray-600 font-medium mt-1">Mit Bildern</p>
            </div>
          </div>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="store.loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <Loader2 class="w-16 h-16 text-purple-600 animate-spin" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p class="text-gray-600 font-semibold mt-6 text-lg">Lade Ausstellungen...</p>
      </div>

      <!-- ERROR -->
      <div
        v-else-if="store.error"
        class="bg-white rounded-2xl shadow-md border-2 border-red-200 p-8 text-center"
      >
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <p class="text-red-600 font-semibold text-lg mb-4">Fehler beim Laden: {{ store.error.message }}</p>
        <button
          @click="store.fetchExhibitions(keyword, sort)"
          class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl transition font-semibold"
        >
          Erneut versuchen
        </button>
      </div>

      <!-- GRID -->
      <div
        v-else-if="filteredExhibitions.length"
        class="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <article
          v-for="(exhibition, index) in filteredExhibitions"
          :key="exhibition.id"
          @click="openViewModal(exhibition)"
          class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group"
          :style="`animation: fadeInUp 0.5s ease-out ${index * 0.05}s both`"
        >
          <div class="relative h-48 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              v-if="exhibition.image"
              :src="exhibition.image"
              :alt="exhibition.title"
              class="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <ImageIcon class="w-12 h-12" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span class="text-white text-sm font-bold flex items-center gap-2">
                <Eye class="w-4 h-4" />
                Details ansehen
              </span>
            </div>
          </div>
          <div class="p-5">
            <h2 class="text-lg font-bold text-gray-900 truncate mb-2 group-hover:text-purple-600 transition">
              {{ exhibition.title }}
            </h2>
            <p class="text-gray-600 line-clamp-2 text-sm mb-3 min-h-[2.5rem]">
              {{ exhibition.description || "Keine Beschreibung verfügbar." }}
            </p>
            <div class="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <Calendar class="w-3.5 h-3.5" />
                <span>{{ formatDate(exhibition.created_at) }}</span>
              </div>
              <span
                v-if="exhibition.isActive"
                class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold"
              >
                <Eye class="w-3 h-3" />
                Aktiv
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold"
              >
                Inaktiv
              </span>
            </div>
          </div>
        </article>
      </div>

      <!-- NO RESULTS -->
      <div v-else class="bg-white rounded-2xl shadow-md p-12 md:p-20 text-center">
        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ImageIcon class="w-10 h-10 text-gray-400" />
        </div>
        <p class="text-gray-500 text-xl font-semibold mb-2">Keine Ausstellungen vorhanden</p>
        <p class="text-gray-400 text-sm mb-6">Erstelle deine erste Ausstellung mit dem Button oben</p>
        <button
          @click="openCreateModal"
          class="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold"
        >
          <Plus class="w-5 h-5" />
          Erste Ausstellung erstellen
        </button>
      </div>
    </div>

    <!-- VIEW MODAL -->
    <teleport to="body">
      <transition name="modal">
        <div
          v-if="modal.visible && modal.type === 'view'"
          @click="closeModal"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
        >
          <div @click.stop class="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-3xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 flex justify-between items-start gap-3 p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100 z-10 rounded-t-2xl">
              <div class="flex items-start gap-3 flex-1">
                <div class="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex-shrink-0">
                  <ImageIcon class="w-6 h-6 text-purple-600" />
                </div>
                <h2 class="text-2xl font-bold text-gray-900 leading-tight">
                  {{ selectedExhibition.title }}
                </h2>
              </div>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-white rounded-xl flex-shrink-0"
              >
                <X class="w-6 h-6" />
              </button>
            </div>

            <div class="p-6 space-y-4">
              <img
                v-if="selectedExhibition.image"
                :src="selectedExhibition.image"
                :alt="selectedExhibition.title"
                class="rounded-xl w-full max-h-96 object-cover shadow-lg border-2 border-gray-200"
              />
              <div v-if="selectedExhibition.description" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FileText class="w-4 h-4 text-blue-600" />
                  Kurzbeschreibung
                </h3>
                <p class="text-gray-800 leading-relaxed">{{ selectedExhibition.description }}</p>
              </div>
              <div v-if="selectedExhibition.text" class="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <h3 class="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <AlignLeft class="w-4 h-4 text-gray-600" />
                  Detaillierte Beschreibung
                </h3>
                <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ selectedExhibition.text }}</p>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500 pt-3 border-t">
                <Calendar class="w-4 h-4" />
                <span>Erstellt am: {{ formatDate(selectedExhibition.created_at) }}</span>
              </div>
              <div class="flex items-center gap-2 pt-2">
                <span
                  v-if="selectedExhibition.isActive"
                  class="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-semibold"
                >
                  <Eye class="w-4 h-4" />
                  Öffentlich sichtbar
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold"
                >
                  Nicht öffentlich
                </span>
              </div>
            </div>

            <div class="sticky bottom-0 p-6 border-t bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row gap-3">
              <button
                @click="openEditModal(selectedExhibition)"
                class="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 text-white px-4 py-3 rounded-xl hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2"
              >
                <Edit2 class="w-5 h-5" />
                Bearbeiten
              </button>
              <button
                @click="confirmDelete(selectedExhibition.id)"
                class="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2"
              >
                <Trash2 class="w-5 h-5" />
                Löschen
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- EDIT/CREATE MODAL -->
    <teleport to="body">
      <transition name="modal">
        <div
          v-if="modal.visible && modal.type === 'edit'"
          @click="closeModal"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4"
        >
          <div @click.stop class="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 flex justify-between items-center p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100 z-10 rounded-t-2xl">
              <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div class="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                  <component :is="editMode ? Edit2 : Plus" class="w-5 h-5 text-purple-600" />
                </div>
                {{ editMode ? 'Ausstellung bearbeiten' : 'Neue Ausstellung' }}
              </h2>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-white rounded-xl"
              >
                <X class="w-6 h-6" />
              </button>
            </div>

            <!-- Bildvorschau -->
            <div v-if="imagePreview" class="p-6 pb-0">
              <div class="relative group">
                <img
                  :src="imagePreview"
                  class="w-full h-56 md:h-64 object-cover rounded-xl shadow-lg border-2 border-gray-200"
                  alt="Vorschau"
                />
                <button
                  v-if="imageFile"
                  @click="removeImage"
                  type="button"
                  class="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Form -->
            <div class="p-6 space-y-5">
              <div class="space-y-2">
                <label class="text-gray-700 font-bold flex items-center gap-2">
                  <FileText class="w-4 h-4 text-purple-600" />
                  Titel <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.title"
                  placeholder="z.B. Moderne Kunst 2024"
                  required
                  class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                />
              </div>

              <div class="space-y-2">
                <label class="text-gray-700 font-bold flex items-center gap-2">
                  <AlignLeft class="w-4 h-4 text-purple-600" />
                  Kurzbeschreibung
                </label>
                <textarea
                  v-model="form.description"
                  placeholder="Kurze Zusammenfassung der Ausstellung..."
                  rows="3"
                  class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label class="text-gray-700 font-bold flex items-center gap-2">
                  <ImageIcon class="w-4 h-4 text-purple-600" />
                  Bild hochladen
                </label>
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleImage"
                  accept="image/*"
                  class="w-full border-2 border-gray-200 rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-purple-500 file:to-purple-600 file:text-white hover:file:shadow-lg file:cursor-pointer cursor-pointer file:font-semibold transition"
                />
                <p class="text-xs text-gray-500 flex items-center gap-1.5">
                  <Info class="w-3.5 h-3.5" />
                  Empfohlen: 1200x800px, max. 5MB
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-gray-700 font-bold flex items-center gap-2">
                  <FileText class="w-4 h-4 text-purple-600" />
                  Detaillierte Beschreibung
                </label>
                <textarea
                  v-model="form.text"
                  placeholder="Ausführliche Beschreibung der Ausstellung..."
                  rows="6"
                  class="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>

              <div class="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                <input
                  type="checkbox"
                  id="isActive"
                  v-model="form.isActive"
                  class="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                />
                <label for="isActive" class="text-gray-700 font-bold cursor-pointer flex-1 flex items-center gap-2">
                  <Eye class="w-4 h-4 text-purple-600" />
                  Ausstellung aktiv (öffentlich sichtbar)
                </label>
              </div>

              <!-- Footer Buttons -->
              <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  @click="saveExhibition"
                  :disabled="isSubmitting || !form.title.trim()"
                  class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
                  <Save v-else class="w-5 h-5" />
                  {{ editMode ? 'Speichern' : 'Erstellen' }}
                </button>
              </div>
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
              <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">Ausstellung löschen?</h3>
              <p class="text-gray-600 mb-6">
                Möchtest du diese Ausstellung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <button
                  @click="showDeleteModal = false"
                  class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold"
                >
                  Abbrechen
                </button>
                <button
                  @click="deleteExhibition"
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

    <!-- TOASTS -->
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
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useExhibitionsStore } from "@/stores/Exhibitions";
import {
  Plus, Edit2, Trash2, X, Save, ImageIcon, FileText, AlignLeft,
  Calendar, Loader2, AlertCircle, AlertTriangle, CheckCircle2,
  XCircle, Info, RefreshCw, Search, Eye
} from 'lucide-vue-next'

const store = useExhibitionsStore();
const keyword = ref("");
const sort = ref("desc");

const modal = ref({
  visible: false,
  type: "view", // view | edit
});

const selectedExhibition = ref({});
const editMode = ref(false);
const showDeleteModal = ref(false);
const exhibitionToDelete = ref(null);
const isSubmitting = ref(false);
const isDeleting = ref(false);

const form = ref({ id: "", title: "", description: "", image: "", text: "", isActive: true });
const imageFile = ref(null);
const imagePreview = ref(null);
const fileInput = ref(null);

// TOASTS
let toastId = 0
const toasts = ref([]);
const showToast = (message, type = 'success') => {
  const id = ++toastId
  toasts.value.push({ id, message, type });
  setTimeout(() => toasts.value = toasts.value.filter(t => t.id !== id), 4000);
}
const removeToast = (id) => toasts.value = toasts.value.filter(t => t.id !== id)

onMounted(() => store.fetchExhibitions(keyword.value, sort.value));

const filteredExhibitions = computed(() => {
  const list = Array.isArray(store.exhibitions) ? store.exhibitions : [];
  const key = keyword.value.toLowerCase();
  return list.filter((e) =>
    [e.title, e.description].some((f) => f?.toLowerCase().includes(key))
  );
});

const totalExhibitions = computed(() =>
  Array.isArray(store.exhibitions) ? store.exhibitions.length : 0
)

const exhibitionsWithImages = computed(() =>
  Array.isArray(store.exhibitions) ? store.exhibitions.filter(e => e.image).length : 0
)

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// MODAL HANDLING
function openViewModal(exhibition) {
  selectedExhibition.value = exhibition;
  modal.value = { visible: true, type: "view" };
}

function openCreateModal() {
  editMode.value = false;
  form.value = { id: "", title: "", description: "", image: "", text: "", isActive: true };
  imageFile.value = null;
  imagePreview.value = null;
  if (fileInput.value) fileInput.value.value = '';
  modal.value = { visible: true, type: "edit" };
}

function openEditModal(exhibition) {
  editMode.value = true;
  selectedExhibition.value = exhibition;

  // boolean sauber normalisieren (1/"1"/true => true)
  const isActiveValue =
    exhibition.isActive === true ||
    exhibition.isActive === 1 ||
    exhibition.isActive === "1";

  form.value = {
    id: exhibition.id ?? "",
    title: exhibition.title ?? "",
    description: exhibition.description ?? "",
    text: exhibition.text ?? "",
    image: exhibition.image ?? "",
    isActive: isActiveValue
  };
  imageFile.value = null;
  imagePreview.value = exhibition.image || null;
  if (fileInput.value) fileInput.value.value = '';
  modal.value = { visible: true, type: "edit" };
}

function closeModal() {
  modal.value.visible = false;
  setTimeout(() => {
    form.value = { title: "", description: "", image: "", text: "", isActive: true };
    if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview.value);
    }
    imageFile.value = null;
    imagePreview.value = null;
    if (fileInput.value) fileInput.value.value = '';
    isSubmitting.value = false;
  }, 300);
}

function confirmDelete(id) {
  exhibitionToDelete.value = id;
  showDeleteModal.value = true;
  closeModal();
}

// IMAGE
function handleImage(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast("Bild ist zu groß (max. 5MB)", "error");
    return;
  }

  imageFile.value = file;
  if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = URL.createObjectURL(file);
}

function removeImage() {
  imageFile.value = null;
  if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(imagePreview.value);
  }
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

// CRUD
async function saveExhibition() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const title = form.value.title?.trim() ?? "";
    const description = form.value.description?.trim() ?? "";
    const text = form.value.text?.trim() ?? "";
    const isActive = !!form.value.isActive;

    if (editMode.value) {
      // Update: Service entscheidet JSON vs. FormData anhand imageFile (File/null)
      const id = form.value.id || selectedExhibition.value.id;
      await store.updateExhibition(
        id,
        title,
        description,
        imageFile.value,   // File oder null
        text,
        isActive
      );
      showToast("Ausstellung erfolgreich aktualisiert!", "success");
    } else {
      // Create: immer FormData
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("text", text);
      fd.append("isActive", isActive ? 1 : 0);
      if (imageFile.value) {
        fd.append("image", imageFile.value);
      }

      await store.createExhibition(fd);
      showToast("Ausstellung erfolgreich erstellt!", "success");
    }

    closeModal();
    await store.fetchExhibitions(keyword.value, sort.value);
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    if (error?.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat();
      showToast(errors[0] || "Validierungsfehler", "error");
    } else if (error?.response?.data?.message) {
      showToast(error.response.data.message, "error");
    } else {
      showToast("Fehler beim Speichern", "error");
    }
  } finally {
    isSubmitting.value = false;
  }
}

async function deleteExhibition() {
  if (isDeleting.value) return;
  isDeleting.value = true;
  try {
    await store.deleteExhibition(exhibitionToDelete.value);
    showToast("Ausstellung erfolgreich gelöscht!", "success");
    showDeleteModal.value = false;
    exhibitionToDelete.value = null;
    await store.fetchExhibitions(keyword.value, sort.value);
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    showToast("Fehler beim Löschen", "error");
  } finally {
    isDeleting.value = false;
  }
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Modal Transitions */
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-active > div, .modal-leave-active > div { transition: transform 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > div { transform: scale(0.95) translateY(20px); }
.modal-leave-to > div { transform: scale(0.95) translateY(20px); }

/* Mobile Modal - slide up */
@media (max-width: 768px) {
  .modal-enter-from > div { transform: translateY(100%); }
  .modal-leave-to > div { transform: translateY(100%); }
}

/* Toast Transitions */
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { transform: translateX(100%); opacity: 0; }
.toast-leave-to { opacity: 0; transform: translateX(50px); }
.toast-move { transition: transform 0.3s ease; }
</style>
section