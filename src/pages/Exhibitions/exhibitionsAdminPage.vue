<template>
  <section class="bg-gray-300 min-h-screen py-6 sm:py-10 px-3 sm:px-6">
    <div class="max-w-7xl mx-auto space-y-6 sm:space-y-8">

      <!-- HEADER -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <ImageIcon class="w-7 h-7 sm:w-9 sm:h-9 text-gray-700" />
            Ausstellungen
          </h1>
          <button
            @click="openCreateModal"
            class="bg-gray-900 hover:bg-gray-800 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 font-medium text-sm sm:text-base"
          >
            <Plus class="w-4 h-4 sm:w-5 sm:h-5" />
            <span class="hidden sm:inline">Neue Ausstellung</span>
            <span class="sm:hidden">Neu</span>
          </button>
        </div>

        <!-- FILTERS -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="keyword"
              placeholder="Ausstellungen durchsuchen..."
              class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
            />
          </div>
          <div class="flex gap-3">
            <select
              v-model="sort"
              class="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 bg-white shadow-sm focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
            >
              <option value="desc">Neueste zuerst</option>
              <option value="asc">Älteste zuerst</option>
            </select>
            <button
              @click="store.fetchExhibitions(keyword, sort)"
              class="px-3 sm:px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:bg-gray-200 transition flex items-center gap-2 text-sm font-medium"
            >
              <RefreshCw class="w-4 h-4" />
              <span class="hidden sm:inline">Aktualisieren</span>
            </button>
          </div>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="store.loading" class="flex flex-col items-center justify-center py-12 sm:py-16">
        <Loader2 class="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 animate-spin mb-3" />
        <p class="text-gray-600 font-medium text-sm sm:text-base">Lade Ausstellungen...</p>
      </div>

      <!-- ERROR -->
      <div
        v-else-if="store.error"
        class="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
      >
        <AlertCircle class="w-10 h-10 sm:w-12 sm:h-12 text-red-600 mx-auto mb-3" />
        <p class="text-red-600 font-medium text-sm sm:text-base">Fehler beim Laden: {{ store.error.message }}</p>
      </div>

      <!-- GRID -->
      <div
        v-else-if="filteredExhibitions.length"
        class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <article
          v-for="exhibition in filteredExhibitions"
          :key="exhibition.id"
          @click="openViewModal(exhibition)"
          class="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
          <div class="relative h-40 sm:h-48 bg-gray-100 overflow-hidden">
            <img
              v-if="exhibition.image"
              :src="exhibition.image"
              :alt="exhibition.title"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <ImageIcon class="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span class="text-white text-xs font-medium flex items-center gap-1.5">
                <Eye class="w-3.5 h-3.5" />
                Ansehen
              </span>
            </div>
          </div>
          <div class="p-4 sm:p-5">
            <h2 class="text-base sm:text-lg font-semibold text-gray-900 truncate mb-2">
              {{ exhibition.title }}
            </h2>
            <p class="text-gray-600 line-clamp-2 text-xs sm:text-sm mb-3 min-h-[2.5rem]">
              {{ exhibition.description || "Keine Beschreibung verfügbar." }}
            </p>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <Calendar class="w-3.5 h-3.5" />
              <span>{{ formatDate(exhibition.created_at) }}</span>
            </div>
          </div>
        </article>
      </div>

      <!-- NO RESULTS -->
      <div v-else class="bg-white rounded-xl sm:rounded-2xl shadow-sm p-12 sm:p-16 text-center">
        <ImageIcon class="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-base sm:text-lg font-medium">Keine Ausstellungen vorhanden</p>
        <p class="text-gray-400 text-xs sm:text-sm mt-2">Erstelle deine erste Ausstellung mit dem Button oben</p>
      </div>
    </div>

    <!-- VIEW MODAL -->
    <teleport to="body">
      <transition name="modal">
        <div
          v-if="modal.visible && modal.type === 'view'"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="sticky top-0 flex justify-between items-start gap-3 p-4 sm:p-6 border-b bg-white z-10 rounded-t-2xl">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 flex-1 leading-tight">
                {{ selectedExhibition.title }}
              </h2>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
              >
                <X class="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-4 sm:p-6 space-y-4">
              <img
                v-if="selectedExhibition.image"
                :src="selectedExhibition.image"
                :alt="selectedExhibition.title"
                class="rounded-xl w-full max-h-64 sm:max-h-96 object-cover shadow-md"
              />
              <div v-if="selectedExhibition.description" class="text-gray-700 leading-relaxed text-sm sm:text-base">
                {{ selectedExhibition.description }}
              </div>
              <div v-if="selectedExhibition.text" class="text-gray-600 leading-relaxed pt-3 border-t text-sm sm:text-base">
                {{ selectedExhibition.text }}
              </div>
              <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-500 pt-3 border-t">
                <Calendar class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Erstellt am: {{ formatDate(selectedExhibition.created_at) }}</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="sticky bottom-0 p-4 sm:p-6 border-t bg-gray-50 rounded-b-2xl flex gap-3">
              <button
                @click="openEditModal(selectedExhibition)"
                class="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
              >
                <Edit2 class="w-4 h-4" />
                <span class="hidden sm:inline">Bearbeiten</span>
                <span class="sm:hidden">Edit</span>
              </button>
              <button
                @click="confirmDelete(selectedExhibition.id)"
                class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
              >
                <Trash2 class="w-4 h-4" />
                <span class="hidden sm:inline">Löschen</span>
                <span class="sm:hidden">Del</span>
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
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="sticky top-0 flex justify-between items-center p-4 sm:p-6 border-b bg-white z-10 rounded-t-2xl">
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <component :is="editMode ? Edit2 : Plus" class="w-5 h-5 sm:w-6 sm:h-6" />
                <span class="hidden sm:inline">{{ editMode ? 'Ausstellung bearbeiten' : 'Neue Ausstellung' }}</span>
                <span class="sm:hidden">{{ editMode ? 'Bearbeiten' : 'Neu' }}</span>
              </h2>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg"
              >
                <X class="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <!-- Bildvorschau -->
            <div v-if="imagePreview" class="p-4 sm:p-6 pb-0">
              <div class="relative group">
                <img
                  :src="imagePreview"
                  class="w-full h-48 sm:h-56 object-cover rounded-xl shadow-md"
                  alt="Vorschau"
                />
                <button
                  v-if="imageFile"
                  @click="removeImage"
                  type="button"
                  class="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="saveExhibition" class="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div class="space-y-2">
                <label class="text-gray-700 font-semibold flex items-center gap-2 text-sm">
                  <FileText class="w-4 h-4" />
                  Titel *
                </label>
                <input
                  v-model="form.title"
                  placeholder="Ausstellungstitel"
                  required
                  class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none transition text-sm sm:text-base"
                />
              </div>

              <div class="space-y-2">
                <label class="text-gray-700 font-semibold flex items-center gap-2 text-sm">
                  <AlignLeft class="w-4 h-4" />
                  Kurzbeschreibung
                </label>
                <textarea
                  v-model="form.description"
                  placeholder="Kurze Zusammenfassung der Ausstellung"
                  rows="3"
                  class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none transition resize-none text-sm sm:text-base"
                ></textarea>
              </div>

              <div class="space-y-2">
                <label class="text-gray-700 font-semibold flex items-center gap-2 text-sm">
                  <ImageIcon class="w-4 h-4" />
                  Bild auswählen
                </label>
                <div class="relative">
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleImage"
                    accept="image/*"
                    class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gray-900 file:text-white hover:file:bg-gray-800 file:cursor-pointer cursor-pointer file:text-sm file:font-medium"
                  />
                </div>
                <p class="text-xs text-gray-500">Empfohlen: 1200x800px, max. 5MB</p>
              </div>

              <div class="space-y-2">
                <label class="text-gray-700 font-semibold flex items-center gap-2 text-sm">
                  <FileText class="w-4 h-4" />
                  Detaillierte Beschreibung
                </label>
                <textarea
                  v-model="form.text"
                  placeholder="Ausführliche Beschreibung der Ausstellung"
                  rows="5"
                  class="w-full border border-gray-300 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-gray-900 focus:outline-none transition resize-none text-sm sm:text-base"
                ></textarea>
              </div>

              <!-- Footer Buttons -->
              <div class="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  @click="closeModal"
                  class="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex-1 px-4 py-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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

    <!-- Delete Confirmation Modal -->
    <teleport to="body">
      <transition name="modal">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          @click.self="showDeleteModal = false"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-red-100 mb-4">
                <AlertTriangle class="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">Ausstellung löschen?</h3>
              <p class="text-gray-600 mb-6 text-sm sm:text-base">
                Möchtest du diese Ausstellung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div class="flex gap-3">
                <button
                  @click="showDeleteModal = false"
                  class="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
                >
                  Abbrechen
                </button>
                <button
                  @click="deleteExhibition"
                  :disabled="isDeleting"
                  class="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
                  <Trash2 v-else class="w-4 h-4" />
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
      <div class="fixed top-4 left-4 right-4 sm:top-20 sm:right-6 sm:left-auto space-y-2 z-50 sm:max-w-sm">
        <transition-group name="toast">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            :class="[
              'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-lg text-white font-medium text-sm',
              toast.type === 'success' ? 'bg-green-600' :
              toast.type === 'error' ? 'bg-red-600' : 'bg-gray-900'
            ]"
          >
            <component
              :is="toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info"
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

