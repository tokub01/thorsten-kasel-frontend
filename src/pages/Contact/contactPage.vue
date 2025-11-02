<template>
  <div class=" bg-gray-300 flex items-center justify-center px-4 py-12  mt-3">
    <div class="max-w-2xl w-full">

      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl mb-4 shadow-lg">
          <Mail class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-4xl sm:text-5xl font-serif font-bold mb-4 text-gray-900">
          Kontakt
        </h1>
        <p class="text-lg text-gray-600">
          Schreib mir eine Nachricht – ich freue mich auf den Austausch.
        </p>
      </div>

      <!-- Success State -->
      <div v-if="showSuccess" class="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle2 class="h-10 w-10 text-green-600" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-3">Nachricht gesendet! ✓</h3>
          <p class="text-gray-600 mb-4 leading-relaxed">
            Wir haben dir eine Bestätigungs-E-Mail an <span class="font-semibold">{{ submittedEmail }}</span> gesendet.
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div class="flex items-start gap-3">
              <Info class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div class="text-sm text-blue-800 text-left">
                <p class="font-semibold mb-1">Bitte bestätige deine E-Mail-Adresse</p>
                <p>Klicke auf den Link in der E-Mail, um deine Nachricht zu verifizieren. Überprüfe auch deinen Spam-Ordner.</p>
              </div>
            </div>
          </div>
          <button
            @click="resetForm"
            class="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            Neue Nachricht senden
          </button>
        </div>
      </div>

      <!-- Contact Form -->
      <form
        v-else
        @submit.prevent="handleSubmit"
        class="bg-white rounded-2xl shadow-xl p-8 md:p-10 space-y-6 border border-gray-200"
      >
        <!-- Name Input -->
        <div>
          <label for="name" class="block text-left mb-2 text-gray-700 font-semibold flex items-center gap-2">
            <User class="w-4 h-4" />
            Name *
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            placeholder="Dein vollständiger Name"
            class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-800 focus:border-transparent focus:outline-none transition"
            :disabled="loading || cooldown > 0"
          />
        </div>

        <!-- Email Input -->
        <div>
          <label for="email" class="block text-left mb-2 text-gray-700 font-semibold flex items-center gap-2">
            <Mail class="w-4 h-4" />
            E-Mail *
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="deine@email.de"
            class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-800 focus:border-transparent focus:outline-none transition"
            :disabled="loading || cooldown > 0"
          />
        </div>

        <!-- Message Input -->
        <div>
          <label for="message" class="block text-left mb-2 text-gray-700 font-semibold flex items-center gap-2">
            <MessageSquare class="w-4 h-4" />
            Nachricht *
          </label>
          <textarea
            id="message"
            v-model="message"
            rows="6"
            required
            placeholder="Deine Nachricht an uns..."
            class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-gray-800 focus:border-transparent focus:outline-none transition resize-none"
            :disabled="loading || cooldown > 0"
          ></textarea>
          <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
            <span>Mindestens 10 Zeichen</span>
            <span>{{ message.length }} / 1000</span>
          </div>
        </div>

        <!-- reCAPTCHA Notice -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div class="flex items-start gap-3">
            <Shield class="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
            <div class="text-xs text-gray-600">
              <p class="font-semibold mb-1">Geschützt durch Google reCAPTCHA</p>
              <p>Es gelten die <a href="https://policies.google.com/privacy" target="_blank" class="underline hover:text-gray-800">Datenschutzerklärung</a> und <a href="https://policies.google.com/terms" target="_blank" class="underline hover:text-gray-800">Nutzungsbedingungen</a> von Google.</p>
            </div>
          </div>
        </div>

        <!-- Hidden reCAPTCHA -->
        <div ref="recaptchaContainer" id="recaptcha-container"></div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || cooldown > 0 || message.length < 10"
          class="w-full bg-gray-800 text-white font-semibold py-4 rounded-lg hover:bg-gray-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <component :is="loading ? Loader2 : Send" :class="['w-5 h-5', loading ? 'animate-spin' : '']" />
          <span v-if="cooldown > 0">Warte {{ cooldown }}s</span>
          <span v-else-if="loading">Wird gesendet...</span>
          <span v-else>Nachricht senden</span>
        </button>

        <!-- Error Message -->
        <div v-if="store.errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <AlertCircle class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-sm font-semibold text-red-800 mb-1">Fehler beim Senden</p>
              <p class="text-sm text-red-700">{{ store.errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Info Text -->
        <p class="text-center text-xs text-gray-500">
          * Pflichtfelder. Deine Daten werden vertraulich behandelt.
        </p>
      </form>

      <!-- Contact Info -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-600 mb-3">Oder kontaktiere mich direkt:</p>
        <a
          href="mailto:thorsten.kasel@web.de"
          class="inline-flex items-center gap-2 text-gray-800 hover:text-gray-600 transition font-medium"
        >
          <Mail class="w-4 h-4" />
          thorsten.kasel@web.de
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useContactStore } from "@/stores/Contact";
import {
  Mail, User, MessageSquare, Shield, Send, CheckCircle2, Info,
  AlertCircle, Loader2
} from 'lucide-vue-next'

const store = useContactStore();

const name = ref("");
const email = ref("");
const message = ref("");
const cooldown = ref(0);
const loading = ref(false);
const showSuccess = ref(false);
const submittedEmail = ref("");
const recaptchaContainer = ref(null);
let cooldownInterval = null;
let recaptchaId = null;

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

// reCAPTCHA laden
const loadRecaptcha = () => new Promise(resolve => {
  if (recaptchaId !== null) return resolve();
  const existing = document.querySelector('script[src*="recaptcha/api.js"]');
  if (!existing) {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=contactRecaptchaInit&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
  window.contactRecaptchaInit = () => {
    window.grecaptcha.ready(() => {
      recaptchaId = window.grecaptcha.render(recaptchaContainer.value, {
        sitekey: process.env.VUE_APP_RECAPTCHA_KEY,
        size: 'invisible'
      });
      resolve();
    });
  };
});

const resetForm = () => {
  name.value = "";
  email.value = "";
  message.value = "";
  showSuccess.value = false;
  store.errorMessage = "";
  store.successMessage = "";
  if (window.grecaptcha && recaptchaId !== null) {
    window.grecaptcha.reset(recaptchaId);
  }
};

const handleSubmit = async () => {
  try {
    loading.value = true;
    store.errorMessage = "";

    // reCAPTCHA laden falls noch nicht geladen
    if (recaptchaId === null) {
      await loadRecaptcha();
    }

    // reCAPTCHA Token abrufen
    const token = await window.grecaptcha.execute(recaptchaId, { action: 'submit' });

    // Formular absenden
    await store.submit(email.value, name.value, message.value, token);

    if (!store.errorMessage) {
      submittedEmail.value = email.value;
      showSuccess.value = true;
      startCooldown(300); // 5 Minuten Cooldown
    }
  } catch (err) {
    console.error('Fehler beim Absenden:', err);
    store.errorMessage = err.message || "Fehler beim Absenden. Bitte versuche es erneut.";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // Cooldown wiederherstellen
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

  // reCAPTCHA laden
  await loadRecaptcha();
});
</script>

<style scoped>
/* reCAPTCHA Container verstecken */
#recaptcha-container {
  position: absolute;
  visibility: hidden;
}
</style>