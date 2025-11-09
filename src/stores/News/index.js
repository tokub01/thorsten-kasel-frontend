import { defineStore } from 'pinia';
import * as NewsService from '@/services/News';

export const useNewsStore = defineStore('news', {
  state: () => ({
    news: [],
    currentNews: null,
    loading: false,
    error: null,
  }),

  getters: {
    activeNews: (state) => {
      return (state.news || []).filter(n =>
        n.isActive === 1 ||
        n.isActive === "1" ||
        n.isActive === true
      );
    },

    getById: (state) => {
      return (id) => state.news.find(n => n.id === id);
    },

    totalCount: (state) => state.news.length,
  },

  actions: {
    async fetchNews(keyword = '', sort = 'desc') {
      this.loading = true;
      this.error = null;

      try {
        const data = await NewsService.index(keyword, sort);
        this.news = Array.isArray(data) ? data : (data?.data || []);
      } catch (err) {
        console.error('Error fetching news:', err);
        this.error = err;
        this.news = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchNewsById(id) {
      this.loading = true;
      this.error = null;

      try {
        const data = await NewsService.show(id);
        this.currentNews = data;
        return data;
      } catch (err) {
        console.error('Error fetching news by ID:', err);
        this.error = err;
        this.currentNews = null;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createNews(formData) {
      this.loading = true;
      this.error = null;

      try {
        const data = await NewsService.store(formData);

        if (data && Array.isArray(this.news)) {
          this.news.unshift(data);
        }

        return data;
      } catch (err) {
        console.error('Error creating news:', err);
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateNews(id, title, description, image, text, isActive) {
      this.loading = true;
      this.error = null;

      try {
        const data = await NewsService.update(id, title, description, image, text, isActive);

        // In Liste aktualisieren
        if (Array.isArray(this.news)) {
          const index = this.news.findIndex(n => n.id === id);
          if (index !== -1) {
            this.news.splice(index, 1, data);
          }
        }

        // Current news aktualisieren
        if (this.currentNews?.id === id) {
          this.currentNews = data;
        }

        return data;
      } catch (err) {
        console.error('Error updating news:', err);
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteNews(id) {
      this.loading = true;
      this.error = null;

      try {
        await NewsService.destroy(id);

        if (Array.isArray(this.news)) {
          this.news = this.news.filter(n => n.id !== id);
        }

        if (this.currentNews?.id === id) {
          this.currentNews = null;
        }

        return true;
      } catch (err) {
        console.error('Error deleting news:', err);
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async toggleActive(id) {
      const item = this.news.find(n => n.id === id);
      if (!item) return;

      const newActiveState = !(item.isActive === 1 || item.isActive === "1" || item.isActive === true);

      try {
        await this.updateNews(
          id,
          item.title,
          item.description,
          null, // kein neues Bild
          item.text,
          newActiveState
        );
      } catch (err) {
        console.error('Error toggling active state:', err);
        throw err;
      }
    },
  },
});