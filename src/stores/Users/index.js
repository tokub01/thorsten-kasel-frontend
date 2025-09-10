import { defineStore } from 'pinia';
import { index, show, store, update, destroy } from '@/services/Users';

export const userStore = defineStore('users', {
    state: () => ({
        errors: [],
        users: null,
        singleSelectedUser: null,
        loading: false,
    }),

    actions: {
        async loadAllUsers() {
            this.loading = true;
            this.errors = [];
            try {
                this.users = await index();
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async loadSingleUser(userId) {
            this.loading = true;
            this.errors = [];
            try {
                this.singleSelectedUser = await show(userId);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async storeUser(user_email, user_password, user_password_confirmation, user_name, user_biography) {
            this.loading = true;
            this.errors = [];
            try {
                this.users = await store(user_email, user_password, user_password_confirmation, user_name, user_biography);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async updateUser(user_email, user_password, user_password_confirmation, user_name, user_biography) {
            this.loading = true;
            this.errors = [];
            try {
                this.users = await update(user_email, user_password, user_password_confirmation, user_name, user_biography);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async removeUser(userId) {
            this.loading = true;
            this.errors = [];
            try {
                this.products = await destroy(userId);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        }
    },
});
