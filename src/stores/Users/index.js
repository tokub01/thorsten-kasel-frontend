import { defineStore } from "pinia";
import * as UserService from "@/services/Users";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [],
    user: null,
    loading: false,
    error: null,
  }),

  actions: {
    // 🔹 Alle Benutzer laden
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.index();
        this.users = data;
        return data;
      } catch (error) {
        console.error("❌ Fehler beim Laden der Benutzer:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Einzelnen Benutzer per ID laden
    async fetchUser(user_id) {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.show(user_id);
        this.user = data;
        return data;
      } catch (error) {
        console.error("❌ Fehler beim Laden des Benutzers:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Benutzer per E-Mail laden
    async fetchUserByEmail(email) {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.index();
        const found = data.find((u) => u.email === email);

        if (!found) throw new Error(`Kein Benutzer mit E-Mail ${email} gefunden.`);

        this.user = found;
        return found;
      } catch (error) {
        console.error("❌ Fehler beim Laden der Biographie:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Benutzer speichern (neu anlegen)
    async createUser(name, email, password, password_confirmation, biography) {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.store(
          name,
          email,
          password,
          password_confirmation,
          biography
        );
        this.users.push(data);
        return data;
      } catch (error) {
        console.error("❌ Fehler beim Erstellen des Benutzers:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Benutzer aktualisieren
    async updateUser(name, email, password, password_confirmation, biography) {
      this.loading = true;
      this.error = null;
      try {
        const data = await UserService.update(
          name,
          email,
          password,
          password_confirmation,
          biography
        );
        this.user = data;
        return data;
      } catch (error) {
        console.error("❌ Fehler beim Aktualisieren des Benutzers:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Nur die Biographie aktualisieren
    async updateUserBiography(email, biography) {
      this.loading = true;
      this.error = null;
      try {
        if (!this.user || this.user.email !== email) {
          await this.fetchUserByEmail(email);
        }

        const res = await UserService.update(
          this.user.name,
          this.user.email,
          null,
          null,
          biography
        );

        this.user.biography = biography;
        return res;
      } catch (error) {
        console.error("❌ Fehler beim Aktualisieren der Biographie:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // 🔹 Benutzer löschen
    async deleteUser(user_id) {
      this.loading = true;
      this.error = null;
      try {
        const res = await UserService.destroy(user_id);
        this.users = this.users.filter((u) => u.id !== user_id);
        return res;
      } catch (error) {
        console.error("❌ Fehler beim Löschen des Benutzers:", error);
        this.error = error;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
