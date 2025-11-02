<template>
  <div class="bg-gray-300 min-h-screen p-6 md:p-10">

    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <h1 class="text-4xl font-serif font-bold text-gray-800 flex items-center gap-3">
        <MailOpen class="w-10 h-10" />
        Kontaktanfragen
      </h1>
      <div class="flex items-center gap-3">
        <span class="text-sm text-gray-600">
          {{ unreadCount }} unbearbeitet{{ unreadCount === 1 ? 'e' : '' }} Anfrage{{ unreadCount === 1 ? '' : 'n' }}
        </span>
      </div>
    </div>

    <!-- Ladeanzeige -->
    <div v-if="store.loading" class="flex flex-col items-center justify-center py-16">
      <Loader2 class="w-12 h-12 text-gray-600 animate-spin mb-3" />
      <p class="text-gray-600 font-medium">Lade Anfragen...</p>
    </div>

    <!-- Fehleranzeige -->
    <div v-else-if="store.errorMessage" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <AlertCircle class="w-12 h-12 text-red-600 mx-auto mb-3" />
      <p class="text-red-600 font-medium">{{ store.errorMessage }}</p>
      <button
        @click="loadRequests"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Erneut versuchen
      </button>
    </div>

    <!-- Kartenansicht der Anfragen -->
    <div v-else-if="unreadRequests.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(req, index) in unreadRequests"
        :key="req.id || index"
        class="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group hover:-translate-y-1"
        @click="openModal(req, index)"
      >
        <!-- Header mit Icon -->
        <div class="p-5 pb-4 border-b bg-gradient-to-br from-gray-50 to-white">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <User class="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition">
                  {{ req.name || 'Unbekannt' }}
                </h2>
                <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <Mail class="w-3 h-3" />
                  <span class="truncate max-w-[200px]">{{ req.email }}</span>
                </div>
              </div>
            </div>
            <ExternalLink class="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </div>

        <!-- Content -->
        <div class="p-5">
          <p class="text-gray-600 text-sm line-clamp-3 min-h-[4rem] mb-3">
            {{ req.message }}
          </p>
          <div v-if="req.title" class="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <FileText class="w-3 h-3" />
            <span class="font-medium">Betreff:</span>
            <span class="truncate">{{ req.title }}</span>
          </div>
          <button
            @click.stop="openModal(req, index)"
            class="w-full mt-3 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium text-sm flex items-center justify-center gap-2"
          >
            Details ansehen
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Keine Anfragen -->
    <div v-else class="bg-white rounded-2xl shadow-sm p-16 text-center">
      <CheckCircle2 class="w-16 h-16 text-green-500 mx-auto mb-4" />
      <p class="text-gray-500 text-lg font-medium">Keine unbearbeiteten Kontaktanfragen</p>
      <p class="text-gray-400 text-sm mt-2">Alle Anfragen wurden bearbeitet! 🎉</p>
    </div>

    <!-- Modal für Detailansicht -->
    <transition name="fade">
      <div
        v-if="modalOpen"
        class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
        @click.self="closeModal"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

          <!-- Header -->
          <div class="flex justify-between items-start p-6 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
            <div class="flex items-start gap-3">
              <div class="p-3 bg-blue-100 rounded-xl">
                <User class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 class="text-2xl font-bold text-gray-800">{{ selectedRequest?.name }}</h2>
                <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Mail class="w-4 h-4" />
                  <a
                    :href="`mailto:${selectedRequest?.email}`"
                    class="hover:text-gray-700 transition hover:underline"
                  >
                    {{ selectedRequest?.email }}
                  </a>
                </div>
              </div>
            </div>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg"
            >
              <X class="w-6 h-6" />
            </button>
          </div>

          <!-- Content -->
          <div class="p-6 space-y-4">
            <div v-if="selectedRequest?.title" class="bg-gray-50 rounded-xl p-4">
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <FileText class="w-4 h-4" />
                <span class="font-semibold">Betreff</span>
              </div>
              <p class="text-gray-800 font-medium">{{ selectedRequest.title }}</p>
            </div>

            <div class="bg-gray-50 rounded-xl p-4">
              <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <MessageSquare class="w-4 h-4" />
                <span class="font-semibold">Nachricht</span>
              </div>
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ selectedRequest?.message }}</p>
            </div>

            <div v-if="selectedRequest?.recaptchaToken" class="bg-green-50 rounded-xl p-4 border border-green-200">
              <div class="flex items-center gap-2 text-sm text-green-700 mb-2">
                <Shield class="w-4 h-4" />
                <span class="font-semibold">reCAPTCHA verifiziert</span>
              </div>
              <p class="text-xs text-green-600 font-mono truncate">{{ selectedRequest.recaptchaToken }}</p>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="p-6 border-t bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row gap-3">
            <a
              :href="`mailto:${selectedRequest?.email}?subject=Re: ${encodeURIComponent(selectedRequest?.title || 'Ihre Anfrage')}`"
              class="flex-1 px-4 py-2.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
            >
              <Mail class="w-4 h-4" />
              E-Mail antworten
            </a>
            <button
              @click="markDone"
              :disabled="isProcessing"
              class="flex-1 px-4 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isProcessing" class="w-4 h-4 animate-spin" />
              <CheckCircle2 v-else class="w-4 h-4" />
              Als erledigt markieren
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="fade">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
        @click.self="showDeleteModal = false"
      >
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <AlertTriangle class="h-8 w-8 text-red-600" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Anfrage löschen?</h3>
            <p class="text-gray-600 mb-6">
              Möchtest du diese Kontaktanfrage wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div class="flex gap-3">
              <button
                @click="showDeleteModal = false"
                :disabled="isProcessing"
                class="flex-1 px-4 py-2.5 rounded-lg border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Abbrechen
              </button>
              <button
                @click="deleteRequest"
                :disabled="isProcessing"
                class="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="isProcessing" class="w-4 h-4 animate-spin" />
                <Trash2 v-else class="w-4 h-4" />
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
          <component
            :is="toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info"
            class="w-5 h-5 flex-shrink-0"
          />
          <span class="flex-1">{{ toast.message }}</span>
          <button
            @click="removeToast(toast.id)"
            class="hover:bg-white/20 rounded p-1 transition"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useContactStore } from '@/stores/Contact'
