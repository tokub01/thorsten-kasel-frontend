<template>
  <section class="bg-gray-50 py-12 px-6 min-h-screen">
    <div class="max-w-6xl mx-auto">

      <!-- Header & Filter -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 class="text-4xl font-serif font-bold text-gray-800">Neuigkeiten</h1>
        <div class="flex flex-wrap gap-3">
          <button @click="page=1" class="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 shadow transition">
            + Neue News
          </button>
          <select v-model="filter" class="border border-gray-300 rounded-lg px-3 py-2">
            <option value="all">Alle</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
          </select>
          <input type="text" v-model="keyword" placeholder="Suche..." class="border border-gray-300 rounded-lg px-3 py-2"/>
        </div>
      </div>

      <!-- Lade- / Fehleranzeige -->
      <div v-if="newsStore.loading" class="text-center text-gray-500 py-8">Lade Neuigkeiten...</div>
      <div v-else-if="newsStore.error" class="text-center text-red-600 py-8">{{ newsStore.error?.message || 'Fehler beim Laden' }}</div>

      <!-- Kartenansicht -->
      <div v-else-if="filteredNews.length" class="grid md:grid-cols-2 gap-6">
        <article v-for="news in filteredNews" :key="news.id" class="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition relative">

          <!-- Bild & Details -->
          <img :src="news.image" alt="News Bild" class="w-full h-48 object-cover"/>
          <div class="p-4 space-y-2">
            <h2 class="text-2xl font-bold text-gray-800">{{ news.title }}</h2>
            <p class="text-gray-600">{{ news.description }}</p>
            <p class="text-sm text-gray-500">{{ formatDate(news.created_at) }}</p>
          </div>

          <!-- isActive Toggle -->
          <button
            @click.stop="toggleActive(news.id)"
            :class="news.isActive
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-red-100 text-red-700 hover:bg-red-200'"
            class="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold transition"
          >
            {{ news.isActive ? 'Aktiv' : 'Inaktiv' }}
          </button>

          <!-- Aktionen -->
          <div class="absolute bottom-3 right-3 flex gap-2">
            <button @click.stop="openEditPage(news)" class="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition">Bearbeiten</button>
            <button @click.stop="deleteNews(news.id)" class="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition">Löschen</button>
          </div>
        </article>
      </div>

      <!-- Keine News -->
      <p v-else class="text-center text-gray-500 py-8">Keine Neuigkeiten vorhanden.</p>

      <!-- Neues / Bearbeiten Modal -->
      <transition name="fade">
        <div v-if="page===1 || page===2" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-2xl font-bold text-gray-800">{{ page===1 ? 'Neue News' : 'News bearbeiten' }}</h2>
              <button @click="page=0" class="text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
            </div>

            <!-- Bildvorschau -->
            <img v-if="imagePreview || imageSelectionPreview" :src="imageSelectionPreview || imagePreview" class="w-full h-48 object-cover rounded-lg mb-4"/>

            <form @submit.prevent="page===1 ? storeNews() : updateNews()" class="space-y-4">
              <div class="flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Titel</label>
                <input v-model="title" type="text" placeholder="Titel eingeben"
                       class="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-gray-300 focus:outline-none" required/>
              </div>

              <div class="flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Beschreibung</label>
                <input v-model="description" type="text" placeholder="Beschreibung eingeben"
                       class="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-gray-300 focus:outline-none"/>
              </div>

              <div class="flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Bild auswählen</label>
                <input type="file" @change="handleImage" class="border border-gray-300 rounded p-3"/>
              </div>

              <div class="flex flex-col">
                <label class="text-gray-700 font-medium mb-1">Text</label>
                <textarea v-model="text" rows="5" placeholder="Text eingeben"
                          class="border border-gray-300 rounded p-3 focus:ring-2 focus:ring-gray-300 focus:outline-none"></textarea>
              </div>

              <div class="flex items-center gap-3">
                <input type="checkbox" v-model="isActive" class="w-4 h-4"/>
                <label class="text-gray-700 font-medium">Aktiv</label>
              </div>

              <div class="flex justify-end gap-3 pt-3 border-t">
                <button type="button" @click="page=0" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition">Abbrechen</button>
                <button type="submit" class="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition">{{ page===1 ? 'Anlegen' : 'Speichern' }}</button>
              </div>
            </form>
          </div>
        </div>
      </transition>

      <!-- Toast Notifications -->
      <div class="fixed bottom-6 right-6 space-y-2 z-50">
        <div
          v-for="(toast, index) in toasts"
          :key="index"
          class="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow flex items-center justify-between min-w-[200px] transition-opacity"
        >
          {{ toast.message }}
          <button @click="removeToast(index)" class="ml-2 text-gray-800 font-bold">×</button>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useNewsStore } from '@/stores/News'

const newsStore = useNewsStore()

// State
const page = ref(0)
const title = ref('')
const description = ref('')
const text = ref('')
const imageSelection = ref(null)
const imageSelectionPreview = ref(null)
const imagePreview = ref(null)
const isActive = ref(true)
const keyword = ref('')
const filter = ref('all')

// Toasts
const toasts = ref([])
const showToast = (message) => {
  toasts.value.push({ message })
  setTimeout(() => toasts.value.shift(), 3000)
}
const removeToast = (index) => toasts.value.splice(index, 1)

// Load news
const loadNews = () => newsStore.fetchNews(keyword.value)
onMounted(loadNews)
watch(keyword, loadNews)

// Filtered News
const filteredNews = ref([])
watch([() => newsStore.news, filter], () => {
  if (!newsStore.news) return
  filteredNews.value = newsStore.news.filter(n => {
    if (filter.value === 'active') return n.isActive === 1
    if (filter.value === 'inactive') return n.isActive !== 1
    return true
  })
}, { immediate: true })

// Image handler
const handleImage = e => {
  const file = e.target.files[0]
  if (file) {
    imageSelection.value = file
    imageSelectionPreview.value = URL.createObjectURL(file)
  }
}

// Open Edit Modal
const openEditPage = (news) => {
  page.value = 2
  title.value = news.title
  description.value = news.description
  text.value = news.text
  imageSelection.value = null
  imageSelectionPreview.value = null
  imagePreview.value = news.image
  isActive.value = news.isActive === 1
}

// CRUD Functions
const storeNews = async () => {
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('text', text.value)
  formData.append('isActive', isActive.value ? 1 : 0)
  if(imageSelection.value) formData.append('image', imageSelection.value)
  await newsStore.createNews(formData)
  resetForm()
  showToast('News erfolgreich angelegt!')
}

const updateNews = async () => {
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('description', description.value)
  formData.append('text', text.value)
  formData.append('isActive', isActive.value ? 1 : 0)
  if(imageSelection.value) formData.append('image', imageSelection.value)
  await newsStore.updateNews(newsStore.getById(newsStore.news.find(n=>n.title===title.value)?.id)?.id, title.value, description.value, imageSelection.value, text.value)
  resetForm()
  showToast('News erfolgreich aktualisiert!')
}

const deleteNews = async (id) => {
  if(!confirm('News wirklich löschen?')) return
  await newsStore.deleteNews(id)
  showToast('News gelöscht!')
}

const resetForm = () => {
  title.value = ''
  description.value = ''
  text.value = ''
  imageSelection.value = null
  imageSelectionPreview.value = null
  imagePreview.value = null
  isActive.value = true
  page.value = 0
  loadNews()
}

// Toggle Active
const toggleActive = (id) => {
  newsStore.toggleActive(id)
  showToast('Status geändert!')
}

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
