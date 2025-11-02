<template>
  <div class="bg-gray-300 p-4 md:p-8 min-h-screen">
    <div class="max-w-7xl mx-auto">

      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div class="p-2 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <MailOpen class="w-8 h-8 text-white" />
              </div>
              Kontaktanfragen
            </h1>
            <p class="text-gray-600">Verwalte eingehende Kundenanfragen</p>
          </div>
          <div class="bg-white rounded-2xl shadow-md px-6 py-4 border border-gray-100">
            <div class="flex items-center gap-3">
              <div class="p-2 bg-red-100 rounded-lg">
                <Clock class="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ unreadCount }}</p>
                <p class="text-xs text-gray-600 font-medium">Unbearbeitet</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Ladeanzeige -->
      <div v-if="store.loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <Loader2 class="w-16 h-16 text-red-600 animate-spin" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 bg-red-100 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p class="text-gray-600 font-semibold mt-6 text-lg">Lade Anfragen...</p>
      </div>

      <!-- Fehleranzeige -->
      <div v-else-if="store.errorMessage" class="bg-white rounded-2xl shadow-md border-2 border-red-200 p-8 text-center">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle class="w-8 h-8 text-red-600" />
        </div>
        <p class="text-red-600 font-semibold text-lg mb-4">{{ store.errorMessage }}</p>
        <button
          @click="loadRequests"
          class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:shadow-xl transition font-semibold"
        >
          Erneut versuchen
        </button>
      </div>

      <!-- Kartenansicht der Anfragen -->
      <div v-else-if="unreadRequests.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div
          v-for="(req, index) in unreadRequests"
          :key="req.id || index"
          class="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer group hover:-translate-y-2"
          :style="`animation: fadeInUp 0.5s ease-out ${index * 0.05}s both`"
          @click="openModal(req, index)"
        >
          <!-- Header mit Icon -->
          <div class="p-5 pb-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
            <div class="flex items-start justify-between">
              <div class="flex items-center gap-3">
                <div class="p-2 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                  <User class="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-900 group-hover:text-red-600 transition">
                    {{ req.name || 'Unbekannt' }}
                  </h2>
                  <div class="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Mail class="w-3 h-3" />
                    <span class="truncate max-w-[200px]">{{ req.email }}</span>
                  </div>
                </div>
              </div>
              <ExternalLink class="w-4 h-4 text-gray-400 group-hover:text-red-600 transition" />
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <p class="text-gray-600 text-sm line-clamp-3 min-h-[4rem] mb-3">
              {{ req.message }}
            </p>
            <div v-if="req.title" class="flex items-center gap-2 text-xs text-gray-500 mb-3 p-2 bg-gray-50 rounded-lg">
              <FileText class="w-3 h-3" />
              <span class="font-medium">Betreff:</span>
              <span class="truncate">{{ req.title }}</span>
            </div>
            <button
              @click.stop="openModal(req, index)"
              class="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all font-semibold text-sm flex items-center justify-center gap-2"
            >
              Details ansehen
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Keine Anfragen -->
      <div v-else class="bg-white rounded-2xl shadow-md p-12 md:p-20 text-center">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 class="w-10 h-10 text-green-600" />
        </div>
        <p class="text-gray-500 text-xl font-semibold mb-2">Keine unbearbeiteten Kontaktanfragen</p>
        <p class="text-gray-400 text-sm">Alle Anfragen wurden bearbeitet! 🎉</p>
      </div>

    </div>

    <!-- Modal für Detailansicht -->
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="modalOpen"
          @click="closeModal"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
          <div @click.stop class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

            <!-- Header -->
            <div class="flex justify-between items-start p-6 border-b sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 z-10 rounded-t-2xl">
              <div class="flex items-start gap-3">
                <div class="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                  <User class="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">{{ selectedRequest?.name }}</h2>
                  <div class="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Mail class="w-4 h-4" />
                    <a
                      :href="`mailto:${selectedRequest?.email}`"
                      class="hover:text-red-600 transition hover:underline font-medium"
                    >
                      {{ selectedRequest?.email }}
                    </a>
                  </div>
                </div>
              </div>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-white rounded-xl"
              >
                <X class="w-6 h-6" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-4">
              <div v-if="selectedRequest?.title" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                <div class="flex items-center gap-2 text-sm text-blue-700 mb-2">
                  <FileText class="w-4 h-4" />
                  <span class="font-bold">Betreff</span>
                </div>
                <p class="text-gray-900 font-semibold">{{ selectedRequest.title }}</p>
              </div>

              <div class="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <div class="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MessageSquare class="w-4 h-4" />
                  <span class="font-bold">Nachricht</span>
                </div>
                <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">{{ selectedRequest?.message }}</p>
              </div>

              <div v-if="selectedRequest?.recaptchaToken" class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                <div class="flex items-center gap-2 text-sm text-green-700 mb-2">
                  <Shield class="w-4 h-4" />
                  <span class="font-bold">reCAPTCHA verifiziert</span>
                </div>
                <p class="text-xs text-green-700 font-mono truncate bg-white px-2 py-1 rounded">{{ selectedRequest.recaptchaToken }}</p>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="p-6 border-t bg-gray-50 rounded-b-2xl flex flex-col sm:flex-row gap-3">
              <a
                :href="`mailto:${selectedRequest?.email}?subject=Re: ${encodeURIComponent(selectedRequest?.title || 'Ihre Anfrage')}`"
                class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2"
              >
                <Mail class="w-5 h-5" />
                E-Mail antworten
              </a>
              <button
                @click="markDone"
                :disabled="isProcessing"
                class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Loader2 v-if="isProcessing" class="w-5 h-5 animate-spin" />
                <CheckCircle2 v-else class="w-5 h-5" />
                Als erledigt markieren
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Delete Confirmation Modal -->
    <teleport to="body">
      <transition name="fade">
        <div
          v-if="showDeleteModal"
          @click="showDeleteModal = false"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
        >
          <div @click.stop class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-red-100 to-red-200 mb-4">
                <AlertTriangle class="h-8 w-8 text-red-600" />
              </div>
              <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-3">Anfrage löschen?</h3>
              <p class="text-gray-600 mb-6">
                Möchtest du diese Kontaktanfrage wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <button
                  @click="showDeleteModal = false"
                  :disabled="isProcessing"
                  class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Abbrechen
                </button>
                <button
                  @click="deleteRequest"
                  :disabled="isProcessing"
                  class="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Loader2 v-if="isProcessing" class="w-5 h-5 animate-spin" />
                  <Trash2 v-else class="w-5 h-5" />
                  Löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 md:top-6 md:right-6 space-y-2 z-[60] max-w-sm">
      <transition-group name="slide-left">
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
          <button
            @click="removeToast(toast.id)"
            class="hover:bg-white/20 rounded-lg p-1.5 transition"
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
  XCircle, Info, Clock
} from 'lucide-vue-next'

// Store initialisieren
const store = useContactStore()

// Computed Properties für die Anfragen
const unreadRequests = computed(() => {
  const data = Array.isArray(store.contactRequests) ? store.contactRequests : []
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
  if (isProcessing.value) return
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
      if (typeof store.deleteContactRequest === 'function') {
        await store.deleteContactRequest(selectedRequest.value.id)
      } else {
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
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
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