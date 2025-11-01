import { defineStore } from 'pinia'
import * as NewsService from '@/services/News'

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [],         // Alle News
    loading: false,   // Ladezustand
    error: null,      // Fehlerstatus
  }),

  getters: {
    // Nur aktive News
    activeNews: (state) => (state.news || []).filter((n) => n.isActive),

    // News nach ID
    getById: (state) => (id) => state.news.find((n) => n.id === id),
  },

  actions: {
    // Alle News laden
    async fetchNews(keyword = '', sort = '') {
      this.loading = true
      this.error = null
      try {
        const data = await NewsService.index(keyword, sort)
        this.news = data?.data || [] // sicherstellen, dass ein Array vorhanden ist
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // Einzelne News laden (optional)
    async fetchNewsById(id) {
      this.loading = true
      this.error = null
      try {
        const data = await NewsService.show(id)
        return data
      } catch (err) {
        this.error = err
        return null
      } finally {
        this.loading = false
      }
    },

    // Neue News erstellen
    async createNews(formData) {
      this.loading = true
      this.error = null
      try {
        const data = await NewsService.store(formData)
        this.news.push(data)
        return data
      } catch (err) {
        this.error = err
        return null
      } finally {
        this.loading = false
      }
    },

    // News aktualisieren
    async updateNews(id, title, description, image, text) {
      this.loading = true
      this.error = null
      try {
        const data = await NewsService.update(id, title, description, image, text)
        const index = this.news.findIndex((n) => n.id === id)
        if (index !== -1) this.news[index] = data
        return data
      } catch (err) {
        this.error = err
        return null
      } finally {
        this.loading = false
      }
    },

    // News löschen
    async deleteNews(id) {
      this.loading = true
      this.error = null
      try {
        await NewsService.destroy(id)
        this.news = this.news.filter((n) => n.id !== id)
      } catch (err) {
        this.error = err
      } finally {
        this.loading = false
      }
    },

    // Aktiv/Deaktiv schalten
    toggleActive(id) {
      const item = this.news.find((n) => n.id === id)
      if (item) item.isActive = !item.isActive
    },
  },
})
