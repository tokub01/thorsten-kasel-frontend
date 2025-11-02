<template>
  <div class="bg-gray-300 px-4 py-10 mt-3">
    <div class="mx-auto bg-white shadow-lg rounded-xl p-8 max-w-4xl">
      <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">Vita</h1>

      <div v-if="loading" class="text-gray-500 text-center py-10">
        Biographie wird geladen...
      </div>

      <div v-else-if="biography" v-html="biography" class="prose text-gray-700"></div>

      <div v-else class="text-gray-500 text-center py-10">
        Biographie ist noch nicht verfügbar.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/Users';

const userStore = useUserStore();
const biography = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    // ID des Users, dessen Biografie angezeigt werden soll
    const userId = 1; // <-- hier ggf. dynamisch setzen
    const data = await userStore.fetchBiography(userId);
    biography.value = data.biography || '';
  } catch (err) {
    console.error('Fehler beim Laden der Biographie', err);
    biography.value = '';
  } finally {
    loading.value = false;
  }
});
</script>
