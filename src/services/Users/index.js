// src/stores/userStore.js
import { defineStore } from 'pinia'
import * as UserService from '@/services/Users'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const data = await UserService.index()
        this.users = data
      } catch (error) {
        console.error('Fehler beim Laden der Benutzer:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchUser(user_id) {
      this.loading = true
      this.error = null
      try {
        const data = await UserService.show(user_id)
        this.user = data
      } catch (error) {
        console.error('Fehler beim Laden des Benutzers:', error)
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchUserByEmail(email) {
      this.loading = true
      this.error = null
      try {
        const data = await UserService.index()
        const found = data.find((u) => u.email === email)
        if (!found) throw new Error(`Kein Benutzer mit E-Mail ${email} gefunden`)
        this.user = found
      } catch (error) {
        console.error('Fehler beim Laden der Biographie:', error)
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUserBiography(email, biography) {
      this.loading = true
      this.error = null
      try {
        if (!this.user || this.user.email !== email) {
          await this.fetchUserByEmail(email)
        }

        const res = await UserService.update(
          this.user.name,
          this.user.email,
          null,
          null,
          biography
        )

        this.user.biography = biography
        return res
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Biographie:', error)
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
