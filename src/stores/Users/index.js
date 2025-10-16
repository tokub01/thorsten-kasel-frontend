import { defineStore } from "pinia";
import * as UserService from "@/services/Users";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [],
    user: null,
    biography: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers(keyword = "", sort = "") {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.index(keyword, sort);
        this.users = data;
        return data;
      } catch (err) {
        console.error("Fehler beim Laden der Benutzer:", err);
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchUser(user_id) {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.show(user_id);
        this.user = data;
        return data;
      } catch (err) {
        console.error("Fehler beim Laden des Benutzers:", err);
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchBiography(user_id) {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.getBiography(user_id);
        this.biography = data.biography;
        return data;
      } catch (err) {
        console.error("Fehler beim Laden der Biografie:", err);
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(userId, email, name, password = null, biography = null) {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.update(userId, email, name, password, biography);
        this.user = data;
        return data;
      } catch (err) {
        console.error("Fehler beim Aktualisieren des Benutzers:", err);
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(user_id) {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.destroy(user_id);
        this.user = null;
        return data;
      } catch (err) {
        console.error("Fehler beim Löschen des Benutzers:", err);
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createUser(formData) {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.store(formData);
        this.user = data;
        return data;
      } catch (err) {
        console.error("Fehler beim Erstellen des Benutzers:", err);
        this.error = err;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