import {
  MailOpen, User, Mail, FileText, MessageSquare, Shield, CheckCircle2,
  Trash2, X, ArrowRight, ExternalLink, Loader2, AlertCircle, AlertTriangle,
  XCircle, Info
} from 'lucide-vue-next'

// Store initialisieren
const store = useContactStore()

// Computed Properties für die Anfragen
const unreadRequests = computed(() => {
  // contactRequests ist direkt ein Array laut Store
  const data = Array.isArray(store.contactRequests) ? store.contactRequests : []

  // Nur ungelesene Anfragen zurückgeben (isRead kann false, 0 oder "0" sein)
  return data.filter(item => item.isRead === false || item.isRead === 0 || item.isRead === "0")
})

const unreadCount = computed(() => unreadRequests.value.length)

// Modal State
const modalOpen = ref(false)
const showDeleteModal = ref(false)
const selectedRequest = ref(null)
const selectedIndex = ref(null)
const isProcessing = ref(false)

// Toast Management
let toastId = 0
const toasts = ref([])

const showToast = (message, type = 'success') => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 4000)
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

// Modal Funktionen
const openModal = (request, index) => {
  selectedRequest.value = request
  selectedIndex.value = index
  modalOpen.value = true
}

const closeModal = () => {
  if (isProcessing.value) return // Verhindere Schließen während Verarbeitung
  modalOpen.value = false
  selectedRequest.value = null
  selectedIndex.value = null
}

// Anfrage als erledigt markieren
const markDone = async () => {
  if (isProcessing.value) return

  try {
    isProcessing.value = true

    if (selectedRequest.value?.id) {
      // Store-Methode aufrufen
      await store.updateContactRequest(selectedRequest.value.id)

      showToast('Kontaktanfrage als erledigt markiert!', 'success')
      closeModal()
    } else {
      throw new Error('Keine gültige Anfrage ID gefunden')
    }
  } catch (error) {
    console.error('Fehler beim Markieren als erledigt:', error)
    showToast(error.message || 'Fehler beim Markieren der Anfrage', 'error')
  } finally {
    isProcessing.value = false
  }
}

// Anfrage löschen
const deleteRequest = async () => {
  if (isProcessing.value) return

  try {
    isProcessing.value = true

    if (selectedRequest.value?.id) {
      // Store-Methode aufrufen (falls vorhanden)
      if (typeof store.deleteContactRequest === 'function') {
        await store.deleteContactRequest(selectedRequest.value.id)
      } else {
        // Fallback: Lokales Entfernen aus dem Array
        console.warn('deleteContactRequest Methode nicht im Store gefunden')
        const index = store.contactRequests.findIndex(
          r => r.id === selectedRequest.value.id
        )
        if (index !== -1) {
          store.contactRequests.splice(index, 1)
        }
      }

      showToast('Kontaktanfrage gelöscht!', 'success')
      showDeleteModal.value = false
      closeModal()
    } else {
      throw new Error('Keine gültige Anfrage ID gefunden')
    }
  } catch (error) {
    console.error('Fehler beim Löschen:', error)
    showToast(error.message || 'Fehler beim Löschen der Anfrage', 'error')
  } finally {
    isProcessing.value = false
  }
}

// Anfragen laden
const loadRequests = async () => {
  try {
    await store.getContactRequests()
    console.log('📊 Geladene Daten:', {
      raw: store.contactRequests,
      unread: unreadRequests.value,
      count: unreadCount.value
    })
  } catch (error) {
    console.error('❌ Fehler beim Laden der Kontaktanfragen:', error)
    showToast('Fehler beim Laden der Anfragen', 'error')
  }
}

// Initialisierung beim Mounten
onMounted(() => {
  loadRequests()
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