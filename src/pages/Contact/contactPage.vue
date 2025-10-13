<template>
  <div class="flex flex-col bg-gray-300 text-gray-800">
    <!-- Inhalt -->
    <main class="flex-grow">
      <div class="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 class="text-4xl sm:text-5xl font-serif font-bold mb-6 text-gray-900">
          Kontakt
        </h1>
        <p class="text-lg text-gray-600 mb-12">
          Schreib mir eine Nachricht – ich freue mich auf den Austausch.
        </p>

        <!-- Kontaktformular -->
        <form
          @submit.prevent="handleSubmit"
          class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md p-8 md:p-10 space-y-6 border border-gray-200"
        >
          <div>
            <label for="name" class="block text-left mb-2 text-gray-700 font-semibold">
              Name
            </label>
            <input
              id="name"
              v-model="name"
              type="text"
              required
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            />
          </div>

          <div>
            <label for="email" class="block text-left mb-2 text-gray-700 font-semibold">
              E-Mail
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            />
          </div>

          <div>
            <label for="message" class="block text-left mb-2 text-gray-700 font-semibold">
              Nachricht
            </label>
            <textarea
              id="message"
              v-model="message"
              rows="6"
              required
              class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-400 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-gray-900 text-white font-semibold py-3 rounded-lg hover:bg-gray-700 transition"
            :disabled="store.loading || cooldown > 0"
          >
            {{ cooldown > 0 ? `Warte ${cooldown}s` : 'Nachricht senden' }}
          </button>

          <p
            v-if="store.errorMessage"
            class="text-red-600 text-center mt-2 font-medium"
          >
            {{ store.errorMessage }}
          </p>
          <p
            v-if="store.successMessage"
            class="text-green-600 text-center mt-2 font-medium"
          >
            {{ store.successMessage }}
          </p>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useContactStore } from "@/stores/Contact";

const store = useContactStore();

const name = ref("");
const email = ref("");
const message = ref("");
const cooldown = ref(0);
let cooldownInterval = null;

// Cooldown Funktionen
const startCooldown = (seconds) => {
  const until = Date.now() + seconds * 1000;
  localStorage.setItem("contactCooldownUntil", until.toString());
  updateCooldown(until);
  if (cooldownInterval) clearInterval(cooldownInterval);
  cooldownInterval = setInterval(() => updateCooldown(until), 1000);
};

const updateCooldown = (until) => {
  const diff = Math.floor((until - Date.now()) / 1000);
  cooldown.value = diff > 0 ? diff : 0;
  if (cooldown.value <= 0 && cooldownInterval) {
    clearInterval(cooldownInterval);
    cooldownInterval = null;
    localStorage.removeItem("contactCooldownUntil");
  }
};

onMounted(() => {
  const savedUntil = localStorage.getItem("contactCooldownUntil");
  if (savedUntil) {
    const until = parseInt(savedUntil);
    if (until > Date.now()) {
      updateCooldown(until);
      cooldownInterval = setInterval(() => updateCooldown(until), 1000);
    } else {
      localStorage.removeItem("contactCooldownUntil");
    }
  }
});

const handleSubmit = async () => {
  try {
    await store.submit(email.value, name.value, message.value);
    if (!store.errorMessage) {
      name.value = "";
      email.value = "";
      message.value = "";
      startCooldown(300);
    }
  } catch (err) {
    store.errorMessage = err.message || "Fehler beim Absenden";
  }
};
</script>
