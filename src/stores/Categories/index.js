import { defineStore } from 'pinia';
import { index, show, store, update, destroy } from '@/services/Categories';

export const useCategoryStore = defineStore('categories', {
    state: () => ({
        errors: [],
        categories: null,
        singleSelectedCategory: null,
        loading: false,
    }),

    actions: {
        async loadAllCategories() {
            this.loading = true;
            this.errors = [];
            try {
                this.categories = await index();
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async loadSingleCategory(categoryId) {
            this.loading = true;
            this.errors = [];
            try {
                this.singleSelectedCategory = await show(categoryId);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async storeCategory(categoryName) {
            this.loading = true;
            this.errors = [];
            try {
                this.category = await store(categoryName);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async updateCategory(productId, categoryId, categoryName) {
            this.loading = true;
            this.errors = [];
            try {
                this.categories = await update(productId, categoryId, categoryName);
            } catch (error) {
                if (error.response?.status === 422) {
                    this.errors = error.response.data.errors;
                }
            } finally {
                this.loading = false;
            }
        },
        async removeCategory(categoryId) {
            this.loading = true;
            this.errors = [];
            try {
                this.categories = await destroy(categoryId);
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
