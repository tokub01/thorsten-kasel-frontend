import { defineStore } from "pinia";
import * as ExhibitionsService from "@/services/Exhibitions";

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
        // Sicherstellen, dass immer ein Array gespeichert wird
        this.exhibitions = Array.isArray(data) ? data : data.data || [];
      } catch (error) {
        console.error("Fehler beim Laden der Ausstellungen:", error);
        this.error = error;
        this.exhibitions = []; // Leeres Array bei Fehler
      } finally {
        this.loading = false;
      }
    },

    async fetchExhibition(id) {
      this.loading = true;
      this.error = null;
      try {
        const data = await ExhibitionsService.show(id);
        this.currentExhibition = data;
        return data;
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

        // Zur Liste hinzufügen falls erfolgreich
        if (data && Array.isArray(this.exhibitions)) {
          this.exhibitions.unshift(data);
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

        // In Liste aktualisieren
        if (data && Array.isArray(this.exhibitions)) {
          const index = this.exhibitions.findIndex(e => e.id === id);
          if (index !== -1) {
            this.exhibitions[index] = data;
          }
        }

        // Current exhibition aktualisieren
        if (this.currentExhibition?.id === id) {
          this.currentExhibition = data;
        }

        return data;
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