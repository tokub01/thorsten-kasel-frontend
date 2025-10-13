<template>
  <div class="min-h-screen bg-gray-300 px-4 py-10">
    <div class="mx-auto bg-white shadow-lg rounded-xl p-8 max-w-4xl">
      <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">Vita bearbeiten</h1>

      <!-- Toast -->
      <transition name="fade">
        <div
          v-if="toast.message"
          :class="[
            'fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white z-50 transition',
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          ]"
        >
          {{ toast.message }}
        </div>
      </transition>

      <!-- Loading -->
      <div v-if="loading" class="text-center text-gray-600 py-10">
        Lädt Biographie...
      </div>

      <!-- Editor -->
      <div v-else>
        <div id="toolbar" class="bg-gray-100 border-b border-gray-300 px-4 py-2 flex flex-wrap gap-2 rounded-t-xl">
          <select class="ql-header border rounded p-1">
            <option value="1"></option>
            <option value="2"></option>
            <option selected></option>
          </select>
          <button class="ql-bold px-2 py-1 rounded hover:bg-gray-200"></button>
          <button class="ql-italic px-2 py-1 rounded hover:bg-gray-200"></button>
          <button class="ql-underline px-2 py-1 rounded hover:bg-gray-200"></button>
          <button class="ql-link px-2 py-1 rounded hover:bg-gray-200"></button>
          <button class="ql-list" value="ordered"></button>
          <button class="ql-list" value="bullet"></button>
          <button class="ql-clean px-2 py-1 rounded hover:bg-gray-200"></button>
        </div>

        <div ref="editor" class="editor p-6 min-h-[400px] bg-white rounded-b-xl"></div>

        <!-- Speichern -->
        <div class="flex justify-end mt-6">
          <button
            @click="saveBiography"
            class="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useUserStore } from '@/stores/Users'

const userStore = useUserStore()
const editor = ref(null)
const quill = ref(null)
const loading = ref(true)
const biography = ref('')
const currentUser = ref(null)
const toast = ref({ message: '', type: 'success' })

function showToast(message, type = 'success') {
  toast.value = { message, type }
  setTimeout(() => (toast.value.message = ''), 3000)
}

async function loadBiography() {
  try {
    // Lade alle Benutzer mit der bestehenden index()-Methode
    const users = await userStore.fetchUsers()
    currentUser.value = users.find(u => u.email === 'thorsten.kasel@web.de')

    if (currentUser.value && currentUser.value.biography) {
      biography.value = currentUser.value.biography
    } else {
      biography.value = '<p>Noch keine Biographie vorhanden.</p>'
    }
  } catch (error) {
    console.error('Fehler beim Laden der Biographie:', error)
    showToast('Fehler beim Laden der Biographie', 'error')
  } finally {
    loading.value = false
  }
}

async function saveBiography() {
  try {
    if (!currentUser.value) {
      showToast('Benutzer nicht gefunden', 'error')
      return
    }

    const newBio = quill.value.root.innerHTML

    // Verwende hier die bestehende update()-Methode aus dem Store
    await userStore.update(
      currentUser.value.name,
      currentUser.value.email,
      null,
      null,
      newBio
    )

    showToast('Biographie erfolgreich gespeichert!')
  } catch (error) {
    console.error('Fehler beim Speichern:', error)
    showToast('Fehler beim Speichern der Biographie', 'error')
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
