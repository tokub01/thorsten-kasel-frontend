import { defineStore } from "pinia";
import * as ExhibitionsService from "@/services/Exhibitions";

// Hilfsfunktion zum Normalisieren von isActive
const normalizeIsActive = (exhibition) => {
  if (!exhibition) return null;

  return {
    ...exhibition,
    isActive: Boolean(
      exhibition.isActive === true ||
      exhibition.isActive === 1 ||
      exhibition.isActive === "1"
    )
  };
};

export const useExhibitionsStore = defineStore("exhibitions", {
  state: () => ({
    exhibitions: [],
    currentExhibition: null,
    loading: false,
    error: null,
  }),

  getters: {
    // Getter für aktive Ausstellungen
    activeExhibitions: (state) => {
      return state.exhibitions.filter(e => e.isActive);
    },

    // Getter für Anzahl der Ausstellungen
    totalCount: (state) => state.exhibitions.length,

    // Getter für spezifische Ausstellung
    getExhibitionById: (state) => {
      return (id) => state.exhibitions.find(e => e.id === id);
    }
  },

  actions: {
    async fetchExhibitions(keyword = "", sort = "desc") {
      this.loading = true;
      this.error = null;

      try {
        const data = await ExhibitionsService.index(keyword, sort);
        const rawExhibitions = Array.isArray(data)
          ? data
          : (data?.data && Array.isArray(data.data))
            ? data.data
            : [];

        // isActive normalisieren und filtern (null-Werte entfernen)
        this.exhibitions = rawExhibitions
          .map(normalizeIsActive)
          .filter(e => e !== null);

      } catch (error) {
        console.error("Fehler beim Laden der Ausstellungen:", error);
        this.error = error;
        this.exhibitions = [];
        throw error; // Error weitergeben für UI-Handling
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
        this.currentExhibition = null;
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
        const normalizedData = normalizeIsActive(data);

        if (normalizedData && Array.isArray(this.exhibitions)) {
          this.exhibitions.unshift(normalizedData);
        }

        return normalizedData;
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
        const data = await ExhibitionsService.update(
          id,
          title,
          description,
          image,
          text,
          isActive
        );
        const normalizedData = normalizeIsActive(data);

        // In Liste aktualisieren
        if (Array.isArray(this.exhibitions)) {
          const index = this.exhibitions.findIndex(e => e.id === id);
          if (index !== -1) {
            this.exhibitions.splice(index, 1, normalizedData);
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

        // Aus Liste entfernen
        if (Array.isArray(this.exhibitions)) {
          this.exhibitions = this.exhibitions.filter((e) => e.id !== id);
        }

        // Current exhibition zurücksetzen falls gelöscht
        if (this.currentExhibition?.id === id) {
          this.currentExhibition = null;
        }

        return true;
      } catch (error) {
        console.error("Fehler beim Löschen der Ausstellung:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Zusätzliche Hilfsmethoden
    clearError() {
      this.error = null;
    },

    resetCurrentExhibition() {
      this.currentExhibition = null;
    },

    clearAll() {
      this.exhibitions = [];
      this.currentExhibition = null;
      this.loading = false;
      this.error = null;
    }
  },
});