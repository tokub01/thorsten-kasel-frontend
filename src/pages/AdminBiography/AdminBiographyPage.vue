<template>
  <div class="bg-gray-300 px-4 py-8 md:py-10 min-h-screen">
    <div class="mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden max-w-5xl">

      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-500 to-purple-600 p-6 md:p-8 text-white">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <div class="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <BookOpen class="w-8 h-8" />
              </div>
              Vita bearbeiten
            </h1>
            <p class="text-purple-100">Erstelle und bearbeite deine Biografie</p>
          </div>
          <div class="flex gap-2 md:gap-3">
            <button
              @click="resetBiography"
              class="px-4 md:px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all font-semibold flex items-center gap-2"
            >
              <RotateCcw class="w-4 h-4" />
              <span class="hidden sm:inline">Zurücksetzen</span>
            </button>
            <button
              @click="saveBiography"
              :disabled="saving"
              class="px-5 md:px-6 py-2.5 rounded-xl bg-white text-purple-600 hover:shadow-xl transition-all font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              <span class="hidden sm:inline">{{ saving ? 'Speichert...' : 'Speichern' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="relative">
          <Loader2 class="w-16 h-16 text-purple-600 animate-spin" />
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p class="text-gray-600 font-semibold mt-6 text-lg">Lädt Biographie...</p>
      </div>

      <!-- Editor -->
      <div v-else class="p-6 md:p-8">
        <!-- Toolbar -->
        <div
          id="toolbar"
          class="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 px-4 py-3 flex flex-wrap gap-2 rounded-t-xl shadow-sm"
        >
          <select class="ql-header border-2 border-gray-200 rounded-lg p-2 bg-white font-semibold text-sm hover:border-purple-300 transition">
            <option value="1">📝 Überschrift 1</option>
            <option value="2">📝 Überschrift 2</option>
            <option selected>📄 Normal</option>
          </select>

          <div class="flex gap-1 items-center">
            <button class="ql-bold px-3 py-2 rounded-lg hover:bg-gray-200 transition border border-transparent hover:border-gray-300" title="Fett">
              <strong>B</strong>
            </button>
            <button class="ql-italic px-3 py-2 rounded-lg hover:bg-gray-200 transition border border-transparent hover:border-gray-300" title="Kursiv">
              <em>I</em>
            </button>
            <button class="ql-underline px-3 py-2 rounded-lg hover:bg-gray-200 transition border border-transparent hover:border-gray-300" title="Unterstrichen">
              <u>U</u>
            </button>
          </div>

          <div class="flex gap-1 items-center">
            <button class="ql-list px-3 py-2 rounded-lg hover:bg-gray-200 transition border border-transparent hover:border-gray-300" value="ordered" title="Nummerierte Liste">
              1.
            </button>
            <button class="ql-list px-3 py-2 rounded-lg hover:bg-gray-200 transition border border-transparent hover:border-gray-300" value="bullet" title="Aufzählungsliste">
              •
            </button>
          </div>

          <button class="ql-link px-3 py-2 rounded-lg hover:bg-gray-200 transition border border-transparent hover:border-gray-300" title="Link">
            🔗
          </button>

          <button class="ql-image px-3 py-2 rounded-lg hover:bg-gray-200 transition border border-transparent hover:border-gray-300" title="Bild einfügen">
            🖼️
          </button>

          <button class="ql-clean px-3 py-2 rounded-lg hover:bg-red-100 text-red-600 transition border border-transparent hover:border-red-300" title="Formatierung entfernen">
            🧹
          </button>
        </div>

        <!-- Editor Area -->
        <div
          ref="editor"
          class="editor min-h-[400px] md:min-h-[500px] bg-white border-2 border-gray-200 border-t-0 rounded-b-xl shadow-sm focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 transition"
        ></div>

        <!-- Info Box -->
        <div class="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4 md:p-5">
          <div class="flex items-start gap-3">
            <div class="p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <Info class="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Tipps zum Bearbeiten</h3>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• Bilder werden automatisch komprimiert (max. 800px Breite)</li>
                <li>• Empfohlene Bildgröße: unter 2MB</li>
                <li>• Nutze Listen für übersichtliche Aufzählungen</li>
                <li>• Speichere regelmäßig deine Änderungen</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="fixed top-4 right-4 md:top-6 md:right-6 space-y-2 z-50 max-w-sm">
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
          <component :is="toast.type === 'success' ? CheckCircle2 : toast.type === 'error' ? XCircle : Info" class="w-5 h-5 flex-shrink-0" />
          <span class="flex-1">{{ toast.message }}</span>
          <button @click="removeToast(toast.id)" class="hover:bg-white/20 rounded-lg p-1.5 transition">
            <X class="w-4 h-4" />
          </button>
        </div>
      </transition-group>
    </div>

    <!-- Image Controls Modal -->
    <teleport to="body">
      <transition name="fade">
        <div v-if="showImageControls" @click="closeImageControls" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div @click.stop class="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <ImageIcon class="w-6 h-6 text-purple-600" />
                Bild anpassen
              </h3>
              <button @click="closeImageControls" class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg">
                <X class="w-6 h-6" />
              </button>
            </div>

            <!-- Width Control -->
            <div class="mb-6">
              <label class="block font-semibold text-gray-700 mb-3">
                Breite: {{ imageWidth }}%
              </label>
              <input
                type="range"
                v-model.number="imageWidth"
                min="10"
                max="100"
                step="5"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              >
              <div class="flex justify-between text-xs text-gray-500 mt-2">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <!-- Height Control -->
            <div class="mb-6">
              <label class="block font-semibold text-gray-700 mb-3">
                Höhe: {{ imageHeight }}px
              </label>
              <input
                type="range"
                v-model.number="imageHeight"
                min="100"
                max="800"
                step="50"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              >
              <div class="flex justify-between text-xs text-gray-500 mt-2">
                <span>100px</span>
                <span>400px</span>
                <span>800px</span>
              </div>
            </div>

            <!-- Aspect Ratio Lock -->
            <div class="mb-6 bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  v-model="lockAspectRatio"
                  class="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                >
                <span class="font-semibold text-gray-800">Seitenverhältnis beibehalten</span>
              </label>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="closeImageControls"
                class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                Abbrechen
              </button>
              <button
                @click="applyImageChanges"
                class="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                <Check class="w-5 h-5" />
                Anwenden
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useUserStore } from '@/stores/Users'
import {
  BookOpen, Save, Loader2, CheckCircle2, XCircle, Info, X, RotateCcw,
  ImageIcon, Check
} from 'lucide-vue-next'

