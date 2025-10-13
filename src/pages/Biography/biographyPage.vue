<template>
  <div class="min-h-screen bg-gray-300 px-4 py-10">
    <div class="mx-auto bg-white shadow-lg rounded-xl p-8 max-w-4xl">
      <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">Vita</h1>

      <div v-if="biography" v-html="biography" class="prose text-gray-700"></div>

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

onMounted(async () => {
  try {
    await userStore.fetchUsers();
    const user = userStore.users.find(u => u.email === 'thorsten.kasel@web.de');
    biography.value = user?.biography || '';
  } catch (err) {
    console.error('Fehler beim Laden der Biographie', err);
  }
});
</script>
