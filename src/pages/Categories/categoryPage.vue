<template>
  <div class="bg-gray-300 min-h-screen p-6">
    <div class="max-w-6xl mx-auto">

      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 class="text-4xl font-serif font-bold text-gray-800">🏷️ Kategorien</h1>
        <button
          @click="openCreateModal"
          class="mt-4 sm:mt-0 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-fit"
        >
          <Plus class="w-5 h-5" />
          Neue Kategorie
        </button>
      </div>

      <!-- Tabelle -->
      <div class="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
            <tr>
              <th class="px-6 py-4 text-left font-semibold">Name</th>
              <th class="px-6 py-4 text-center font-semibold w-64">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loader -->
            <tr v-if="isLoading">
              <td colspan="2" class="text-center py-12">
                <Loader2 class="w-10 h-10 text-gray-600 animate-spin mx-auto mb-2" />
                <p class="text-gray-500 font-medium">Lädt Kategorien...</p>
              </td>
            </tr>

            <!-- Fehler -->
            <tr v-else-if="error">
              <td colspan="2" class="text-center py-12">
                <AlertCircle class="w-10 h-10 text-red-600 mx-auto mb-2" />
                <p class="text-red-600 font-medium">{{ error }}</p>
              </td>
            </tr>

            <!-- Kategorien -->
            <tr
              v-else
              v-for="(category, index) in categoryStore.categories ?? []"
              :key="category.id"
              :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              class="hover:bg-gray-100 transition-colors"
            >
              <td class="px-6 py-4 border-t text-gray-800 font-medium">
                <div class="flex items-center gap-2">
                  <Tag class="w-4 h-4 text-gray-500" />
                  {{ category.name }}
                </div>
              </td>
              <td class="px-6 py-4 border-t flex justify-center gap-2">
                <button
                  @click="openEditModal(category)"
                  class="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 font-medium"
                >
                  <Edit2 class="w-4 h-4" />
                  Bearbeiten
                </button>
                <button
                  @click="confirmDelete(category)"
                  class="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-all flex items-center gap-2 font-medium"
                >
                  <Trash2 class="w-4 h-4" />
                  Löschen
                </button>
              </td>
            </tr>

            <!-- Keine Kategorien -->
            <tr v-if="!isLoading && (!categoryStore.categories || categoryStore.categories.length === 0)">
              <td colspan="2" class="text-center py-16">
                <Tag class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p class="text-gray-500 text-lg font-medium">Noch keine Kategorien vorhanden</p>
                <p class="text-gray-400 text-sm mt-2">Erstelle deine erste Kategorie mit dem Button oben</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Create/Edit Modal -->
      <transition name="fade">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            <!-- Header -->
            <div class="flex justify-between items-center p-6 border-b">
              <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <component :is="editMode ? Edit2 : Plus" class="w-6 h-6" />
                {{ editMode ? 'Kategorie bearbeiten' : 'Neue Kategorie' }}
              </h2>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg"
              >
                <X class="w-6 h-6" />
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="editMode ? updateCategory() : storeCategory()" class="p-6 space-y-5">
              <div class="space-y-2">
                <label for="categoryName" class="text-gray-700 font-semibold flex items-center gap-2">
                  <Tag class="w-4 h-4" />
                  Kategoriename *
                </label>
                <input
                  id="categoryName"
                  v-model="categoryName"
                  type="text"
                  placeholder="z.B. Landschaften, Porträts, Abstrakt..."
                  class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
                  required
                />
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
              <h3 class="text-xl font-bold text-gray-900 mb-2">Kategorie löschen?</h3>
              <p class="text-gray-600 mb-6">
                Möchtest du "<span class="font-semibold">{{ categoryToDelete?.name }}</span>" wirklich löschen?
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
                  @click="deleteCategory"
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
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/Categories'
import {
  Plus, Edit2, Trash2, X, Save, Tag, Loader2, AlertCircle,
  AlertTriangle, CheckCircle2, XCircle, Info
} from 'lucide-vue-next'

const categoryStore = useCategoryStore()

// State
const showModal = ref(false)
const showDeleteModal = ref(false)
const editMode = ref(false)
const categoryName = ref('')
const categoryToDelete = ref(null)
const isLoading = ref(true)
const error = ref(null)

// Toasts
let toastId = 0
const toasts = ref([])
const showToast = (message, type = 'success') => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => toasts.value = toasts.value.filter(t => t.id !== id), 4000)
}
const removeToast = (id) => toasts.value = toasts.value.filter(t => t.id !== id)

// Load Categories
async function loadCategories() {
  isLoading.value = true
  error.value = null
  try {
    await categoryStore.loadAllCategories()
  }
  catch (err) {
    error.value = 'Fehler beim Laden der Kategorien.'
    showToast('Fehler beim Laden', 'error')
  }
  finally {
    isLoading.value = false
  }
}

// Modal Functions
function openCreateModal() {
  editMode.value = false
  categoryName.value = ''
  showModal.value = true
}

function openEditModal(category) {
  editMode.value = true
  categoryName.value = category.name
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  setTimeout(() => {
    categoryName.value = ''
  }, 300)
}

function confirmDelete(category) {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

// CRUD Functions
async function storeCategory() {
  const formData = new FormData()
  formData.append('name', categoryName.value)

  try {
    await categoryStore.storeProduct(formData)
    closeModal()
    showToast('Kategorie erfolgreich erstellt!', 'success')
    await loadCategories()
  } catch(e) {
    showToast('Fehler beim Erstellen', 'error')
  }
}

async function updateCategory() {
  const formData = new FormData()
  formData.append('name', categoryName.value)

  try {
    await categoryStore.updateCategory(formData)
    closeModal()
    showToast('Kategorie erfolgreich aktualisiert!', 'success')
    await loadCategories()
  } catch(e) {
    showToast('Fehler beim Aktualisieren', 'error')
  }
}

async function deleteCategory() {
  try {
    await categoryStore.deleteCategory(categoryToDelete.value.id)
    showDeleteModal.value = false
    categoryToDelete.value = null
    showToast('Kategorie erfolgreich gelöscht!', 'success')
    await loadCategories()
  } catch(e) {
    showToast('Fehler beim Löschen', 'error')
  }
}

onMounted(() => loadCategories())
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
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