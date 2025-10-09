<template>
  <div class="bg-gray-50 min-h-screen p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 class="text-4xl font-serif font-bold text-gray-800">Kategorien</h1>
        <button
          @click="page = 1"
          class="mt-4 sm:mt-0 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-lg shadow transition"
        >
          + Neue Kategorie
        </button>
      </div>

      <!-- Tabelle -->
      <div class="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <table class="min-w-full text-left">
          <thead class="bg-gray-100 text-gray-700 text-sm uppercase tracking-wider">
            <tr>
              <th class="px-6 py-3 font-semibold">Name</th>
              <th class="px-6 py-3 text-center font-semibold w-48">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <!-- Loader -->
            <tr v-if="isLoading">
              <td colspan="2" class="text-center py-8 text-gray-400 italic">Lädt Kategorien ...</td>
            </tr>

            <!-- Fehler -->
            <tr v-else-if="error">
              <td colspan="2" class="text-center py-8 text-red-500 italic">{{ error }}</td>
            </tr>

            <!-- Kategorien -->
            <tr
              v-else
              v-for="category in categoryStore.categories ?? []"
              :key="category.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 border-t text-gray-800">{{ category.name }}</td>
              <td class="px-6 py-4 border-t flex justify-center gap-3">
                <button
                  @click="openEditPage(category)"
                  class="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                >
                  Bearbeiten
                </button>
                <button
                  @click="deleteCategory(category.id)"
                  class="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                >
                  Löschen
                </button>
              </td>
            </tr>

            <!-- Keine Kategorien -->
            <tr v-if="!isLoading && (!categoryStore.categories || categoryStore.categories.length === 0)">
              <td colspan="2" class="text-center py-8 text-gray-500 italic">
                Noch keine Kategorien vorhanden.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Formular Modal -->
      <transition name="fade">
        <div
          v-if="page === 1 || page === 2"
          class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        >
          <div class="bg-white rounded-xl shadow-md max-w-lg w-full p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-800">
                {{ page === 1 ? 'Neue Kategorie' : `Kategorie bearbeiten` }}
              </h2>
              <button
                @click="page = 0"
                class="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form @submit.prevent="page === 1 ? storeCategory() : updateCategory()" class="space-y-4">
              <div>
                <label for="categoryName" class="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  id="categoryName"
                  v-model="categoryName"
                  type="text"
                  placeholder="z. B. Landschaften, Porträts ..."
                  class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                  required
                />
              </div>

              <div class="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  @click="page = 0"
                  class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  class="px-5 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition"
                >
                  {{ page === 1 ? 'Erstellen' : 'Speichern' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/Categories'

const categoryStore = useCategoryStore()
const page = ref(0)
const name = ref('')
const categoryName = ref('')
const isLoading = ref(true)
const error = ref(null)

async function loadCategories() {
  isLoading.value = true
  error.value = null
  try { await categoryStore.loadAllCategories() }
  catch (err) { error.value = 'Fehler beim Laden der Kategorien.' }
  finally { isLoading.value = false }
}

function openEditPage(category) {
  categoryName.value = category.name
  name.value = category.name
  page.value = 2
}

async function storeCategory() {
  const formData = new FormData()
  formData.append('name', categoryName.value)
  await categoryStore.storeProduct(formData)
  categoryName.value = ''
  page.value = 0
  await loadCategories()
}

async function updateCategory() {
  const formData = new FormData()
  formData.append('name', categoryName.value)
  await categoryStore.updateCategory(formData)
  categoryName.value = ''
  page.value = 0
  await loadCategories()
}

async function deleteCategory(id) {
  if (!confirm('Möchtest du diese Kategorie wirklich löschen?')) return
  await categoryStore.deleteCategory(id)
  await loadCategories()
}

onMounted(() => loadCategories())
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
