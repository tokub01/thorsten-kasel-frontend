<template>
  <div class="bg-gray-300 min-h-screen p-6 md:p-10">
    <h1 class="text-3xl font-serif font-bold text-gray-800 mb-6">Kontaktanfragen</h1>

    <!-- Ladeanzeige -->
    <div v-if="store.loading" class="text-center text-gray-500 py-8">
      Lade Anfragen...
    </div>

    <!-- Fehleranzeige -->
    <div v-else-if="store.errorMessage" class="text-center text-red-600 py-8">
      {{ store.errorMessage }}
    </div>

    <!-- Kartenansicht der Anfragen -->
    <div v-else-if="store.errors && store.errors.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(req, index) in store.errors"
        :key="index"
        class="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer"
        @click="openModal(req, index)"
      >
        <div class="p-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-1">{{ req.name || 'Unbekannt' }}</h2>
          <p class="text-gray-600 text-sm mb-2 line-clamp-3">{{ req.message }}</p>
          <p class="text-gray-400 text-xs">{{ req.email }}</p>
        </div>
      </div>
    </div>

    <!-- Keine Anfragen -->
    <div v-else class="text-center text-gray-500 py-20">
      Keine Kontaktanfragen vorhanden
    </div>

    <!-- Modal für Detailansicht -->
    <transition name="fade">
      <div v-if="modalOpen" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative">
          <button @click="closeModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>

          <h2 class="text-2xl font-bold text-gray-800 mb-4">Kontaktanfrage von {{ selectedRequest?.name }}</h2>

          <div class="space-y-2">
            <p><strong>Email:</strong> {{ selectedRequest?.email }}</p>
            <p><strong>Nachricht:</strong></p>
            <p class="border border-gray-200 p-3 rounded bg-gray-50">{{ selectedRequest?.message }}</p>
            <p v-if="selectedRequest?.recaptchaToken"><strong>reCAPTCHA Token:</strong> {{ selectedRequest.recaptchaToken }}</p>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              @click="markDone(selectedIndex)"
              class="px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
            >
              Als erledigt markieren
            </button>
            <button
              @click="deleteRequest(selectedIndex)"
              class="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
            >
              Löschen
            </button>
          </div>
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContactStore } from '@/stores/Contact'

const store = useContactStore()

// Modal
const modalOpen = ref(false)
const selectedRequest = ref(null)
const selectedIndex = ref(null)

// Toasts
const toasts = ref([])
const showToast = (msg) => {
  toasts.value.push({ message: msg })
  setTimeout(() => toasts.value.shift(), 3000)
}
const removeToast = (index) => toasts.value.splice(index, 1)

// Modal Funktionen
const openModal = (request, index) => {
  selectedRequest.value = request
  selectedIndex.value = index
  modalOpen.value = true
}
const closeModal = () => {
  modalOpen.value = false
  selectedRequest.value = null
  selectedIndex.value = null
}

// "Als erledigt markieren"
const markDone = (index) => {
  if (store.errors && store.errors[index]) {
    store.errors.splice(index, 1)
    closeModal()
    showToast('Kontaktanfrage als erledigt markiert!')
  }
}

// Löschen
const deleteRequest = (index) => {
  if (!confirm('Kontaktanfrage wirklich löschen?')) return
  if (store.errors && store.errors[index]) {
    store.errors.splice(index, 1)
    closeModal()
    showToast('Kontaktanfrage gelöscht!')
  }
}

// Beispiel: beim Mount die "Anfragen" laden (hier nur store.errors)
onMounted(() => {
  // store.errors könnte z.B. aus API geladen werden
  if (!store.errors) store.errors = []
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
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
</style>
