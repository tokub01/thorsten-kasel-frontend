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
      } catch (error) {
        console.error("Fehler beim Laden der Ausstellung:", error);
        this.error = error;
      } finally {
        this.loading = false;
      }
    },

    async createExhibition(formData) {
      this.loading = true;
      this.error = null;
      try {
        const data = await ExhibitionsService.store(formData);
        // optional: direkt zur Liste hinzufügen
        this.exhibitions.unshift(data);
        return data;
      } catch (error) {
        console.error("Fehler beim Erstellen der Ausstellung:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateExhibition(title, description, image, text) {
      this.loading = true;
      this.error = null;
      try {
        const data = await ExhibitionsService.update(title, description, image, text);
        // Optional: update currentExhibition oder Liste
        this.currentExhibition = data;
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
        this.exhibitions = this.exhibitions.filter((e) => e.id !== id);
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