const form = ref({ id: "", title: "", description: "", image: "", text: "" });
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

onMounted(() => store.fetchExhibitions());

const filteredExhibitions = computed(() => {
  const list = Array.isArray(store.exhibitions) ? store.exhibitions : [];
  const key = keyword.value.toLowerCase();
  return list.filter((e) =>
    [e.title, e.description].some((f) => f?.toLowerCase().includes(key))
  );
});

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
  form.value = { id: "", title: "", description: "", image: "", text: "" };
  imageFile.value = null;
  imagePreview.value = null;
  modal.value = { visible: true, type: "edit" };
}

function openEditModal(exhibition) {
  editMode.value = true;
  selectedExhibition.value = exhibition;
  form.value = { ...exhibition };
  imageFile.value = null;
  imagePreview.value = exhibition.image || null;
  modal.value = { visible: true, type: "edit" };
}

function closeModal() {
  modal.value.visible = false;
  setTimeout(() => {
    form.value = { title: "", description: "", image: "", text: "" };
    imageFile.value = null;
    imagePreview.value = null;
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
  const file = event.target.files[0];
  if (!file) return;

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    showToast("Bild ist zu groß (max. 5MB)", "error");
    return;
  }

  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
}

function removeImage() {
  imageFile.value = null;
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
    const fd = new FormData();
    fd.append("title", form.value.title);
    fd.append("description", form.value.description || "");
    fd.append("text", form.value.text || "");
    if (imageFile.value) fd.append("image", imageFile.value);

    if (editMode.value) {
      await store.updateExhibition(
        form.value.id,
        form.value.title,
        form.value.description,
        imageFile.value,
        form.value.text
      );
      showToast("Ausstellung erfolgreich aktualisiert!", "success");
    } else {
      await store.createExhibition(fd);
      showToast("Ausstellung erfolgreich erstellt!", "success");
    }

    closeModal();
    await store.fetchExhibitions();
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    showToast("Fehler beim Speichern", "error");
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
    await store.fetchExhibitions();
  } catch (error) {
    console.error("Fehler beim Löschen:", error);
    showToast("Fehler beim Löschen", "error");
  } finally {
    isDeleting.value = false;
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
@media (max-width: 640px) {
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
</style>