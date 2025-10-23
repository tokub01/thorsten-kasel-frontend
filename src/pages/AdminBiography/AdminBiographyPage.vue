<template>
  <div class="min-h-screen bg-gray-300 px-4 py-10">
    <div class="mx-auto bg-white shadow-xl rounded-2xl p-8 max-w-4xl">

      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-4xl font-bold text-gray-800 flex items-center gap-3">
          <BookOpen class="w-10 h-10" />
          Vita bearbeiten
        </h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-16">
        <Loader2 class="w-12 h-12 text-gray-600 animate-spin mb-3" />
        <p class="text-gray-600 font-medium">Lädt Biographie...</p>
      </div>

      <!-- Editor -->
      <div v-else>
        <!-- Toolbar -->
        <div
          id="toolbar"
          class="bg-gray-100 border border-gray-300 px-4 py-3 flex flex-wrap gap-2 rounded-t-xl shadow-sm"
        >
          <select class="ql-header border rounded p-1 bg-white">
            <option value="1">Überschrift 1</option>
            <option value="2">Überschrift 2</option>
            <option selected>Normal</option>
          </select>
          <button class="ql-bold px-2 py-1 rounded hover:bg-gray-200 transition" title="Fett"></button>
          <button class="ql-italic px-2 py-1 rounded hover:bg-gray-200 transition" title="Kursiv"></button>
          <button class="ql-underline px-2 py-1 rounded hover:bg-gray-200 transition" title="Unterstrichen"></button>
          <button class="ql-link px-2 py-1 rounded hover:bg-gray-200 transition" title="Link"></button>
          <button class="ql-list" value="ordered" title="Nummerierte Liste"></button>
          <button class="ql-list" value="bullet" title="Aufzählungsliste"></button>
          <button class="ql-clean px-2 py-1 rounded hover:bg-gray-200 transition" title="Formatierung entfernen"></button>
        </div>

        <!-- Editor Area -->
        <div
          ref="editor"
          class="editor p-6 min-h-[400px] bg-white border border-gray-300 border-t-0 rounded-b-xl shadow-sm focus-within:ring-2 focus-within:ring-gray-800"
        ></div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="resetBiography"
            class="px-5 py-2.5 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all font-medium flex items-center gap-2"
          >
            <RotateCcw class="w-4 h-4" />
            Zurücksetzen
          </button>
          <button
            @click="saveBiography"
            class="px-6 py-2.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center gap-2"
          >
            <Save class="w-4 h-4" />
            Speichern
          </button>
        </div>
      </div>
    </div>

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
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useUserStore } from '@/stores/Users'
import {
  BookOpen, Save, Loader2, CheckCircle2, XCircle, Info, X, RotateCcw
} from 'lucide-vue-next'

const userStore = useUserStore()
const editor = ref(null)
const quill = ref(null)
const loading = ref(true)
const biography = ref('')
const originalBiography = ref('')

// Toasts
let toastId = 0
const toasts = ref([])
const showToast = (message, type = 'success') => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => toasts.value = toasts.value.filter(t => t.id !== id), 4000)
}
const removeToast = (id) => toasts.value = toasts.value.filter(t => t.id !== id)

async function loadBiography() {
  try {
    loading.value = true

    // ID des Users, dessen Biografie bearbeitet wird
    const userId = 1 // ggf. dynamisch anpassen

    const data = await userStore.fetchBiography(userId)
    biography.value = data.biography || '<p>Noch keine Biographie vorhanden.</p>'
    originalBiography.value = biography.value
  } catch (error) {
    console.error('Fehler beim Laden der Biographie:', error)
    showToast('Fehler beim Laden der Biographie', 'error')
    biography.value = '<p>Noch keine Biographie vorhanden.</p>'
    originalBiography.value = biography.value
  } finally {
    loading.value = false
  }
}

async function saveBiography() {
  try {
    if (!quill.value) return

    const newBio = quill.value.root.innerHTML

    // ID des Users (gleich wie beim Laden)
    const userId = 1

    // fetchUser um E-Mail und Name zu bekommen
    const userData = await userStore.fetchUser(userId)

    await userStore.updateUser(
      userId,
      userData.data.email,
      userData.data.name,
      null,
      newBio
    )

    originalBiography.value = newBio
    showToast('Biographie erfolgreich gespeichert!', 'success')
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
    showToast('Fehler beim Speichern der Biographie', 'error')
  }
}

function resetBiography() {
  if (quill.value && originalBiography.value) {
    quill.value.root.innerHTML = originalBiography.value
    showToast('Änderungen zurückgesetzt', 'success')
  }
}

onMounted(async () => {
  await loadBiography()

  await nextTick()
  if (editor.value) {
    quill.value = new Quill(editor.value, {
      theme: 'snow',
      modules: { toolbar: '#toolbar' }
    })
    quill.value.root.innerHTML = biography.value
  }
})
</script>

<style scoped>
.editor {
  min-height: 400px;
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