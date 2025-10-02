<template>
  <div class="border w-[90%] m-auto mt-4 flex flex-col p-5 mt-3">
    <p class="text-3xl font-bold border-b mb-3">Kontakt</p>
    <form class="w-full" @submit.prevent="handleSubmit">
      <div class="flex flex-col">
        <label for="email">E-Mail:</label>
        <input id="email" v-model="email" class="border p-2" type="text" required />
      </div>
      <div class="flex flex-col mt-2">
        <label for="name">Name:</label>
        <input id="name" v-model="name" class="border p-2" type="text" required />
      </div>
      <div class="flex flex-col mt-2">
        <label for="message">Nachricht:</label>
        <textarea id="message" v-model="message" class="border p-2" required></textarea>
      </div>

      <button
        class="border p-2 hover:bg-gray-600 hover:cursor-pointer mt-4"
        :disabled="store.loading || cooldown > 0"
        type="submit"
      >
        {{ cooldown > 0 ? `Warte ${cooldown}s` : 'Absenden' }}
      </button>

      <p v-if="store.errorMessage" class="error mt-2">{{ store.errorMessage }}</p>
      <p v-if="store.successMessage" class="text-green-600 mt-2">{{ store.successMessage }}</p>
    </form>
  </div>
</template>

<style scoped>
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: red;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import { useContactStore } from '@/stores/Contact'

const store = useContactStore()

const name = ref('')
const email = ref('')
const message = ref('')
const cooldown = ref(0)
let cooldownInterval = null

let grecaptchaReady = ref(false)

const startCooldown = (seconds) => {
  const until = Date.now() + seconds * 1000
  localStorage.setItem('contactCooldownUntil', until.toString())

  updateCooldown(until)
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => updateCooldown(until), 1000)
}

const updateCooldown = (until) => {
  const diff = Math.floor((until - Date.now()) / 1000)
  cooldown.value = diff > 0 ? diff : 0
  if (cooldown.value <= 0 && cooldownInterval) {
    clearInterval(cooldownInterval)
    cooldownInterval = null
    localStorage.removeItem('contactCooldownUntil')
  }
}

// reCAPTCHA Script laden + Cooldown prüfen
onMounted(() => {
  // Cooldown aus localStorage wiederherstellen
  const savedUntil = localStorage.getItem('contactCooldownUntil')
  if (savedUntil) {
    const until = parseInt(savedUntil)
    if (until > Date.now()) {
      updateCooldown(until)
      cooldownInterval = setInterval(() => updateCooldown(until), 1000)
    } else {
      localStorage.removeItem('contactCooldownUntil')
    }
  }

  // reCAPTCHA Script laden
  const script = document.createElement('script')
  script.src = 'https://www.google.com/recaptcha/api.js?render=6LfRCtYrAAAAANiO5azebKcTfT_jU_IUvkMQ91fo'
  script.async = true
  script.defer = true
  script.onload = () => {
    grecaptchaReady.value = true
  }
  document.head.appendChild(script)
})

// Formular absenden
const handleSubmit = () => {
  if (!grecaptchaReady.value || !window.grecaptcha) {
    store.errorMessage = 'reCAPTCHA noch nicht geladen!'
    return
  }

  window.grecaptcha.ready(() => {
    window.grecaptcha.execute('6LfRCtYrAAAAANiO5azebKcTfT_jU_IUvkMQ91fo', { action: 'submit_contact' })
      .then((token) => {
        store.submit(email.value, name.value, message.value, token)
          .then(() => {
            if (!store.errorMessage) {
              name.value = ''
              email.value = ''
              message.value = ''
              startCooldown(300) // ✅ jetzt 500 Sekunden und persistent
            }
          })
      })
      .catch(err => {
        store.errorMessage = err.message || 'Fehler bei reCAPTCHA'
      })
  })
}
</script>

