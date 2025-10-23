<template>
  <section class="bg-gray-300 min-h-screen py-10 px-6">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 class="text-4xl font-bold text-gray-800 font-serif">🎨 Ausstellungen</h1>

        <div class="flex flex-wrap gap-3">
          <input
            v-model="keyword"
            placeholder="🔍 Suche..."
            class="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-gray-400 outline-none"
          />
          <select
            v-model="sort"
            class="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-gray-400 outline-none"
          >
            <option value="desc">Neueste zuerst</option>
            <option value="asc">Älteste zuerst</option>
          </select>
          <button
            @click="store.fetchExhibitions(keyword, sort)"
            class="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition flex items-center gap-2"
          >
            <RefreshCw class="w-4 h-4" />
            Aktualisieren
          </button>
          <button
            @click="openCreateModal"
            class="bg-gray-800 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-700 transition-all flex items-center gap-2"
          >
            <Plus class="w-5 h-5" />
            Neue Ausstellung
          </button>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="store.loading" class="flex flex-col items-center justify-center py-16">
        <Loader2 class="w-12 h-12 text-gray-600 animate-spin mb-3" />
        <p class="text-gray-600 font-medium">Lade Ausstellungen...</p>
      </div>

      <!-- ERROR -->
      <div
        v-else-if="store.error"
        class="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
      >
        <AlertCircle class="w-12 h-12 text-red-600 mx-auto mb-3" />
        <p class="text-red-600 font-medium">Fehler beim Laden: {{ store.error.message }}</p>
      </div>

      <!-- GRID -->
      <div
        v-else-if="filteredExhibitions.length"
        class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <article
          v-for="exhibition in filteredExhibitions"
          :key="exhibition.id"
          @click="openViewModal(exhibition)"
          class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
          <div class="relative h-48 bg-gray-100 overflow-hidden">
            <img
              v-if="exhibition.image"
              :src="exhibition.image"
              :alt="exhibition.title"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400">
              <ImageIcon class="w-12 h-12" />
            </div>
          </div>
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-800 truncate mb-2">{{ exhibition.title }}</h2>
            <p class="text-gray-600 line-clamp-2 text-sm mb-3 min-h-[2.5rem]">
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
      <div v-else class="bg-white rounded-2xl shadow-sm p-16 text-center">
        <ImageIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 text-lg font-medium">Keine Ausstellungen vorhanden</p>
        <p class="text-gray-400 text-sm mt-2">Erstelle deine erste Ausstellung mit dem Button oben</p>
      </div>
    </div>

    <!-- VIEW MODAL -->
    <transition name="fade">
      <div v-if="modal.visible && modal.type === 'view'" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
            <h2 class="text-2xl font-bold text-gray-800">{{ selectedExhibition.title }}</h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-4">
            <img
              v-if="selectedExhibition.image"
              :src="selectedExhibition.image"
              class="rounded-xl w-full max-h-96 object-cover shadow-md"
            />
            <p class="text-gray-700 leading-relaxed">{{ selectedExhibition.description }}</p>
            <div v-if="selectedExhibition.text" class="text-gray-600 leading-relaxed pt-3 border-t">
              {{ selectedExhibition.text }}
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500 pt-3 border-t">
              <Calendar class="w-4 h-4" />
              <span>Erstellt am: {{ formatDate(selectedExhibition.created_at) }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t bg-gray-50 rounded-b-2xl flex gap-3">
            <button
              @click="openEditModal(selectedExhibition)"
              class="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
            >
              <Edit2 class="w-4 h-4" />
              Bearbeiten
            </button>
            <button
              @click="confirmDelete(selectedExhibition.id)"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
            >
              <Trash2 class="w-4 h-4" />
              Löschen
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- EDIT/CREATE MODAL -->
    <transition name="fade">
      <div v-if="modal.visible && modal.type === 'edit'" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4" @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
            <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <component :is="editMode ? Edit2 : Plus" class="w-6 h-6" />
              {{ editMode ? 'Ausstellung bearbeiten' : 'Neue Ausstellung' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg">
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Bildvorschau -->
          <div v-if="imagePreview" class="p-6 pb-0">
            <img :src="imagePreview" class="w-full h-56 object-cover rounded-xl shadow-md"/>
          </div>

          <!-- Form -->
          <form @submit.prevent="saveExhibition" class="p-6 space-y-5">
            <div class="space-y-2">
              <label class="text-gray-700 font-semibold flex items-center gap-2">
                <FileText class="w-4 h-4" />
                Titel *
              </label>
              <input
                v-model="form.title"
                placeholder="Ausstellungstitel"
                required
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-800 focus:outline-none transition"
              />
            </div>

            <div class="space-y-2">
              <label class="text-gray-700 font-semibold flex items-center gap-2">
                <AlignLeft class="w-4 h-4" />
                Beschreibung
              </label>
              <textarea
                v-model="form.description"
                placeholder="Kurzbeschreibung"
                rows="3"
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-800 focus:outline-none transition resize-none"
              ></textarea>
            </div>

            <div class="space-y-2">
              <label class="text-gray-700 font-semibold flex items-center gap-2">
                <ImageIcon class="w-4 h-4" />
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
                <FileText class="w-4 h-4" />
                Vollständiger Text
              </label>
              <textarea
                v-model="form.text"
                placeholder="Detaillierte Beschreibung"
                rows="5"
                class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-800 focus:outline-none transition resize-none"
              ></textarea>
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
                {{ editMode ? 'Änderungen speichern' : 'Erstellen' }}
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
            <h3 class="text-xl font-bold text-gray-900 mb-2">Ausstellung löschen?</h3>
            <p class="text-gray-600 mb-6">
              Möchtest du diese Ausstellung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div class="flex gap-3">
              <button
                @click="showDeleteModal = false"
                class="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all font-medium"
              >
                Abbrechen
              </button>
              <button
                @click="deleteExhibition"
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

    <!-- TOASTS -->
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
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useExhibitionsStore } from "@/stores/Exhibitions";
import {
  Plus, Edit2, Trash2, X, Save, ImageIcon, FileText, AlignLeft,
  Calendar, Loader2, AlertCircle, AlertTriangle, CheckCircle2,
  XCircle, Info, RefreshCw
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

const form = ref({ title: "", description: "", image: "", text: "" });
const imageFile = ref(null);
const imagePreview = ref(null);

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
  form.value = { title: "", description: "", image: "", text: "" };
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
  imageFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
}

// CRUD
async function saveExhibition() {
  try {
    const fd = new FormData();
    fd.append("title", form.value.title);
    fd.append("description", form.value.description);
    fd.append("text", form.value.text);
    if (imageFile.value) fd.append("image", imageFile.value);

    if (editMode.value) {
      await store.updateExhibition(form.value.title, form.value.description, imageFile.value, form.value.text);
      showToast("Ausstellung erfolgreich aktualisiert!", "success");
    } else {
      await store.createExhibition(fd);
      showToast("Ausstellung erfolgreich erstellt!", "success");
    }

    closeModal();
    store.fetchExhibitions();
  } catch {
    showToast("Fehler beim Speichern", "error");
  }
}

async function deleteExhibition() {
  try {
    await store.deleteExhibition(exhibitionToDelete.value);
    showToast("Ausstellung erfolgreich gelöscht!", "success");
    showDeleteModal.value = false;
    exhibitionToDelete.value = null;
    store.fetchExhibitions();
  } catch {
    showToast("Fehler beim Löschen", "error");
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
</style>