const userStore = useUserStore()
const editor = ref(null)
const quill = ref(null)
const loading = ref(true)
const saving = ref(false)
const biography = ref('')
const originalBiography = ref('')

// Image Controls
const showImageControls = ref(false)
const selectedImage = ref(null)
const imageWidth = ref(100)
const imageHeight = ref(300)
const lockAspectRatio = ref(true)
const originalAspectRatio = ref(1)

// Toasts
let toastId = 0
const toasts = ref([])
const showToast = (message, type = 'success') => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => toasts.value = toasts.value.filter(t => t.id !== id), 4000)
}
const removeToast = (id) => toasts.value = toasts.value.filter(t => t.id !== id)

// Neue Funktion: Bild komprimieren
function compressImage(file, maxWidth = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Skaliere runter wenn zu groß
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Konvertiere zu komprimiertem Base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality)

        console.log('📊 Image compression:', {
          original: (file.size / 1024).toFixed(2) + 'KB',
          compressed: (compressedBase64.length / 1024).toFixed(2) + 'KB',
          ratio: ((compressedBase64.length / file.size) * 100).toFixed(1) + '%'
        })

        resolve(compressedBase64)
      }

      img.onerror = reject
      img.src = e.target.result
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Custom Image Handler - VERBESSERT für Upload
async function imageHandler() {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')

  input.onchange = async () => {
    const file = input.files[0]
    if (!file) return

    // Validate file size (max 2MB für bessere Performance)
    if (file.size > 2 * 1024 * 1024) {
      showToast('Bild ist zu groß. Maximal 2MB erlaubt.', 'error')
      return
    }

    try {
      showToast('Bild wird komprimiert...', 'info')

      // Komprimiere Bild
      const compressedBase64 = await compressImage(file)

      // Füge komprimiertes Bild ein
      const range = quill.value.getSelection(true)
      quill.value.insertEmbed(range.index, 'image', compressedBase64)
      quill.value.setSelection(range.index + 1)

      showToast('Bild erfolgreich eingefügt!', 'success')
    } catch (error) {
      console.error('Fehler beim Bildupload:', error)
      showToast('Fehler beim Einfügen des Bildes', 'error')
    }
  }

  input.click()
}

