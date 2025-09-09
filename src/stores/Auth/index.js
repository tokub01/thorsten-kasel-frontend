import { defineStore } from 'pinia';
import { login } from '@/services/Auth';
import router from '@/router'

export const useAuthStore = defineStore('user', {
    state: () => ({
        errors: [],
        user: null,
        loading: false,
    }),

    actions: {
        async login(email, password) {
            this.loading = true;
            this.errors = [];
            try {
                this.user = await login(email, password);
                localStorage.setItem('authToken', this.user.token);
                router.push({ name: 'home' });
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }

                if (error.response?.status === 401) {
                    this.errors = error.response.data.message;
                }
            } finally {
                this.loading = false;
            }
        }
    },
});
