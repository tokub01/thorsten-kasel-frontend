<template>
  <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-10">
      <!-- Seitenüberschrift -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6">
        {{ isNew ? 'Neue News erstellen' : 'News bearbeiten' }}
      </h1>

      <!-- Formular -->
      <form @submit.prevent="saveNews" class="space-y-6">
        <!-- Titel -->
        <div>
          <label class="block text-gray-700 font-semibold mb-1" for="title">Titel</label>
          <input
            id="title"
            v-model="news.title"
            type="text"
            class="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>

        <!-- Beschreibung -->
        <div>
          <label class="block text-gray-700 font-semibold mb-1" for="description">Beschreibung</label>
          <textarea
            id="description"
            v-model="news.description"
            class="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            rows="5"
            required
          ></textarea>
        </div>

        <!-- Datum -->
        <div>
          <label class="block text-gray-700 font-semibold mb-1" for="date">Datum</label>
          <input
            id="date"
            v-model="news.date"
            type="date"
            class="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>

        <!-- Bild -->
        <div>
          <label class="block text-gray-700 font-semibold mb-1" for="image">Bild URL</label>
          <input
            id="image"
            v-model="news.image"
            type="text"
            placeholder="https://example.com/image.jpg"
            class="w-full border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
          />
          <div v-if="news.image" class="mt-4">
            <img :src="news.image" :alt="news.title" class="w-full rounded-lg object-cover max-h-64" />
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            @click="cancel"
            class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isNew = computed(() => route.params.newsId === 'new');

const news = ref({
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0], // Heute als default
  image: '',
});

// Beispielhafte Daten, wenn bestehende News geladen werden soll
const exampleNews = {
  1: {
    title: "Neue Ausstellung eröffnet",
    description: "Eine spannende Ausstellung über zeitgenössische Kunst in urbanen Räumen.",
    date: "2025-10-01",
    image: "https://place-hold.it/600x400",
  },
  2: {
    title: "Künstlergespräch am 15. Oktober",
    description: "Interaktives Gespräch mit mehreren Künstlern über aktuelle Trends.",
    date: "2025-09-20",
    image: "https://place-hold.it/600x400",
  },
};

onMounted(() => {
  if (!isNew.value && exampleNews[route.params.newsId]) {
    news.value = { ...exampleNews[route.params.newsId] };
  }
});

function saveNews() {
  console.log("News speichern:", news.value);
  // Hier kannst du POST/PUT an dein Backend machen
  router.push('/admin/newsPage');
}

function cancel() {
  router.push('/admin/newsPage');
}
</script>

<style scoped>
textarea {
  resize: vertical;
}
</style>
