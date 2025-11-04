// @/stores/Exhibitions/index.js
import { defineStore } from "pinia";
import * as ExhibitionsService from "@/services/Exhibitions";

// Hilfsfunktion zum Normalisieren von isActive
const normalizeIsActive = (exhibition) => ({
  ...exhibition,
  isActive: Boolean(exhibition.isActive) ||
            exhibition.isActive === 1 ||
            exhibition.isActive === "1"
});

export const useExhibitionsStore = defineStore("exhibitions", {
  state: () => ({
    exhibitions: [],
    currentExhibition: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchExhibitions(keyword = "", sort = "desc") {
      this.loading = true;
      this.error = null;
      try {
        const data = await ExhibitionsService.index(keyword, sort);
        const rawExhibitions = Array.isArray(data) ? data : data.data || [];

        // isActive normalisieren
        this.exhibitions = rawExhibitions.map(normalizeIsActive);
      } catch (error) {
        console.error("Fehler beim Laden der Ausstellungen:", error);
        this.error = error;
        this.exhibitions = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchExhibition(id) {
      this.loading = true;
      this.error = null;
      try {
        const data = await ExhibitionsService.show(id);
        this.currentExhibition = normalizeIsActive(data);
        return this.currentExhibition;
      } catch (error) {
        console.error("Fehler beim Laden der Ausstellung:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createExhibition(formData) {
      this.loading = true;
      this.error = null;
      try {
        const data = await ExhibitionsService.store(formData);
        if (data && Array.isArray(this.exhibitions)) {
          this.exhibitions.unshift(normalizeIsActive(data));
        }
        return data;
      } catch (error) {
        console.error("Fehler beim Erstellen der Ausstellung:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateExhibition(id, title, description, image, text, isActive) {
      this.loading = true;
      this.error = null;
      try {
        const data = await ExhibitionsService.update(id, title, description, image, text, isActive);

        const normalizedData = normalizeIsActive(data);

        // In Liste aktualisieren
        if (Array.isArray(this.exhibitions)) {
          const index = this.exhibitions.findIndex(e => e.id === id);
          if (index !== -1) {
            this.exhibitions[index] = normalizedData;
          }
        }

        // Current exhibition aktualisieren
        if (this.currentExhibition?.id === id) {
          this.currentExhibition = normalizedData;
        }

        return normalizedData;
      } catch (error) {
        console.error("Fehler beim Aktualisieren der Ausstellung:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteExhibition(id) {
      this.loading = true;
      this.error = null;
      try {
        await ExhibitionsService.destroy(id);
        if (Array.isArray(this.exhibitions)) {
          this.exhibitions = this.exhibitions.filter((e) => e.id !== id);
        }
        if (this.currentExhibition?.id === id) {
          this.currentExhibition = null;
        }
      } catch (error) {
        console.error("Fehler beim Löschen der Ausstellung:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});