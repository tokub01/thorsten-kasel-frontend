// stores/contact.js
import { defineStore } from 'pinia'
import { submit, verify } from '@/services/Contact'

export const useContactStore = defineStore('contact', {
  state: () => ({
    errors: [],
    loading: false,
    successMessage: '',
    errorMessage: '',
  }),

  actions: {
    async submit(email, name, message, recaptchaToken) {
      this.loading = true
      this.errors = []
      this.errorMessage = ''
      this.successMessage = ''
      // stores/contact.js
      try {
        const res = await submit(email, name, message, recaptchaToken)
        this.successMessage = res.message || 'Nachricht erfolgreich gesendet!'  // 🔥
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors || []
          this.errorMessage = error.response.data.message || 'Validierungsfehler'
        } else if (error.response?.status === 403) {
          this.errorMessage = error.response.data.message || 'Du wurdest als Bot erkannt'
        } else {
          this.errorMessage = error.response?.data?.message || 'Fehler beim Absenden'
        }
      }
    },
    async verify(token) {
      this.loading = true
      this.errors = []
      this.errorMessage = ''
      this.successMessage = ''
      // stores/contact.js
      try {
        const res = await verify(token)
        this.successMessage = res.message || 'E-Mail erfolgreich verifiziert!'  // 🔥
      } catch (error) {
        if (error.response?.status === 422) {
          this.errors = error.response.data.errors || []
          this.errorMessage = error.response.data.message || 'Validierungsfehler'
        } else if (error.response?.status === 403) {
          this.errorMessage = error.response.data.message || 'Du wurdest als Bot erkannt'
        } else {
          this.errorMessage = error.response?.data?.message || 'Fehler beim Absenden'
        }
      }
    },
  },
})