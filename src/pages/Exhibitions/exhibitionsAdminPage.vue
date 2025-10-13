<template>
  <section class="bg-gray-300 min-h-screen py-10 px-6">
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- HEADER -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 class="text-4xl font-bold text-gray-800 font-serif">🖼️ Ausstellungen verwalten</h1>

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
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow hover:bg-gray-300 transition"
          >
            🔄 Aktualisieren
          </button>
          <button
            @click="openCreateModal"
            class="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            ➕ Neue Ausstellung
          </button>
        </div>
      </div>

      <!-- LOADING / ERROR -->
      <div v-if="store.loading" class="text-gray-700 text-center py-10 animate-pulse">
        ⏳ Lade Ausstellungen...
      </div>

      <div
        v-else-if="store.error"
        class="bg-red-100 border border-red-300 text-red-700 text-center p-4 rounded-lg"
      >
        Fehler beim Laden: {{ store.error.message }}
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
          class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition cursor-pointer"
        >
          <div class="relative h-48 bg-gray-100">
            <img
              v-if="exhibition.image"
              :src="exhibition.image"
              :alt="exhibition.title"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex items-center justify-center h-full text-gray-400 italic">
              Kein Bild
            </div>
          </div>
          <div class="p-5">
            <h2 class="text-xl font-semibold text-gray-800 truncate">{{ exhibition.title }}</h2>
            <p class="text-gray-600 line-clamp-2 mb-2">
              {{ exhibition.description || "Keine Beschreibung verfügbar." }}
            </p>
            <p class="text-xs text-gray-500">{{ formatDate(exhibition.created_at) }}</p>
          </div>
        </article>
      </div>

      <!-- NO RESULTS -->
      <div v-else class="text-center text-gray-600 bg-white py-16 rounded-xl shadow">
        Keine Ausstellungen gefunden.
      </div>
    </div>

    <!-- MODAL -->
    <transition name="fade">
      <div v-if="modal.visible" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative">
          <!-- CLOSE BUTTON -->
          <button @click="closeModal" class="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold">×</button>

          <!-- MODAL TITLE -->
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ modal.title }}</h2>

          <!-- MODAL CONTENT -->
          <div v-if="modal.type === 'view'" class="space-y-3">
            <img
              v-if="selectedExhibition.image"
              :src="selectedExhibition.image"
              class="rounded-lg w-full max-h-64 object-cover"
            />
            <p class="text-gray-700">{{ selectedExhibition.description }}</p>
            <p class="text-sm text-gray-500">
              Erstellt am: {{ formatDate(selectedExhibition.created_at) }}
            </p>

            <div class="flex justify-end gap-3 mt-4">
              <button
                @click="openEditModal(selectedExhibition)"
                class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
              >
                ✏️ Bearbeiten
              </button>
              <button
                @click="confirmDelete(selectedExhibition.id)"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                🗑️ Löschen
              </button>
            </div>
          </div>

          <form v-else-if="modal.type === 'edit'" @submit.prevent="saveExhibition" class="space-y-4">
            <input
              v-model="form.title"
              placeholder="Titel"
              required
              class="w-full border rounded-lg px-3 py-2"
            />
            <textarea
              v-model="form.description"
              placeholder="Beschreibung"
              class="w-full border rounded-lg px-3 py-2"
            ></textarea>

            <div class="flex flex-col gap-2">
              <label class="text-gray-700 font-medium">Bild auswählen</label>
              <input type="file" @change="handleImage" accept="image/*" />
              <img
                v-if="imagePreview"
                :src="imagePreview"
                class="w-full max-h-48 object-cover rounded-lg mt-2"
              />
            </div>

            <textarea
              v-model="form.text"
              placeholder="Text"
              class="w-full border rounded-lg px-3 py-2"
            ></textarea>

            <button
              type="submit"
              class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition w-full"
            >
              💾 {{ editMode ? "Änderungen speichern" : "Erstellen" }}
            </button>
          </form>
        </div>
      </div>
    </transition>

    <!-- TOASTS -->
    <div class="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      <div
        v-for="(toast, index) in toasts"
        :key="index"
        class="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow flex items-center justify-between min-w-[200px] transition"
      >
        {{ toast.message }}
        <button @click="removeToast(index)" class="ml-2 text-gray-800 font-bold">×</button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useExhibitionsStore } from "@/stores/Exhibitions";

const store = useExhibitionsStore();
const keyword = ref("");
const sort = ref("desc");

const modal = ref({
  visible: false,
  type: "view", // view | edit
  title: "",
});

const selectedExhibition = ref({});
const editMode = ref(false);

const form = ref({ title: "", description: "", image: "", text: "" });
const imageFile = ref(null);
const imagePreview = ref(null);

// TOASTS
const toasts = ref([]);
function showToast(message) {
  toasts.value.push({ message });
  setTimeout(() => toasts.value.shift(), 3000);
}
function removeToast(index) {
  toasts.value.splice(index, 1);
}

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
  modal.value = { visible: true, type: "view", title: exhibition.title };
}
function openCreateModal() {
  editMode.value = false;
  form.value = { title: "", description: "", image: "", text: "" };
  imageFile.value = null;
  imagePreview.value = null;
  modal.value = { visible: true, type: "edit", title: "➕ Neue Ausstellung" };
}
function openEditModal(exhibition) {
  editMode.value = true;
  selectedExhibition.value = exhibition;
  form.value = { ...exhibition };
  imageFile.value = null;
  imagePreview.value = exhibition.image || null;
  modal.value = { visible: true, type: "edit", title: "✏️ Ausstellung bearbeiten" };
}
function closeModal() { modal.value.visible = false; }

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
      showToast("✅ Ausstellung aktualisiert");
    } else {
      await store.createExhibition(fd);
      showToast("🎉 Ausstellung erstellt");
    }

    closeModal();
    store.fetchExhibitions();
    imageFile.value = null;
    imagePreview.value = null;
  } catch {
    showToast("❌ Fehler beim Speichern");
  }
}

async function confirmDelete(id) {
  if (!confirm("Möchtest du diese Ausstellung wirklich löschen?")) return;
  try {
    await store.deleteExhibition(id);
    showToast("🗑️ Ausstellung gelöscht");
    closeModal();
  } catch {
    showToast("❌ Fehler beim Löschen");
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
</style>