// Handle Image Click
function handleImageClick(event) {
  if (event.target.tagName === 'IMG') {
    selectedImage.value = event.target

    // Get current dimensions
    const currentWidth = selectedImage.value.style.width || '100%'
    const currentHeight = selectedImage.value.style.height || 'auto'

    imageWidth.value = currentWidth.includes('%') ? parseInt(currentWidth) : 100
    imageHeight.value = currentHeight === 'auto' ? 300 : parseInt(currentHeight)

    // Calculate aspect ratio
    originalAspectRatio.value = selectedImage.value.naturalWidth / selectedImage.value.naturalHeight

    showImageControls.value = true
  }
}

// Apply Image Changes
function applyImageChanges() {
  if (!selectedImage.value) return

  selectedImage.value.style.width = `${imageWidth.value}%`
  selectedImage.value.style.height = lockAspectRatio.value ? 'auto' : `${imageHeight.value}px`
  selectedImage.value.style.maxWidth = '100%'
  selectedImage.value.style.borderRadius = '0.75rem'
  selectedImage.value.style.margin = '1rem 0'
  selectedImage.value.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'

  closeImageControls()
  showToast('Bildgröße angepasst!', 'success')

  // Update biography content
  biography.value = quill.value.root.innerHTML
}

// Close Image Controls
function closeImageControls() {
  showImageControls.value = false
  selectedImage.value = null
}

async function loadBiography() {
  try {
    loading.value = true
    const userId = 1 // Dynamisch setzen wenn nötig

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

    saving.value = true
    const newBio = quill.value.root.innerHTML
    const userId = 1

    // Prüfe Größe der Biographie
    const bioSize = new Blob([newBio]).size
    console.log('📊 Biography size:', (bioSize / 1024).toFixed(2) + 'KB')

    if (bioSize > 500 * 1024) { // Warnung bei > 500KB
      showToast('Warnung: Biographie ist sehr groß. Dies kann zu Problemen führen.', 'error')
    }

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
  } finally {
    saving.value = false
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
      modules: {
        toolbar: {
          container: '#toolbar',
          handlers: {
            image: imageHandler
          }
        }
      }
    })
    quill.value.root.innerHTML = biography.value

    // Add click listener for images
    quill.value.root.addEventListener('click', handleImageClick)
  }
})

onBeforeUnmount(() => {
  if (quill.value) {
    quill.value.root.removeEventListener('click', handleImageClick)
  }
})
</script>

<style scoped>
/* Quill Editor Customization */
:deep(.ql-container) {
  font-family: inherit;
  font-size: 1rem;
}

:deep(.ql-editor) {
  min-height: 400px;
  padding: 2rem;
  line-height: 1.8;
}

:deep(.ql-editor img) {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0.75rem;
  margin: 1rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.ql-editor img:hover) {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transform: scale(1.02);
}

:deep(.ql-editor h1) {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

:deep(.ql-editor h2) {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

:deep(.ql-editor p) {
  margin-bottom: 1rem;
  color: #374151;
}

:deep(.ql-editor ul),
:deep(.ql-editor ol) {
  padding-left: 2rem;
  margin-bottom: 1rem;
}

:deep(.ql-editor a) {
  color: #8b5cf6;
  text-decoration: underline;
}

@media (max-width: 768px) {
  :deep(.ql-editor) {
    min-height: 400px;
    padding: 1.5rem;
  }
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

/* Range Input Styling */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
}
</style>